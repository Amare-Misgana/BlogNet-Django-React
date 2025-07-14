import { useState, useEffect } from "react";
import axios from "axios";

function useAuth(checkUrl, refreshUrl) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            let token = localStorage.getItem("access")
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(checkUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data.user);
                setIsAuthenticated(true);
            } catch (error) {
                let refresh = localStorage.getItem("refresh")
                if (!refresh) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }
                let success = null

                const token = localStorage.getItem("refresh");
                if (!token) return false;

                try {
                    const { data } = await axios.post(refreshUrl, { refresh: token });
                    localStorage.setItem("access", data.access);
                    success = true;
                } catch {
                    success = false;
                }


                if (success) {
                    setIsAuthenticated(true)
                    setLoading(false)
                    return;
                }

                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkToken();
    }, [checkUrl, refreshUrl]);

    return { isAuthenticated, loading, user };
}

export default useAuth;
