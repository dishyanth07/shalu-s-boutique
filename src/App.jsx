import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import OrderHistory from './pages/OrderHistory'
import Contact from './pages/Contact'
import Collection from './pages/Collection'
import Wishlist from './pages/Wishlist'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import AdminFeatured from './pages/admin/AdminFeatured'
import MainLayout from './components/layout/MainLayout'


function App() {
  return (
    <div className="min-h-screen bg-primary-light text-primary">
      <Toaster position="top-center" />
      <Routes>
        {/* Customer Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/history" element={<OrderHistory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/collections/:categoryId" element={<Collection />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/featured" element={<AdminFeatured />} />
      </Routes>
    </div>
  )
}

export default App
