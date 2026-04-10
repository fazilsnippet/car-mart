// layouts/UserLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";

const UserLayout = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default UserLayout;