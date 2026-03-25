import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Search, Package, Clock, Truck, CheckCircle, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const OrderHistory = () => {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!phone) return

    // Clean input (remove spaces, punctuation, etc.)
    const cleanInput = phone.trim().replace(/^#/, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    
    if (cleanInput.length < 5) {
      toast.error('Please enter a valid Phone Number or Order ID')
      return
    }

    setLoading(true)
    setSearched(false)
    setOrders([])

    try {
      let foundOrders = []

      // 1. Try phone match first
      const { data: byPhone, error: phoneErr } = await supabase
        .from('orders')
        .select(`*, order_items(*, product_variants(*))`)
        .ilike('phone', `%${cleanInput}%`)
        .order('created_at', { ascending: false })

      if (byPhone && byPhone.length > 0) {
        foundOrders = byPhone
      } else {
        // 2. Try partial ID match (client-side filter to avoid UUID cast error)
        const { data: allOrders } = await supabase
          .from('orders')
          .select(`*, order_items(*, product_variants(*))`)
          .order('created_at', { ascending: false })
          .limit(100) // fetch recent orders to scan

        if (allOrders) {
          foundOrders = allOrders.filter(o => o.id.toLowerCase().replace(/-/g, '').includes(cleanInput))
        }
      }

      setOrders(foundOrders)
      setSearched(true)
    } catch (error) {
      console.error('History error:', error)
      toast.error('Error fetching order history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-accent/20 text-accent-dark'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle size={20} className="text-green-600" />
      case 'shipped': return <Truck size={20} className="text-blue-600" />
      default: return <Clock size={20} className="text-accent" />
    }
  }

  return (
    <div className="min-h-screen bg-primary-light pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Order History</h1>
          <p className="text-gray-500 font-light">Enter your phone number to view all your past orders</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-gray-100 mb-8 sm:mb-12">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number / Order ID"
                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all font-medium text-sm sm:text-base"
              />
            </div>
            <button 
              disabled={loading || !phone.trim()}
              type="submit"
              className="px-6 sm:px-10 py-3 sm:py-4 bg-accent text-primary font-bold rounded-2xl hover:bg-[#c9a632] disabled:opacity-50 transition-all w-full sm:w-auto text-sm sm:text-base"
            >
              {loading ? 'Searching...' : 'Find Orders'}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {orders.length === 0 ? (
              <div className="text-center py-12 sm:py-20 bg-white rounded-3xl shadow-sm border border-gray-50 border-dashed px-4">
                <Package size={40} className="mx-auto text-gray-300 mb-4 sm:mb-4 sm:size-48" />
                <h3 className="text-lg sm:text-xl font-serif text-primary mb-2">No orders found</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-6">We couldn't find any orders matching "{phone}"</p>
                <Link to="/" className="inline-flex items-center text-accent font-bold hover:text-primary transition-colors text-sm sm:text-base">
                  Start Shopping <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="font-serif text-xl sm:text-2xl text-primary border-b border-gray-200 pb-3 sm:pb-4">
                  Found {orders.length} Order{orders.length > 1 ? 's' : ''}
                </h3>
                
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5 sm:pb-6 mb-5 sm:mb-6">
                      <div className="w-full sm:w-auto">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <span className="font-bold text-primary font-mono text-base sm:text-lg">#{order.id.split('-')[0].toUpperCase()}</span>
                          <span className={`px-2 sm:px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400">Placed on {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none flex justify-between sm:block items-center">
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold mb-0 sm:mb-1">Total Amount</p>
                        <p className="text-lg sm:text-2xl font-bold text-primary">₹{order.total_price}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 sm:mb-4">Items in Order</h4>
                      {order.order_items?.map((item, idx) => (
                        <div key={idx} className="flex flex-row items-center sm:items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-2xl">
                          <div className="w-14 h-16 sm:w-16 sm:h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
                            {item.product_variants?.image_url ? (
                              <img src={item.product_variants.image_url} alt="product" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Package size={16} className="text-gray-400 sm:size-20" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-primary text-sm sm:text-base truncate">{item.product_variants?.product_name || 'Boutique Item'}</h4>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">
                              Qty: {item.quantity} | Size: {item.product_variants?.size || 'N/A'} {item.product_variants?.color ? `| Color: ${item.product_variants.color}` : ''}
                            </p>
                          </div>
                          <div className="text-right pl-2">
                            <p className="font-bold text-primary text-sm sm:text-base w-max">₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory
