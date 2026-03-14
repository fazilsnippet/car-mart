import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
        <HiOutlineExclamationCircle className="w-12 h-12 text-indigo-600" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">404 - Page Not Found</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        Oops! It seems the page you're looking for has taken a wrong turn or doesn't exist anymore.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

