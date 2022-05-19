import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Menu from "./components/Menu/Menu";
import Stake from "./components/Stake/Stake";

function App() {
  return (
    <div className="main">
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Stake />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
