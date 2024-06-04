import React from 'react';
import {useState,useEffect} from 'react';
import '../styles/pokedex.css';

export default function Pokedex() {
  const [pokedex, setPokedex] = useState([]);

  useEffect(() => {
    setPokedex(JSON.parse(localStorage.getItem('pokedex')));
  }, []);

  const removeFromPokedex = (pokeName) => {
    const updatePokedex = pokedex.filter(pokemon => pokemon.name !== pokeName);
    localStorage.setItem('pokedex', JSON.stringify(updatePokedex));
    setPokedex(updatePokedex);
  };

  return (
    <div className="container">
      <div>
        {pokedex.map((poke, index) => (
          <div className="pokemon-card" key={index}>
            <h2>{poke.name}</h2>
              <img src={poke.sprites.front_default} alt={poke.name} />
              <p>Type: {poke.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
            <button onClick={() => removeFromPokedex(poke.name)}>Free this Pokemon</button>
          </div>
        ))}
      </div>
    </div>
  );
}
