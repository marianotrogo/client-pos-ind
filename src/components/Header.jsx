export default function Header({ title }) {
  return (
    <header className="bg-white h-16 shadow-md flex items-center px-6 ml-64">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
    </header>
  );
}
