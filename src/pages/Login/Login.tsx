import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleLogin = async () => {

        console.log("Botón pulsado");

    try {

        console.log("Llamando al backend...");

        const response = await login(username, password);

        console.log(response);

        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);

        navigate("/home");

    } catch (error) {

        console.error(error);

    }

};
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f4f4f4",
            }}
        >
            <div
                style={{
                    width: "350px",
                    backgroundColor: "#ffffff",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,.2)",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "25px",
                    }}
                >
                    Fitness
                </h2>

                <div style={{ marginBottom: "15px" }}>
                    <label>Usuario</label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Usuario"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label>Contraseña</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                {error && (
                    <div
                        style={{
                            color: "red",
                            marginBottom: "15px",
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        cursor: "pointer",
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "5px",
                        fontWeight: "bold",
                    }}
                >
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
            </div>
        </div>
    );
}
