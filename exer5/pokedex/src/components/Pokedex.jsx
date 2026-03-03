import { useEffect, useState } from "react";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export default function Pokedex() {
  const [dexId, setDexId] = useState(1);
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchPokemon() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${BASE_URL}/${dexId}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setPokemon(data);
      } catch (e) {
        if (!cancelled) {
          setPokemon(null);
          setError("Could not load that Pokémon.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPokemon();
    return () => {
      cancelled = true;
    };
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

  const prev = () => setDexId((id) => Math.max(1, id - 1));
  const next = () => setDexId((id) => id + 1);

  return (
    <div className="page">
      <h1 className="title">Pokédex</h1>

      <div className="topRow">
        <button className="arrowBtn" onClick={prev} disabled={dexId <= 1 || loading}>
          ◀
        </button>

        <div className="centerBlock">
          <div className="idName">
            #{String(displayId).padStart(3, "0")} {name}
          </div>

          <div className="typesRow">
            {types.map((t) => (
              <span key={t} className={`typePill type-${t}`}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <button className="arrowBtn" onClick={next} disabled={loading}>
          ▶
        </button>
      </div>

      <div className="spriteBox">
        {loading && <div className="hint">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && sprite && <img className="sprite" src={sprite} alt={name} />}
      </div>
    </div>
  );
}

function cap(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}