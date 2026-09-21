import { Helmet } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';
import QuoteModal from './components/ui/QuoteModal';
import AdminLoginModal from './components/ui/AdminLoginModal';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard';
import { useUIStore } from './store/useUIStore';

function App() {
  const { isAdmin } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-slate-900 font-sans">
      <Helmet>
        <title>DonPack Adhesives | Advanced Adhesive Solutions</title>
        <meta name="description" content="DONPACK ADHESIVES delivers innovative, high-performance hot-melt technology tailored for demanding industrial and packaging applications worldwide." />
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
    </div>
  );
}

export default App;
