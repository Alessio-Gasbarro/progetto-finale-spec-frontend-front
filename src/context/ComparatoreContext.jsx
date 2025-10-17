import React, { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage.jsx";

// Crea il context per il comparatore
const ComparatoreContext = createContext();

// Hook per accedere al context
export function useComparatore() {
    return useContext(ComparatoreContext);
}

// Limite massimo elementi nel comparatore
const MAX_COMPARE = 5;

// Provider con persistenza localStorage
export function ComparatoreProvider({ children }) {
    const [prodottiComparati, setProdottiComparati] = useLocalStorage("comparatore", []);

    function aggiungiAlComparatore(prodotto) {
        setProdottiComparati(prev => {
            if (!prodotto || prodotto.id == null) return prev;
            if (prev.some(p => p.id === prodotto.id)) return prev;
            if (prev.length >= MAX_COMPARE) return prev;
            return [...prev, { id: prodotto.id, title: prodotto.title, category: prodotto.category }];
        });
    }

    function rimuoviDalComparatore(id) {
        setProdottiComparati(prev => prev.filter(p => p.id !== id));
    }

    function svuotaComparatore() {
        setProdottiComparati([]);
    }

    return (
        <ComparatoreContext.Provider value={{ prodottiComparati, aggiungiAlComparatore, rimuoviDalComparatore, svuotaComparatore, MAX_COMPARE }}>
            {children}
        </ComparatoreContext.Provider>
    );
}