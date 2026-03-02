import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-gray-600">
        Page not found
      </p>

      <Link
        to="/"
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
