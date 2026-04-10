// components/MobileDrawer.jsx
import { Link } from "react-router-dom";

const MobileDrawer = ({ open, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl p-6 z-50 transform transition-transform ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <h2 className="mb-4 text-lg font-semibold">More</h2>

        <div className="flex flex-col gap-4">
          <Link to="/wishlist" onClick={onClose}>Wishlist</Link>
          <Link to="/mBooking" onClick={onClose}>Bookings</Link>
          {/* <Link to="/sell" onClick={onClose}>Sell Your Car</Link> */}
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;