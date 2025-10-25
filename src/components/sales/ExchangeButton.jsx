export default function ExchangeButton({ isExchangeMode, onToggle }) {
  return (
    <button
      onClick={() => onToggle(!isExchangeMode)}
      className={`px-4 py-2 rounded-md shadow-sm transition ${
        isExchangeMode
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      {isExchangeMode ? "🔁 Modo Cambio Activado" : "Activar Modo Cambio"}
    </button>
  );
}
