import { useEffect, useMemo, useState } from "react";
import TypePills from "./TypePills";
import InfoPanel from "./InfoPanel";
import MovesPanel from "./MovesPanel";
import SearchBar from "./SearchBar";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export default function Pokedex() {
  const [dexId, setDexId] = useState(1);
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("moves");

  async function fetchPokemon(queryOrId) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/${queryOrId}/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setPokemon(data);
      setDexId(data.id);
    } catch (e) {
      setError("Could not load that Pokémon. Try a different name or number.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPokemon(dexId);
    // eslint-disable-next-line
  }, [dexId]);

  const display = useMemo(() => {
    if (!pokemon) return null;

    const id = pokemon.id ?? dexId;
    const nameLower = (pokemon.name ?? "").toLowerCase();

    const sprite =
      pokemon.sprites?.other?.["official-artwork"]?.front_default ||
      pokemon.sprites?.front_default ||
      "";

    const types = (pokemon.types ?? [])
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name);

    const moves = (pokemon.moves ?? []).map((m) => m.move.name);

    const heightM = (pokemon.height ?? 0) / 10;
    const weightKg = (pokemon.weight ?? 0) / 10;

    const stats = (pokemon.stats ?? []).map((s) => ({
      name: prettyTitle(s.stat?.name ?? ""),
      value: s.base_stat ?? 0,
    }));

    return { id, nameLower, sprite, types, moves, heightM, weightKg, stats };
  }, [pokemon, dexId]);

  const prev = () => setDexId((id) => Math.max(1, id - 1));
  const next = () => setDexId((id) => id + 1);

  const onSearch = (q) => {
    const normalized = q.toLowerCase();
    fetchPokemon(normalized);
  };

  return (
    <div className="page">
      <h1 className="title">Exercise 5 - PokeDex!</h1>

      <SearchBar onSearch={onSearch} disabled={loading} />

      <div className="layout">
        {/* LEFT PANEL */}
        <div className="left">
          <div className="spriteBox">
            {loading && <div className="hint">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && display?.sprite && (
              <img className="sprite" src={display.sprite} alt={display.nameLower} />
            )}
          </div>

          <div className="dexNumber">
            #{String(display?.id ?? dexId).padStart(3, "0")}
          </div>

          <div className="nameBox">{display?.nameLower || "—"}</div>

          <div className="typesBlock">
            <div className="typesLabel">Types:</div>
            <TypePills types={display?.types ?? []} />
          </div>

          <div className="arrowRow">
            <button className="arrowBtn" onClick={prev} disabled={dexId <= 1 || loading}>
              &lt;
            </button>
            <button className="arrowBtn" onClick={next} disabled={loading}>
              &gt;
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right">
          <div className="rightHeader">{tab === "moves" ? "Moves" : "Info"}</div>

          <div className="dataPanel">
            {tab === "moves" ? (
              <MovesPanel moves={display?.moves ?? []} />
            ) : (
              <InfoPanel
                heightM={display?.heightM ?? 0}
                weightKg={display?.weightKg ?? 0}
                stats={display?.stats ?? []}
              />
            )}
          </div>

          <div className="tabRow">
            <button
              className={`tabBtn ${tab === "info" ? "tabActiveInfo" : ""}`}
              onClick={() => setTab("info")}
            >
              Info
            </button>

            <button
              className={`tabBtn ${tab === "moves" ? "tabActiveMoves" : ""}`}
              onClick={() => setTab("moves")}
            >
              Moves
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function prettyTitle(s) {
  return (s ?? "")
    .replaceAll("-", " ")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}