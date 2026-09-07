import { Helmet } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';
import QuoteModal from './components/ui/QuoteModal';
import AdminLoginModal from './components/ui/AdminLoginModal';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { useUIStore } from './store/useUIStore';

function App() {
  const { isAdmin } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-slate-900 font-sans">
      <Helmet>
        <title>DonPack Adhesive | Advanced Adhesive Solutions</title>
        <meta name="description" content="DONPACK ADHESIVE delivers innovative, high-performance hot-melt technology tailored for demanding industrial and packaging applications worldwide." />
      </Helmet>
      
      {!isAdmin ? (
        <>
          <Navbar />
          <main className="flex-1">
            <Home />
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
