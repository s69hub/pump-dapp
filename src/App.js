import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import Stake from "./components/Stake/Stake";
import { StateProvider } from "./contexts/StateContext";

function App() {
  return (
    <div className="main">
      <StateProvider>
        <Router>
          <Menu />
          <Routes>
            <Route path="/" element={<Stake />} />
          </Routes>
        </Router>
      </StateProvider>
    </div>
  );
}

export default App;
