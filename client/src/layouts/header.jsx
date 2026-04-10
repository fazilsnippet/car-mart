// components/Header.jsx
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="flex items-center justify-between w-full h-16 px-6 text-white bg-black">
      <Link to="/" className="text-xl font-bold">CarZone</Link>

      <div className="flex gap-4">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/wishlist">Wishlist</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;