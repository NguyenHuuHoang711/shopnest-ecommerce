import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import React, { lazy, Suspense } from "react";

import Home from "./pages/user/Home";

const Products = lazy(() => import("./pages/user/Products"));
const Product = lazy(() => import("./pages/user/Product"));
const About = lazy(() => import("./pages/user/About"));
const Contact = lazy(() => import("./pages/user/Contact"));
const Faq = lazy(() => import("./pages/user/Faq"));
const ShippingAndReturn = lazy(() => import("./pages/user/ShippingAndReturn"));
const StorePolicy = lazy(() => import("./pages/user/StorePolicy"));
const Cart = lazy(() => import("./pages/user/Cart"));
const Checkout = lazy(() => import("./pages/user/Checkout"));
const Authentication = lazy(() => import("./pages/auth/Authentication"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const Orders = lazy(() => import("./pages/user/Orders"));
const Order = lazy(() => import("./pages/user/Order"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Admin = lazy(() => import("./pages/admin/Admin"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminOrderDetails = lazy(() => import("./pages/admin/AdminOrderDetails"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminUserDetails = lazy(() => import("./pages/admin/AdminUserDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));

import Topbar from "./features/admin/components/shared/Topbar";
import Sidebar from "./features/admin/components/shared/Sidebar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./routes/ScrollToTop";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import GlobalLoader from "./components/feedback/loading/GlobalLoader";
import RouteError from "./components/feedback/error/RouteError";

const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
const AuthLayout = () => <Outlet />;

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />

      <div className="min-w-0 flex-1 flex flex-col relative lg:pl-72">
        <Topbar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/admin",
        errorElement: <RouteError />,
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: (
              <AdminRoute>
                <Admin />
              </AdminRoute>
            ),
          },
          {
            path: "orders",
            element: (
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            ),
          },
          {
            path: "orders/:id",
            element: (
              <AdminRoute>
                <AdminOrderDetails />
              </AdminRoute>
            ),
          },
          {
            path: "products",
            element: (
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            ),
          },
          {
            path: "products/new",
            element: (
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            ),
          },
          {
            path: "products/:id/edit",
            element: (
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            ),
          },
          {
            path: "users",
            element: (
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            ),
          },
          {
            path: "users/:id",
            element: (
              <AdminRoute>
                <AdminUserDetails />
              </AdminRoute>
            ),
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
      {
        path: "/auth",
        errorElement: <RouteError />,
        element: <AuthLayout />,
        children: [
          { path: "", element: <Authentication /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "reset-password/:token", element: <ResetPassword /> },

          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
      {
        path: "/",
        errorElement: <RouteError />,
        element: <RootLayout />,
        children: [
          { path: "", element: <Home /> },
          { path: "products", element: <Products /> },
          { path: "about", element: <About /> },
          { path: "faq", element: <Faq /> },
          { path: "contact", element: <Contact /> },
          { path: "shipping&return", element: <ShippingAndReturn /> },
          { path: "storepolicy", element: <StorePolicy /> },
          { path: "cart", element: <Cart /> },
          { path: "products/:id", element: <Product /> },
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: "wishlist",
            element: (
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            ),
          },
          {
            path: "orders",
            element: (
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            ),
          },
          {
            path: "orders/:id",
            element: (
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            ),
          },
          {
            path: "checkout",
            element: (
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            ),
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
