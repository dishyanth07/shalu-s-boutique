import React from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Package, ShoppingCart, LogOut, ExternalLink, Menu, X, Layers, Star } from 'lucide-react'

const AdminLayout = ({ children }) => {
  const { user, loading, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  if (loading) return null
  if (!user) return <Navigate to="/admin/login" />

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Package size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <Layers size={20} />, label: 'Categories', path: '/admin/categories' },
    { icon: <Star size={20} />, label: 'Featured', path: '/admin/featured' },
    { icon: <ShoppingCart size={20} />, label: 'Orders', path: '/admin/orders' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="p-8 flex flex-col items-start">
          <span className="text-xl font-serif text-[#b89542] leading-none mb-1">Unique</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#b89542] leading-none">BOUTIQUE ADMIN</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-primary text-white font-bold shadow-md' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <div className={location.pathname === item.path ? 'text-white' : 'text-gray-400'}>
                {item.icon}
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50 space-y-2">
          <Link to="/" target="_blank" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary transition-all">
            <ExternalLink size={18} />
            <span className="text-[10px] uppercase tracking-widest font-bold">View Website</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 transition-all text-left"
          >
            <LogOut size={18} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden bg-primary p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-lg font-serif text-accent italic">Unique Admin</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-primary pt-20 px-6 animate-in slide-in-from-top duration-300">
          <nav className="space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-4 p-4 rounded-2xl ${
                  location.pathname === item.path ? 'bg-accent text-primary' : 'text-white/60'
                }`}
              >
                {item.icon}
                <span className="font-bold uppercase tracking-[0.2em]">{item.label}</span>
              </Link>
            ))}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 p-4 rounded-2xl text-red-300"
            >
              <LogOut size={20} />
              <span className="font-bold uppercase tracking-[0.2em]">Log Out</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
