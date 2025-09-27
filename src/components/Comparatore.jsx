import React, { useEffect, useState } from "react";
import { useComparatore } from "../context/ComparatoreContext";
import { fetchInstrument } from "../api/Strumenti";
import { Link } from "react-router-dom";

export default function Comparatore() {
    const { prodottiComparati, rimuoviDalComparatore, svuotaComparatore } = useComparatore();
    const [strumenti, setStrumenti] = useState([]);
    const [loading, setLoading] = useState(false);

    // Popup state
    const [showPopup, setShowPopup] = useState(false);
    const [hidePopup, setHidePopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState("");

    function mostraPopup(msg) {
        setPopupMsg(msg);
        setShowPopup(true);
        setHidePopup(false);
        setTimeout(() => setHidePopup(true), 1200);
        setTimeout(() => setShowPopup(false), 1600);
    }

    useEffect(() => {
        async function caricaStrumenti() {
            setLoading(true);
            const dettagli = await Promise.all(
                prodottiComparati.map(async prodotto => {
                    const data = await fetchInstrument(prodotto.id);
                    const dettagliCompleti = Array.isArray(data) ? data[0] : data;
                    return dettagliCompleti || {};
                })
            );
            setStrumenti(dettagli);
            setLoading(false);
        }
        if (prodottiComparati.length > 0) {
            caricaStrumenti();
        } else {
            setStrumenti([]);
        }
    }, [prodottiComparati]);

    const handleRimuovi = (id) => {
        rimuoviDalComparatore(id);
        mostraPopup("Lo strumento è stato rimosso.");
    };

    return (
        <main>
            {showPopup && (
                <div className={`popup-notify popup-remove${hidePopup ? " popup-hide" : ""}`}>
                    {popupMsg}
                </div>
            )}
            <h2 className="comparator-h2">Comparatore</h2>
            {strumenti.length === 0 && !loading ? (
                <p className="comparator-p">Nessun prodotto selezionato per il confronto.</p>
            ) : (
                <div className="big-comparator">
                    <div className="comparatore-container">
                        {strumenti.map((s, idx) => {
                            const m = s.musictool || s;
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