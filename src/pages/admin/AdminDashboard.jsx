import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { TrendingUp, ShoppingBag, Clock, IndianRupee } from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    productsCount: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get orders
        const { data: orders, error: ordersError } = await supabase.from('orders').select('*')
        if (ordersError) throw ordersError

        const { count: productsCount, error: countError } = await supabase.from('products').select('*', { count: 'exact', head: true })
        if (countError) throw countError
        
        const sales = orders?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0
        const pending = orders?.filter(o => o.status === 'Pending').length || 0

        setStats({
          totalSales: sales,
          totalOrders: orders?.length || 0,
          pendingOrders: pending,
          productsCount: productsCount || 0
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <AdminLayout>
      <header className="mb-12">
        <h2 className="text-3xl font-serif text-primary">System Overview</h2>
        <p className="text-gray-400 font-light mt-1">Here's how Shalu's Boutique is performing today.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Revenue', value: `₹${stats.totalSales}`, icon: <IndianRupee />, color: 'bg-green-100 text-green-600' },
          { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag />, color: 'bg-blue-100 text-blue-600' },
          { label: 'Pending Orders', value: stats.pendingOrders, icon: <Clock />, color: 'bg-orange-100 text-orange-600' },
          { label: 'Active Products', value: stats.productsCount, icon: <TrendingUp />, color: 'bg-primary text-accent' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions / Recent Activity Stubs */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h4 className="text-xl font-serif mb-6">Recent Sales Activity</h4>
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-gray-400 text-sm">Sale graphics and trends will appear here.</p>
          </div>
        </div>
        <div className="bg-primary text-white rounded-3xl p-8 shadow-xl">
          <h4 className="text-xl font-serif mb-6 text-accent">Quick Links</h4>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/admin/products')}
              className="w-full py-4 px-6 bg-white/10 rounded-2xl text-left hover:bg-white/20 transition-all font-bold text-sm uppercase tracking-widest"
            >
              Add New Product
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="w-full py-4 px-6 bg-white/10 rounded-2xl text-left hover:bg-white/20 transition-all font-bold text-sm uppercase tracking-widest"
            >
              Manage Products
            </button>
            <button 
              onClick={() => window.print()}
              className="w-full py-4 px-6 bg-accent text-primary rounded-2xl text-left transition-all font-black text-sm uppercase tracking-widest shadow-lg"
            >
              Print Report
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
