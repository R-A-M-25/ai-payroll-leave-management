export default function Header({ collapsed }) {
  return (
    <header className="bg-white border-b border-gray-200 px-14 py-5 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-900">
        Employee Workspace
      </h1>

      <div className="text-sm text-gray-600">
        Welcome back
      </div>
    </header>
  );
}