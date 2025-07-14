import axios from "axios";
import { useState, useEffect } from "react";

export const useAxios = ({ method = "GET", url, data = null, run = true, isProtected = false }) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!run) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                let config = {
                    method: method.toLowerCase(),
                    url,
                    data,
                };

                if (isProtected) {
                    config.headers = {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    };
                }

                const res = await axios(config);
                setResponse(res.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [method, url, data, run]);

    return { response, error, loading };
};


