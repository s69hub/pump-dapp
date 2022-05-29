import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import Staking from "./components/Staking/Staking";
import { StateProvider } from "./contexts/StateContext";

function App() {
  return (
    <StateProvider>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Staking />} />
        </Routes>
      </Router>
    </StateProvider>
  );
}

export default App;
