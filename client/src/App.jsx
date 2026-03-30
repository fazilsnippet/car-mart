import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetUserProfileQuery } from "./redux/features/users/userApi.js";
import { setUser, logout } from "./redux/features/auth/authSlice";
import { connectSocket } from "./utils/socket.js";

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const CarCreate = lazy(() => import("./redux/features/cars/CarCreate"));
const BookingCreate = lazy(() => import("./redux/features/bookings/BookingCreate"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CarList = lazy(() => import("./redux/features/cars/carList"));
const BrandCreation = lazy(() => import("./redux/features/brands/brandCreation"));
const BrandList = lazy(() => import("./redux/features/brands/bradnList"));
const CarDetailPage = lazy(() => import("./redux/features/cars/carDetailPage"));
const Login = lazy(() => import("./redux/features/auth/login.jsx"));
const Register = lazy(() => import("./redux/features/auth/register.jsx"));
const MyProfile = lazy(() => import("./redux/features/users/userProfile.jsx"));
const MyBookings = lazy(() => import("./redux/features/bookings/myBooking.jsx"));
const GetWishlists = lazy(() =>
  import("./redux/features/wishlist/GetWishlists.jsx")
);
const NotificationsPage = lazy(() =>
  import("./redux/features/notification/notifications.page.jsx")
);
const ChatPage = lazy(() => import("./redux/features/chats/chatPage.jsx"));

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useGetUserProfileQuery();

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }

    if (isError) {
      dispatch(logout());
    }
  }, [data, isError, dispatch]);

  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading app...</div>;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/car" element={<CarCreate />} />
            <Route path="/cars-list" element={<CarList />} />
            <Route path="/booking" element={<BookingCreate />} />
            <Route path="/brandCreation" element={<BrandCreation />} />
            <Route path="/brandList" element={<BrandList />} />
            <Route path="/car/:slug" element={<CarDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/myBooking" element={<MyBookings />} />
            <Route path="/wishlist" element={<GetWishlists />} />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:conversationId" element={<ChatPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
