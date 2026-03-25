import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronDown, SlidersHorizontal, Grid3x3, LayoutGrid, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { supabase } from '../lib/supabase'

const Collection = () => {
  const { categoryId } = useParams() // e.g., 'best-sellers', 'pre-booking', 'all'
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState([])
  
  // Dynamic categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name')
        if (error) throw error
        if (data) setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat.name
    return acc
  }, { 'best-sellers': "BEST SELLERS", 'pre-booking': "PRE-BOOKING" })

  const displayTitle = categoryMap[categoryId] || (categoryId ? categoryId.replace(/-/g, ' ').toUpperCase() : 'ALL COLLECTIONS')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let query = supabase.from('products').select(`*, product_variants(*)`)
        
        // Dynamic filtering based on URL category
        if (categoryId === 'best-sellers') {
          query = query.eq('is_best_seller', true)
        } else if (categoryId === 'pre-booking') {
          query = query.eq('is_pre_booking', true)
        } else if (categoryId && categoryId !== 'all') {
          // Use mapping for robust filtering
          const dbCategory = categoryMap[categoryId] || categoryId.replace(/-/g, ' ').toUpperCase()
          query = query.ilike('category', `%${dbCategory}%`)
        }

        const { data, error } = await query
        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryId, categories]) // Add categories as dependency to re-run fetch when map is ready

  const allCollectionNames = [
    ...categories.map(c => c.name),
    "BEST SELLERS",
    "PRE-BOOKING"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="pt-8 pb-12 text-center">
        <h1 className="text-3xl font-serif text-primary tracking-[0.2em] uppercase">{displayTitle}</h1>
      </div>

      {/* Toolbar */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 border-b border-gray-100 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors"
          >
            <SlidersHorizontal size={14} /> {showFilters ? 'Hide filters' : 'Show filters'}
          </button>
          
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary border-l border-gray-200 pl-6 cursor-pointer hover:text-accent transition-colors">
            Date, new to old <ChevronDown size={14} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-primary transition-colors"><Grid3x3 size={18} /></button>
          <button className="hover:text-primary transition-colors"><LayoutGrid size={18} /></button>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 flex items-start gap-12 relative overflow-x-hidden">
        
        {/* Filter Overlay (Mobile only) */}
        {showFilters && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Left Sidebar / Mobile Drawer - always a fixed overlay drawer */}
        <div className={`
          fixed top-0 left-0 h-full z-[100]
          w-[300px] bg-white
          transform transition-all duration-300 ease-in-out
          ${showFilters ? 'translate-x-0' : '-translate-x-full'}
          p-6 border-r border-gray-100
          overflow-y-auto shadow-xl
        `}>
          <div className="flex items-center justify-between lg:hidden mb-8 pb-4 border-b border-gray-100">
            <span className="font-bold text-sm uppercase tracking-widest text-primary">Filters</span>
            <button onClick={() => setShowFilters(false)} className="p-2 -mr-2 text-gray-400 hover:text-primary transition-colors">
              <X size={20} />
            </button>
          </div>
            
            {/* All collections */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-primary mb-4 flex items-center justify-between cursor-pointer uppercase tracking-widest">
                Collections <ChevronDown size={16} className="text-gray-400" />
              </h3>
              <div className="flex flex-col gap-3">
                {allCollectionNames.map((item, idx) => {
                  const itemSlug = Object.keys(categoryMap).find(key => categoryMap[key] === item) || item.toLowerCase().replace(/ /g, '-').replace(/'/g, '')
                  return (
                    <Link 
                      key={idx} 
                      to={`/collections/${itemSlug}`}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className={`w-3.5 h-3.5 border border-gray-300 rounded-sm flex items-center justify-center group-hover:border-primary transition-colors ${item === displayTitle ? 'border-primary' : ''}`}>
                         {item === displayTitle && <div className="w-1.5 h-1.5 bg-primary rounded-sm"></div>}
                      </div>
                      <span className={`text-[10px] tracking-widest uppercase transition-colors ${item === displayTitle ? 'font-bold text-primary' : 'font-medium text-gray-500 group-hover:text-primary'}`}>{item}</span>
                    </Link>
                  )
                })}
                <button className="text-[10px] font-bold uppercase tracking-widest text-primary text-left mt-2">SHOW MORE</button>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-8 border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-primary mb-4 flex items-center justify-between cursor-pointer">
                Availability <ChevronDown size={16} className="text-gray-400" />
              </h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-3.5 h-3.5 border border-gray-300 rounded-sm group-hover:border-primary transition-colors"></div>
                  <span className="text-xs tracking-wider uppercase font-medium text-gray-500 group-hover:text-primary">In stock</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-3.5 h-3.5 border border-gray-300 rounded-sm group-hover:border-primary transition-colors"></div>
                  <span className="text-xs tracking-wider uppercase font-medium text-gray-500 group-hover:text-primary">Out of stock</span>
                </label>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-gray-100 pt-6 border-b pb-8">
              <h3 className="text-sm font-bold text-primary mb-6 flex items-center justify-between cursor-pointer">
                Price <ChevronDown size={16} className="text-gray-400" />
              </h3>
              <div className="px-2">
                <div className="h-1 lg:w-full bg-gray-200 rounded-full relative">
                  <div className="absolute left-0 right-10 h-full bg-primary rounded-full"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow cursor-pointer"></div>
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow cursor-pointer"></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Product Grid Area - always full width since filter is a fixed overlay */}
        <div className="w-full min-h-[50vh]">
          {loading ? (
             <div className="flex justify-center items-center h-full py-20">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
             </div>
          ) : products.length > 0 ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-x-6 md:gap-y-10 w-full">
               {products.map(product => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-32 text-center text-gray-400">
               <p className="text-lg">No products found in this collection.</p>
               <Link to="/collections/all" className="mt-4 text-xs font-bold uppercase tracking-widest text-[#8666be] hover:underline">View All Collections</Link>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection
