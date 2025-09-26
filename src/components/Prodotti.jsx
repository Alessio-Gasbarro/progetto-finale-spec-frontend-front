import React, { useEffect, useState } from "react";
import { useComparatore } from "../context/ComparatoreContext";
import { fetchAllInstruments } from "../api/Strumenti";

const Prodotti = () => {
    const [prodotti, setProdotti] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [hidePopup, setHidePopup] = useState(false);

    const { aggiungiAlComparatore, prodottiComparati } = useComparatore();

    useEffect(() => {
        fetchAllInstruments()
            .then(data => {
                setProdotti(data);
                setLoading(false);
            })
            .catch(error => {
                setErrore(error.message);
                setLoading(false);
            });
    }, []);

    const handleCompara = prodotto => {
        aggiungiAlComparatore(prodotto);
        setShowPopup(true);
        setHidePopup(false);
        setTimeout(() => setHidePopup(true), 1200);   // Avvia animazione uscita
        setTimeout(() => setShowPopup(false), 1600);  // Rimuovi popup dopo animazione
    };

    if (loading) return <div>Caricamento...</div>;
    if (errore) return <div>Errore: {errore}</div>;

    return (
        <>
            {showPopup && (
                <div className={`popup-notify popup-success${hidePopup ? " popup-hide" : ""}`}>
                    Strumento aggiunto al Comparatore!
                </div>
            )}
            <div className="prodotti-container">
                {prodotti.map(prodotto => {
                    const giaComparato = prodottiComparati.some(p => p.title === prodotto.title);
                    const disabilitaCompara = giaComparato || prodottiComparati.length >= 2;
                    return (
                        <div className="prodotto-card" key={prodotto.id || prodotto.title}>
                            <h3>{prodotto.title}</h3>
                            <p>Categoria: {prodotto.category}</p>
                            <div className="prodotto-bottoni">
                                <a href="#" className="prodotto-btn">Preferiti</a>
                                <a
                                    href="#"
                                    className="prodotto-btn"
                                    onClick={e => {
                                        e.preventDefault();
                                        if (!disabilitaCompara) handleCompara(prodotto);
                                    }}
                                    style={{
                                        pointerEvents: disabilitaCompara ? "none" : "auto",
                                        opacity: disabilitaCompara ? 0.5 : 1
                                    }}
                                    tabIndex={disabilitaCompara ? -1 : 0}
                                    aria-disabled={disabilitaCompara}
                                >
                                    Compara
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Prodotti;