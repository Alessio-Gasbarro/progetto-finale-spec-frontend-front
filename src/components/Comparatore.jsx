import React, { useEffect, useState } from "react";
import { useComparatore } from "../context/ComparatoreContext";
import { fetchInstrument } from "../api/Strumenti";
import { Link } from "react-router-dom";
import { usePopupNotify } from "../hooks/usePopupNotify";
import PopupNotify from "./PopupNotify";

export default function Comparatore() {
    const { prodottiComparati, rimuoviDalComparatore, svuotaComparatore } = useComparatore();
    const [strumenti, setStrumenti] = useState([]);
    const [loading, setLoading] = useState(false);

    const { show, hide, msg, type, showPopup } = usePopupNotify();

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
        showPopup("Lo strumento è stato rimosso.", "remove");
    };

    return (
        <main>
            <PopupNotify show={show} hide={hide} msg={msg} type={type} />
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