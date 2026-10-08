import { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, ChevronRight, ShoppingCart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductStore } from '../store/useProductStore';
import { useUIStore } from '../store/useUIStore';
import { seoApplications } from '../data/seoApplications';

export default function ApplicationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const { setQuoteModalOpen } = useUIStore();
  
  const seoData = slug ? seoApplications[slug] : null;

  useEffect(() => {
    fetchProducts();
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  }, [fetchProducts, slug]);

  if (!seoData) {
    return <Navigate to="/products" replace />;
  }

  // Filter products by the appCategory that this application maps to
  const applicationProducts = products.filter(
    (p) => p.apps.includes(seoData.appCategory) || p.apps.includes('All')
  );

  return (
    <div className="min-h-[calc(100vh-64px)] pb-16 sm:pb-24">
      <Helmet>
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="keywords" content={seoData.keywords.join(', ')} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              High-Performance Adhesives for <br className="hidden sm:block" />
              <span className="text-brand-green">{seoData.industry}</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              {seoData.metaDescription}
            </p>
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="bg-brand-green hover:bg-green-700 text-white px-8 py-4 rounded font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto"
            >
              Get a Quote for {seoData.industry} Adhesives
            </button>
          </motion.div>
        </div>
      </section>

      {/* Challenge / Solution Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-brand-navy mb-4 flex items-center gap-3">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">The Challenge</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {seoData.challenge}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-brand-green/30"
            >
              <h2 className="text-2xl font-bold text-brand-navy mb-4 flex items-center gap-3">
                <span className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm">The Solution</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {seoData.solution}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-navy mb-4">Recommended Products</h2>
          <div className="h-1 w-20 bg-brand-green mx-auto rounded-full"></div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-brand-green" />
            <p>Loading recommended products...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg">{error}</div>
        ) : applicationProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>No specific products found. Please contact us for custom formulations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {applicationProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-all hover:border-brand-navy"
              >
                <div className="h-48 relative bg-slate-50 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="text-lg font-bold text-brand-navy mb-2 line-clamp-2">{product.name}</h4>
                  <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-1">{product.desc}</p>
                  <Link
                    to="/products"
                    className="w-full py-2.5 mt-auto bg-slate-50 hover:bg-brand-navy hover:text-white text-brand-navy font-medium rounded transition-colors text-sm border border-slate-200 hover:border-brand-navy flex items-center justify-center gap-2"
                  >
                    View in Catalog <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Trust Elements */}
      <section className="bg-brand-navy text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <ShieldCheck className="w-16 h-16 text-brand-green mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Why Manufacturers Trust DonPack</h2>
          <p className="text-lg text-slate-300 mb-10">
            With decades of experience formulating adhesives for specific industrial requirements, we provide not just glue, but complete bonding solutions.
          </p>
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-8 py-4 rounded font-bold text-lg transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ShoppingCart className="w-5 h-5" /> Request a Free Sample
          </button>
        </div>
      </section>
    </div>
  );
}
