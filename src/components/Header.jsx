import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <div className="col-30">
                <h1>Logo</h1>
            </div>
            <div className="col-30">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/comparatore">Comparatore</Link></li>
                    <li><Link to="/preferiti">Preferiti</Link></li>
                </ul>
            </div>
            <div className="col-30">
                <h1>Tasto di Ricerca</h1>
            </div>
        </header>
    );
}