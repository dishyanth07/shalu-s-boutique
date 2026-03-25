import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Eye, Truck, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product_variants (
              *,
              products (*)
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Error loading orders')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) toast.error('Failed to update status')
    else {
      toast.success(`Order marked as ${status}`)
      fetchOrders()
      if (selectedOrder?.id === orderId) setSelectedOrder({...selectedOrder, status})
    }
  }

  return (
    <AdminLayout>
      <header className="mb-12">
        <h2 className="text-3xl font-serif text-primary">Orders</h2>
        <p className="text-gray-400 font-light mt-1">Manage and fulfill your customer orders.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              onClick={() => setSelectedOrder(order)}
              className={`bg-white p-6 rounded-3xl shadow-sm border cursor-pointer transition-all ${
                selectedOrder?.id === order.id ? 'border-accent ring-4 ring-accent/5' : 'border-gray-50 hover:border-accent/30'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black text-primary uppercase tracking-tighter">#{order.id.slice(0, 8)}</h4>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                  order.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-primary">{order.customer_name}</p>
                  <p className="text-xs text-gray-500">{order.phone}</p>
                </div>
                <p className="text-xl font-black text-primary">₹{order.total_price}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400">No orders found yet.</p>
            </div>
          )}
        </div>

        {/* Order Details Panel */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-primary text-white p-8 rounded-3xl shadow-2xl sticky top-24 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-serif mb-8 text-accent">Order Details</h3>
              
              <div className="space-y-6 mb-8 text-sm">
                <div>
                  <p className="text-primary-light/40 uppercase tracking-widest text-[10px] font-black mb-1">Customer Info</p>
                  <p className="font-bold text-base">{selectedOrder.customer_name}</p>
                  <p className="text-primary-light/60">{selectedOrder.phone}</p>
                  <p className="text-primary-light/60 mt-2 italic">"{selectedOrder.address}"</p>
                </div>
                
                <div>
                  <p className="text-primary-light/40 uppercase tracking-widest text-[10px] font-black mb-1">Items</p>
                  <div className="space-y-2 mt-2">
                    {selectedOrder.order_items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span>{item.quantity}x {item.product_variants?.products?.name || 'Item'} ({item.product_variants?.size})</span>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-primary-light/40 uppercase tracking-widest text-[10px] font-black">Total Paid</span>
                  <span className="text-2xl font-black text-accent">₹{selectedOrder.total_price}</span>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <p className="text-primary-light/40 uppercase tracking-widest text-[10px] font-black mb-3">Update Status</p>
                <button 
                  onClick={() => updateStatus(selectedOrder.id, 'Shipped')}
                  disabled={selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered'}
                  className="w-full py-4 bg-white/10 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30"
                >
                  <Truck size={18} className="mr-2" /> Mark as Shipped
                </button>
                <button 
                  onClick={() => updateStatus(selectedOrder.id, 'Delivered')}
                  disabled={selectedOrder.status === 'Delivered'}
                  className="w-full py-4 bg-accent text-primary rounded-2xl font-black flex items-center justify-center hover:bg-white transition-all disabled:opacity-30"
                >
                  <CheckCircle size={18} className="mr-2" /> Mark as Delivered
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center text-gray-400 bg-gray-100 rounded-3xl border border-dashed border-gray-200">
              <p>Select an order to view details and manage fulfillment.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
