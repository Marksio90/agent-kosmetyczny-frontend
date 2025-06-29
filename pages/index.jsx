// pages/index.jsx
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [minScore, setMinScore] = useState(0);
  const [compareList, setCompareList] = useState([]);

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

  const trackClick = async (productName, productLink) => {
    try {
      await fetch("https://agent-kosmetyczny-backend.onrender.com/api/track/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: productName, product_link: productLink }),
      });
    } catch (error) {
      console.error("Tracking error:", error);
    }
  };

  const addToCompare = (product) => {
    setCompareList((prev) => [...prev.filter(p => p.name !== product.name), product]);
  };

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
          placeholder="np. cera sucha, szukam kremu z filtrem"
          className="w-full p-2 border rounded mb-2"
        />
        <label className="block mb-1">Minimalna ocena AI: {minScore}/10</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={minScore}
          onChange={(e) => setMinScore(parseFloat(e.target.value))}
          className="w-full mb-4"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Szukaj rekomendacji</button>
      </form>

      {recommendations && (
        <div className="bg-green-100 p-4 rounded">
          <p><strong>Rekomendacje:</strong></p>
          <ul className="mt-2 list-disc list-inside space-y-2">
            {recommendations.filter(item => item.score_ai >= minScore).map((item, idx) => (
              <li key={idx} className="flex flex-col">
                <span>{item.name} ({item.brand}) – {item.score_ai}/10</span>
                <div className="flex gap-3 mt-1 text-sm">
                  <a href={`https://www.hebe.pl/search?query=${encodeURIComponent(item.name)}`} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(item.name, 'Hebe')} className="text-blue-600 underline">Hebe</a>
                  <a href={`https://www.rossmann.pl/szukaj?SearchTerm=${encodeURIComponent(item.name)}`} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(item.name, 'Rossmann')} className="text-blue-600 underline">Rossmann</a>
                  <a href={`https://www.ceneo.pl/Kosmetyki;szukaj-${encodeURIComponent(item.name)}`} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(item.name, 'Ceneo')} className="text-blue-600 underline">Ceneo</a>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(item.name + " " + item.brand)}`} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(item.name, 'Google')} className="text-green-700 underline">Google</a>
                  <button onClick={() => addToCompare(item)} className="text-xs text-pink-600 underline">+ Porównaj</button>
                </div>
              </li>
            ))}
          </ul>
          {compareList.length > 0 && (
            <Link href={{ pathname: "/compare", query: { items: JSON.stringify(compareList) } }} className="mt-4 inline-block text-white bg-pink-600 px-4 py-2 rounded">Przejdź do porównania</Link>
          )}
        </div>
      )}
    </div>
  );
}
