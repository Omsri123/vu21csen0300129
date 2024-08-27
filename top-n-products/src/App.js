import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AP from './pages/AP';
import PD from './pages/PD';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/product/:id" element={<PD/>} />
        <Route path="/" element={<AP/>} />
      </Routes>
    </Router>
  );
}

export default App;
