import React, { createContext, useContext, useState } from "react";

const PreferitiContext = createContext();

export function usePreferiti() {
    return useContext(PreferitiContext);
}

export function PreferitiProvider({ children }) {
    const [preferiti, setPreferiti] = useState([]);

    function aggiungiAiPreferiti(prodotto) {
        setPreferiti(prev =>
            prev.find(p => p.id === prodotto.id) ? prev : [...prev, prodotto]
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