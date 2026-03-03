import { useState } from "react";

export default function SearchBar({ onSearch, disabled }) {
  const [query, setQuery] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onSearch(q);
  };

  return (
    <form className="searchRow" onSubmit={submit}>
      <input
        className="searchInput"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name or # (e.g. pikachu or 25)"
        disabled={disabled}
      />
      <button className="searchBtn" type="submit" disabled={disabled}>
        Search
      </button>
    </form>
  );
}