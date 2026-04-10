// components/Sidebar.jsx
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="flex-col hidden w-64 min-h-screen p-4 text-white bg-gray-900 md:flex">
      
      <h2 className="mb-6 text-lg font-semibold">Menu</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/myBooking">Bookings</Link>
        <Link to="/myProfile">Profile</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/sell">Sell Your Car</Link>
      </nav>

    </aside>
  );
};

export default Sidebar;