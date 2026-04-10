import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../utils/theme.jsx";
import { Sun, Moon } from "lucide-react";
export default function PublicLayout() {
  const user = useSelector((state) => state.auth.user);
    const { theme, toggleTheme } = useTheme();
  

  return (
    <div className="min-h-screen bg-background text-foreground">

      <header className="flex items-center justify-between h-16 px-6 border-b">

        <Link to="/" className="text-lg font-bold">
          CarMart
        </Link>

        <div className="flex gap-4">
          {user ? (
            <Link to="/myProfile">My Account</Link>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Signup</Link>
            </>
          )}
              <button onClick={toggleTheme}>
                        {theme === "dark" ? <Sun /> : <Moon />}
                      </button>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}