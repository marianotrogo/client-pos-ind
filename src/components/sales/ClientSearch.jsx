import { useState } from "react";
import axios from "../../api/axios.js";
import { XCircle } from "lucide-react";

export default function ClientSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedClient(null);
    if (value.length < 2) return setResults([]);

    try {
      const res = await axios.get(`/clientes?search=${value}`);
      setResults(res.data);
    } catch (err) {
      console.error("Error buscando cliente:", err);
    }
  };

  const handleSelect = (client) => {
    setSelectedClient(client);
    setQuery(client.name);
    setResults([]);
    onSelect(client);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSelectedClient(null);
    onSelect(null);
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center border rounded-md shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-400">
        <input
          type="text"
          placeholder="Buscar cliente por nombre o DNI..."
          value={query}
          onChange={handleSearch}
          className="flex-1 p-2 rounded-md focus:outline-none text-sm"
        />
        {selectedClient && (
          <button
            onClick={handleClear}
            className="p-1 text-gray-500 hover:text-red-500 transition"
            title="Limpiar cliente"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute w-full bg-white border rounded-md shadow-lg mt-1 z-20 max-h-52 overflow-auto">
          {results.map((c) => (
            <li
              key={c.id}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(c)}
            >
              <span className="font-medium">{c.name}</span>{" "}
              <span className="text-gray-500">({c.dni || "s/DNI"})</span>
            </li>
          ))}
        </ul>
      )}

      {query.length >= 2 && results.length === 0 && !selectedClient && (
        <div className="absolute bg-white border rounded-md shadow mt-1 p-2 text-sm text-gray-500 w-full z-20">
          Sin coincidencias
        </div>
      )}
    </div>
  );
}
