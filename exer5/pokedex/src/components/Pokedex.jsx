import { useEffect, useMemo, useState } from "react";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export default function Pokedex() {
  const [dexId, setDexId] = useState(1);
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tab state persists across pokemon changes
  const [tab, setTab] = useState("moves"); // "moves" or "info" (Figma shows Moves selected)

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

  const display = useMemo(() => {
    if (!pokemon) return null;

    const id = pokemon.id ?? dexId;
    const name = cap(pokemon.name ?? "");

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
      name: pretty(s.stat?.name ?? ""),
      value: s.base_stat ?? 0,
    }));

    return { id, name, sprite, types, moves, heightM, weightKg, stats };
  }, [pokemon, dexId]);

  const prev = () => setDexId((id) => Math.max(1, id - 1));
  const next = () => setDexId((id) => id + 1);

  return (
    <div className="page">
      <h1 className="title">Exercise 5 - PokeDex!</h1>

      <div className="layout">
        {/* LEFT PANEL */}
        <div className="left">
          <div className="spriteBox">
            {loading && <div className="hint">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && display?.sprite && (
              <img className="sprite" src={display.sprite} alt={display.name} />
            )}
          </div>

          <div className="nameBox">{display?.name || "—"}</div>

          <div className="typesBlock">
            <div className="typesLabel">Types:</div>
            <div className="typesRow">
              {(display?.types ?? []).map((t) => (
                <span key={t} className={`typePill type-${t}`}>
                  {t}
                </span>
              ))}
            </div>
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
              <ul className="movesList">
                {(display?.moves ?? []).map((m) => (
                  <li key={m}>{pretty(m)}</li>
                ))}
              </ul>
            ) : (
              <div className="infoPanel">
                <div className="infoRow">
                  <span className="infoKey">Height</span>
                  <span className="infoVal">{(display?.heightM ?? 0).toFixed(1)} m</span>
                </div>
                <div className="infoRow">
                  <span className="infoKey">Weight</span>
                  <span className="infoVal">{(display?.weightKg ?? 0).toFixed(1)} kg</span>
                </div>

                <div className="statsTitle">Stats</div>
                <div className="statsList">
                  {(display?.stats ?? []).map((s) => (
                    <div key={s.name} className="statRow">
                      <span className="statName">{s.name}</span>
                      <span className="statVal">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
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

function cap(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}

function pretty(s) {
  return (s ?? "")
    .replaceAll("-", " ")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}