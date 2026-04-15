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

/* ✅ NON-LAZY (CRITICAL ROUTES) */
import DashboardLayout from "./layouts/DashboardLayout";
// import Dashboard from "./pages/Dashboard";

/* ✅ LAZY (NON-CRITICAL ROUTES) */
const CarCreate = lazy(() => import("./redux/features/cars/CarCreate"));
const BookingCreate = lazy(() =>
  import("./redux/features/bookings/BookingCreate")
);
const NotFound = lazy(() => import("./pages/NotFound"));
// const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Dashboard = lazy(() => import("./pages/newDashboard"));
const CarList = lazy(() => import("./redux/features/cars/carList"));
const BrandCreation = lazy(() =>
  import("./redux/features/brands/brandCreation")
);
const BrandList = lazy(() =>
  import("./redux/features/brands/bradnList")
);
const CarDetailPage = lazy(() =>
  import("./redux/features/cars/carDetailPage")
);
const Login = lazy(() => import("./redux/features/auth/login.jsx"));
const Register = lazy(() => import("./redux/features/auth/register.jsx"));
const MyProfile = lazy(() =>
  import("./redux/features/users/userProfile.jsx")
);
const MyBookings = lazy(() =>
  import("./redux/features/bookings/myBooking.jsx")
);
const GetWishlists = lazy(() =>
  import("./redux/features/wishlist/GetWishlists.jsx")
);
const NotificationsPage = lazy(() =>
  import("./redux/features/notification/notifications.page.jsx")
);
import Header from "./layouts/header.jsx";
const ChatPage = lazy(() =>
  import("./redux/features/chats/chatPage.jsx")
);
import EmiCalculator from "./utils/emiCalculator.jsx";
import CarForm from "./redux/features/carSell/carForm.jsx";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [getMe, { isLoading }] = useLazyGetMeQuery();
  const [refreshAccessToken] = useRefreshAccessTokenMutation();

  /* 🔐 Restore session */
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
            // fallback
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

  /* 🔌 Socket connection */
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
        <Header/>
      <Routes>
        {/* ✅ ROOT (NO LAZY) */}
        <Route path="/" element={<DashboardLayout />}>
          {/* <Route index element={<Dashboard />} /> */}

          {/* 🔒 Admin */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute adminOnly>
                  <Dashboard />
                </PrivateRoute>
              </Suspense>
            }
          />
           {/* <Route
        index
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          </Suspense>
        }
      /> */}

          {/* 🚗 Cars */}
          <Route
            path="/car"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute adminOnly>
                  <CarCreate />
                </PrivateRoute>
              </Suspense>
            }
          />

          <Route
            path="/cars-list"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <CarList />
              </Suspense>
            }
          />

          <Route
            path="/car/:slug"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <CarDetailPage />
              </Suspense>
            }
          />

          {/* 📦 Booking */}
          <Route
            path="/booking"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <BookingCreate />
              </Suspense>
            }
          />

          <Route
            path="/myBooking"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              </Suspense>
            }
          />

          {/* 🏷️ Brands */}
          <Route
            path="/brandCreation"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute adminOnly>
                  <BrandCreation />
                </PrivateRoute>
              </Suspense>
            }
          />

          <Route
            path="/brandList"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <BrandList />
              </Suspense>
            }
          />

          {/* 👤 Auth */}
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            }
          />
            <Route
            path="/emiCalculator"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <EmiCalculator />
              </Suspense>
            }
          />
          

          <Route
            path="/register"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Register />
              </Suspense>
            }
          />

          {/* 🙍 User */}
          <Route
            path="/myProfile"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute>
                  <MyProfile />
                </PrivateRoute>
              </Suspense>
            }
          />

          <Route
            path="/wishlist"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute>
                  <GetWishlists />
                </PrivateRoute>
              </Suspense>
            }
          />
          <Route
            path="/sell-car"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute>
                  <CarForm />
                </PrivateRoute>
              </Suspense>
            }
          />

          {/* 🔔 Notifications */}
          <Route
            path="/notifications"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              </Suspense>
            }
          />
 
          {/* 💬 Chat */}
          <Route
            path="/chat"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              </Suspense>
            }
          />

          <Route
            path="/chat/:conversationId"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              </Suspense>
            }
          />
        </Route>

        {/* ❌ 404 */}
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;