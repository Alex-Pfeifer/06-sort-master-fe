import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-semibold text-gray-900">
          Trash Sort
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            About
          </Link>
          <Link
            to="/containers"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Containers
          </Link>
          <Link
            to="/container-form"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Add container
          </Link>
          <Link
              to="/items"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Items
          </Link>
        </nav>
      </div>
    </header>
  );
}
