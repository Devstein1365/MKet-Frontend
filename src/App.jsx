import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import { UnreadMessagesProvider } from "./context/UnreadMessagesContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VerifyEmailSent from "./pages/VerifyEmailSent";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/Error";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Wishlist from "./pages/dashboard/Wishlist";
import PostItem from "./pages/dashboard/PostItem";
import EditListing from "./pages/dashboard/EditListing";
import ProductDetails from "./pages/dashboard/ProductDetails";
import Messages from "./pages/dashboard/Messages";
import Profile from "./pages/dashboard/Profile";
import UserProfile from "./pages/dashboard/UserProfile";
import Settings from "./pages/dashboard/Settings";
import Notifications from "./pages/dashboard/Notifications";
import Categories from "./pages/dashboard/Categories";
import CategoryProducts from "./pages/dashboard/CategoryProducts";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <UnreadMessagesProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              {/* Dashboard routes - nested and protected */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="product/edit/:id" element={<EditListing />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="post" element={<PostItem />} />
                <Route path="chat" element={<Messages />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/:userId" element={<UserProfile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="categories" element={<Categories />} />
                <Route
                  path="categories/:categoryId"
                  element={<CategoryProducts />}
                />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UnreadMessagesProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
