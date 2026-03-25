import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { CreditCard, Truck, CheckCircle, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orderDone, setOrderDone] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'COD'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRazorpay = async (orderId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: totalPrice * 100, // in paise
      currency: "INR",
      name: "Shalu's Boutique",
      description: "Purchase payment",
      handler: async function (response) {
        // Update order status to confirmed or similar on success
        await supabase.from('orders').update({ payment_id: response.razorpay_payment_id }).eq('id', orderId)
        toast.success('Payment Successful!')
        setOrderDone(orderId)
        clearCart()
      },
      prefill: {
        name: formData.name,
        contact: formData.phone
      },
      theme: {
        color: "#3D3D3D"
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return
    setLoading(true)

    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          total_price: totalPrice,
          payment_method: formData.paymentMethod,
          status: 'Pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        variant_id: item.variant.id,
        quantity: item.quantity,
        price: item.variant.price
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      // 3. Handle Payment
      if (formData.paymentMethod === 'ONLINE') {
        handleRazorpay(order.id)
      } else {
        toast.success('Order Placed Successfully!')
        setOrderDone(order.id)
        clearCart()
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderDone) {
    return (
      <div className="min-h-screen bg-primary-light flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-12 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-serif text-primary mb-4">Order Confirmed!</h2>
          <p className="text-gray-500 mb-8 font-light">
            Thank you for shopping with us. Your order ID is <span className="font-bold text-primary">#{orderDone.slice(0, 8)}</span>.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-primary text-white font-bold rounded-full hover:bg-accent transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-light pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/cart')} className="flex items-center text-gray-500 hover:text-primary mb-8">
          <ChevronLeft size={20} /> Back to Bag
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-50">
            <h2 className="text-3xl font-serif text-primary mb-8">Delivery Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                <input 
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                <input 
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all"
                  placeholder="For order updates"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Shipping Address</label>
                <textarea 
                  required
                  name="address"
                  rows="4"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all"
                  placeholder="House no, Street, City, ZIP"
                ></textarea>
              </div>

              <div className="pt-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                      formData.paymentMethod === 'COD' ? 'border-accent bg-accent/5' : 'border-gray-100 bg-white hover:border-accent/30'
                    }`}
                  >
                    <Truck className="mb-2 text-primary" size={24} />
                    <span className="font-bold text-sm">Cash on Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'ONLINE' })}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                      formData.paymentMethod === 'ONLINE' ? 'border-accent bg-accent/5' : 'border-gray-100 bg-white hover:border-accent/30'
                    }`}
                  >
                    <CreditCard className="mb-2 text-primary" size={24} />
                    <span className="font-bold text-sm">Online Payment</span>
                  </button>
                </div>
              </div>

              <button
                disabled={loading || cart.length === 0}
                className="w-full py-5 bg-primary text-white font-bold rounded-full hover:bg-accent disabled:bg-gray-300 transition-all mt-8 text-lg shadow-lg"
              >
                {loading ? 'Processing...' : `Place Order (₹${totalPrice})`}
              </button>
            </form>
          </div>

          {/* Cart Preview */}
          <div className="hidden lg:block">
            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/5">
              <h3 className="text-xl font-serif text-primary mb-6">Order Preview</h3>
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.variant.id} className="flex items-center gap-4">
                    <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                      <img src={item.variant.image_url} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-primary truncate">{item.variant.product_name || 'Product'}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} | Size: {item.variant.size}</p>
                    </div>
                    <span className="font-bold text-primary">₹{item.variant.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-primary/10 pt-6 space-y-4">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold text-xs uppercase">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 text-2xl font-bold text-primary">
                  <span>Total</span>
                  <span className="text-accent">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
