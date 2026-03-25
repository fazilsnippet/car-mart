import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import CarCreate from "./redux/features/cars/CarCreate";
import BookingCreate from "./redux/features/bookings/BookingCreate";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import CarList from "./redux/features/cars/carList";
import BrandCreation from "./redux/features/brands/brandCreation";
import BrandList from "./redux/features/brands/bradnList";
import CarDetailPage from "./redux/features/cars/carDetailPage";
import Login from "./redux/features/auth/login.jsx";
import Register from "./redux/features/auth/register.jsx";
import MyProfile from "./redux/features/users/userProfile.jsx";
import { useEffect } from "react";
import PrivateRoute from "./utils/private";
import MyBookings from "./redux/features/bookings/myBooking.jsx";
import { useGetUserProfileQuery } from "./redux/features/users/userApi.js";
import { setUser, logout } from "./redux/features/auth/authSlice";


import { useSelector, useDispatch } from "react-redux";
function App() {
  const { theme } = useSelector((state) => state.ui);

  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetUserProfileQuery();

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }

    if (isError) {
      dispatch(logout());
    }
  }, [data, isError, dispatch]);

  if (isLoading) {
    return <div>Loading app...</div>; // or spinner
  }


  // useEffect(() => {
  //   if (theme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [theme]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="car" element={<CarCreate />} />
          <Route path="cars-list" element={<CarList />} />
          <Route path="booking" element={<BookingCreate />} />
          <Route path="brandCreation" element={<BrandCreation />} />
          <Route path="brandList" element={<BrandList />} />
          <Route path="car/:slug" element={<CarDetailPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
           <Route path="register" element={<Register />} />
            <Route path="myBooking" element={<MyBookings/> }/>
          <Route path="/myProfile" element={<MyProfile /> }/>
           </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
