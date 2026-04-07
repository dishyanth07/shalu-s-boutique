import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X, ChevronDown, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { supabase } from '../lib/supabase'

const Navbar = () => {
  const { totalItems } = useCart()
  const { wishlist } = useWishlist()
  const navigate = useNavigate()

  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      if (data) setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const inputRef = useRef(null)

  // Focus input when overlay opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [searchOpen])

  // Escape key to close
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Debounced Supabase search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      const { data } = await supabase
        .from('products')
        .select('id, name, category, product_variants(price, image_url)')
        .ilike('name', `%${query}%`)
        .limit(6)
      setResults(data || [])
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleResultClick = (id) => {
    setSearchOpen(false)
    navigate(`/product/${id}`)
  }

  return (
    <>
      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Input row */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <Search size={20} className="text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-base text-primary outline-none bg-transparent placeholder-gray-400"
              />
              <button onClick={() => setSearchOpen(false)} className="p-1 text-gray-400 hover:text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Results */}
            {query.trim() && (
              <div className="max-h-80 overflow-y-auto">
                {searching ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-accent" />
                  </div>
                ) : results.length > 0 ? (
                  results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleResultClick(p.id)}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-12 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.product_variants?.[0]?.image_url && (
                          <img src={p.product_variants[0].image_url} alt={p.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-primary text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{p.category}</p>
                      </div>
                      {p.product_variants?.[0]?.price && (
                        <p className="text-sm font-bold text-accent">₹{p.product_variants[0].price}</p>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-center text-gray-400 text-sm py-8">No products found for "{query}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={(e) => e.target === e.currentTarget && setMobileMenuOpen(false)}
      >
        <div className={`fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex flex-col">
              <span className="text-xl font-serif text-[#b89542]">Unique</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#b89542]">BOUTIQUE</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-primary transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6 flex flex-col space-y-6">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-primary hover:text-[#b89542]">HOME</NavLink>
            <NavLink to="/collections/all" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-primary hover:text-[#b89542]">ALL CATEGORIES</NavLink>
            <div className="pl-4 border-l border-gray-100 flex flex-col space-y-4">
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  to={`/collections/${cat.slug}`} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#b89542]"
                >
                  {cat.name.replace("UNIQUE ", "")}
                </Link>
              ))}
            </div>
            <NavLink to="/collections/best-sellers" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-primary hover:text-[#b89542]">BEST SELLERS</NavLink>
            <NavLink to="/collections/pre-booking" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-primary hover:text-[#b89542]">PRE-BOOKING</NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-primary hover:text-[#b89542]">CONTACT</NavLink>
            <NavLink to="/history" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-primary hover:text-[#b89542]">ORDER HISTORY</NavLink>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
             <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-[#b89542]">
               <User size={18} /> Admin
             </Link>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#c8b6ff] text-primary text-[9px] sm:text-xs font-bold py-2 px-4 text-center uppercase tracking-widest z-50 relative overflow-hidden whitespace-nowrap text-ellipsis">
        WhatsApp: 9092330688
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">

            {/* Left Box: Mobile Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-primary hover:text-[#b89542] transition-colors lg:hidden">
                <Menu size={24} />
              </button>
              
              <Link to="/" className="flex flex-col items-start sm:items-center">
                <span className="text-2xl sm:text-3xl font-serif text-[#b89542] leading-none mb-1">Unique</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium text-[#b89542] leading-none ml-1 sm:ml-0">BOUTIQUE</span>
              </Link>
            </div>

            {/* Center Box: Desktop Navigation Links */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-8 space-x-8 xl:space-x-10">
              <NavLink to="/" className="text-[11px] font-bold uppercase tracking-widest text-primary hover:text-[#b89542] transition-colors py-4">
                HOME
              </NavLink>
              <a href="/#collection" className="text-[11px] font-bold uppercase tracking-widest text-primary hover:text-[#b89542] transition-colors py-4">
                OUR COLLECTIONS
              </a>
              
              {/* Dropdown container */}
              <div className="relative group">
                <NavLink to="/collections/all" className="flex items-center text-[11px] font-bold uppercase tracking-widest text-primary hover:text-[#b89542] transition-colors py-4">
                  OUR CATEGORIES <ChevronDown size={12} className="ml-1 opacity-50"/>
                </NavLink>
                {/* Dropdown Menu */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-xl border border-gray-100 min-w-[280px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-sm">
                  <div className="py-2 flex flex-col">
                    {categories.length > 0 ? (
                      categories.map((cat, i) => (
                        <Link key={cat.id} to={`/collections/${cat.slug}`} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-gray-100 shrink-0">
                             <img 
                               src={cat.image_url || "https://images.unsplash.com/photo-1583391733958-d2597280170a?q=80&w=100"} 
                               alt={cat.name} 
                               className="w-full h-full object-cover rounded-sm border border-gray-100" 
                             />
                          </div>
                          <span className="text-[11px] font-bold tracking-widest uppercase text-primary line-clamp-2 leading-relaxed">{cat.name}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">No categories found</div>
                    )}
                  </div>
                </div>
              </div>

              <NavLink to="/collections/best-sellers" className="text-[11px] font-bold uppercase tracking-widest text-primary hover:text-[#b89542] transition-colors py-4">
                BEST SELLERS
              </NavLink>
              <NavLink to="/collections/pre-booking" className="text-[11px] font-bold uppercase tracking-widest text-primary hover:text-[#b89542] transition-colors py-4">
                PRE-BOOKING
              </NavLink>
              <NavLink to="/contact" className="text-[11px] font-bold uppercase tracking-widest text-primary hover:text-[#b89542] transition-colors py-4">
                CONTACT
              </NavLink>
            </div>

            {/* Right Box: Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              <Link to="/admin/login" className="hidden sm:block p-1 text-primary hover:text-[#b89542] transition-colors">
                <User size={20} strokeWidth={1.5} />
              </Link>
              <button onClick={() => setSearchOpen(true)} className="p-1 text-primary hover:text-[#b89542] transition-colors" aria-label="Search">
                <Search size={20} strokeWidth={1.5} />
              </button>
              <Link to="/cart" className="p-1 text-primary hover:text-[#b89542] transition-colors relative">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link to="/wishlist" className="p-1 text-primary hover:text-[#b89542] transition-colors relative">
                <Heart size={20} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </div>

          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
