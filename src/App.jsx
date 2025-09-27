import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Comparatore from "./components/Comparatore";
import Preferiti from "./components/Preferiti";
import Prodotti from "./components/Prodotti";
import DettaglioProdotto from "./components/DettaglioProdotto";
import { ComparatoreProvider } from "./context/ComparatoreContext";
import { PreferitiProvider } from "./context/PreferitiContext";

export default function App() {
  return (
    <ComparatoreProvider>
      <PreferitiProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/comparatore" element={<Comparatore />} />
            <Route path="/preferiti" element={<Preferiti />} />
            <Route path="/strumenti" element={<Prodotti />} />
            <Route path="/strumento/:id" element={<DettaglioProdotto />} />
          </Routes>
        </BrowserRouter>
      </PreferitiProvider>
    </ComparatoreProvider>
  );
}