import React, { useEffect, useState } from "react";
import { useComparatore } from "../context/ComparatoreContext";
import { fetchInstrument } from "../api/Strumenti";

export default function Comparatore() {
    const { prodottiComparati, rimuoviDalComparatore, svuotaComparatore } = useComparatore();
    const [strumenti, setStrumenti] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function caricaStrumenti() {
            setLoading(true);
            const dettagli = await Promise.all(
                prodottiComparati.map(async prodotto => {
                    const data = await fetchInstrument(prodotto.id);
                    // Se il backend restituisce un array, prendi il primo elemento
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

    return (
        <main>
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
                                    <button className="comparatore-btn" onClick={() => rimuoviDalComparatore(m.id)}>
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
        </main>
    );
}