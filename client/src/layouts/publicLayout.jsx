// // layouts/PublicLayout.jsx
// import { Outlet } from "react-router-dom";
// import MobileBottomNav from "./mobileBottomNav";
// import MobileDrawer from "./mobileDrawer";
// import { useState } from "react";
// import Header from "./header";


// const PublicLayout = () => {
//     const [open, setOpen] = useState(false);

//   return (
//     <>
//        <Header /> 
//       <main className="p-4">
//         <Outlet />
//       </main>
//        <MobileBottomNav onOpenMore={() => setOpen(true)} />
//       <MobileDrawer open={open} onClose={() => setOpen(false)} />
//     </>
//   );
// };

// export default PublicLayout;