import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Trash2, ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-primary-light flex flex-col">
      
      <div className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        <h1 className="text-4xl font-serif text-primary mb-12">Your Shopping Bag</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
            <p className="text-xl text-gray-500 mb-8">Your bag is empty.</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-accent transition-all duration-300"
            >
              <ArrowLeft size={20} className="mr-2" /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.variant.id} className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-50 gap-6">
                  <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <img src={item.variant.image_url} alt={item.variant.id} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-serif text-primary mb-1">
                      {item.variant.product_name || "Product"} {/* Usually joined from product table */}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider">
                      Size: <span className="text-primary font-medium">{item.variant.size}</span>
                      {item.variant.color && <span> | Color: <span className="text-primary font-medium">{item.variant.color}</span></span>}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start border border-gray-200 rounded-full px-3 py-1 bg-white w-fit mx-auto sm:mx-0">
                      <button 
                        onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:text-accent"
                      >
                        -
                      </button>
                      <span className="mx-4 font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                        className="p-1 hover:text-accent"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-xl font-bold text-primary mb-4">₹{item.variant.price * item.quantity}</p>
                    <button 
                      onClick={() => removeFromCart(item.variant.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-primary text-white p-8 rounded-3xl shadow-xl sticky top-24">
                <h3 className="text-2xl font-serif mb-8 border-b border-primary-light/20 pb-4">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-primary-light/80">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-primary-light/80">
                    <span>Shipping</span>
                    <span className="text-accent font-bold uppercase tracking-wider text-xs flex items-center">Free</span>
                  </div>
                </div>
                <div className="flex justify-between text-2xl font-bold mb-8 items-end">
                  <span>Total</span>
                  <span className="text-accent">₹{totalPrice}</span>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-accent text-primary font-black rounded-full hover:bg-white transition-all duration-300 flex items-center justify-center group"
                >
                  Proceed to Checkout <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-[10px] text-primary-light/40 mt-6 uppercase tracking-[0.2em]">
                   Taxes and shipping calculated at checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
