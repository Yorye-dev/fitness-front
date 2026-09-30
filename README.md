# FitNess · Frontend

React, TypeScript y Vite. Formularios con React Hook Form y Zod; sesión y preferencias con Zustand.
Mantiene los temas claro/oscuro/sistema y los idiomas español/inglés.
La paleta visual utiliza los colores de [Gruvbox](https://github.com/morhetz/gruvbox).
El tema claro usa su crema `light0_hard` (`#f9f5d7`) para fondos y tarjetas, con bordes suaves;
el oscuro utiliza la paleta Gruvbox dark. El acceso y el registro usan una
composición centrada y minimalista, con el logotipo y una cuadrícula verde sutil de fondo.

## Desarrollo

El entorno completo se arranca desde `../fitness-deploy`:

```powershell
./start.ps1
```

```bash
bash ./start.sh development
```

El frontal queda disponible en `http://localhost:5173`. Para trabajar fuera de Docker con Node.js
compatible con el proyecto:

```bash
npm ci
npm run dev
```

Vite reenvía `/api` y `/auth` a `http://localhost:8080`; dentro de Docker se configura
`VITE_API_PROXY_TARGET=http://backend:8080`. El navegador siempre usa rutas del mismo origen.
No incluir secretos en variables `VITE_*`, porque forman parte del cliente.

```bash
npm run build
npm run lint
```

## Rutas y funcionalidad

| Ruta                | Contenido                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `/login`            | Inicio de sesión, mostrar contraseña, errores de conexión/credenciales y acceso al registro |
| `/register`         | Alta de cuenta y perfil, confirmación y requisitos de contraseña                            |
| `/`                 | Home protegida con macros, peso actual y espacio para entrenamiento                         |
| `/?date=YYYY-MM-DD` | Resumen de una fecha concreta; permite conservar y compartir la ruta                        |
| `/intakes`          | Historial de ingestas con calendario, alta, edición y eliminación                           |
| `/intakes?date=YYYY-MM-DD` | Historial de una fecha concreta                                                        |
| `/meals`            | Catálogo reutilizable de comidas por 100 g o por unidad                                     |
| `/training`         | Rutinas reutilizables y planificación semanal de entrenamientos                            |
| `/training/progress` | Evolución por ejercicio y listado de entrenamientos completados                          |
| `/profile`          | Edición del perfil y preferencias, accesible desde el avatar de la cabecera                |

El registro inicia sesión automáticamente. Si la cuenta se crea pero no se puede recuperar el perfil,
se vuelve al acceso con un aviso de cuenta creada, evitando repetir el alta.

Las contraseñas nuevas requieren **8 caracteres** como mínimo y confirmación. Se permiten espacios,
pegado y gestores de contraseñas. No se aplican reglas nuevas de creación al formulario de acceso.
El usuario tiene 3–50 caracteres (letras, números o `_`). El perfil incluye peso, altura, edad, sexo
para el cálculo, actividad y objetivo, conforme al contrato actual del backend.

Nota de compatibilidad: el frontend cuenta caracteres Unicode para el mínimo de contraseña; el
backend actual usa longitud en bytes UTF-8. El frontend es más restrictivo en contraseñas cortas
con caracteres multibyte. Ambos contratos deberían unificarse si se modifica la política del backend.

La home muestra calorías y macros consumidos/objetivo/restantes, y distingue un exceso sobre el
objetivo. Los datos proceden de la API. Los estados de carga, error y día sin ingestas están separados.
La fecha predeterminada es el día local del navegador, enviada explícitamente a la API.
Entrenamiento muestra la rutina asignada al día de la semana de la fecha seleccionada.
La home prioriza las tarjetas de calorías/macros, el peso actual del perfil y el entrenamiento del día.
Las ingestas se consultan desde **Historial** (`/intakes`), accesible en el menú de escritorio y móvil.
Su calendario permite recorrer días anteriores. La tarjeta de entrenamiento muestra los ejercicios
y objetivos de la planificación semanal actual hasta iniciar la sesión. Desde ese momento muestra
el registro guardado para esa fecha, incluso si después se modifica o archiva la rutina.

### Configurar el perfil

El avatar de la cabecera abre **Mi perfil** (`/profile`) en escritorio y móvil. La página carga
`GET /api/me` y permite editar peso, altura, edad, actividad habitual y objetivo con `PUT /api/me`.
El nombre de usuario y el sexo se muestran como datos de la cuenta según el contrato actual.

Se validan los límites del backend: peso mayor que 0 y hasta 300 kg (hasta tres decimales), altura
entera de 1 a 250 cm, edad entera de 1 a 120 años y opciones de actividad/objetivo conocidas.
Las respuestas PascalCase de la API se convierten a los valores snake_case requeridos al guardar.

Guardar actualiza el perfil de la sesión y el peso de la home. El backend recalcula los objetivos
nutricionales de hoy y conserva las versiones anteriores; el formulario explica este efecto antes
de enviar. El botón se habilita al modificar datos, evita envíos mientras guarda y conserva los
cambios si hay un fallo. Se puede restablecer el formulario o confirmar el descarte antes de navegar.

En **Apariencia e idioma** se eligen tema e idioma con aplicación inmediata. Estas preferencias
se conservan en este navegador; los datos del perfil se guardan en el backend. La página y el menú
de preferencias comparten los mismos controles accesibles, con identificadores únicos.

### Registrar comidas

1. En **Mis comidas → Añadir comida** (`/meals`), guardar el nombre, calorías, proteínas, carbohidratos
   y grasas por cada 100 g o elegir **Valores por unidad**. Se permiten hasta tres decimales.
   Para un batido, introducir los nutrientes de un batido completo en el modo por unidad.
2. En la home, pulsar la acción discreta **+ Añadir comida**, o usar **Registrar ingesta** desde el
   catálogo. Elegir una comida guardada, indicar fecha y cantidad, y revisar el aporte estimado.
   La cantidad admite **Gramos** o **Unidades / porciones**: 2 galletas de 29 g registran 58 g.
   Una comida guardada por unidad pide solo **Unidades consumidas** (1 batido, 2 batidos, etc.),
   sin gramos ni conversión ficticia de unidades a peso. También admite 0,5 unidades.
3. Al guardar se solicita de nuevo el resumen al backend. Los nutrientes se suman al consumo y se
   restan de lo que queda para llegar al objetivo. El catálogo por sí solo no suma consumo.
4. Se puede repetir la misma comida en otras ingestas, con cantidades diferentes. Archivar o editar
   la comida conserva el histórico. Eliminar una ingesta con la papelera la descuenta del día.
5. En **Historial**, el lápiz abre la edición de cantidad, unidades y fecha.
   Las unidades guardadas se recuperan (por ejemplo, 2 × 29 g). Si se cambia la fecha, el historial abre
   el día de destino; el consumo se descuenta del día original. Editar conserva los nutrientes
   originales, incluso para alimentos archivados, y no modifica el catálogo.

La búsqueda recorre el catálogo completo en el servidor y los resultados están paginados.
Los formularios y confirmaciones usan diálogos nativos con foco gestionado y navegación por teclado.
Durante el guardado se bloquean los envíos repetidos y el cierre del diálogo.
La cantidad se valida entre 0,001 y 1.000.000 g. Las porciones admiten fracciones y hasta tres
decimales; el peso total se redondea a 0,001 g. El backend vuelve a validar las cantidades y calcula
el peso; los nutrientes definitivos los calcula PostgreSQL. Crear y editar comparten el formulario.

Cada envío de ingesta tiene un UUID. Reintentar los mismos datos desde el formulario abierto reutiliza
ese identificador para evitar duplicados si se perdió la respuesta. Cerrar el formulario, enviar
otros datos o recargar la página termina ese intento; antes de repetirlo conviene consultar el día.
La creación de entradas del catálogo no tiene esa protección de reintentos.

### Planificar una semana de entrenamiento

1. Entrar en **Entrenamiento** (`/training`) y pulsar **Crear rutina**.
2. Añadir ejercicios de fuerza, cardio o movilidad y ordenarlos con las flechas.
3. Para fuerza, indicar series, rango de repeticiones, descanso y peso previsto opcional. Para cardio
   o movilidad, indicar series, duración en segundos y descanso. Cada ejercicio admite notas.
4. Guardar la rutina y asignarla a uno o varios días, de lunes a domingo. Cada cambio de asignación
   se guarda automáticamente; los días sin rutina quedan como descanso o sin planificar.
5. Consultar en la home la rutina correspondiente a la fecha elegida. Las rutinas se pueden editar
   o archivar. Archivarlas libera sus días, conservando las referencias de sesiones existentes.

El plan es recurrente, con una rutina por día. Modificarlo cambia la planificación actual para ese
día de la semana, incluso al consultar una fecha pasada; no se versiona el calendario histórico.
Los pesos y repeticiones de la rutina son objetivos; la home permite guardar los resultados reales.
Se admiten hasta 100 rutinas activas y 50 ejercicios por rutina. Las ediciones simultáneas en varias
pestañas conservan el último guardado. Reintentar el guardado desde el mismo formulario reutiliza
el UUID de la rutina, evitando crear otra rutina si se perdió la respuesta.

### Registrar entrenamiento y agua desde la home

- **Empezar entrenamiento** crea una sesión diaria con una copia de los ejercicios y sus objetivos.
  La tarjeta pasa de **Pendiente** a **En progreso**. Volver a pulsar tras perder la respuesta recupera
  esa sesión, sin duplicarla. Actualmente se admite una sesión de la home por usuario y fecha.
- En el diálogo se pueden ajustar peso y repeticiones de cada serie, añadir o quitar series y marcar
  cada ejercicio como realizado o no realizado. Cardio y movilidad registran duración por serie.
  Si no hay carga prevista, el peso queda vacío: indicar el real, o 0 para ejercicios sin carga añadida.
- **Guardar progreso** permite continuar más tarde, incluso desde otro equipo. **Confirmar
  entrenamiento** exige resolver todos los ejercicios y haber realizado al menos uno. Hay una acción
  rápida para marcar los pendientes como realizados, seguida de la revisión y confirmación final.
- Una sesión completada puede consultarse o corregirse desde la misma tarjeta. Cada escritura usa
  una revisión para detectar cambios en otra pestaña y un identificador para reintentar sin duplicar.
  Los cambios del diálogo se guardan con los botones, no automáticamente; el cierre avisa si hay
  cambios sin guardar. El registro no mide automáticamente la duración real de un entrenamiento.
- **Agua del día** muestra una botella vectorial minimalista, con contorno fino y relleno plano cuyo
  nivel sube suavemente, el consumo,
  el objetivo y el porcentaje. La animación respeta `prefers-reduced-motion`. Más del 100 % mantiene
  la botella llena y conserva el porcentaje y la cantidad reales.
- Los botones **+250 ml**, **+500 ml** y **Otra cantidad** registran aportes independientes. Se puede
  deshacer el último. El lápiz cambia el objetivo inicial de 2000 ml desde la fecha seleccionada;
  las fechas anteriores conservan su objetivo. El valor inicial es editable, no un cálculo médico.
- La fecha seleccionada se comparte con macros, entrenamiento y agua. Sin una fecha explícita,
  la home cambia al nuevo día al llegar la medianoche local (o al recuperar el foco). Los días futuros
  muestran su planificación; el frontal habilita el registro al llegar la fecha.

Los registros se conservan en PostgreSQL. El calendario permite consultar fechas anteriores.
El progreso de entrenamiento ya tiene su página; las estadísticas específicas de agua siguen pendientes.

### Consultar el progreso del entrenamiento

En **Entrenamiento → Progreso** (`/training/progress`), o desde **Ver progreso** en la home:

- Elegir últimos 30 días, 90 días, un año o un rango personalizado de hasta 366 días.
- Ver sesiones completadas, series realizadas y repeticiones de fuerza del período.
- Seleccionar un ejercicio para consultar su gráfica por sesión. Fuerza admite carga máxima,
  repeticiones totales, volumen (suma de kg × repeticiones) y series; cardio/movilidad, duración y series.
- Consultar primera y última medición, y su diferencia absoluta dentro del período. Con una sola
  sesión se muestra el dato, sin atribuirle una evolución. Las diferencias no evalúan por sí solas
  una mejora o pérdida de rendimiento: pueden cambiar las series o el rango de repeticiones.
- Desplegar los datos de la gráfica en una tabla y abrir el registro del día para revisar sus series.
  El listado de entrenamientos se pagina de diez en diez.

Solo se contabilizan sesiones, ejercicios y series completados. El selector agrupa por identidad
del ejercicio y conserva los registros de rutinas archivadas. Las fechas y el ejercicio elegido
quedan en la URL. Se mantienen estados de carga, error, reintento y período sin datos.

## Estructura para ampliar casos de uso

```text
src/
├── app/                         # Inicialización y rutas
├── components/ui/               # Controles accesibles compartidos
├── config/                      # Traducciones y navegación
├── features/
│   ├── auth/
│   │   ├── components/          # Formularios y protección de rutas
│   │   ├── pages/               # Login y registro
│   │   ├── services/            # Contratos HTTP de autenticación
│   │   ├── stores/              # Ciclo de vida de la sesión
│   │   ├── types/
│   │   └── validation/          # Reglas de formularios
│   ├── home/
│   │   ├── components/          # Fecha y perfil
│   │   └── pages/HomePage.tsx   # Composición de la página
│   ├── nutrition/
│   │   ├── components/          # Resumen, tarjetas e ingestas
│   │   ├── hooks/               # Peticiones, cancelación y reintento
│   │   ├── services/            # Acceso a la API nutricional
│   │   └── types/
│   └── training/
│       ├── components/          # Rutinas, ejercicios y semana
│       ├── hooks/               # Plan semanal y entrenamiento del día
│       ├── pages/TrainingPage.tsx
│       ├── services/            # API de entrenamiento
│       ├── types/
│       └── validation/          # Reglas de prescripción de ejercicios
├── layouts/                     # Estructura de acceso y aplicación
└── lib/
    ├── api/                     # Clientes HTTP, respuesta y errores
    ├── auth/                    # Almacenamiento e invalidación de sesión
    └── date.ts                  # Fechas de calendario sin conversión a UTC
```

### Añadir una funcionalidad

1. Crear su carpeta en `features`, con tipos y servicio HTTP según el contrato del backend.
2. Encapsular carga, error y cancelación en un hook; mantener los componentes de presentación sin
   peticiones directas. Las respuestas del backend tienen forma `{ data: ... }`.
3. Componer la página a partir de esos componentes. `HomePage` se carga de forma diferida.
4. Añadir la ruta protegida en `app/router.tsx` y, cuando sea operativa, su entrada en
   `config/navigation.ts`. Escritorio y móvil usan la misma configuración.
5. Añadir textos en `config/i18n/es.ts` y `en.ts`.

## API utilizada

| Método | Ruta                                   | Uso                                  |
| ------ | -------------------------------------- | ------------------------------------ |
| POST   | `/auth/sign_in`                        | Obtener access y refresh tokens      |
| POST   | `/auth/register`                       | Crear cuenta/perfil y obtener tokens |
| POST   | `/auth/refresh`                        | Renovar el access token              |
| GET    | `/api/me`                              | Recuperar el usuario autenticado     |
| GET    | `/api/nutrition/daily?date=YYYY-MM-DD` | Resumen diario e ingestas            |

El catálogo utiliza `GET/POST /api/nutrition/meals` y `PUT/DELETE /api/nutrition/meals/{id}`.
Las ingestas utilizan `POST /api/nutrition/consumptions` y `PUT/DELETE /api/nutrition/consumptions/{id}`.
POST añade `id` y `meal_id`; POST y PUT envían `date` y, de forma excluyente, `quantity_grams`
o el par `portion_count`/`portion_grams`. Para comidas por unidad, se envía únicamente `portion_count`;
las respuestas devuelven `quantity_grams` y `portion_grams` a `null`. El backend requiere la migración
`0006` (automática al arrancar). El catálogo expone `nutrition_basis` (`per_100g` / `per_unit`) y cuatro
nutrientes `*_per_100g` o `*_per_unit`; el servicio los normaliza para los componentes del frontal.
La búsqueda del catálogo añade `q` y la paginación `page`/`per_page`.

Entrenamiento utiliza `GET /api/training/routines`, `PUT/DELETE /api/training/routines/{id}`,
`GET/PUT /api/training/week` y `GET /api/training/daily?date=YYYY-MM-DD`.
El PUT de rutina crea o reemplaza su contenido completo con un UUID proporcionado por el cliente.
La semana contiene siete entradas (`weekday`: 1 lunes–7 domingo; `routine_id`: UUID o `null`).
Estas rutas requieren la migración `0007`, aplicada automáticamente al arrancar el backend.

Con `0008`, `/api/training/daily` también devuelve `session` (o `null`). `POST /api/training/sessions`
inicia o recupera una sesión diaria; `PUT /api/training/sessions/{id}` guarda avances o resultados.
Agua utiliza `GET /api/water/daily?date=YYYY-MM-DD`, `POST /api/water/intakes`,
`DELETE /api/water/intakes/{id}` y `PUT /api/water/goal`.

`GET /api/training/progress?from=YYYY-MM-DD&to=YYYY-MM-DD&exercise_id=UUID` devuelve resúmenes de
sesiones completadas, ejercicios disponibles y puntos del ejercicio seleccionado. `exercise_id`
es opcional: sin uno disponible en el período se selecciona el primero por nombre.

El cliente autenticado envía exclusivamente el access token como Bearer. Ante un 401, comparte
una renovación entre peticiones simultáneas y reintenta una sola vez. Un refresh rechazado limpia
la sesión. Los fallos de red permiten reintentar; no se presentan como contraseña incorrecta.
Las respuestas de una sesión anterior se descartan si se ha cambiado de cuenta o cerrado sesión.

Se conserva el almacenamiento de sesión del proyecto en `localStorage`, ahora con ambos tokens.
Las contraseñas nunca se guardan. El cierre de sesión borra los tokens del navegador; el backend
actual no ofrece revocación. Para pasar a cookies HttpOnly haría falta cambiar también el contrato
del backend y definir su protección CSRF; no se simula esa capacidad desde el frontal.

## Alcance de las comprobaciones

Los cambios de login, registro, home, ingestas, planificación, sesiones y agua se han compilado con TypeScript
y Vite y analizado con Oxlint.
No se han ejecutado pruebas automatizadas ni creado cuentas de prueba en la base de datos.
Queda pendiente comprobar la interacción completa con el backend en ejecución.
El lint general señala un aviso previo de Fast Refresh en `@/components/ui/button.tsx`, un archivo
ajeno al árbol `src` y sin imports desde la aplicación actual.
