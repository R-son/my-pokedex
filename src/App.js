import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PokeList from './components/pokeList';
import Pokedex from './components/pokedex';
import Navbar from './components/navbar';

export default function App() {
  return (
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<PokeList/>}/>
          <Route path="/pokedex" element={<Pokedex/>} />
        </Routes>
      </Router>
  );
}