import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Comparatore from "./components/Comparatore";
import Preferiti from "./components/Preferiti";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparatore" element={<Comparatore />} />
        <Route path="/preferiti" element={<Preferiti />} />
      </Routes>
    </BrowserRouter>
  );
}