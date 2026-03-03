export default function InfoPanel({ heightM, weightKg, stats }) {
  return (
    <div className="infoPanel">
      <div className="infoRow">
        <span className="infoKey">Height</span>
        <span className="infoVal">{(heightM ?? 0).toFixed(1)} m</span>
      </div>

      <div className="infoRow">
        <span className="infoKey">Weight</span>
        <span className="infoVal">{(weightKg ?? 0).toFixed(1)} kg</span>
      </div>

      <div className="statsTitle">Stats</div>
      <div className="statsList">
        {(stats ?? []).map((s) => (
          <div key={s.name} className="statRow">
            <span className="statName">{s.name}</span>
            <span className="statVal">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}