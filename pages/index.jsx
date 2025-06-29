// Dodajemy do index.jsx wszystkie nowe funkcje krok po kroku
// Zakładamy, że kod startowy to Twój aktualny działający komponent Home()

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState(null);

  // 🔧 nowe stany do filtrowania i sortowania
  const [minScore, setMinScore] = useState(0);
  const [sortDesc, setSortDesc] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    const ingredients = input.split(",").map((i) => i.trim());
    const res = await fetch("https://agent-kosmetyczny-backend.onrender.com/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });
    const data = await res.json();
    setResult(data);
  };

  const handleRecommendSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://agent-kosmetyczny-backend.onrender.com/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: query }),
    });
    const data = await res.json();
    setRecommendations(data.products);
  };

  const trackClick = async (productName, link) => {
    try {
      await fetch("https://agent-kosmetyczny-backend.onrender.com/api/track/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: productName,
          product_link: link,
        }),
      });
    } catch (err) {
      console.error("Track error", err);
    }
  };

  // 🔍 przefiltrowana i posortowana lista
  const filteredSorted = (recommendations || [])
    .filter((r) => r.score_ai >= minScore)
    .sort((a, b) => (sortDesc ? b.score_ai - a.score_ai : 0));

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-2">🧪 Scoring INCI</h1>
      <form onSubmit={handleScoreSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="np. aqua, alcohol, parfum"
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Sprawdź ocenę</button>
      </form>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Średnia ocena:</strong> {result.avg_score.toFixed(2)}</p>
          <ul className="mt-2">
            {result.details.map((item, idx) => (
              <li key={idx}>{item.ingredient} → {item.score}/10 ({item.risk})</li>
            ))}
          </ul>
        </div>
      )}

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-2">🔍 Szukaj rekomendacji kosmetyków</h2>
      <form onSubmit={handleRecommendSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="np. szukam kremu z filtrem"
          className="w-full p-2 border rounded mb-2"
        />
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <label>
            Minimalna ocena AI: {minScore}
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={minScore}
              onChange={(e) => setMinScore(parseFloat(e.target.value))}
              className="w-full"
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sortDesc}
              onChange={() => setSortDesc(!sortDesc)}
            /> Sortuj malejąco
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showIngredients}
              onChange={() => setShowIngredients(!showIngredients)}
            /> Pokaż składniki
          </label>
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Szukaj rekomendacji</button>
      </form>

      {filteredSorted.length > 0 && (
        <div className="bg-green-100 p-4 rounded">
          <p><strong>Rekomendacje:</strong></p>
          <ul className="mt-2 list-disc list-inside space-y-2">
            {filteredSorted.map((item, idx) => (
              <li key={idx} className="flex flex-col">
                <span>{item.name} ({item.brand}) – {item.score_ai}/10</span>
                {showIngredients && <p className="text-sm">Składniki: {item.ingredients.join(", ")}</p>}
                <div className="flex gap-3 mt-1 text-sm">
                  {['Hebe', 'Rossmann', 'Ceneo', 'Google'].map((shop) => {
                    const urlMap = {
                      Hebe: `https://www.hebe.pl/search?query=${encodeURIComponent(item.name)}`,
                      Rossmann: `https://www.rossmann.pl/szukaj?SearchTerm=${encodeURIComponent(item.name)}`,
                      Ceneo: `https://www.ceneo.pl/Kosmetyki;szukaj-${encodeURIComponent(item.name)}`,
                      Google: `https://www.google.com/search?q=${encodeURIComponent(item.name + " " + item.brand)}`,
                    };
                    return (
                      <a
                        key={shop}
                        href={urlMap[shop]}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick(item.name, urlMap[shop])}
                        className="text-blue-700 underline"
                      >{shop}</a>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
