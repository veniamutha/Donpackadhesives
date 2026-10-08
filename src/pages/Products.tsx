import { useState, useEffect } from 'react';
import { Box, X, ChevronRight, ShoppingCart, ChevronLeft, LayoutGrid, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductStore, type Product } from '../store/useProductStore';
import { useUIStore } from '../store/useUIStore';

export default function Products() {
  const { selectedCategory, setCategory, products, categories, isLoading, error, fetchProducts, fetchCategories } = useProductStore();
  const { setQuoteModalOpen } = useUIStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Grouping categories based on the database
  const getProductCategory = (product: Product): string => {
    return product.category || 'Others';
  };

  // Combine categories from db with any categories found in products (to ensure 'Others' is caught)
  const categoryNamesFromDb = categories.map(c => c.name);
  const categoriesFromProducts = Array.from(new Set(products.map(p => getProductCategory(p))));
  
  // Create a unique list keeping DB categories first, then any extra ones like 'Others'
  const PRODUCT_CATEGORIES = Array.from(new Set([...categoryNamesFromDb, ...categoriesFromProducts]));

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => getProductCategory(p) === selectedCategory);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0); // Reset gallery index when opening new product
  };

  const currentProductIndex = selectedProduct ? filteredProducts.findIndex(p => p.id === selectedProduct.id) : -1;

  const handlePrevProduct = () => {
    if (currentProductIndex > 0) {
      handleOpenModal(filteredProducts[currentProductIndex - 1]);
    } else if (currentProductIndex === 0) {
      handleOpenModal(filteredProducts[filteredProducts.length - 1]);
    }
  };

  const handleNextProduct = () => {
    if (currentProductIndex !== -1 && currentProductIndex < filteredProducts.length - 1) {
      handleOpenModal(filteredProducts[currentProductIndex + 1]);
    } else if (currentProductIndex === filteredProducts.length - 1) {
      handleOpenModal(filteredProducts[0]);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Category Filter Header */}
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Category Filter</h2>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-brand-navy mb-6 sm:mb-8">What are you looking for?</h3>
        
        {/* Filter Cards */}
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {['All', ...PRODUCT_CATEGORIES].map((categoryName) => {
            const isSelected = selectedCategory === categoryName;
            return (
              <button
                key={categoryName}
                onClick={() => setCategory(categoryName)}
                className={`px-6 py-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                  isSelected 
                    ? 'border-brand-green bg-green-50 shadow-md transform -translate-y-1' 
                    : 'border-slate-100 bg-white hover:border-brand-navy hover:shadow'
                }`}
              >
                <LayoutGrid className={`w-5 h-5 ${isSelected ? 'text-brand-green' : 'text-slate-400'}`} />
                <span className={`font-bold text-sm sm:text-base ${isSelected ? 'text-brand-navy' : 'text-slate-600'}`}>{categoryName}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recommended Solutions */}
      <div>
        <h3 className="text-lg sm:text-2xl font-bold text-slate-800 mb-6 sm:mb-8 border-b pb-4 flex items-center justify-between gap-2">
          <span className="truncate">{selectedCategory === 'All' ? 'Complete Catalog' : `Category: ${selectedCategory}`}</span>
          <span className="flex-shrink-0 text-brand-navy font-bold bg-slate-100 px-3 py-1 rounded-full text-sm">{filteredProducts.length} items</span>
        </h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-brand-green" />
            <p>Loading products from database...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
            <p className="font-bold mb-2">Error loading products</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>No products found for this category.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {PRODUCT_CATEGORIES.map((category) => {
              const categoryItems = filteredProducts.filter(p => getProductCategory(p) === category);
              if (categoryItems.length === 0) return null;
              return (
                <section key={category}>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-7">
                    <div className="h-8 w-1.5 rounded-full bg-brand-green flex-shrink-0" />
                    <h3 className="text-lg sm:text-xl font-extrabold text-brand-navy whitespace-nowrap tracking-tight">
                      {category}
                    </h3>
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="flex-shrink-0 text-xs font-bold text-brand-green bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
                      {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Product Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryItems.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group flex flex-col h-full hover:shadow-md transition-all hover:border-slate-200"
                      >
                        <div
                          className="h-48 relative bg-slate-50 border-b border-slate-100 overflow-hidden cursor-pointer"
                          onClick={() => handleOpenModal(product)}
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-md">
                              1/{product.images.length}
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex gap-2 mb-3 flex-wrap">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-green bg-green-50/80 px-2 py-1 rounded">
                              {getProductCategory(product)}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-brand-navy mb-2 line-clamp-2">{product.name}</h4>
                          <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-1">{product.desc}</p>
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="w-full py-2.5 mt-auto bg-slate-50 hover:bg-brand-navy hover:text-white text-brand-navy font-medium rounded transition-colors text-sm border border-slate-200 hover:border-brand-navy flex items-center justify-center gap-2"
                          >
                            View Data Sheet <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedProduct(null)}
          ></div>

          {/* Modal Panel */}
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-5xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col relative z-10 transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
              <h2 className="text-base sm:text-2xl font-bold text-brand-navy pr-2 line-clamp-2" id="modal-title">
                {selectedProduct.name}
              </h2>
              <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-200 pl-4">
                <button 
                  onClick={handlePrevProduct}
                  className="text-slate-500 border border-slate-200 shadow-sm hover:border-slate-300 hover:text-brand-navy hover:bg-slate-50 p-2 rounded-full transition-all"
                  title="Previous Product"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNextProduct}
                  className="text-slate-500 border border-slate-200 shadow-sm hover:border-slate-300 hover:text-brand-navy hover:bg-slate-50 p-2 rounded-full transition-all"
                  title="Next Product"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="hidden sm:block w-px h-6 bg-slate-200 mx-2"></div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-slate-500 border border-slate-200 shadow-sm hover:border-red-200 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                
                {/* Left Column: Image Gallery & Description */}
                <div className="flex flex-col">
                  {/* Main Gallery Image */}
                  <div className="bg-slate-100 rounded-xl overflow-hidden mb-4 relative aspect-[4/3] group flex items-center justify-center">
                    <img 
                      src={selectedProduct.images[activeImageIndex]} 
                      alt={`${selectedProduct.name} - View ${activeImageIndex + 1}`} 
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Navigation Arrows (always visible on mobile, hover on desktop) */}
                    {selectedProduct.images.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(prev => prev === 0 ? selectedProduct.images.length - 1 : prev - 1);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(prev => prev === selectedProduct.images.length - 1 ? 0 : prev + 1);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                      {selectedProduct.images.map((img, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative h-20 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                            activeImageIndex === idx ? 'border-brand-navy opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="prose prose-slate mt-6">
                    <p className="text-slate-600 leading-relaxed text-justify">
                      {selectedProduct.longDesc || selectedProduct.desc}
                    </p>
                  </div>
                </div>

                {/* Right Column: Specifications */}
                <div>
                  <h3 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
                    <Box className="w-5 h-5 text-brand-green" /> Technical Specifications
                  </h3>
                  
                  {selectedProduct.specs ? (
                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-slate-200">
                          {Object.entries(selectedProduct.specs).map(([key, value]) => (
                            <tr key={key} className="hover:bg-slate-100 transition-colors">
                              <th className="px-4 py-3 font-medium text-slate-700 w-1/2 bg-slate-50/50">{key}</th>
                              <td className="px-4 py-3 text-slate-600 w-1/2">{value as string}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200 border-dashed">
                      <p className="text-slate-500 italic">Detailed technical specifications are being updated for this product.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer / CTA */}
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-full sm:w-auto px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded transition-colors order-2 sm:order-1"
              >
                Close
              </button>
              <button 
                onClick={() => setQuoteModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-brand-green hover:bg-green-800 text-white font-medium rounded transition-colors flex items-center justify-center gap-2 shadow-sm order-1 sm:order-2"
              >
                <ShoppingCart className="w-5 h-5" /> Interested? Book Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
