import React from "react";
import BigLogo from "../assets/Big_Logo.png";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <main>
            <div className="container order">
                <div className="">
                    <h1>Benvenuto su Musicando!</h1>
                </div>
                <div className="homepic">
                    <img src={BigLogo} alt="" />
                </div>
                <div className="">
                    <p>Con Musicando, puoi comparare vari strumenti musicali!</p>
                    <p>Con noi, hai sempre una media dei prezzi, del peso, origine ed altro...</p>
                    <p>Quindi cosa aspetti? Vai direttamente a guardare tutti gli strumenti disponibili!</p>
                </div>
                <Link to="/strumenti" class="icon-button"><i class="fas fa-search"></i></Link>
            </div>
        </main>
    );
}