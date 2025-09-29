import { usePreferiti } from "../context/PreferitiContext";
import { useComparatore } from "../context/ComparatoreContext";
import React from "react";
import { Link } from "react-router-dom";
import { usePopupNotify } from "../hooks/usePopupNotify";
import PopupNotify from "./PopupNotify";

export default function Preferiti() {
    const { preferiti, rimuoviDaiPreferiti } = usePreferiti();
    const { aggiungiAlComparatore, prodottiComparati } = useComparatore();

    const { show, hide, msg, type, showPopup } = usePopupNotify();

    const handleCompara = prodotto => {
        aggiungiAlComparatore(prodotto);
        showPopup("Strumento aggiunto al Comparatore!", "success");
    };

    const handleRimuovi = id => {
        rimuoviDaiPreferiti(id);
        showPopup("Strumento rimosso dai Preferiti!", "remove");
    };

    return (
        <>
            <PopupNotify show={show} hide={hide} msg={msg} type={type} />
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