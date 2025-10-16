import React, { useEffect, useState, useMemo } from "react";
import { useComparatore } from "../context/ComparatoreContext";
import { fetchAllInstruments } from "../api/Strumenti";
import { useNavigate } from "react-router-dom";
import { usePreferiti } from "../context/PreferitiContext";
import { usePopupNotify } from "../hooks/usePopupNotify";
import PopupNotify from "./PopupNotify";
import useDebounce from "../hooks/useDebounce";

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
    // Lista di prodotti recuperati dall'API
    const [prodotti, setProdotti] = useState([]);
    // Stato di caricamento
    const [loading, setLoading] = useState(true);
    // Stato di errore
    const [errore, setErrore] = useState(null);
    // Stato per la ricerca immediata (input)
    const [search, setSearch] = useState("");
    // Stato per l'ordinamento
    const [sortOrder, setSortOrder] = useState("az");
    // Stato per la categoria selezionata
    const [categoria, setCategoria] = useState("Tutte");

    // Context e hook vari
    const { aggiungiAlComparatore, prodottiComparati } = useComparatore();
    const { aggiungiAiPreferiti } = usePreferiti();
    const { show, hide, msg, type, showPopup } = usePopupNotify();
    const navigate = useNavigate();

    // Hook debounce: ritarda l'aggiornamento del valore di ricerca effettivo
    const debouncedSearch = useDebounce(search, 300); // 300ms di default

    // Carica i prodotti all'avvio
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

    // Handler per aggiungere al comparatore e mostrare popup
    const handleCompara = prodotto => {
        aggiungiAlComparatore(prodotto);
        showPopup("Strumento aggiunto al Comparatore!", "success");
    };

    // Handler per aggiungere ai preferiti e mostrare popup
    const handlePreferiti = prodotto => {
        aggiungiAiPreferiti(prodotto);
        showPopup("Strumento aggiunto ai Preferiti!", "success");
    };

    // Calcolo memoizzato dei prodotti filtrati e ordinati.
    // Viene ricalcolato solo quando cambiano prodotti, debouncedSearch, categoria o sortOrder.
    const prodottiFiltrati = useMemo(() => {
        // Normalizza la ricerca debounced
        const q = (debouncedSearch || "").trim().toLowerCase();

        // Filtra per titolo e categoria
        const filtrati = prodotti.filter(p => {
            const title = (p.title || "").toString();
            const matchTitle = title.toLowerCase().includes(q);
            const matchCategory = categoria === "Tutte" || p.category === categoria;
            return matchTitle && matchCategory;
        });

        // Ordina in base a sortOrder
        filtrati.sort((a, b) => {
            const ta = (a.title || "").toString();
            const tb = (b.title || "").toString();
            if (sortOrder === "az") return ta.localeCompare(tb);
            return tb.localeCompare(ta);
        });

        return filtrati;
    }, [prodotti, debouncedSearch, categoria, sortOrder]);

    if (loading) return <div>Caricamento...</div>;
    if (errore) return <div>Errore: {errore}</div>;

    return (
        <>
            <PopupNotify show={show} hide={hide} msg={msg} type={type} />
            <h2 className="comparator-h2">Tutti gli Strumenti</h2>

            <div className="prodotti-filtri-bar">
                <select
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                    className="prodotti-sort-select"
                >
                    <option value="az">A → Z</option>
                    <option value="za">Z → A</option>
                </select>

                {/* Input di ricerca: aggiorna lo stato immediato "search" */}
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
                    const disabilitaCompara = giaComparato || prodottiComparati.length >= 5;
                    return (
                        <div
                            className="prodotto-card"
                            key={prodotto.id}
                            onClick={() => navigate(`/strumento/${prodotto.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <h3>{prodotto.title}</h3>
                            <p>Categoria: {prodotto.category}</p>
                            <div className="prodotto-bottoni" onClick={e => e.stopPropagation()}>
                                <button
                                    className="prodotto-btn"
                                    onClick={() => handlePreferiti(prodotto)}
                                >
                                    Preferiti
                                </button>
                                <button
                                    className="prodotto-btn"
                                    onClick={() => { if (!disabilitaCompara) handleCompara(prodotto); }}
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
        </>
    );
};

export default Prodotti;