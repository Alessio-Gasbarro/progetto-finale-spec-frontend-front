import React, { createContext, useContext, useState } from "react"; // Importa React e gli hook necessari

// Crea il context per il comparatore
const ComparatoreContext = createContext();

// Hook custom per accedere facilmente al context del comparatore
export function useComparatore() {
    return useContext(ComparatoreContext); // Restituisce il valore del context
}

// Provider che gestisce lo stato e le funzioni del comparatore
export function ComparatoreProvider({ children }) {
    // Stato locale per la lista dei prodotti comparati
    const [prodottiComparati, setProdottiComparati] = useState([]);

    // Funzione per aggiungere un prodotto al comparatore
    function aggiungiAlComparatore(prodotto) {
        setProdottiComparati(prev => {
            // Se il prodotto è già presente, non lo aggiunge
            if (prev.find(p => p.id === prodotto.id)) return prev;
            // Se ci sono già 2 prodotti, non aggiunge altri
            if (prev.length >= 2) return prev;
            // Aggiunge il prodotto (solo id, title, category per fallback)
            return [...prev, { id: prodotto.id, title: prodotto.title, category: prodotto.category }];
        });
    }

    // Funzione per rimuovere un prodotto dal comparatore tramite id
    function rimuoviDalComparatore(id) {
        setProdottiComparati(prev => prev.filter(p => p.id !== id));
    }

    // Funzione per svuotare completamente il comparatore
    function svuotaComparatore() {
        setProdottiComparati([]);
    }

    // Ritorna il provider con stato e funzioni disponibili nel value
    return (
        <ComparatoreContext.Provider value={{
            prodottiComparati, // Lista dei prodotti comparati
            aggiungiAlComparatore, // Funzione per aggiungere
            rimuoviDalComparatore, // Funzione per rimuovere
            svuotaComparatore // Funzione per svuotare
        }}>
            {children} {/* Renderizza i figli all'interno del provider */}
        </ComparatoreContext.Provider>
    );
}