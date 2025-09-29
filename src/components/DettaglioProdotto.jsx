// Importa React e gli hook useEffect, useState dal pacchetto react
import React, { useEffect, useState } from "react";
// Importa useParams e useNavigate da react-router-dom per gestire parametri e navigazione
import { useParams, useNavigate } from "react-router-dom";
// Importa la funzione per recuperare un singolo strumento dall'API
import { fetchInstrument } from "../api/Strumenti";
// Importa il context per il comparatore
import { useComparatore } from "../context/ComparatoreContext";
// Importa il context per i preferiti
import { usePreferiti } from "../context/PreferitiContext";
// Importa il custom hook per gestire il popup di notifica
import { usePopupNotify } from "../hooks/usePopupNotify";
// Importa il componente che mostra il popup
import PopupNotify from "./PopupNotify";

// Definisce il componente principale DettaglioProdotto
export default function DettaglioProdotto() {
    // Ottiene l'id del prodotto dalla URL tramite useParams
    const { id } = useParams();
    // Ottiene la funzione di navigazione per cambiare pagina
    const navigate = useNavigate();
    // Ottiene la funzione per aggiungere al comparatore dal context
    const { aggiungiAlComparatore } = useComparatore();
    // Ottiene la funzione per aggiungere ai preferiti dal context
    const { aggiungiAiPreferiti } = usePreferiti();
    // Stato locale per il prodotto da mostrare
    const [prodotto, setProdotto] = useState(null);
    // Stato locale per gestire il caricamento
    const [loading, setLoading] = useState(true);

    // Ottiene lo stato e la funzione per mostrare il popup dal custom hook
    const { show, hide, msg, type, showPopup } = usePopupNotify();

    // Effetto che carica i dati del prodotto quando cambia l'id
    useEffect(() => {
        // Funzione asincrona per recuperare i dati
        async function carica() {
            // Recupera i dati dallo strumento tramite API
            const data = await fetchInstrument(id);
            // Se la risposta ha la proprietà musictool, la usa, altrimenti usa direttamente data
            const m = data.musictool || data;
            // Aggiorna lo stato locale con il prodotto
            setProdotto(m);
            // Imposta loading a false
            setLoading(false);
        }
        // Chiama la funzione di caricamento
        carica();
    }, [id]); // Dipende da id, si aggiorna quando cambia

    // Se sta caricando, mostra un messaggio di caricamento
    if (loading) return <div className="comparator-p">Caricamento...</div>;
    // Se il prodotto non esiste, mostra un messaggio di errore
    if (!prodotto) return <div className="comparator-p">Prodotto non trovato.</div>;

    return (
        <>
            {/* Mostra il popup di notifica se necessario */}
            <PopupNotify show={show} hide={hide} msg={msg} type={type} />
            <div className="dettaglio-prodotto-wrapper">
                <div className="dettaglio-prodotto-img">
                    {/* Mostra l'immagine del prodotto se disponibile */}
                    {prodotto.image && (
                        <img
                            src={prodotto.image} // URL dell'immagine
                            alt={prodotto.title} // Testo alternativo
                            className="dettaglio-prodotto-img-el" // Classe CSS
                        />
                    )}
                </div>
                <div className="dettaglio-prodotto-info">
                    {/* Mostra il titolo del prodotto */}
                    <h2 className="dettaglio-prodotto-title">{prodotto.title}</h2>
                    {/* Mostra la categoria */}
                    <p className="dettaglio-prodotto-category"><b>Categoria:</b> {prodotto.category || "N/A"}</p>
                    {/* Mostra l'origine */}
                    <p><b>Origine:</b> {prodotto.origin || "N/A"}</p>
                    {/* Mostra la difficoltà */}
                    <p><b>Difficoltà:</b> {prodotto.difficulty !== undefined ? prodotto.difficulty : "N/A"}</p>
                    {/* Mostra il prezzo medio */}
                    <p><b>Prezzo medio:</b> {prodotto.averagePrice !== undefined ? prodotto.averagePrice + " €" : "N/A"}</p>
                    {/* Mostra il peso medio */}
                    <p><b>Peso medio:</b> {prodotto.averageWeight !== undefined ? prodotto.averageWeight + " kg" : "N/A"}</p>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "2rem" }}>
                {/* Bottone per tornare alla pagina strumenti */}
                <button
                    className="comparatore-btn"
                    onClick={() => navigate("/strumenti")}
                >
                    Torna ai prodotti
                </button>
                {/* Bottone per aggiungere ai preferiti e mostrare popup */}
                <button
                    className="comparatore-btn"
                    onClick={() => {
                        aggiungiAiPreferiti(prodotto); // Aggiunge ai preferiti
                        showPopup("Strumento aggiunto ai Preferiti!", "success"); // Mostra popup
                    }}
                >
                    Aggiungi ai preferiti
                </button>
                {/* Bottone per aggiungere al comparatore e mostrare popup */}
                <button
                    className="comparatore-btn"
                    onClick={() => {
                        aggiungiAlComparatore(prodotto); // Aggiunge al comparatore
                        showPopup("Strumento aggiunto al Comparatore!", "success"); // Mostra popup
                    }}
                >
                    Aggiungi al comparatore
                </button>
            </div>
        </>
    );
}