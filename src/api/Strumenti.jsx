import { useEffect } from "react";

//Importiamo l'api
const API_URL = import.meta.env.VITE_API_BASE;

// Funzione per recuperare tutti gli strumenti
export async function fetchAllInstruments() {
    try {
        const response = await fetch(`${API_URL}/musictools`);
        // se la risposta non è ok, lancio un errore
        if (!response.ok) {
            throw new Error(`Errore HTTP nella chiamata fetchAllInstruments: ${response.status} ${response.statusText}`);
        }
        // altrimenti ritorno i dati
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error("Errore nel recupero dei dati");
        return [];
    }
}

fetchAllInstruments().then(data => {
    console.log("Dati ricevuti:", data);
});

// Funzione per recuperare lo strumento con un ID specifico
export async function fetchInstrument(id) {
    try {
        const response = await fetch(`${API_URL}/musictools/${id}`);
        if (!response.ok) {
            throw new Error(`Errore HTTP nella chiamata fetchInstrument: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data; // <-- qui restituiamo direttamente il prodotto
    } catch (error) {
        console.error(error);
        return null;
    }
}

fetchInstrument(5).then(data => {
    console.log(data); //Consolelog strumento singolo (in questo esempio il 5)
});