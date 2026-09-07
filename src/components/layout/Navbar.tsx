import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export default function Navbar() {
  const { setQuoteModalOpen } = useUIStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-brand-bg shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="DonPack Logo" className="h-10 w-auto object-contain" />
          <span className="font-bold text-xl ml-2 text-brand-navy uppercase tracking-wide">
            DonPack Adhesive
          </span>
        </a>
        
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <a href="#home" className="hover:text-brand-navy transition-colors">Home</a>
          <a href="#products" className="hover:text-brand-navy transition-colors">Products</a>
          <a href="#solutions" className="hover:text-brand-navy transition-colors">Solutions</a>
          <a href="#about" className="hover:text-brand-navy transition-colors">About Us</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setQuoteModalOpen(true)}
            className="bg-brand-navy hover:bg-slate-800 text-white px-3 sm:px-5 py-2 rounded text-sm sm:text-base font-medium transition-colors"
          >
            Get a Quote
          </button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-brand-navy transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full left-0">
          <div className="flex flex-col px-4 py-4 gap-4 font-medium text-slate-600">
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-navy transition-colors block py-2">Home</a>
            <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-navy transition-colors block py-2">Products</a>
            <a href="#solutions" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-navy transition-colors block py-2">Solutions</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-navy transition-colors block py-2">About Us</a>
          </div>
        </div>
      )}
    </nav>
  );
}
