import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [dbCategories, setDbCategories] = useState([])

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    is_best_seller: false,
    is_pre_booking: false,
    variants: [{ size: '', color: '', price: '', original_price: '', stock_quantity: 0, image_url: '' }]
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      if (data) {
        setDbCategories(data)
        if (data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: data[0].name }))
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select(`*, product_variants(*)`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: '', color: '', price: '', original_price: '', stock_quantity: 0, image_url: '' }]
    })
  }

  const handleRemoveVariant = (index) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    })
  }

  const uploadImage = (file, variantIndex) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      handleVariantChange(variantIndex, 'image_url', e.target.result)
      toast.success('Image added!')
    }
    reader.onerror = () => toast.error('Could not read image file')
    reader.readAsDataURL(file)
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants]
    newVariants[index][field] = value
    setFormData({ ...formData, variants: newVariants })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingProduct) {
        // Update logic (simplified: delete variants and recreate or update individual)
        const { error: pError } = await supabase.from('products').update({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          is_best_seller: formData.is_best_seller,
          is_pre_booking: formData.is_pre_booking
        }).eq('id', editingProduct.id)
        if (pError) throw pError

        // For simplicity in this demo, we'll delete and re-insert variants
        await supabase.from('product_variants').delete().eq('product_id', editingProduct.id)
        const variantsToInsert = formData.variants.map(v => ({ 
          product_id: editingProduct.id,
          size: v.size,
          color: v.color,
          price: v.price,
          original_price: v.original_price || null,
          stock_quantity: v.stock_quantity,
          image_url: v.image_url
        }))
        await supabase.from('product_variants').insert(variantsToInsert)
        
        toast.success('Product updated!')
      } else {
        // Insert new product
        const { data: product, error: pError } = await supabase.from('products').insert({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          is_best_seller: formData.is_best_seller,
          is_pre_booking: formData.is_pre_booking
        }).select().single()

        if (pError) throw pError

        const variantsToInsert = formData.variants.map(v => ({ 
          product_id: product.id,
          size: v.size,
          color: v.color,
          price: v.price,
          original_price: v.original_price || null,
          stock_quantity: v.stock_quantity,
          image_url: v.image_url
        }))
        const { error: vError } = await supabase.from('product_variants').insert(variantsToInsert)
        if (vError) throw vError

        toast.success('Product added successfully!')
      }

      setShowModal(false)
      setEditingProduct(null)
      setFormData({ 
        name: '', 
        description: '', 
        category: '', 
        is_best_seller: false,
        is_pre_booking: false,
        variants: [{ size: '', color: '', price: '', original_price: '', stock_quantity: 0, image_url: '' }] 
      })
      fetchProducts()
    } catch (error) {
      console.error(error)
      toast.error(`Error: ${error.message || 'Failed to save product'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error('Error deleting product')
    else {
      toast.success('Product deleted')
      fetchProducts()
    }
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      is_best_seller: !!product.is_best_seller,
      is_pre_booking: !!product.is_pre_booking,
      variants: product.product_variants || []
    })
    setShowModal(true)
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-serif text-primary">Inventory</h2>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ 
              name: '', 
              description: '', 
              category: '', 
              is_best_seller: false,
              is_pre_booking: false,
              variants: [{ size: '', color: '', price: '', original_price: '', stock_quantity: 0, image_url: '' }] 
            });
            setShowModal(true);
          }}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center hover:bg-accent transition-all"
        >
          <Plus size={20} className="mr-2" /> Add Product
        </button>
      </div>

      {loading && !showModal ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Search products by name or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:border-primary transition-all outline-none text-sm shadow-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                <tr>
                  <th className="px-8 py-5">Product</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Variants</th>
                  <th className="px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-primary text-sm uppercase tracking-wider">{p.name}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[9px] font-bold uppercase tracking-widest border border-primary/10">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-2">
                        {p.is_best_seller && (
                          <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-yellow-100 italic">BEST SELLER</span>
                        )}
                        {p.is_pre_booking && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-purple-100 italic">PRE-BOOKING</span>
                        )}
                        {!p.is_best_seller && !p.is_pre_booking && (
                          <span className="text-[8px] text-gray-300 uppercase tracking-widest font-medium">Regular</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                      {p.product_variants?.length || 0} variants
                    </td>
                    <td className="px-8 py-5 space-x-4">
                      <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-primary transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-2xl font-serif">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-accent transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
                  <select 
                    required 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all text-sm appearance-none cursor-pointer outline-none"
                  >
                    {dbCategories.length > 0 ? (
                      dbCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))
                    ) : (
                      <option disabled>No categories found. Create one first!</option>
                    )}
                  </select>
                </div>
              </div>
 
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.is_best_seller} 
                    onChange={e => setFormData({...formData, is_best_seller: e.target.checked})} 
                    className="w-5 h-5 rounded-lg border-2 border-gray-100 text-accent focus:ring-accent"
                  />
                  <span className="text-sm font-bold uppercase tracking-widest text-primary group-hover:text-accent transition-colors">Best Seller</span>
                </label>
 
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.is_pre_booking} 
                    onChange={e => setFormData({...formData, is_pre_booking: e.target.checked})} 
                    className="w-5 h-5 rounded-lg border-2 border-gray-100 text-accent focus:ring-accent"
                  />
                  <span className="text-sm font-bold uppercase tracking-widest text-primary group-hover:text-accent transition-colors">Pre-Booking</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-accent transition-all"></textarea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider">Product Variants</h4>
                  <button type="button" onClick={handleAddVariant} className="text-accent text-xs font-black uppercase tracking-widest flex items-center">
                    <Plus size={14} className="mr-1" /> Add Variant
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.variants.map((v, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-2xl flex flex-col md:flex-row gap-4 relative group">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <input placeholder="Size" value={v.size} onChange={e => handleVariantChange(i, 'size', e.target.value)} className="w-full px-4 py-2 bg-white rounded-lg border-transparent focus:border-accent" />
                          <input placeholder="Color" value={v.color} onChange={e => handleVariantChange(i, 'color', e.target.value)} className="w-full px-4 py-2 bg-white rounded-lg border-transparent focus:border-accent" />
                          <input placeholder="Original Price" type="number" value={v.original_price} onChange={e => handleVariantChange(i, 'original_price', e.target.value)} className="w-full px-4 py-2 bg-white rounded-lg border-transparent focus:border-accent" title="Used for strikethrough price" />
                          <input placeholder="Selling Price" type="number" value={v.price} onChange={e => handleVariantChange(i, 'price', e.target.value)} className="w-full px-4 py-2 bg-white rounded-lg border-transparent focus:border-accent" />
                          <input placeholder="Stock" type="number" value={v.stock_quantity} onChange={e => handleVariantChange(i, 'stock_quantity', e.target.value)} className="w-full px-4 py-2 bg-white rounded-lg border-transparent focus:border-accent" />
                        </div>
                        {/* Image Upload */}
                        <div className="flex items-center gap-4">
                          {v.image_url && (
                            <img src={v.image_url} alt="preview" className="w-14 h-16 object-cover rounded-xl border border-gray-200 flex-shrink-0" />
                          )}
                          <label className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-lg border-2 border-dashed border-gray-200 hover:border-accent cursor-pointer transition-colors">
                            <Upload size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {v.image_url ? 'Change image' : 'Upload image from device'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) uploadImage(file, i)
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <button type="button" onClick={() => handleRemoveVariant(i)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl hover:bg-accent shadow-lg transition-all">
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminProducts
