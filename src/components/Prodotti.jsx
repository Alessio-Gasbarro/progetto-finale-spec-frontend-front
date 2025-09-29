import React, { useEffect, useState } from "react"; // Importa React e gli hook useEffect, useState
import { useComparatore } from "../context/ComparatoreContext"; // Importa il context del comparatore
import { fetchAllInstruments } from "../api/Strumenti"; // Importa la funzione per recuperare tutti gli strumenti
import { useNavigate } from "react-router-dom"; // Importa useNavigate per la navigazione SPA
import { usePreferiti } from "../context/PreferitiContext"; // Importa il context dei preferiti
import { usePopupNotify } from "../hooks/usePopupNotify"; // Importa il custom hook per il popup
import PopupNotify from "./PopupNotify"; // Importa il componente popup

// Definisce le categorie disponibili
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
    // Stato locale per la lista dei prodotti
    const [prodotti, setProdotti] = useState([]);
    // Stato locale per il caricamento
    const [loading, setLoading] = useState(true);
    // Stato locale per eventuali errori
    const [errore, setErrore] = useState(null);
    // Stato locale per la ricerca
    const [search, setSearch] = useState("");
    // Stato locale per l'ordinamento
    const [sortOrder, setSortOrder] = useState("az");
    // Stato locale per la categoria selezionata
    const [categoria, setCategoria] = useState("Tutte");

    // Ottiene le funzioni dal context del comparatore
    const { aggiungiAlComparatore, prodottiComparati } = useComparatore();
    // Ottiene la funzione dal context dei preferiti
    const { aggiungiAiPreferiti } = usePreferiti();
    // Ottiene lo stato e la funzione per mostrare il popup dal custom hook
    const { show, hide, msg, type, showPopup } = usePopupNotify();
    // Ottiene la funzione di navigazione
    const navigate = useNavigate();

    // Effetto che carica tutti gli strumenti all'avvio
    useEffect(() => {
        fetchAllInstruments()
            .then(data => {
                setProdotti(data); // Aggiorna lo stato con i prodotti
                setLoading(false); // Imposta loading a false
            })
            .catch(error => {
                setErrore(error.message); // Aggiorna lo stato errore
                setLoading(false); // Imposta loading a false
            });
    }, []); // Solo all'avvio

    // Funzione per aggiungere al comparatore e mostrare popup
    const handleCompara = prodotto => {
        aggiungiAlComparatore(prodotto); // Aggiunge al comparatore
        showPopup("Strumento aggiunto al Comparatore!", "success"); // Mostra popup
    };

    // Funzione per aggiungere ai preferiti e mostrare popup
    const handlePreferiti = prodotto => {
        aggiungiAiPreferiti(prodotto); // Aggiunge ai preferiti
        showPopup("Strumento aggiunto ai Preferiti!", "success"); // Mostra popup
    };

    // Filtra e ordina i prodotti in base a ricerca, categoria e ordinamento
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

    // Se sta caricando, mostra un messaggio di caricamento
    if (loading) return <div>Caricamento...</div>;
    // Se c'è un errore, mostra il messaggio di errore
    if (errore) return <div>Errore: {errore}</div>;

    return (
        <>
            {/* Mostra il popup di notifica */}
            <PopupNotify show={show} hide={hide} msg={msg} type={type} />
            <h2 className="comparator-h2">Tutti gli Strumenti</h2>
            <div className="prodotti-filtri-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                {/* Select per ordinamento */}
                <select
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                    className="prodotti-sort-select"
                >
                    <option value="az">A → Z</option>
                    <option value="za">Z → A</option>
                </select>
                {/* Input per ricerca */}
                <input
                    type="text"
                    placeholder="Cerca per titolo..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="search-bar"
                />
                {/* Select per categoria */}
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
                    const giaComparato = prodottiComparati.some(p => p.id === prodotto.id); // Verifica se già comparato
                    const disabilitaCompara = giaComparato || prodottiComparati.length >= 2; // Disabilita se già comparato o troppi
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
                                        handlePreferiti(prodotto); // Aggiunge ai preferiti
                                    }}
                                >
                                    Preferiti
                                </a>
                                <a
                                    href="#"
                                    className="prodotto-btn"
                                    onClick={e => {
                                        e.preventDefault();
                                        if (!disabilitaCompara) handleCompara(prodotto); // Aggiunge al comparatore
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