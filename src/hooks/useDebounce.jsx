import { useState, useEffect } from "react";

// Hook per restituire un valore "debounced" dopo un delay
export default function useDebounce(value, delay = 300) {
    // Stato locale che contiene il valore ritardato
    const [debouncedValue, setDebouncedValue] = useState(value);

    // Ogni volta che value o delay cambiano, settiamo un timeout
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Pulizia: se value cambia prima del timeout, cancelliamo il timer
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // dipendenze: ricalcola quando value o delay cambiano

    // Ritorna il valore debounced
    return debouncedValue;
}