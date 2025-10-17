import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {
    const getInitial = () => {
        try {
            const raw = localStorage.getItem(key);
            if (raw !== null) return JSON.parse(raw);
        } catch {
            // ignore parse errors
        }
        return typeof initialValue === "function" ? initialValue() : initialValue;
    };

    const [value, setValue] = useState(getInitial);

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // ignore write errors
        }
    }, [key, value]);

    return [value, setValue];
}