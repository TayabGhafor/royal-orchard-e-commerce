import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="min-h-screen grid place-items-center bg-stone-50 px-6">
    <div className="text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-orange-600 mb-3">
        Page not found
      </p>
      <h1 className="text-4xl font-headline font-extrabold text-stone-900 mb-4">
        This admin page does not exist.
      </h1>
      <Link to="/" className="font-bold text-orange-700 hover:underline">
        Return to dashboard
      </Link>
    </div>
  </main>
);

export default NotFound;
