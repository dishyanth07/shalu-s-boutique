import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-serif mb-6">UNIQUE BOUTIQUE</h2>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-8 text-sm uppercase tracking-widest text-primary-light/60">
          <Link to="/" className="hover:text-accent">Home</Link>
          <a href="/#collection" className="hover:text-accent">Shop</a>
          <Link to="/track" className="hover:text-accent">Tracking</Link>
          <Link to="/admin/login" className="hover:text-accent">Admin</Link>
        </div>
        <div className="mb-8 text-sm text-primary-light/80 space-y-1">
          <p>📞 WhatsApp: 9092330688</p>
          <p>🚚 Cash on Delivery available | 🌏 Shipping Worldwide</p>
        </div>
        <p className="text-xs text-primary-light/40">© 2026 Unique Boutique. All rights reserved.</p>

      </div>
    </footer>
  )
}

export default Footer
