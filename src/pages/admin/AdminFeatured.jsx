import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { uploadImage } from '../../lib/storage'
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Upload, Loader2, ArrowUp, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminFeatured = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ title: '', image_url: '', link_url: '', sort_order: 0 })

  useEffect(() => {
    fetchFeatured()
  }, [])

  const fetchFeatured = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('featured_collections')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) toast.error('Error fetching featured collections')
    else setFeatured(data || [])
    setLoading(false)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const publicUrl = await uploadImage(file)
      setFormData({ ...formData, image_url: publicUrl })
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (editingItem) {
      const { error } = await supabase
        .from('featured_collections')
        .update(formData)
        .eq('id', editingItem.id)
      
      if (error) toast.error('Error updating collection')
      else {
        toast.success('Collection updated')
        setShowModal(false)
        fetchFeatured()
      }
    } else {
      const { error } = await supabase
        .from('featured_collections')
        .insert([formData])
      
      if (error) toast.error('Error creating collection')
      else {
        toast.success('Collection created')
        setShowModal(false)
        fetchFeatured()
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this featured collection?')) {
      const { error } = await supabase.from('featured_collections').delete().eq('id', id)
      if (error) toast.error('Error deleting collection')
      else {
        toast.success('Collection removed')
        fetchFeatured()
      }
    }
  }

  const moveItem = async (index, direction) => {
    const newItems = [...featured]
    const otherIndex = index + direction
    if (otherIndex < 0 || otherIndex >= newItems.length) return

    // Swap sort orders
    const currentItem = newItems[index]
    const otherItem = newItems[otherIndex]
    
    const tempOrder = currentItem.sort_order
    currentItem.sort_order = otherItem.sort_order
    otherItem.sort_order = tempOrder

    // Optimized: In a real app we'd bulk update, here we just update two
    await Promise.all([
      supabase.from('featured_collections').update({ sort_order: currentItem.sort_order }).eq('id', currentItem.id),
      supabase.from('featured_collections').update({ sort_order: otherItem.sort_order }).eq('id', otherItem.id)
    ])
    
    fetchFeatured()
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-serif text-primary">Home Page Featured</h2>
        <button 
          onClick={() => {
            setEditingItem(null)
            setFormData({ title: '', image_url: '', link_url: '', sort_order: featured.length })
            setShowModal(true)
          }}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center hover:bg-accent transition-all"
        >
          <Plus size={20} className="mr-2" /> Add Featured Item
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8">
        <p className="text-sm text-gray-500 italic">Manage the "OUR BEST SELLING COLLECTIONS" slider on the home page. Reorder items using the arrows.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured.map((item, index) => (
            <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="aspect-[4/5] bg-gray-50 relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="p-2 bg-white/90 rounded-xl text-primary hover:bg-white disabled:opacity-50"><ArrowUp size={16} /></button>
                  <button onClick={() => moveItem(index, 1)} disabled={index === featured.length - 1} className="p-2 bg-white/90 rounded-xl text-primary hover:bg-white disabled:opacity-50"><ArrowDown size={16} /></button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-primary uppercase tracking-widest text-sm mb-1">{item.title}</h3>
                <p className="text-[10px] text-gray-400 font-mono truncate mb-4">{item.link_url || 'No link set'}</p>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                  <button 
                    onClick={() => {
                      setEditingItem(item)
                      setFormData(item)
                      setShowModal(true)
                    }}
                    className="p-2 text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif text-primary">{editingItem ? 'Edit Featured Item' : 'New Featured Item'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Item Title</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. CHINNON SAREE"
                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Image</label>
                  <div className="space-y-4">
                    {formData.image_url && (
                      <div className="relative aspect-[4/5] w-32 rounded-2xl overflow-hidden border border-gray-100">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, image_url: ''})}
                          className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      <div className="flex-1 relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          disabled={uploading}
                        />
                        <div className={`w-full px-6 py-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2 ${uploading ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200 group-hover:border-primary group-hover:bg-white'}`}>
                          {uploading ? (
                            <Loader2 size={18} className="animate-spin text-primary" />
                          ) : (
                            <Upload size={18} className="text-gray-400 group-hover:text-primary" />
                          )}
                          <span className="text-xs font-bold text-gray-400 group-hover:text-primary">
                            {uploading ? 'Uploading...' : 'Click to upload local image'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 text-xs font-bold uppercase tracking-widest">OR</div>
                      <input 
                        type="text" 
                        value={formData.image_url} 
                        onChange={e => setFormData({...formData, image_url: e.target.value})}
                        placeholder="Paste image URL here"
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Collection Link (URL)</label>
                  <input 
                    type="text" 
                    value={formData.link_url} 
                    onChange={e => setFormData({...formData, link_url: e.target.value})}
                    placeholder="e.g. /collections/chinnon-saree"
                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-sm"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-8 py-4 border border-gray-100 text-gray-400 font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-50 transition-all">Cancel</button>
                  <button type="submit" disabled={uploading} className="flex-1 px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-accent transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminFeatured
