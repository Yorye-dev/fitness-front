import { useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/");
    };

    return (

        <div>

            <h1>Home</h1>

            <p>Bienvenido.</p>

            <button onClick={logout}>
                Logout
            </button>

        </div>

    );

}
