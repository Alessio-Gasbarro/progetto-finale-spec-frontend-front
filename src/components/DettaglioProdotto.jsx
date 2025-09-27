import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchInstrument } from "../api/Strumenti";
import { useComparatore } from "../context/ComparatoreContext";
import { usePreferiti } from "../context/PreferitiContext";

export default function DettaglioProdotto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { aggiungiAlComparatore } = useComparatore();
    const { aggiungiAiPreferiti } = usePreferiti();
    const [prodotto, setProdotto] = useState(null);
    const [loading, setLoading] = useState(true);

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
        async function carica() {
            const data = await fetchInstrument(id);
            const m = data.musictool || data;
            setProdotto(m);
            setLoading(false);
        }
        carica();
    }, [id]);

    if (loading) return <div className="comparator-p">Caricamento...</div>;
    if (!prodotto) return <div className="comparator-p">Prodotto non trovato.</div>;

    return (
        <>
            {showPopup && (
                <div className={`popup-notify popup-success${hidePopup ? " popup-hide" : ""}`}>
                    {popupMsg}
                </div>
            )}
            <div className="dettaglio-prodotto-wrapper">
                <div className="dettaglio-prodotto-img">
                    {prodotto.image && (
                        <img
                            src={prodotto.image}
                            alt={prodotto.title}
                            className="dettaglio-prodotto-img-el"
                        />
                    )}
                </div>
                <div className="dettaglio-prodotto-info">
                    <h2 className="dettaglio-prodotto-title">{prodotto.title}</h2>
                    <p className="dettaglio-prodotto-category"><b>Categoria:</b> {prodotto.category || "N/A"}</p>
                    <p><b>Origine:</b> {prodotto.origin || "N/A"}</p>
                    <p><b>Difficoltà:</b> {prodotto.difficulty !== undefined ? prodotto.difficulty : "N/A"}</p>
                    <p><b>Prezzo medio:</b> {prodotto.averagePrice !== undefined ? prodotto.averagePrice + " €" : "N/A"}</p>
                    <p><b>Peso medio:</b> {prodotto.averageWeight !== undefined ? prodotto.averageWeight + " kg" : "N/A"}</p>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "2rem" }}>
                <button
                    className="comparatore-btn"
                    onClick={() => navigate("/strumenti")}
                >
                    Torna ai prodotti
                </button>
                <button
                    className="comparatore-btn"
                    onClick={() => {
                        aggiungiAiPreferiti(prodotto);
                        mostraPopup("Strumento aggiunto ai Preferiti!");
                    }}
                >
                    Aggiungi ai preferiti
                </button>
                <button
                    className="comparatore-btn"
                    onClick={() => {
                        aggiungiAlComparatore(prodotto);
                        mostraPopup("Strumento aggiunto al Comparatore!");
                    }}
                >
                    Aggiungi al comparatore
                </button>
            </div>
        </>
    );
}