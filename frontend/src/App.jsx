import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Blog from "./Pages/Blog/Blog";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Logout from "./Pages/Logout/Logout";
import ServerDown from "./Pages/ServerDown/ServerDown";
import { useServerStatus } from "./hooks/useServerStatus";
import { useEffect } from "react";

function App() {
    const navigate = useNavigate();
    const isUp = useServerStatus();
    

    useEffect(() => {
        if (isUp === false) {
            const { href, origin } = window.location;
            const relative = href.replace(origin + "/", "");
            if (!relative.includes("/server-down?nextPage=")) {
                navigate(`/server-down?nextPage=${relative}`);
            }
        }
    }, [isUp]);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/server-down" element={<ServerDown />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/blog/*" element={<Blog />} />
        </Routes>
    );
}

export default App;
