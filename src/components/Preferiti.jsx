import { usePreferiti } from "../context/PreferitiContext";
import { useComparatore } from "../context/ComparatoreContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Preferiti() {
    const { preferiti, rimuoviDaiPreferiti } = usePreferiti();
    const { aggiungiAlComparatore, prodottiComparati } = useComparatore();

    const [showPopup, setShowPopup] = useState(false);
    const [hidePopup, setHidePopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState("");

    const handleCompara = prodotto => {
        aggiungiAlComparatore(prodotto);
        setPopupMsg("Strumento aggiunto al Comparatore!");
        setShowPopup(true);
        setHidePopup(false);
        setTimeout(() => setHidePopup(true), 1200);
        setTimeout(() => setShowPopup(false), 1600);
    };

    const handleRimuovi = id => {
        rimuoviDaiPreferiti(id);
        setPopupMsg("Strumento rimosso dai Preferiti!");
        setShowPopup(true);
        setHidePopup(false);
        setTimeout(() => setHidePopup(true), 1200);
        setTimeout(() => setShowPopup(false), 1600);
    };

    return (
        <>
            {showPopup && (
                <div className={`popup-notify popup-success${hidePopup ? " popup-hide" : ""}`}>
                    {popupMsg}
                </div>
            )}
            <h2 className="comparator-h2">Preferiti</h2>
            {preferiti.length === 0 ? (
                <div className="comparator-p">Nessun prodotto nei preferiti.</div>
            ) : (
                <div className="prodotti-container">
                    {preferiti.map(prodotto => {
                        const giaComparato = prodottiComparati.some(p => p.id === prodotto.id);
                        const disabilitaCompara = giaComparato || prodottiComparati.length >= 2;
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