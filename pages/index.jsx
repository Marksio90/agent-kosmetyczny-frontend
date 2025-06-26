const handleScoreSubmit = async (e) => {
  e.preventDefault();
  const ingredients = input.split(",").map((i) => i.trim());
  try {
    const res = await fetch("https://agent-kosmetyczny-backend.onrender.com/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    console.log("Wynik scoringu:", data);
    setResult(data);
  } catch (err) {
    console.error("Błąd scoringu:", err);
    alert("Nie udało się pobrać oceny składników.");
  }
};

const handleRecommendSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("https://agent-kosmetyczny-backend.onrender.com/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: query }),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    console.log("Wynik rekomendacji:", data);
    setRecommendations(data);
  } catch (err) {
    console.error("Błąd rekomendacji:", err);
    alert("Nie udało się pobrać rekomendacji.");
  }
};
