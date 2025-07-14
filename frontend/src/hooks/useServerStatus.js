import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

export const useServerStatus = (url = 'http://127.0.0.1:8000/api/health/', intervalMs = 10000) => {
    const [isUp, setIsUp] = useState(null);
    const [count, setCount] = useState(0);
    const timerRef = useRef(null);
    const isMounted = useRef(true);
    const isUpRef = useRef(isUp); // 👈 holds latest value

    // Update ref whenever isUp changes
    useEffect(() => {
        isUpRef.current = isUp;
    }, [isUp]);

    useEffect(() => {
        isMounted.current = true;

        const check = async () => {
            try {
                const res = await axios.get(url, { timeout: 3000 });
                if (isMounted.current) {
                    const up = res.data.status === "ok";
                    setIsUp(up);
                }
            } catch {
                if (isMounted.current) {
                    setIsUp(false);
                }
            }
        };

        check();
        timerRef.current = setInterval(check, intervalMs);

        return () => {
            clearInterval(timerRef.current);
            isMounted.current = false;
        };
    }, [url, intervalMs]);

    return isUp;
};
