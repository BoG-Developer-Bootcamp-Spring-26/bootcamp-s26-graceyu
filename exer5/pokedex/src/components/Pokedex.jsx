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

  const displayId = pokemon?.id ?? dexId;
  const name = pokemon?.name ? cap(pokemon.name) : "";
  const sprite =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default ||
    "";

  const types = (pokemon?.types ?? [])
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map((t) => t.type.name);

  return (
    <div>
      <h1>Pokédex</h1>

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <button onClick={() => setDexId((id) => Math.max(1, id - 1))}>◀</button>

        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            #{String(displayId).padStart(3, "0")} {name}
          </div>

          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {types.map((t) => (
              <span
                key={t}
                style={{
                  padding: "6px 10px",
                  borderRadius: 10,
                  background: "#ddd",
                  fontWeight: 700,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <button onClick={() => setDexId((id) => id + 1)}>▶</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {sprite ? (
          <img src={sprite} alt={name} style={{ height: 200 }} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

function cap(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}