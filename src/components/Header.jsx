import React from "react";
import { Link } from "react-router-dom";
import Big_Logo from "../assets/Big_Logo.png";

export default function Header() {
    return (
        <header>
            <div className="col-30">
                <img src={Big_Logo} alt="" className="head-logo" />
            </div>
            <div className="col-30">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/comparatore">Comparatore</Link></li>
                    <li><Link to="/preferiti">Preferiti</Link></li>
                </ul>
            </div>
            <div className="col-30">
                <Link to="/strumenti" className="icon-button">
                    <i className="fas fa-search"></i>
                </Link>
            </div>
        </header>
    );
}