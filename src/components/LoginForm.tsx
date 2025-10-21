import React from "react";

export default function LoginTest() {
  const handleClick = async () => {
    console.log("Botón clickeado: voy a hacer POST");

    try {
      const res = await fetch("http://localhost:8080/auth/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "prueba01", password: "123" }),
      });

      console.log("Respuesta del fetch:", res);
      const data = await res.json().catch(() => ({}));
      console.log("Datos recibidos:", data);
    } catch (err) {
      console.error("Error en fetch:", err);
    }
  };

  return <button onClick={handleClick}>Test Login POST</button>;
}

