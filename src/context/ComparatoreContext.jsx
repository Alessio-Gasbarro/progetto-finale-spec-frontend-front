import React, { createContext, useContext, useState } from "react";

const ComparatoreContext = createContext();

export function useComparatore() {
    return useContext(ComparatoreContext);
}

export function ComparatoreProvider({ children }) {
    const [prodottiComparati, setProdottiComparati] = useState([]);

    function aggiungiAlComparatore(prodotto) {
        setProdottiComparati(prev => {
            if (prev.find(p => p.title === prodotto.title)) return prev;
            if (prev.length >= 2) return prev;
            return [...prev, prodotto];
        });
    }

    function rimuoviDalComparatore(title) {
        setProdottiComparati(prev => prev.filter(p => p.title !== title));
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