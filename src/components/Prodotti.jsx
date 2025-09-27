import React, { useEffect, useState } from "react";
import { useComparatore } from "../context/ComparatoreContext";
import { fetchAllInstruments } from "../api/Strumenti";
import { useNavigate } from "react-router-dom";
import { usePreferiti } from "../context/PreferitiContext";

const CATEGORIE = [
    "Tutte",
    "Corde",
    "Percussioni",
    "Fiati",
    "Tastiere a mantice",
    "Tastiere",
    "Ottoni"
];

const Prodotti = () => {
    const [prodotti, setProdotti] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [hidePopup, setHidePopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState("");
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("az");
    const [categoria, setCategoria] = useState("Tutte");

    const { aggiungiAlComparatore, prodottiComparati } = useComparatore();
    const { aggiungiAiPreferiti } = usePreferiti();
    const navigate = useNavigate();

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
        setPopupMsg("Strumento aggiunto al Comparatore!");
        setShowPopup(true);
        setHidePopup(false);
        setTimeout(() => setHidePopup(true), 1200);
        setTimeout(() => setShowPopup(false), 1600);
    };

    const handlePreferiti = prodotto => {
        aggiungiAiPreferiti(prodotto);
        setPopupMsg("Strumento aggiunto ai Preferiti!");
        setShowPopup(true);
        setHidePopup(false);
        setTimeout(() => setHidePopup(true), 1200);
        setTimeout(() => setShowPopup(false), 1600);
    };

    // Filtra e ordina i prodotti
    const prodottiFiltrati = prodotti
        .filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase()) &&
            (categoria === "Tutte" || p.category === categoria)
        )
        .sort((a, b) => {
            if (sortOrder === "az") {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });

    if (loading) return <div>Caricamento...</div>;
    if (errore) return <div>Errore: {errore}</div>;

    return (
        <>
            {showPopup && (
                <div className={`popup-notify popup-success${hidePopup ? " popup-hide" : ""}`}>
                    {popupMsg}
                </div>
            )}
            <h2 className="comparator-h2">Tutti gli Strumenti</h2>
            <div className="prodotti-filtri-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                <select
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                    className="prodotti-sort-select"
                >
                    <option value="az">A → Z</option>
                    <option value="za">Z → A</option>
                </select>
                <input
                    type="text"
                    placeholder="Cerca per titolo..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="search-bar"
                />
                <select
                    value={categoria}
                    onChange={e => setCategoria(e.target.value)}
                    className="prodotti-category-select"
                >
                    {CATEGORIE.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="prodotti-container">
                {prodottiFiltrati.map(prodotto => {
                    const giaComparato = prodottiComparati.some(p => p.id === prodotto.id);
                    const disabilitaCompara = giaComparato || prodottiComparati.length >= 2;
                    return (
                        <div
                            className="prodotto-card"
                            key={prodotto.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/strumento/${prodotto.id}`)}
                        >
                            <h3>{prodotto.title}</h3>
                            <p>Categoria: {prodotto.category}</p>
                            <div className="prodotto-bottoni" onClick={e => e.stopPropagation()}>
                                <a
                                    href="#"
                                    className="prodotto-btn"
                                    onClick={e => {
                                        e.preventDefault();
                                        handlePreferiti(prodotto);
                                    }}
                                >
                                    Preferiti
                                </a>
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