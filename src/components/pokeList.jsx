import '../styles/pokeList.css';
import React from 'react';
import {useState, useEffect} from 'react';

export default function PokemonList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedPokemons, setSearchedPokemons] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const pokedex = JSON.parse(localStorage.getItem('pokedex')) || [];
    const savedSearches = JSON.parse(localStorage.getItem('searchedPokemons')) || [];
    const combinedList = checkDuplicate(savedSearches, pokedex);
    setSearchedPokemons(combinedList);
  }, []);

  const checkDuplicate = (pokesList, pokedexList) => {
    const combined = [];
    pokesList.forEach(pokemon => {
      if (!combined.some(p => p.name === pokemon.name)) {
        combined.push({ ...pokemon, added: isInPokedex(pokemon) });
      }
    });
    pokedexList.forEach(pokemon => {
      if (!combined.some(p => p.name === pokemon.name)) {
        combined.push({ ...pokemon, added: true });
      }
    });
    return combined;
  };

  const fetchPokemon = async () => {
    setError('');
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokemon was not found');
      }
      const data = await response.json();
      setSearchedPokemons(prevState => {
        const isAlreadySearched = prevState.some(p => p.name === data.name);
        if (!isAlreadySearched) {
          const updatedState = [...prevState, { ...data, added: isInPokedex(data) }];
          localStorage.setItem('searchedPokemons', JSON.stringify(updatedState));
          return updatedState;
        }
        return prevState;
      });
      setSearchTerm('');
    } catch (err) {
      setError(err.message);
    }
  };

  const addToPokedex = (pokemon) => {
    let pokedex = JSON.parse(localStorage.getItem('pokedex')) || [];
    if (!pokedex.some(p => p.name === pokemon.name)) {
      pokedex.push(pokemon);
      localStorage.setItem('pokedex', JSON.stringify(pokedex));
    }
    setSearchedPokemons(prevState => {
      const updatedState = prevState.map(p => 
        p.name === pokemon.name ? { ...p, added: true } : p
      );
      localStorage.setItem('searchedPokemons', JSON.stringify(updatedState));
      return updatedState;
    });
  };

  const removeFromPokedex = (pokemonName) => {
    let pokedex = JSON.parse(localStorage.getItem('pokedex')) || [];
    pokedex = pokedex.filter(pokemon => pokemon.name !== pokemonName);
    localStorage.setItem('pokedex', JSON.stringify(pokedex));
    setSearchedPokemons(prevState => {
      const updatedState = prevState.map(p => 
        p.name === pokemonName ? { ...p, added: false } : p
      );
      localStorage.setItem('searchedPokemons', JSON.stringify(updatedState));
      return updatedState;
    });
  };

  const isInPokedex = (pokemon) => {
    let pokedex = JSON.parse(localStorage.getItem('pokedex')) || [];
    return pokedex.some(p => p.name === pokemon.name);
  };

  return (
    <div className="container">
      <h1>Pokemons List</h1>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Type a Pokemon's name or id"
      />
      <button onClick={fetchPokemon}>Search</button>
      {error && <p>{error}</p>}
      <div>
        {searchedPokemons.map((pokemon, index) => (
          <div className="pokemon-card" key={index}>
            <h3>{pokemon.name}</h3>
            {pokemon.sprites && pokemon.sprites.front_default && (
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            )}
            {pokemon.types && (
              <p>Type(s): {pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
            )}
            {pokemon.added ? (
              <div className="already-in-pokedex">
                Already in the Pokedex 
                <button onClick={() => removeFromPokedex(pokemon.name)}>Free this Pokemon</button>
              </div>
            ) : (
              <button onClick={() => addToPokedex(pokemon)}>Add to Pokedex</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}