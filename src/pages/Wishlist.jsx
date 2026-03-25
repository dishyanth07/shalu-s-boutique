import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist()

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Page Header */}
      <div className="pt-12 pb-16 text-center border-b border-gray-50">
        <h1 className="text-3xl font-serif text-primary tracking-widest uppercase mb-2">My Wishlist</h1>
        <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-medium">
          {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12">
        {wishlist.length > 0 ? (
          <>
            <div className="flex justify-end mb-8">
              <button 
                onClick={clearWishlist}
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                <X size={14} /> Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-8 md:gap-y-12">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Heart size={32} className="text-gray-200" strokeWidth={1} />
            </div>
            <h2 className="text-xl font-serif text-primary mb-4">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8 font-light leading-relaxed">
              Looks like you haven't saved any boutique treasures yet. Explore our collections to find your favorites!
            </p>
            <Link 
              to="/collections/all" 
              className="inline-flex items-center px-10 py-4 bg-primary text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#b89542] transition-all duration-300 rounded-sm"
            >
              Explore Collections <ShoppingBag className="ml-2" size={16} strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
