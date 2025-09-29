import React, { createContext, useContext, useState } from "react"; // Importa React e gli hook necessari

// Crea il context per i preferiti
const PreferitiContext = createContext();

// Hook custom per accedere facilmente al context dei preferiti
export function usePreferiti() {
    return useContext(PreferitiContext); // Restituisce il valore del context
}

// Provider che gestisce lo stato e le funzioni dei preferiti
export function PreferitiProvider({ children }) {
    // Stato locale per la lista dei preferiti
    const [preferiti, setPreferiti] = useState([]);

    // Funzione per aggiungere un prodotto ai preferiti
    function aggiungiAiPreferiti(prodotto) {
        setPreferiti(prev =>
            // Se il prodotto è già presente, non lo aggiunge
            prev.find(p => p.id === prodotto.id) ? prev : [...prev, prodotto]
        );
    }

    // Funzione per rimuovere un prodotto dai preferiti tramite id
    function rimuoviDaiPreferiti(id) {
        setPreferiti(prev => prev.filter(p => p.id !== id));
    }

    // Ritorna il provider con stato e funzioni disponibili nel value
    return (
        <PreferitiContext.Provider value={{ preferiti, aggiungiAiPreferiti, rimuoviDaiPreferiti }}>
            {children} {/* Renderizza i figli all'interno del provider */}
        </PreferitiContext.Provider>
    );
}