import { useEffect, useState } from "react";
import { Move, PokeType, VersionGroupDetail } from "../shared/type";
import { getFullPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

interface PokeCardProps {
  selectedPokemon: number;
}
interface PokemonCache {
  [key: number]: PokeType;
}
interface SkillCache {
  [key: string]: Move;
}

const PokeCard = ({ selectedPokemon }: PokeCardProps) => {
  const [data, setData] = useState<PokeType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [skill, setSkill] = useState<Move | null>(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  const { name, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites?.[val as keyof typeof sprites]) {
      return false;
    }
    if (["versions", "other"].includes(val)) {
      return false;
    }
    return true;
  });

  const fetchMoveData = async (move: string, moveUrl: string) => {
    if (loadingSkill || !localStorage || !moveUrl) return;

    // check cache for move
    let c: SkillCache = {};
    if (localStorage.getItem("pokemon-moves")) {
      const localStorageData = localStorage.getItem("pokemon-moves");
      if (localStorageData) {
        c = JSON.parse(localStorageData);
      }
    }
    if (move in c) {
      setSkill(c[move]);
      // console.log("Found move in cache");
      return;
    }

    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();
      // console.log("Fetched move from API", moveData);
      const description = moveData?.flavor_text_entries.filter(
        (val: VersionGroupDetail) => {
          return val.version_group.name == "firered-leafgreen";
        }
      )[0]?.flavor_text;

      const skillData: Move = {
        name: move,
        description: description || "No description available",
        url: moveUrl,
      };
      setSkill(skillData);
      c[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(c));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSkill(false);
    }
  };

  useEffect(() => {
    // if loading, exit logic
    if (loading || !localStorage) return;

    // check if the selected pokemon information is available in the cache
    // 1. define the cache
    let cache: PokemonCache = {};
    if (localStorage.getItem("pokedex")) {
      const localStorageData = localStorage.getItem("pokemon");
      if (localStorageData) {
        cache = JSON.parse(localStorageData);
      }
    }
    // 2. check if the selected pokemon is in the cache, otherwise fetch
    if (selectedPokemon in cache) {
      // read from cache
      setData(cache[selectedPokemon]);
      // console.log("Found pokemon in cache");
      return;
    }

    // we passed all the cache stuff to no avail and now need to fetch the data from the api

    async function fetchPokemonData() {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = "pokemon/" + (selectedPokemon + 1);
        const finalUrl = baseUrl + suffix;
        const res = await fetch(finalUrl);
        const pokemonData = await res.json();
        setData(pokemonData);
        // console.log("Fetched pokemon data");

        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPokemonData();

    // if we fetch from the api, make sure to save the information to the cache for next time
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="poke-card">
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}
        >
          <div className="">
            <h6>Name</h6>
            <h2 className="skill-name">{skill.name}</h2>
          </div>
          <div className="">
            <h6>Description</h6>
            <p>{skill.description.replace("-", " ")}</p>
          </div>
        </Modal>
      )}
      <div className="">
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types?.map((typeObj, typeIndex) => (
          <TypeCard key={typeIndex} type={typeObj?.type?.name} />
        ))}
      </div>
      <img
        src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
        alt={`${name}-large-img`}
        className="default-img"
      />
      <div className="img-container">
        {imgList.map((spriteUrl, spriteIndex) => {
          const imgUrl = sprites![spriteUrl as keyof typeof sprites] as string;
          return (
            <img
              src={imgUrl}
              alt={`${name}-img-${spriteUrl}`}
              key={spriteIndex}
            />
          );
        })}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats?.map(({ stat, base_stat }, statIndex) => (
          <div key={statIndex} className="stat-item">
            <p>{stat?.name.replace("-", " ")}</p>
            <h4>{base_stat}</h4>
          </div>
        ))}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves
          ?.slice() // Create a copy of the moves array
          .sort((a, b) => a.move.name.localeCompare(b.move.name)) // Sort alphabetically by move name
          .map(({ move }, moveIndex) => (
            <button
              className="pokemon-move"
              key={moveIndex}
              onClick={() => {
                fetchMoveData(move.name, move.url);
              }}
            >
              <p>{move?.name.replace("-", " ")}</p>
            </button>
          ))}
      </div>
    </div>
  );
};
export default PokeCard;
