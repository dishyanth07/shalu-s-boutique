import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Lock, Mail, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await login(email, password)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back, Admin!')
      navigate('/admin')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-white mb-2">Admin Portal</h1>
          <p className="text-primary-light/50 uppercase tracking-widest text-xs font-bold">Unique Boutique</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16"></div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all font-medium"
                  placeholder="admin@uniqueboutique.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-0 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:bg-accent transition-all flex items-center justify-center group"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-primary-light/30 text-xs uppercase tracking-widest">
          Secure access only • Unauthorized entry is logged
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
