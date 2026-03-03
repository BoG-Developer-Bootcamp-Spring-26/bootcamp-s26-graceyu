export default function MovesPanel({ moves }) {
  return (
    <ul className="movesList">
      {(moves ?? []).map((m) => (
        <li key={m}>{prettyLower(m)}</li>
      ))}
    </ul>
  );
}

function prettyLower(s) {
  return (s ?? "").toLowerCase().replaceAll("-", " ");
}