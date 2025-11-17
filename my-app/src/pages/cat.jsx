import { useEffect, useState } from "react";
import Axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export const CatPage = () => {
  const [fact, setFact] = useState("");
  const [breedData, setBreedData] = useState([]);

  const generateFact = () => {
    Axios.get("https://catfact.ninja/fact").then((response) => {
      setFact(response.data.fact);
    });
  };

  const fetchBreeds = async () => {
    const response = await Axios.get("https://api.thecatapi.com/v1/breeds");
    const breeds = response.data.slice(0, 8).map((breed) => ({
      name: breed.name,
      weight: parseInt(breed.weight.metric.split(" - ")[1]),
    }));
    setBreedData(breeds);
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

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

      <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Wagi popularnych ras
        </h2>
        <div className="w-full h-64">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
          >
            <BarChart data={breedData}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="weight" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
