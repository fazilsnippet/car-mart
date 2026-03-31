import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useLazyGetMeQuery,
  useRefreshAccessTokenMutation,
} from "./redux/features/users/userApi.js";
import { setUser, logout } from "./redux/features/auth/authSlice";
import { connectSocket } from "./utils/socket.js";
import PrivateRoute from "./utils/private.jsx";

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const CarCreate = lazy(() => import("./redux/features/cars/CarCreate"));
const BookingCreate = lazy(() => import("./redux/features/bookings/BookingCreate"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
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
  const [getMe, { isLoading }] = useLazyGetMeQuery();
  const [refreshAccessToken] = useRefreshAccessTokenMutation();

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await getMe().unwrap();

        if (isMounted && response?.data) {
          dispatch(setUser(response.data));
        }
      } catch (error) {
        if (error?.status === 401) {
          try {
            await refreshAccessToken().unwrap();
            const refreshedUser = await getMe().unwrap();

            if (isMounted && refreshedUser?.data) {
              dispatch(setUser(refreshedUser.data));
              return;
            }
          } catch {
            // fall through to logout
          }
        }

        if (isMounted) {
          dispatch(logout());
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, getMe, refreshAccessToken]);

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
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/car"
              element={
                <PrivateRoute adminOnly>
                  <CarCreate />
                </PrivateRoute>
              }
            />
            <Route path="/cars-list" element={<CarList />} />
            <Route path="/booking" element={<BookingCreate />} />
            <Route
              path="/brandCreation"
              element={
                <PrivateRoute adminOnly>
                  <BrandCreation />
                </PrivateRoute>
              }
            />
            <Route path="/brandList" element={<BrandList />} />
            <Route path="/car/:slug" element={<CarDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/myBooking"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <PrivateRoute>
                  <GetWishlists />
                </PrivateRoute>
              }
            />
            <Route
              path="/myProfile"
              element={
                <PrivateRoute>
                  <MyProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat/:conversationId"
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
