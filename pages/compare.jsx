import { useEffect, useState } from "react";

export default function ComparePage() {
  const [compared, setCompared] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("compareList");
    if (stored) setCompared(JSON.parse(stored));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 Porównanie kosmetyków</h1>

      {compared.length === 0 ? (
        <p className="text-gray-600">Nie dodano żadnych produktów do porównania.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Nazwa</th>
              <th className="p-2 text-left">Marka</th>
              <th className="p-2 text-left">Ocena AI</th>
              <th className="p-2 text-left">Składniki</th>
            </tr>
          </thead>
          <tbody>
            {compared.map((prod, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{prod.name}</td>
                <td className="p-2">{prod.brand}</td>
                <td className="p-2">{prod.score_ai}/10</td>
                <td className="p-2 text-sm">{prod.ingredients.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
