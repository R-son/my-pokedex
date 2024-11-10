import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/navbar.css';
import pokeLogo from '../styles/Pokemon.png'; // Importer votre logo

export default function Navbar() {
  return (
    <div className="navbar">
      <img src={pokeLogo} alt="Logo" className="navLogo" />
      <div className="navLinks">
        <Link to="/" className="navLink button">Pokemons List</Link>
        <Link to="/pokedex" className="navLink button">My Pokedex</Link>
      </div>
    </div>
  );
}
