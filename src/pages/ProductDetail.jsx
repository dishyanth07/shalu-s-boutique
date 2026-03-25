import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { ChevronLeft, ShoppingBag, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (*)
          `)
          .eq('id', id)
          .single()

        if (error) throw error
        
        setProduct(data)
        if (data.product_variants?.length > 0) {
          setSelectedVariant(data.product_variants[0])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Product not found or error loading details')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  const handleAddToCart = () => {
    if (selectedVariant) {
      if (selectedVariant.stock_quantity < quantity) {
        toast.error('Not enough stock available')
        return
      }
      addToCart(selectedVariant, quantity)
      toast.success(`${product.name} added to cart!`)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  )

  if (!product) return null

  return (
    <div className="min-h-screen bg-primary-light pb-20">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft size={20} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery (Simplified) */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-sm">
              <img 
                src={selectedVariant?.image_url || 'https://via.placeholder.com/800x1000?text=Shalu+Boutique'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Variant Thumbnails */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.product_variants?.map((v) => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedVariant?.id === v.id ? 'border-accent shadow-md scale-105' : 'border-transparent'
                  }`}
                >
                  <img src={v.image_url || 'https://via.placeholder.com/100x120?text=Variant'} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <p className="text-accent font-bold tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4 leading-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-6">₹{selectedVariant?.price}</p>
            
            <div className="h-px w-full bg-gray-200 mb-8"></div>
            
            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Description</h4>
              <p className="text-gray-600 leading-relaxed font-light">{product.description}</p>
            </div>

            {/* Variant Selectors */}
            {product.product_variants?.length > 1 && (
              <div className="mb-8">
                <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Select Option</h4>
                <div className="flex flex-wrap gap-3">
                  {product.product_variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all ${
                        selectedVariant?.id === v.id 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white text-primary border-gray-200 hover:border-accent'
                      }`}
                    >
                      {v.size} {v.color ? `/ ${v.color}` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center mb-8">
              {selectedVariant?.stock_quantity > 0 ? (
                <span className="flex items-center text-green-600 text-sm font-medium">
                  <Check size={16} className="mr-1" /> In Stock ({selectedVariant.stock_quantity} available)
                </span>
              ) : (
                <span className="text-red-500 text-sm font-medium">Out of Stock</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-accent"
                >
                  -
                </button>
                <span className="mx-4 font-bold w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-accent"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
                className="flex-1 flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-accent disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
              >
                Add to Cart <ShoppingBag className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
