import { useState } from "react";

export default function Pokedex() {
  const [dexId, setDexId] = useState(1);

  return (
    <div>
      <h1>Pokédex</h1>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <button onClick={() => setDexId((id) => Math.max(1, id - 1))}>
          ◀
        </button>

        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          #{dexId}
        </div>

        <button onClick={() => setDexId((id) => id + 1)}>
          ▶
        </button>
      </div>
    </div>
  );
}