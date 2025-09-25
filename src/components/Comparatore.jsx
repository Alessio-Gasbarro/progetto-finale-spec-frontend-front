import React from "react";
import { useComparatore } from "../context/ComparatoreContext";

export default function Comparatore() {
    const { prodottiComparati, rimuoviDalComparatore, svuotaComparatore } = useComparatore();

    return (
        <main>
            <h2 className="comparator-h2">Comparatore</h2>
            {prodottiComparati.length === 0 ? (
                <p className="comparator-p">Nessun prodotto selezionato per il confronto.</p>
            ) : (
                <div className="big-comparator">
                    <div className="comparatore-container">
                        {prodottiComparati.map(prodotto => (
                            <div key={prodotto.title} className="comparatore-card">
                                <img
                                    src={prodotto.image}
                                    alt={prodotto.title}
                                    className="comparatore-img"
                                />
                                <h3 className="comparatore-title">{prodotto.title}</h3>
                                <p className="comparatore-category">Categoria: {prodotto.category}</p>
                                <p>Origine: {prodotto.origin}</p>
                                <p>Difficoltà: {prodotto.difficulty}</p>
                                <p>Prezzo medio: {prodotto.averagePrice} €</p>
                                <p>Peso medio: {prodotto.averageWeight} kg</p>
                                <button
                                    className="comparatore-btn"
                                    onClick={() => rimuoviDalComparatore(prodotto.title)}
                                >
                                    Rimuovi
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        className="comparatore-btn comparatore-btn-svuota"
                        onClick={svuotaComparatore}
                    >
                        Svuota tutto
                    </button>
                </div>
            )}
        </main>
    );
}