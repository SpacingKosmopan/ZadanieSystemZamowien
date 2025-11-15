import { useState } from "react";
import Axios from "axios";

export const CatPage = () => {
  const [fact, setFact] = useState("");

  const generateFact = () => {
    Axios.get("https://catfact.ninja/fact").then((response) => {
      setFact(response.data.fact);
    });
  };

  return (
    <div className="max-w-xl w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Ciekawostki o kotach
        </h1>
        <p className="text-sm text-gray-500">
          Kliknij przycisk, aby pobrać fakt
        </p>
      </header>
      <button
        onClick={generateFact}
        className="px-3 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50"
      >
        Wygeneruj
      </button>
      <div className="mt-4 p-4 bg-linear-to-r from-white to-gray-50 border border-gray-100 rounded-lg">
        <p className="text-gray-800 leading-relaxed">{fact}</p>
      </div>
    </div>
  );
};
