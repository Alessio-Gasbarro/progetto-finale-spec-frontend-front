import React, { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage.jsx";

// Crea il context per i preferiti
const PreferitiContext = createContext();

// Hook per accedere al context
export function usePreferiti() {
    return useContext(PreferitiContext);
}

// Provider con persistenza localStorage
export function PreferitiProvider({ children }) {
    const [preferiti, setPreferiti] = useLocalStorage("preferiti", []);

    function aggiungiAiPreferiti(prodotto) {
        setPreferiti(prev =>
            prev.some(p => p.id === prodotto.id) ? prev : [...prev, prodotto]
        );
    }

    function rimuoviDaiPreferiti(id) {
        setPreferiti(prev => prev.filter(p => p.id !== id));
    }

    return (
        <PreferitiContext.Provider value={{ preferiti, aggiungiAiPreferiti, rimuoviDaiPreferiti }}>
            {children}
        </PreferitiContext.Provider>
    );
}