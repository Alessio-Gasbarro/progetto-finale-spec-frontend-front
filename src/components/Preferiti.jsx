import { usePreferiti } from "../context/PreferitiContext"; // Importa il context dei preferiti
import { useComparatore } from "../context/ComparatoreContext"; // Importa il context del comparatore
import React from "react"; // Importa React
import { Link } from "react-router-dom"; // Importa Link per la navigazione SPA
import { usePopupNotify } from "../hooks/usePopupNotify"; // Importa il custom hook per il popup
import PopupNotify from "./PopupNotify"; // Importa il componente popup

export default function Preferiti() {
    // Ottiene i dati e le funzioni dal context dei preferiti
    const { preferiti, rimuoviDaiPreferiti } = usePreferiti();
    // Ottiene le funzioni dal context del comparatore
    const { aggiungiAlComparatore, prodottiComparati } = useComparatore();

    // Ottiene lo stato e la funzione per mostrare il popup dal custom hook
    const { show, hide, msg, type, showPopup } = usePopupNotify();

    // Funzione per aggiungere al comparatore e mostrare popup
    const handleCompara = prodotto => {
        aggiungiAlComparatore(prodotto); // Aggiunge al comparatore
        showPopup("Strumento aggiunto al Comparatore!", "success"); // Mostra popup
    };

    // Funzione per rimuovere dai preferiti e mostrare popup
    const handleRimuovi = id => {
        rimuoviDaiPreferiti(id); // Rimuove dai preferiti
        showPopup("Strumento rimosso dai Preferiti!", "remove"); // Mostra popup
    };

    return (
        <>
            {/* Mostra il popup di notifica */}
            <PopupNotify show={show} hide={hide} msg={msg} type={type} />
            <h2 className="comparator-h2">Preferiti</h2>
            {preferiti.length === 0 ? (
                <div className="comparator-p">Nessun prodotto nei preferiti.</div>
            ) : (
                <div className="prodotti-container">
                    {preferiti.map(prodotto => {
                        const giaComparato = prodottiComparati.some(p => p.id === prodotto.id); // Verifica se già comparato
                        const disabilitaCompara = giaComparato || prodottiComparati.length >= 2; // Disabilita se già comparato o troppi
                        return (
                            <div className="prodotto-card" key={prodotto.id}>
                                <h3>{prodotto.title}</h3>
                                <p>Categoria: {prodotto.category}</p>
                                <div className="prodotto-bottoni">
                                    <button
                                        className="prodotto-btn"
                                        onClick={() => handleRimuovi(prodotto.id)}
                                    >
                                        Rimuovi
                                    </button>
                                    <button
                                        className="prodotto-btn"
                                        onClick={() => handleCompara(prodotto)}
                                        disabled={disabilitaCompara}
                                        style={{
                                            pointerEvents: disabilitaCompara ? "none" : "auto",
                                            opacity: disabilitaCompara ? 0.5 : 1
                                        }}
                                    >
                                        Compara
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="all-button-wrapper">
                <Link to="/strumenti" className="all-button">Tutti gli Strumenti</Link>
            </div>
        </>
    );
}