// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
import HomePage from './pages/Homepage/HomePage';
import SummonerPage from './pages/SummonerPage/SummonerPage'; // Import your SummonerPage component

function App() {
  return (
    <Router>
      <Routes> {/* Wrap your routes with Routes */}
        <Route exact path="/" element={<HomePage />} /> {/* Use 'element' prop instead of 'component' */}
        <Route path="/summoner/:summonerName" element={<SummonerPage />} /> {/* Use 'element' prop instead of 'component' */}
      </Routes>
    </Router>
  );
}

export default App;
