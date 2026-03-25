import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Search, Package, Clock, Truck, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const OrderTracking = () => {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query) return
    setLoading(true)
    setOrder(null)

    // Strip leading # and any trailing punctuation/spaces
    const clean = query.trim().replace(/^#/, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    if (!clean) { toast.error('Please enter a valid Order ID or Phone'); setLoading(false); return }

    try {
      let found = null

      // 1. Try phone exact/partial match
      const { data: byPhone } = await supabase
        .from('orders')
        .select(`*, order_items(*, product_variants(*))`)
        .ilike('phone', `%${clean}%`)
        .order('created_at', { ascending: false })
        .limit(1)

      if (byPhone && byPhone.length > 0) {
        found = byPhone[0]
      } else {
        // 2. Fetch latest orders and match ID client-side (handles partial UUID match)
        const { data: allOrders } = await supabase
          .from('orders')
          .select(`*, order_items(*, product_variants(*))`)
          .order('created_at', { ascending: false })
          .limit(50)

        if (allOrders) {
          found = allOrders.find(o => o.id.toLowerCase().replace(/-/g, '').includes(clean)) || null
        }
      }

      if (found) {
        setOrder(found)
      } else {
        toast.error('No order found with this ID or Phone')
      }
    } catch (error) {
      console.error('Tracking error:', error)
      toast.error('Error searching for order')
    } finally {
      setLoading(false)
    }
  }

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1
      case 'Shipped': return 2
      case 'Delivered': return 3
      default: return 0
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-serif text-primary mb-3 sm:mb-4">Track Your Order</h1>
          <p className="text-sm sm:text-base text-gray-500 font-light">Enter your Order ID or registered Phone Number</p>
        </div>

        <div className="bg-white p-4 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8 sm:mb-12">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order ID / Phone Number"
                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all text-sm sm:text-base"
              />
            </div>
            <button 
              disabled={loading}
              className="px-6 sm:px-10 py-3 sm:py-4 bg-primary text-white font-bold rounded-2xl hover:bg-accent transition-all disabled:bg-gray-300 w-full sm:w-auto text-sm sm:text-base"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {order && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100">
              {/* Order Header */}
              <div className="bg-primary p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary-light/60 mb-1">Order Status</p>
                  <h2 className="text-2xl sm:text-3xl font-serif text-accent">{order.status}</h2>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary-light/60 mb-1">Order Date</p>
                  <p className="font-bold text-sm sm:text-base">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-6 sm:p-8 md:p-12 border-b border-gray-100">
                <div className="relative flex justify-between items-center max-w-2xl mx-auto px-2 sm:px-0">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-0"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 -z-0 transition-all duration-1000"
                    style={{ width: `${(getStatusStep(order.status) - 1) * 50}%` }}
                  ></div>

                  {[
                    { icon: <Clock size={16} className="sm:w-6 sm:h-6" />, label: 'Order Placed', step: 1 },
                    { icon: <Truck size={16} className="sm:w-6 sm:h-6" />, label: 'Shipped', step: 2 },
                    { icon: <CheckCircle size={16} className="sm:w-6 sm:h-6" />, label: 'Delivered', step: 3 }
                  ].map((s) => (
                    <div key={s.step} className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${
                        getStatusStep(order.status) >= s.step ? 'bg-accent text-primary' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {s.icon}
                      </div>
                      <span className={`mt-2 sm:mt-3 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest text-center ${
                        getStatusStep(order.status) >= s.step ? 'text-primary' : 'text-gray-400'
                      }`}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-6 sm:p-8 md:p-12">
                <h3 className="text-lg sm:text-xl font-serif text-primary mb-4 sm:mb-6 flex items-center">
                  <Package className="mr-2 sm:mr-3 text-accent" size={20} /> Items in this Order
                </h3>
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-bold text-primary text-sm sm:text-base">Variant ID: {item.variant_id?.slice(0, 8)}</p>
                        <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity} x ₹{item.price}</p>
                      </div>
                      <span className="font-black text-primary text-sm sm:text-base">₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 sm:pt-6 text-lg sm:text-xl font-black text-primary border-t border-gray-100">
                  <span>Grand Total</span>
                  <span className="text-accent">₹{order.total_price}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default OrderTracking
