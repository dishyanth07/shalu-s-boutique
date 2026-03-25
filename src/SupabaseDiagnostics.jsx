import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

const SupabaseDiagnostics = () => {
  const [status, setStatus] = useState('checking')
  const [error, setError] = useState(null)
  const [keys, setKeys] = useState({ url: false, key: false })
  const [counts, setCounts] = useState({ products: 0, variants: 0, categories: 0 })

  useEffect(() => {
    const checkConnection = async () => {
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      setKeys({ 
        url: !!url && url.includes('supabase.co'), 
        key: !!key && (key.startsWith('eyJ') || key.startsWith('sb_')) 
      })

      if (!key || (!key.startsWith('eyJ') && !key.startsWith('sb_'))) {
        setStatus('error')
        setError('Your VITE_SUPABASE_ANON_KEY looks incorrect.')
        return
      }

      try {
        const { count: pCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
        const { count: vCount } = await supabase.from('product_variants').select('*', { count: 'exact', head: true })
        const { count: cCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
        
        setCounts({ products: pCount || 0, variants: vCount || 0, categories: cCount || 0 })
        setStatus('success')
        
      } catch (err) {
        console.error('Connection check failed:', err)
        setStatus('error')
        setError(err.message || 'Unknown network error')
      }
    }
    checkConnection()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-[999] max-w-sm bg-red-50 border-2 border-red-200 p-6 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 text-primary">
      <h3 className="text-red-600 font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
        Supabase Diagnostics
      </h3>
      <p className="text-[10px] text-red-800 leading-relaxed mb-4 font-medium italic">
        {status === 'checking' ? 'Testing connection...' : (error || 'Connected successfully!')}
      </p>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded flex justify-between ${keys.url ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            Supabase URL: <span>{keys.url ? 'Valid' : 'Invalid'}</span>
          </div>
          <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded flex justify-between ${keys.key ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            Anon Key: <span>{keys.key ? 'Valid' : 'Invalid'}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-red-100 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 flex justify-between">
            Products In DB: <span className={counts.products > 0 ? 'text-green-600' : 'text-red-600'}>{counts.products}</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 flex justify-between">
            Variants In DB: <span className={counts.variants > 0 ? 'text-green-600' : 'text-red-600'}>{counts.variants}</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 flex justify-between">
            Categories In DB: <span className={counts.categories > 0 ? 'text-green-600' : 'text-red-600'}>{counts.categories}</span>
          </div>
        </div>
      </div>
      
      {status === 'success' && counts.products === 0 && (
        <div className="mt-4 p-3 bg-white/50 rounded-xl border border-red-100 animate-pulse">
           <p className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">⚠️ DB Is Empty! Please run sample_data.sql</p>
        </div>
      )}
      {status === 'success' && counts.products > 0 && (
        <div className="mt-4 p-2 bg-green-50 rounded-xl border border-green-100">
           <p className="text-[10px] font-bold text-green-600 uppercase tracking-tighter center">✅ CONNECTION STABLE - ALL DATA LOADED</p>
        </div>
      )}
    </div>
  )
}

export default SupabaseDiagnostics
