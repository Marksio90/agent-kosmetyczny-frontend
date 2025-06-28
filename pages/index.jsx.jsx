import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState(null);

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
      body: JSON.stringify({
        skin_type: "dry", // przykładowy profil użytkownika
        allergies: [],
        preferences: [],
      }),
    });
    const data = await res.json();
    setRecommendations(data.products); // <- tutaj zmiana: `data.products`
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
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Szukaj rekomendacji</button>
      </form>

      {recommendations && (
        <div className="bg-green-100 p-4 rounded">
          <p><strong>Rekomendacje:</strong></p>
          <ul className="mt-2 list-disc list-inside">
            {recommendations.map((item, idx) => (
              <li key={idx}>{item.name} – {item.brand} (ocena: {item.score_ai}/10)</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
