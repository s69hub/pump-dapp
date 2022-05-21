import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Menu from "./components/Menu/Menu";
import Stake from "./components/Stake/Stake";

function App() {
  return (
    <div className="main">
      <UserProvider>
        <Router>
          <Menu />
          <Routes>
            <Route path="/" element={<Stake />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
