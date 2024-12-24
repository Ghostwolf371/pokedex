import { useEffect, useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils/index.ts";

interface SideNavProps {
  selectedPokemon: number;
  setSelectedPokemon: (selectedPokemon: number) => void;
}

const SideNav = ({ selectedPokemon, setSelectedPokemon }: SideNavProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

  const filteredPokemon = debouncedSearchValue
    ? first151Pokemon.filter((pokemon, pokemonIndex) => {
        const pokemonNameMatches = pokemon
          .toLowerCase()
          .includes(debouncedSearchValue.toLowerCase());
        const pokedexNumberMatches = getFullPokedexNumber(
          pokemonIndex
        ).includes(debouncedSearchValue.toLowerCase());

        return pokemonNameMatches || pokedexNumberMatches;
      })
    : first151Pokemon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500); // 500ms delay before updating the search

    return () => clearTimeout(timer); // Cleanup on unmount or when searchValue changes
  }, [searchValue]);

  return (
    <nav>
      <div className={"header"}>
        <h1 className="text-gradient">Pokédex</h1>
      </div>
      <input
        placeholder="E.g. 001 or Bulba..."
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
      {filteredPokemon.length === 0 && searchValue ? (
        <p>No Pokémon found</p> // If no match is found
      ) : (
        filteredPokemon.map((pokemon, pokemonIndex) => {
          const truePokedexNumber = first151Pokemon.indexOf(pokemon);
          return (
            <button
              onClick={() => {
                setSelectedPokemon(truePokedexNumber);
              }}
              key={pokemonIndex}
              className={`nav-card ${
                pokemonIndex === selectedPokemon ? "nav-card-selected" : ""
              }`}
            >
              <p>{getFullPokedexNumber(truePokedexNumber)}</p>
              <p>{pokemon}</p>
            </button>
          );
        })
      )}
    </nav>
  );
};

export default SideNav;
