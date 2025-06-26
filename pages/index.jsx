
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
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

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧪 Scoring INCI</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Wpisz składniki oddzielone przecinkami"
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Sprawdź</button>
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
    </div>
  );
}
