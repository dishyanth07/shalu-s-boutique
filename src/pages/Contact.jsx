import React, { useState } from 'react'
import { Award, Truck, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      toast.success('Thanks for subscribing!')
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Main Content */}
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase text-primary mb-8">Shalu's Boutique</h1>
        
        <p className="text-sm font-bold text-primary mb-2">📍 Offline & Online showroom</p>
        <p className="text-sm font-semibold text-primary mb-2">WhatsApp: 8838693929 | ☎️ 04142-216123</p>
        <p className="text-sm font-medium text-gray-500 mb-20 max-w-sm mx-auto leading-relaxed">
          Kindly message us on WhatsApp for product or order details, or email us at shaluboutique@gmail.com. 
          <br/>🚚 Cash on Delivery available | 🌏 Shipping Worldwide
        </p>

        <div className="w-full mt-10">
          <h2 className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase text-primary mb-6">NEWSLETTER</h2>
          <p className="text-sm font-medium italic text-gray-600 mb-8 font-serif">
            Join to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row shadow-sm border border-gray-100 max-w-lg mx-auto">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com" 
              required
              className="flex-1 px-6 py-4 text-sm font-medium text-gray-700 outline-none bg-white placeholder:text-gray-400"
            />
            <button 
              type="submit" 
              className="px-10 py-4 bg-[#b89542] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#a38031] transition-colors whitespace-nowrap"
            >
              JOIN
            </button>
          </form>
        </div>
      </div>

      {/* Footer Benefits Block (similar to their footer start) */}
      <div className="w-full bg-[#f3e3cc] py-16 mt-10">
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-4 text-center">
          <div className="flex flex-col items-center">
            <Award size={28} className="mb-4 text-primary" strokeWidth={1.5} />
            <h4 className="font-bold text-primary mb-2 text-sm tracking-wide">Elite Boutique Service</h4>
            <p className="text-xs font-medium text-gray-600">Choose us for the best boutique experience.</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck size={28} className="mb-4 text-primary" strokeWidth={1.5} />
            <h4 className="font-bold text-primary mb-2 text-sm tracking-wide">Worldwide Shipping</h4>
            <p className="text-xs font-medium text-gray-600">Shipping available worldwide 🌏</p>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle size={28} className="mb-4 text-primary" strokeWidth={1.5} />
            <h4 className="font-bold text-primary mb-2 text-sm tracking-wide">Support</h4>
            <p className="text-xs font-medium text-gray-600">WhatsApp: 8838693929 | ☎️ 04142-216123</p>
          </div>
        </div>
      </div>

      {/* Real Footer Below Benefits */}
      <div className="w-full bg-[#c8b6ff] py-16 text-primary">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className="flex flex-col items-start gap-1">
              <span className="text-2xl font-serif text-[#b89542] leading-none mb-1">Shalu's</span>
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#b89542] leading-none">BOUTIQUE</span>
           </div>
           
           <div className="flex flex-col gap-3">
             <h4 className="font-bold text-xs uppercase tracking-wider mb-2">Our Menu</h4>
             <a href="/" className="text-xs hover:text-[#b89542]">Home</a>
             <a href="/collections/all" className="text-xs hover:text-[#b89542]">Our Categories</a>
             <a href="/collections/sale" className="text-xs hover:text-[#b89542]">Sale</a>
             <a href="/collections/best-sellers" className="text-xs hover:text-[#b89542]">Best Sellers</a>
             <a href="/collections/new-arrivals" className="text-xs hover:text-[#b89542]">New Arrivals</a>
             <a href="/collections/pre-booking" className="text-xs hover:text-[#b89542]">Pre-Booking</a>
             <a href="/contact" className="text-xs hover:text-[#b89542]">Contact</a>
           </div>

           <div className="flex flex-col gap-3">
             <h4 className="font-bold text-xs uppercase tracking-wider mb-2">Quick Links</h4>
             <a href="#" className="text-xs hover:text-[#b89542]">Terms and Conditions</a>
             <a href="#" className="text-xs hover:text-[#b89542]">Shipping Policy</a>
             <a href="#" className="text-xs hover:text-[#b89542]">Return Policy</a>
             <a href="#" className="text-xs hover:text-[#b89542]">Privacy Policy</a>
             <a href="#" className="text-xs hover:text-[#b89542]">About Us</a>
           </div>

           <div className="flex flex-col gap-3">
             <h4 className="font-bold text-xs uppercase tracking-wider mb-2">Contact us</h4>
             <p className="text-xs">Shalu's Boutique</p>
             <p className="text-xs underline cursor-pointer pointer-events-none">shaluboutique@gmail.com</p>
             <p className="text-xs underline">WhatsApp: 8838693929 | 04142-216123</p>
           </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-8 mt-16 flex justify-between items-center border-t border-primary/10 pt-8">
           <p className="text-[10px] uppercase font-bold text-primary/70">© SHALU'S BOUTIQUE 2026</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
