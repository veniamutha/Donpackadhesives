import { Helmet } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';
import QuoteModal from './components/ui/QuoteModal';
import AdminLoginModal from './components/ui/AdminLoginModal';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard';
import { useUIStore } from './store/useUIStore';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const { isAdmin } = useUIStore();
  const location = useLocation();
  const siteUrl = 'https://donpack.in';

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-slate-900 font-sans">
      <Helmet>
        <title>DonPack Adhesives | Advanced Adhesive Solutions</title>
        <meta name="description" content="DONPACK ADHESIVES delivers innovative, high-performance hot-melt technology tailored for demanding industrial and packaging applications worldwide." />
        <link rel="canonical" href={`${siteUrl}${location.pathname}`} />
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
