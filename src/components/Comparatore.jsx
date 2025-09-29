import React, { useEffect, useState } from "react"; // Importa React e gli hook useEffect, useState
import { useComparatore } from "../context/ComparatoreContext"; // Importa il context del comparatore
import { fetchInstrument } from "../api/Strumenti"; // Importa la funzione per recuperare i dettagli dello strumento
import { Link } from "react-router-dom"; // Importa Link per la navigazione SPA
import { usePopupNotify } from "../hooks/usePopupNotify"; // Importa il custom hook per il popup
import PopupNotify from "./PopupNotify"; // Importa il componente popup

export default function Comparatore() {
    // Ottiene le funzioni e dati dal context del comparatore
    const { prodottiComparati, rimuoviDalComparatore, svuotaComparatore } = useComparatore();
    // Stato locale per i dettagli degli strumenti
    const [strumenti, setStrumenti] = useState([]);
    // Stato locale per il caricamento
    const [loading, setLoading] = useState(false);

    // Ottiene lo stato e la funzione per mostrare il popup dal custom hook
    const { show, hide, msg, type, showPopup } = usePopupNotify();

    // Effetto che carica i dettagli degli strumenti selezionati per il confronto
    useEffect(() => {
        // Funzione asincrona per caricare i dettagli
        async function caricaStrumenti() {
            setLoading(true); // Imposta loading a true
            // Recupera i dettagli di ogni strumento selezionato
            const dettagli = await Promise.all(
                prodottiComparati.map(async prodotto => {
                    const data = await fetchInstrument(prodotto.id); // Recupera i dati dallo strumento
                    const dettagliCompleti = Array.isArray(data) ? data[0] : data; // Gestisce eventuali array
                    return dettagliCompleti || {}; // Restituisce i dettagli o oggetto vuoto
                })
            );
            setStrumenti(dettagli); // Aggiorna lo stato locale con i dettagli
            setLoading(false); // Imposta loading a false
        }
        // Se ci sono prodotti comparati, carica i dettagli
        if (prodottiComparati.length > 0) {
            caricaStrumenti();
        } else {
            setStrumenti([]); // Altrimenti svuota la lista
        }
    }, [prodottiComparati]); // Dipende dai prodotti comparati

    // Funzione per rimuovere uno strumento dal comparatore e mostrare popup
    const handleRimuovi = (id) => {
        rimuoviDalComparatore(id); // Rimuove dal comparatore
        showPopup("Lo strumento è stato rimosso.", "remove"); // Mostra popup di rimozione
    };

    return (
        <main>
            {/* Mostra il popup di notifica */}
            <PopupNotify show={show} hide={hide} msg={msg} type={type} />
            <h2 className="comparator-h2">Comparatore</h2>
            {strumenti.length === 0 && !loading ? (
                <p className="comparator-p">Nessun prodotto selezionato per il confronto.</p>
            ) : (
                <div className="big-comparator">
                    <div className="comparatore-container">
                        {strumenti.map((s, idx) => {
                            const m = s.musictool || s; // Gestisce eventuale proprietà musictool
                            return (
                                <div key={m.id || idx} className="comparatore-card">
                                    {m.image && (
                                        <img src={m.image} alt={m.title} className="comparatore-img" />
                                    )}
                                    <h3 className="comparatore-title">{m.title || "N/A"}</h3>
                                    <p className="comparatore-category">Categoria: {m.category || "N/A"}</p>
                                    <p>Origine: {m.origin || "N/A"}</p>
                                    <p>Difficoltà: {m.difficulty !== undefined ? m.difficulty : "N/A"}</p>
                                    <p>Prezzo medio: {m.averagePrice !== undefined ? m.averagePrice + " €" : "N/A"}</p>
                                    <p>Peso medio: {m.averageWeight !== undefined ? m.averageWeight + " kg" : "N/A"}</p>
                                    <button className="comparatore-btn" onClick={() => handleRimuovi(m.id)}>
                                        Rimuovi
                                    </button>
                                </div>
                            );
                        })}
                        {loading && (
                            <div className="comparatore-card">
                                <p>Caricamento dettagli...</p>
                            </div>
                        )}
                    </div>
                    <button className="comparatore-btn comparatore-btn-svuota" onClick={svuotaComparatore}>
                        Svuota tutto
                    </button>
                </div>
            )}
            <div className="all-button-wrapper">
                <Link to="/strumenti" className="all-button">Tutti gli Strumenti</Link>
            </div>
        </main>
    );
}