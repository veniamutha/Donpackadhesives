import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useProductStore } from '../store/useProductStore';
import { useUIStore } from '../store/useUIStore';
import { LogOut, Plus, Trash2, Image as ImageIcon, Loader2, Lock, X } from 'lucide-react';

export default function AdminDashboard() {
  const { setAdmin } = useUIStore();
  const { products, fetchProducts, isLoading } = useProductStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [apps, setApps] = useState<string[]>(['All']);
  const [specs, setSpecs] = useState<{key: string, value: string}[]>([]);
  const [images, setImages] = useState<File[]>([]); // New files
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]); // New file previews
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); // Existing urls when editing
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleLogout = () => {
    setAdmin(false);
  };

  const handleDelete = async (id: string, productImages: string[]) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      // Extract file paths from URLs to delete from storage if needed
      // Simplest: just delete record, storage can be cleaned up manually or via trigger
      // but let's try to delete images
      for (const url of productImages) {
        const path = url.split('/').pop();
        if (path) {
          await supabase.storage.from('product-images').remove([path]);
        }
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
    setApps(['All']);
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
    setApps(product.apps);
    
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

  const toggleApp = (app: string) => {
    if (apps.includes(app)) {
      setApps(apps.filter(a => a !== app));
    } else {
      setApps([...apps, app]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (images.length === 0 && existingImageUrls.length === 0)) {
      alert('Name and at least 1 image are required.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload Images
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

      // 2. Format Specs
      const specsJson: Record<string, string> = {};
      specs.forEach(s => {
        if (s.key && s.value) specsJson[s.key] = s.value;
      });

      // 3. Save Product
      const finalImageUrls = [...existingImageUrls, ...uploadedUrls];
      
      const productData = {
        name,
        desc,
        longDesc,
        apps,
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

      // Reset form
      setIsFormOpen(false);
      setName('');
      setDesc('');
      setLongDesc('');
      setApps(['All']);
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
        {!isFormOpen ? (
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

            {isLoading ? (
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
                <label className="block text-sm font-bold text-slate-700 mb-1">Short Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-green focus:border-brand-green" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Detailed Description (Optional)</label>
                <textarea value={longDesc} onChange={e => setLongDesc(e.target.value)} rows={4} className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-green focus:border-brand-green" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Applications</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Packaging', 'Furniture', 'Guns'].map(app => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => toggleApp(app)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${apps.includes(app) ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
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
        )}
      </main>
    </div>
  );
}
