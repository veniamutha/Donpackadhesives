import { Helmet } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';
import QuoteModal from './components/ui/QuoteModal';
import AdminLoginModal from './components/ui/AdminLoginModal';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard';
import { useUIStore } from './store/useUIStore';
import { useCompanyStore } from './store/useCompanyStore';
import { useProductStore } from './store/useProductStore';
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from 'react';

const SEO_ROUTES: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'DONPACK Adhesives | Hot-Melt Adhesive Solutions in India',
    description:
      'DonPack Adhesives manufactures premium hot-melt adhesives for packaging, furniture, carton sealing & industrial applications. Trusted by 500+ manufacturers in India. Get a free quote.',
  },
  '/products': {
    title: 'Adhesive Products Catalog | DONPACK Adhesives',
    description:
      'Browse our complete range of hot-melt adhesives: EVA, PUR, PSA, and specialty adhesives for packaging, furniture, and industrial use. Download data sheets and request a quote.',
  },
  '/about': {
    title: 'About DONPACK Adhesives | Chennai-Based Adhesive Manufacturer',
    description:
      'Learn about DonPack Adhesives — an innovative adhesive manufacturer based in Chennai, India, delivering high-performance hot-melt bonding solutions to 500+ manufacturers worldwide.',
  },
};

function App() {
  const { isAdmin } = useUIStore();
  const { fetchInfo } = useCompanyStore();
  const { fetchCategories } = useProductStore();

  useEffect(() => {
    fetchInfo();
    fetchCategories();
  }, [fetchInfo, fetchCategories]);
  const location = useLocation();
  const siteUrl = 'https://www.donpack.in';

  const currentSEO = SEO_ROUTES[location.pathname] ?? SEO_ROUTES['/'];
  const canonicalUrl = `${siteUrl}${location.pathname}`;

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-slate-900 font-sans">
      <ScrollToTop />
      <Helmet>
        <title>{currentSEO.title}</title>
        <meta name="description" content={currentSEO.description} />
        <link rel="canonical" href={canonicalUrl} />
        {/* Open Graph — updated per page */}
        <meta property="og:title" content={currentSEO.title} />
        <meta property="og:description" content={currentSEO.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${siteUrl}/og-image.jpg`} />
        <meta property="og:type" content="website" />
        {/* Twitter Card — updated per page */}
        <meta name="twitter:title" content={currentSEO.title} />
        <meta name="twitter:description" content={currentSEO.description} />
        <meta name="twitter:image" content={`${siteUrl}/og-image.jpg`} />
      </Helmet>
      
      {!isAdmin ? (
        <>
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<AboutUs />} />
            </Routes>
          </main>
          <Footer />
          <FloatingWhatsApp />
          <QuoteModal />
          <AdminLoginModal />
        </>
      ) : (
        <AdminDashboard />
      )}
      <Analytics />
    </div>
  );
}

export default App;
