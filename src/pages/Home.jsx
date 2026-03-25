import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { supabase } from '../lib/supabase'
import { Award, Truck, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react'

const Home = () => {
  const [products, setProducts] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true)
        
        // Fetch Products and Featured Collections in parallel
        const [
          { data: productsData, error: productsError },
          { data: featuredData, error: featuredError }
        ] = await Promise.all([
          supabase.from('products').select('*, product_variants(*)').limit(8),
          supabase.from('featured_collections').select('*').order('sort_order', { ascending: true })
        ])
        
        if (productsError) throw productsError;
        if (featuredError) throw featuredError;

        setProducts(productsData || [])
        setFeatured(featuredData || [])
      } catch (error) {
        console.error('Error fetching home data:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()

  }, [])

  return (
    <div className="bg-white min-h-screen">
       {/* Hero Section - Vibrant Poster */}
       <section className="relative w-full h-[70vh] md:h-[92vh] bg-[#8666be] overflow-hidden">
          <div className="max-w-[1600px] mx-auto h-full px-2 md:px-6 py-2">
            <div 
              className="relative w-full h-full rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-cover bg-center transition-transform duration-[3000ms] hover:scale-105 group"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1583391733958-d2597280170a?q=80&w=2000")'}}
            >
              {/* Vibrant Overlay with Quote */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-t from-black/60 via-primary/5 to-black/10 px-6 backdrop-blur-[1px]">
                <div className="text-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  <span className="text-[10px] md:text-sm uppercase tracking-[0.8em] font-bold mb-2 block drop-shadow-lg text-accent">ESTABLISHED 2024</span>
                  <span className="text-[9px] md:text-xs uppercase tracking-[0.4em] font-medium mb-4 block drop-shadow-md text-white/90">📍 Offline & Online showroom</span>
                  <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-serif mb-4 md:mb-6 tracking-tighter drop-shadow-2xl leading-none text-white">Shalu's</h1>
                  
                  <div className="max-w-2xl mx-auto mb-10">
                    <p className="text-base sm:text-lg md:text-2xl font-serif italic mb-2 drop-shadow-lg text-[#efcc81]">&quot;Elegance is the only beauty that never fades.&quot;</p>
                    <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold drop-shadow-md opacity-80 text-white">— Audrey Hepburn</p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <Link 
                      to="/collections/all" 
                      className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-accent text-primary text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-2xl rounded-full text-center"
                    >
                      Shop Collection
                    </Link>
                    <Link 
                      to="/contact" 
                      className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-transparent border-2 border-accent text-accent text-[11px] font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all duration-500 backdrop-blur-sm rounded-full text-center"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
       </section>

       {/* Features Bar */}
       <section className="py-12 md:py-16 bg-white border-b border-gray-100">
         <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-4 text-center">
           <div className="flex flex-col items-center">
             <Award size={28} className="mb-4 text-primary" strokeWidth={1.5} />
             <h4 className="font-bold text-[#8666be] mb-2 font-serif tracking-wide text-lg">Elite Boutique Service</h4>
             <p className="text-sm font-light text-gray-500">Choose us for the best boutique experience.</p>
           </div>
           <div className="flex flex-col items-center">
             <Truck size={28} className="mb-4 text-primary" strokeWidth={1.5} />
             <h4 className="font-bold text-[#8666be] mb-2 font-serif tracking-wide text-lg">Worldwide Shipping</h4>
             <p className="text-sm font-light text-gray-500">Shipping available worldwide 🌏</p>
           </div>
           <div className="flex flex-col items-center">
             <MessageCircle size={28} className="mb-4 text-primary" strokeWidth={1.5} />
             <h4 className="font-bold text-[#8666be] mb-2 font-serif tracking-wide text-lg">Support</h4>
              <p className="text-xs sm:text-sm font-light text-gray-500 break-words">WhatsApp: 8838693929 | 04142-216123</p>
           </div>
         </div>
       </section>

       {/* OUR BEST SELLING COLLECTIONS */}
       <section className="py-16 md:py-24 bg-white border-b border-gray-100">
          <div className="text-center mb-12 relative flex items-center justify-center">
            <div className="hidden sm:block flex-1 h-[1px] bg-gray-200 left-8 relative"></div>
            <h2 className="text-xl md:text-2xl font-bold tracking-[0.15em] uppercase text-primary px-8">
              OUR BEST SELLING COLLECTIONS
            </h2>
            <div className="hidden sm:block flex-1 h-[1px] bg-gray-200 right-8 relative"></div>
          </div>
          <div className="max-w-[1500px] mx-auto px-4 md:px-8 relative group">
             {/* Desktop Navigation Arrows (Visual only to match design) */}
             <button className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full items-center justify-center z-10 text-gray-600 hover:text-primary transition-colors">
               <ChevronLeft size={20} />
             </button>
             <button className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full items-center justify-center z-10 text-gray-600 hover:text-primary transition-colors">
               <ChevronRight size={20} />
             </button>

             {/* Sliding container */}
             <div className="flex overflow-x-auto gap-1 md:gap-4 pb-8 snap-x hide-scrollbar scroll-smooth">
                {featured.length > 0 ? (
                  featured.map((item, i) => (
                    <Link 
                      to={item.link_url || `/collections/${item.title.toLowerCase().replace(/ /g, '-')}`} 
                      key={item.id || i} 
                      className="min-w-[260px] md:min-w-[280px] lg:flex-1 aspect-[2/3] relative group snap-start cursor-pointer overflow-hidden block rounded-sm shadow-sm"
                    >
                      <img 
                        src={item.image_url || "https://images.unsplash.com/photo-1583391733958-d2597280170a?q=80&w=600"} 
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
                        alt={item.title} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                      <div className="absolute inset-x-0 bottom-8 flex justify-center w-full text-center">
                        <h3 className="text-white font-medium tracking-widest uppercase text-xs md:text-sm px-4 drop-shadow-lg w-full">{item.title}</h3>
                      </div>
                    </Link>
                  ))
                ) : (
                  [1,2,3,4,5].map((_, i) => (
                    <div key={i} className="min-w-[260px] md:min-w-[280px] lg:flex-1 aspect-[2/3] bg-gray-100 animate-pulse rounded-sm"></div>
                  ))
                )}
             </div>
          </div>
       </section>

       {/* NEW DROPS */}
       <section id="collection" className="py-16 md:py-24 bg-white border-b border-gray-100">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-xl md:text-2xl font-bold tracking-[0.15em] uppercase text-primary mb-6">NEW DROPS</h2>
            <Link to="/collections/all" className="inline-block px-6 py-2 bg-[#f6f6f6] text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-full text-primary">
              PICK YOUR FAVORITES
            </Link>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-8 md:gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                <p className="text-red-400 font-medium">Error: {error}</p>
              </div>
            ) : (
              <div className="text-center py-20 border border-gray-100 rounded-sm">
                <p className="text-lg text-gray-400 font-light">New drops arriving soon.</p>
              </div>
            )}
            
            {/* Carousel dots (visual only to match design) */}
            <div className="flex justify-center gap-2 mt-12 hidden">
               <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            </div>
          </div>
       </section>

    </div>
  )
}

export default Home
