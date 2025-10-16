import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import ScrollToTop from "react-scroll-to-top";
import AboutPage from "./pages/AboutPage";
import ServicePage from "./pages/ServicePage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import TeamPage from "./pages/TeamPage";
import TeamDetailsPage from "./pages/TeamDetailsPage";
import ShopPage from "./pages/ShopPage";
import ShopDetailsPage from "./pages/ShopDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRoute from "./components/AdminRoute";
import { Toaster } from 'react-hot-toast';
import AdminSpareParts from "./pages/AdminSpareParts";
import AdminSuppliers from "./pages/AdminSuppliers";
import AdminTechnician from "./pages/AdminTechnician";
import MyCarsPage from "./pages/MyCarsPage";
import CarDetailsPage from "./pages/CarDetailsPage";

function App() {
  return (
    
    <div>
      <BrowserRouter>
        <RouteScrollToTop />
        <ScrollToTop smooth color="#E8092E" />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/signup" element={<SignUpPage />} />
          <Route exact path="/about" element={<AboutPage />} />
          <Route exact path="/service" element={<ServicePage />} />
          <Route exact path="/service-details" element={<ServiceDetailsPage />} />
          <Route exact path="/project" element={<ProjectPage />} />
          <Route exact path="/project-details" element={<ProjectDetailsPage />} />
          <Route exact path="/blog" element={<BlogPage />} />
          <Route exact path="/blog-details" element={<BlogDetailsPage />} />
          <Route exact path="/team" element={<TeamPage />} />
          <Route exact path="/team-details" element={<TeamDetailsPage />} />
          <Route exact path="/shop" element={<ShopPage />} />
          <Route exact path="/shop-details" element={<ShopDetailsPage />} />
          <Route exact path="/cart" element={<CartPage />} />
          <Route exact path="/checkout" element={<CheckoutPage />} />
          <Route exact path="/wishlist" element={<WishlistPage />} />
          <Route exact path="/contact" element={<ContactPage />} />
          <Route exact path="/my-cars" element={<MyCarsPage />} />
          <Route exact path="/car-details/:id" element={<CarDetailsPage />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="/admin/spare-parts" element={
            <AdminRoute>
              <AdminSpareParts />
            </AdminRoute>
          } />
          <Route path="/admin/suppliers" element={
            <AdminRoute>
              <AdminSuppliers />
            </AdminRoute>
          } />
          <Route path="/admin/technicians" element={
            <AdminRoute>
              <AdminTechnician />
            </AdminRoute>
          } />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right"/>
    </div>
  );
}

export default App;
