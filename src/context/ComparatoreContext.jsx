import React, { createContext, useContext, useState } from "react";

const ComparatoreContext = createContext();

export function useComparatore() {
    return useContext(ComparatoreContext);
}

export function ComparatoreProvider({ children }) {
    const [prodottiComparati, setProdottiComparati] = useState([]);

    function aggiungiAlComparatore(prodotto) {
        setProdottiComparati(prev => {
            if (prev.find(p => p.id === prodotto.id)) return prev;
            if (prev.length >= 2) return prev;
            // Salva almeno id, title, category per fallback
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
        <ComparatoreContext.Provider value={{
            prodottiComparati,
            aggiungiAlComparatore,
            rimuoviDalComparatore,
            svuotaComparatore
        }}>
            {children}
        </ComparatoreContext.Provider>
    );
}