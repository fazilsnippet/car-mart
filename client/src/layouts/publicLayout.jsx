// layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "./header";
import MobileBottomNav from "./mobileBottomNav";
import MobileDrawer from "./mobileDrawer";
import { useState } from "react";


const PublicLayout = () => {
    const [open, setOpen] = useState(false);

  return (
    <>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
       <MobileBottomNav onOpenMore={() => setOpen(true)} />
      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default PublicLayout;