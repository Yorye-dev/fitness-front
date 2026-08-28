export const es = {
  app: {
    name: "FitNess",
    systemName: "FitNess OS",
    tagline: "Tu cuerpo. Tus datos.",
  },

  auth: {
    welcomeBack: "Bienvenido de nuevo",
    description: "Inicia sesión para continuar tu progreso.",
    username: "Usuario",
    usernamePlaceholder: "Introduce tu usuario",
    password: "Contraseña",
    passwordPlaceholder: "Introduce tu contraseña",
    login: "Entrar",
    authenticating: "Autenticando...",
    invalidCredentials: "Usuario o contraseña incorrectos",
    usernameRequired: "El usuario es obligatorio",
    passwordRequired: "La contraseña es obligatoria",
  },

  navigation: {
    dashboard: "Inicio",
  },

  dashboard: {
    welcomeBack: "Bienvenido de nuevo",
    nutritionProgress: "Este es tu progreso nutricional de hoy.",
    dailyIntake: "Ingesta diaria",
    todaysNutrition: "Nutrición de hoy",
    goal: "Objetivo",
    currentBodyWeight: "Peso corporal actual",
    today: "Hoy",
  },

  macros: {
    calories: "Calorías",
    protein: "Proteínas",
    carbs: "Carbohidratos",
    fat: "Grasas",
    of: "de",
  },

  meals: {
    breakfast: "Desayuno",
    lunch: "Comida",
    snack: "Merienda",
    dinner: "Cena",
  },

  goals: {
    loseWeight: "Perder peso",
    gainMuscle: "Ganar masa muscular",
    maintainWeight: "Mantener peso",
    unknown: "Sin definir",
  },

  preferences: {
    title: "Preferencias",
    language: "Idioma",
    theme: "Tema",
    spanish: "Español",
    english: "Inglés",
    system: "Sistema",
    light: "Claro",
    dark: "Oscuro",
  },

  account: {
    signedInAs: "Sesión iniciada como",
    logout: "Cerrar sesión",
  },

  common: {
    units: {
      calories: "kcal",
      grams: "g",
      kilograms: "kg",
    },
    loading: "Cargando FitNess...",
  },
} as const;
