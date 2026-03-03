export default function TypePills({ types }) {
  return (
    <div className="typesRow">
      {types.map((t) => (
        <span key={t} className={`typePill type-${t}`}>
          {t}
        </span>
      ))}
    </div>
  );
}