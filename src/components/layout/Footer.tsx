import { Mail, Phone, MapPin, Clock, ExternalLink, Lock } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export default function Footer() {
  const { setAdminLoginModalOpen } = useUIStore();

  return (
    <footer className="bg-brand-navy text-white pt-12 sm:pt-16 pb-24 md:pb-12 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="flex flex-col items-start">
          <div className="bg-white p-3 rounded-2xl inline-flex items-center justify-center mb-6 shadow-xl shadow-black/20">
            <img src="/logo.jpg" alt="DonPack Adhesive Logo" className="h-16 w-16 object-contain" onError={(e) => { e.currentTarget.src = '/logo.png'; }} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            DONPACK <span className="text-brand-green">ADHESIVE</span>
          </h2>
          <p className="text-slate-300 max-w-sm leading-relaxed mb-6">
            Premier importers and suppliers of high-grade hot melt adhesives, engineered to meet the demanding performance standards of modern, high-speed manufacturing environments.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-4 text-slate-300">
            <li><a href="#home" className="hover:text-brand-green transition-colors">Home</a></li>
            <li><a href="#products" className="hover:text-brand-green transition-colors">Products</a></li>
            <li><a href="#solutions" className="hover:text-brand-green transition-colors">Industry Solutions</a></li>
            <li><a href="#about" className="hover:text-brand-green transition-colors">About Us</a></li>
            <li>
              <a href="https://www.indiamart.com/donpack/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-green transition-colors">
                IndiaMART Profile <ExternalLink className="w-4 h-4" />
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <span>
                42A, Duraisamy Street, 2nd Main Rd<br />
                Rajiv Nagar, Vanagaram, Chennai<br />
                Adayalampattu, Tamil Nadu 600077, India
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-green shrink-0" />
              <span>+91 97874 65677</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-green shrink-0" />
              <a href="mailto:sales@donpack.in" className="hover:text-brand-green transition-colors">sales@donpack.in</a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand-green shrink-0" />
              <span>10:00 - 18:30</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Donpack Adhesive. All rights reserved.</p>
        <div className="flex gap-6 items-center">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <button 
            onClick={() => setAdminLoginModalOpen(true)}
            className="opacity-10 hover:opacity-50 transition-opacity ml-4"
            title="Admin Login"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
