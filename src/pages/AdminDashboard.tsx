import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useProductStore } from '../store/useProductStore';
import { useFlyerStore } from '../store/useFlyerStore';
import { useUIStore } from '../store/useUIStore';
import { LogOut, Plus, Trash2, Image as ImageIcon, Loader2, Lock, X, LayoutGrid, Image as FlyerIcon, Tags } from 'lucide-react';

export default function AdminDashboard() {
  const { setAdmin } = useUIStore();
  const { products, fetchProducts, isLoading: productsLoading, categories, fetchCategories } = useProductStore();
  const { flyers, fetchFlyers, isLoading: flyersLoading } = useFlyerStore();
  
  const [activeTab, setActiveTab] = useState<'products' | 'flyers' | 'categories'>('products');
  
  // Product State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Flyer State
  const [isFlyerUploading, setIsFlyerUploading] = useState(false);
  const [flyerImage, setFlyerImage] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [flyerTitle, setFlyerTitle] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [specs, setSpecs] = useState<{key: string, value: string}[]>([]);
  const [category, setCategory] = useState('Others');
  const [images, setImages] = useState<File[]>([]); 
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]); 
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); 
  const [submitting, setSubmitting] = useState(false);

  // Categories State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchFlyers();
    fetchCategories();
  }, [fetchProducts, fetchFlyers, fetchCategories]);

  const handleLogout = () => {
    setAdmin(false);
  };

  /* ================= FLYER FUNCTIONS ================= */
  const handleFlyerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFlyerImage(file);
      setFlyerPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadFlyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flyerImage) return;

    setIsFlyerUploading(true);
    try {
      const fileExt = flyerImage.name.split('.').pop();
      const fileName = `flyer_${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, flyerImage);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
        
      const { error: dbError } = await supabase.from('flyers').insert({
        title: flyerTitle,
        image_url: publicUrl
      });
      if (dbError) throw dbError;

      setFlyerImage(null);
      setFlyerPreview(null);
      setFlyerTitle('');
      fetchFlyers();
    } catch (err: any) {
      alert('Error uploading flyer: ' + err.message);
    } finally {
      setIsFlyerUploading(false);
    }
  };

  const handleDeleteFlyer = async (id: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this flyer?')) return;
    try {
      const BUCKET = 'product-images';
      const marker = `/object/public/${BUCKET}/`;
      let pathToDelete = '';
      if (imageUrl.includes(marker)) {
        pathToDelete = imageUrl.split(marker)[1];
      } else {
        pathToDelete = imageUrl.split('/').pop() || '';
      }
      
      if (pathToDelete) {
        await supabase.storage.from(BUCKET).remove([pathToDelete]);
      }

      const { error } = await supabase.from('flyers').delete().eq('id', id);
      if (error) throw error;
      fetchFlyers();
    } catch (err: any) {
      alert('Error deleting flyer: ' + err.message);
    }
  };

  /* ================= CATEGORY FUNCTIONS ================= */
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    try {
      const { error } = await supabase.from('categories').insert({ name: newCategoryName.trim() });
      if (error) throw error;
      setNewCategoryName('');
      fetchCategories();
    } catch (err: any) {
      alert('Error creating category: ' + err.message);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (!categoryToDelete) return;

    if (!window.confirm(`Are you sure you want to delete "${categoryToDelete.name}"? Any products currently in this category will be automatically moved back to "Others".`)) return;
    
    try {
      // 1. Move products to "Others"
      const { error: updateError } = await supabase
        .from('products')
        .update({ category: 'Others' })
        .eq('category', categoryToDelete.name);
      
      if (updateError) throw updateError;

      // 2. Delete the category
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      
      fetchCategories();
      fetchProducts(); // Refresh products to reflect the change to Others
    } catch (err: any) {
      alert('Error deleting category: ' + err.message);
    }
  };

  /* ================= PRODUCT FUNCTIONS ================= */
  const handleDelete = async (id: string, productImages: string[]) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const BUCKET = 'product-images';
      const marker = `/object/public/${BUCKET}/`;
      const pathsToDelete: string[] = [];
      for (const url of productImages) {
        if (url.includes(marker)) {
          pathsToDelete.push(url.split(marker)[1]);
        } else {
          const fallback = url.split('/').pop();
          if (fallback) pathsToDelete.push(fallback);
        }
      }
      if (pathsToDelete.length > 0) {
        await supabase.storage.from(BUCKET).remove(pathsToDelete);
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (err: any) {
      alert('Error deleting product: ' + err.message);
    }
  };

  const openCreateForm = () => {
    setEditingProductId(null);
    setName('');
    setDesc('');
    setLongDesc('');
    setCategory(categories[0]?.name || 'Others');
    setSpecs([]);
    setImages([]);
    setImagePreviewUrls([]);
    setExistingImageUrls([]);
    setIsFormOpen(true);
  };

  const openEditForm = (product: any) => {
    setEditingProductId(product.id);
    setName(product.name);
    setDesc(product.desc);
    setLongDesc(product.longDesc || '');
    setCategory(product.category || 'Others');
    
    const formattedSpecs = Object.entries(product.specs || {}).map(([key, value]) => ({ key, value: String(value) }));
    setSpecs(formattedSpecs);
    
    setExistingImageUrls(product.images || []);
    setImages([]);
    setImagePreviewUrls([]);
    setIsFormOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(f => URL.createObjectURL(f));
      setImagePreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (images.length === 0 && existingImageUrls.length === 0)) {
      alert('Name and at least 1 image are required.');
      return;
    }

    setSubmitting(true);
    try {
      setIsUploading(true);
      const uploadedUrls: string[] = [];
      
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        uploadedUrls.push(publicUrl);
      }
      setIsUploading(false);

      const specsJson: Record<string, string> = {};
      specs.forEach(s => {
        if (s.key && s.value) specsJson[s.key] = s.value;
      });

      const finalImageUrls = [...existingImageUrls, ...uploadedUrls];
      
      const productData = {
        name,
        desc,
        longDesc,
        category,
        specs: specsJson,
        images: finalImageUrls
      };

      if (editingProductId) {
        const { error: dbError } = await supabase.from('products').update(productData).eq('id', editingProductId);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('products').insert(productData);
        if (dbError) throw dbError;
      }

      setIsFormOpen(false);
      setName('');
      setDesc('');
      setLongDesc('');
      setCategory('Others');
      setSpecs([]);
      setImages([]);
      setImagePreviewUrls([]);
      setExistingImageUrls([]);
      fetchProducts();
      
    } catch (err: any) {
      alert('Error creating product: ' + err.message);
      setIsUploading(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-brand-navy text-white p-6 flex justify-between items-center shadow-md z-10">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <div className="bg-brand-green p-1.5 rounded-lg">
            <Lock className="w-5 h-5 text-brand-navy" />
          </div>
          Admin Dashboard
        </h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4 overflow-x-auto">
          <button 
            onClick={() => { setActiveTab('products'); setIsFormOpen(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors whitespace-nowrap ${activeTab === 'products' ? 'bg-brand-navy text-white' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm border border-slate-200'}`}
          >
            <LayoutGrid className="w-5 h-5" /> Manage Products
          </button>
          <button 
            onClick={() => { setActiveTab('flyers'); setIsFormOpen(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors whitespace-nowrap ${activeTab === 'flyers' ? 'bg-brand-navy text-white' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm border border-slate-200'}`}
          >
            <FlyerIcon className="w-5 h-5" /> Manage Flyers
          </button>
          <button 
            onClick={() => { setActiveTab('categories'); setIsFormOpen(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors whitespace-nowrap ${activeTab === 'categories' ? 'bg-brand-navy text-white' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm border border-slate-200'}`}
          >
            <Tags className="w-5 h-5" /> Manage Categories
          </button>
        </div>

        {activeTab === 'products' ? (
          !isFormOpen ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-800">Products ({products.length})</h2>
                <button 
                  onClick={openCreateForm}
                  className="bg-brand-green hover:bg-green-500 text-brand-navy px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" /> Add New Product
                </button>
              </div>

              {productsLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                      <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover bg-slate-100" />
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                        <p className="text-xs font-semibold text-brand-green mb-2 px-2 py-1 bg-brand-green/10 inline-block rounded w-fit">{product.category || 'Uncategorized'}</p>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.desc}</p>
                        
                        <div className="mt-auto flex gap-2">
                          <button 
                            onClick={() => openEditForm(product)}
                            className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded font-medium transition-colors text-sm border border-slate-200"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id, product.images)}
                            className="flex-none p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors border border-red-100"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">{editingProductId ? 'Edit Product' : 'Create New Product'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Product Name *</label>
                  <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-green focus:border-brand-green" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category *</label>
                  <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-green focus:border-brand-green bg-white">
                    <option value="" disabled>Select a category</option>
                    <option value="Others">Others</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Short Description</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-green focus:border-brand-green" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Detailed Description (Optional)</label>
                  <textarea value={longDesc} onChange={e => setLongDesc(e.target.value)} rows={4} className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-green focus:border-brand-green" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Images *</label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {existingImageUrls.map((url, idx) => (
                      <div key={`existing-${idx}`} className="relative w-24 h-24 rounded overflow-hidden border border-slate-200 group">
                        <img src={url} alt="existing" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingImage(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                    {imagePreviewUrls.map((url, idx) => (
                      <div key={`new-${idx}`} className="relative w-24 h-24 rounded overflow-hidden border border-slate-200 group">
                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeNewImage(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                    <label className="w-24 h-24 rounded border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-brand-green hover:border-brand-green cursor-pointer transition-colors bg-slate-50">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span className="text-xs font-medium">Add Image</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700">Specifications (Table Data)</label>
                    <button type="button" onClick={addSpec} className="text-sm text-brand-green font-bold flex items-center gap-1 hover:underline">
                      <Plus className="w-4 h-4" /> Add Row
                    </button>
                  </div>
                  
                  {specs.length > 0 ? (
                    <div className="space-y-2">
                      {specs.map((spec, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input placeholder="e.g. Viscosity" value={spec.key} onChange={e => updateSpec(idx, 'key', e.target.value)} className="flex-1 p-2 border border-slate-300 rounded text-sm" />
                          <input placeholder="e.g. 1000 cps" value={spec.value} onChange={e => updateSpec(idx, 'value', e.target.value)} className="flex-1 p-2 border border-slate-300 rounded text-sm" />
                          <button type="button" onClick={() => removeSpec(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded border border-slate-100 text-center">No specifications added. Click "Add Row" to create table data.</p>
                  )}
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <button type="button" onClick={() => setIsFormOpen(false)} disabled={submitting} className="flex-1 py-3 px-4 border border-slate-300 rounded font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 px-4 bg-brand-green hover:bg-green-500 text-brand-navy rounded font-bold shadow disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> {isUploading ? 'Uploading Images...' : 'Saving...'}</>
                    ) : (
                      editingProductId ? 'Update Product' : 'Save Product'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )
        ) : activeTab === 'flyers' ? (
          /* ================= FLYERS VIEW ================= */
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Upload New Flyer / Poster</h2>
              <form onSubmit={handleUploadFlyer} className="flex flex-col md:flex-row gap-6 items-start">
                <div>
                  {flyerPreview ? (
                    <div className="relative w-48 h-64 rounded-xl overflow-hidden border-2 border-slate-200 group">
                      <img src={flyerPreview} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setFlyerImage(null); setFlyerPreview(null); }} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-8 h-8" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-48 h-64 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-brand-green hover:border-brand-green cursor-pointer transition-colors bg-slate-50">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-sm font-bold">Select Flyer</span>
                      <span className="text-xs text-center px-4 mt-1">Portrait or landscape images</span>
                      <input type="file" accept="image/*" onChange={handleFlyerImageChange} className="hidden" />
                    </label>
                  )}
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Title (Optional)</label>
                    <input 
                      value={flyerTitle} 
                      onChange={e => setFlyerTitle(e.target.value)} 
                      placeholder="e.g. Diwali Sale 2026"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green" 
                    />
                    <p className="text-xs text-slate-500 mt-1">Used for image alt text / SEO.</p>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={!flyerImage || isFlyerUploading} 
                    className="w-full py-3 bg-brand-navy hover:bg-slate-800 text-white rounded-lg font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    {isFlyerUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : <><Plus className="w-5 h-5" /> Upload & Publish Flyer</>}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-4">Active Flyers ({flyers.length})</h3>
              {flyersLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
                </div>
              ) : flyers.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No flyers published yet. Upload one above!</p>
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  {flyers.map(flyer => (
                    <div key={flyer.id} className="break-inside-avoid bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative group">
                      <img src={flyer.image_url} alt={flyer.title || 'Flyer'} className="w-full h-auto" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <p className="text-white font-bold mb-2 truncate">{flyer.title || 'Untitled'}</p>
                        <button 
                          onClick={() => handleDeleteFlyer(flyer.id, flyer.image_url)}
                          className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Flyer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= CATEGORIES VIEW ================= */
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Create New Category</h2>
              <form onSubmit={handleCreateCategory} className="flex gap-4">
                <input 
                  required
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                  placeholder="e.g. Liquid Adhesives"
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green" 
                />
                <button 
                  type="submit" 
                  disabled={isCreatingCategory || !newCategoryName.trim()} 
                  className="px-6 py-3 bg-brand-navy hover:bg-slate-800 text-white rounded-lg font-bold shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {isCreatingCategory ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Add
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-4">Existing Categories ({categories.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center group">
                    <span className="font-semibold text-slate-800">{cat.name}</span>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
