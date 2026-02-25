import { useEffect, useState } from "react";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export default function Pokedex() {
  const [dexId, setDexId] = useState(1);
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    async function fetchPokemon() {
      const res = await fetch(`${BASE_URL}/${dexId}/`);
      const data = await res.json();
      setPokemon(data);
    }

    fetchPokemon();
  }, [dexId]);

  const name = pokemon?.name ?? "";
  const sprite =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default ||
    "";

  return (
    <div>
      <h1>Pokédex</h1>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <button onClick={() => setDexId((id) => Math.max(1, id - 1))}>◀</button>

        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          #{dexId} {name && `- ${cap(name)}`}
        </div>

        <button onClick={() => setDexId((id) => id + 1)}>▶</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {sprite ? (
          <img src={sprite} alt={name} style={{ height: "200px" }} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

function cap(s) {
  if (!s) return "";
  return s[0].toUpperCase() + s.slice(1);
}