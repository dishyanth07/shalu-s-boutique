import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { uploadImage } from '../../lib/storage'
import { Plus, Edit2, Trash2, X, FolderOpen, Upload, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', slug: '', image_url: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Error fetching categories')
    } finally {
      setLoading(false)
    }
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
      console.error('Upload error details:', error)
      toast.error(`Fault: ${error.message || 'Unknown upload error'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSlug = (name) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/'/g, '').replace(/[^\w-]/g, '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const slug = formData.slug || handleSlug(formData.name)
    
    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update({ ...formData, slug })
        .eq('id', editingCategory.id)
      
      if (error) toast.error('Error updating category')
      else {
        toast.success('Category updated')
        setShowModal(false)
        fetchCategories()
      }
    } else {
      const { error } = await supabase
        .from('categories')
        .insert([{ ...formData, slug }])
      
      if (error) toast.error('Error creating category')
      else {
        toast.success('Category created')
        setShowModal(false)
        fetchCategories()
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will not delete products, but they will lose their category link.')) {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) toast.error('Error deleting category')
      else {
        toast.success('Category deleted')
        fetchCategories()
      }
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-serif text-primary">Manage Categories</h2>
        <button 
          onClick={() => {
            setEditingCategory(null)
            setFormData({ name: '', slug: '', image_url: '' })
            setShowModal(true)
          }}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center hover:bg-accent transition-all"
        >
          <Plus size={20} className="mr-2" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center overflow-hidden border border-primary/10">
                   {cat.image_url ? (
                     <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                   ) : (
                     <FolderOpen size={24} className="text-primary/40" />
                   )}
                </div>
                <div>
                  <h3 className="font-bold text-primary uppercase tracking-widest text-sm">{cat.name}</h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">/{cat.slug}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-50 pt-4 mt-2">
                <button 
                  onClick={() => {
                    setEditingCategory(cat)
                    setFormData({ name: cat.name, slug: cat.slug, image_url: cat.image_url || '' })
                    setShowModal(true)
                  }}
                  className="p-2 text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif text-primary">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Category Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. UNIQUE SAREE"
                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Custom Slug (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.slug} 
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    placeholder="e.g. unique-saree"
                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Image</label>
                  <div className="space-y-4">
                    {formData.image_url && (
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, image_url: ''})}
                          className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <X size={10} />
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
                          <span className="text-[11px] font-bold text-gray-400 group-hover:text-primary">
                            {uploading ? 'Uploading...' : 'Upload Link'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-[9px] font-bold uppercase tracking-widest text-gray-400">OR URL</div>
                      <input 
                        type="text" 
                        value={formData.image_url} 
                        onChange={e => setFormData({...formData, image_url: e.target.value})}
                        placeholder="Image URL"
                        className="w-full pl-20 pr-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-8 py-4 border border-gray-100 text-gray-400 font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-50 transition-all">Cancel</button>
                  <button type="submit" disabled={uploading} className="flex-1 px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-accent transition-all shadow-lg shadow-primary/20 disabled:opacity-50">{editingCategory ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminCategories
