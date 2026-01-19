import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./Components/Home";
import Catalog from "./Components/Catalog";
import CarPage from "./Components/CarPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
        <header style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <Link to="/">Автосалон</Link>
          <Link to="/cars">Каталог</Link>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Catalog />} />
          <Route path="/cars/:id" element={<CarPage />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("app")).render(<App />);
