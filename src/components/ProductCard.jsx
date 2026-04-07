import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  
  const isWishlist = isInWishlist(product.id)

  // Find the first variant to show initial price/image
  const defaultVariant = product.product_variants?.[0] || {}
  
  // Price logic: Use original_price from DB if available, otherwise mock it for UI demo
  const currentPrice = defaultVariant.price || 0
  const dbOriginalPrice = defaultVariant.original_price
  const originalPrice = dbOriginalPrice ? parseFloat(dbOriginalPrice) : (currentPrice ? currentPrice + 700 : 0)
  const savingsPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0

  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <Link to={`/product/${product.id}`} className="group block w-full mb-8">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-sm">
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistClick}
          className="absolute top-3 left-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart size={16} className={isWishlist ? 'fill-red-500 text-red-500' : 'text-[#8666be]'} strokeWidth={isWishlist ? 1 : 1.5} />
        </button>

        {/* Save Badge */}
        {savingsPercent > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-white px-2 py-1 text-[10px] font-bold text-gray-800 tracking-wider shadow-sm rounded-sm uppercase">
            Save {savingsPercent}%
          </div>
        )}

        <img
          src={defaultVariant.image_url || 'https://via.placeholder.com/400x500?text=Unique+Boutique'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

      </div>

      {/* Product Info */}
      <div className="flex flex-col items-start px-1">
        <h3 className="text-sm font-bold text-primary mb-1 uppercase tracking-widest line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
          <span className="text-[12px] sm:text-[13px] font-bold text-[#8666be]">Rs. {currentPrice.toLocaleString()}.00</span>
          {originalPrice > 0 && (
            <span className="text-[10px] sm:text-[11px] text-gray-500 line-through opacity-70">Rs. {originalPrice.toLocaleString()}.00</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
