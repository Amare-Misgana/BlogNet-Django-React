import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
    }, [navigate]);
};

export default Logout;
