import { Mail, Phone, MapPin, Clock, ExternalLink, Lock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';
import { useCompanyStore } from '../../store/useCompanyStore';
import { useProductStore } from '../../store/useProductStore';

export default function Footer() {
  const { setAdminLoginModalOpen } = useUIStore();
  const { info } = useCompanyStore();
  const { categories } = useProductStore();

  return (
    <footer className="bg-brand-navy text-white pt-12 sm:pt-16 pb-24 md:pb-12 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="flex flex-col items-start md:col-span-2">
          <div className="bg-white p-3 rounded-2xl inline-flex items-center justify-center mb-6 shadow-xl shadow-black/20">
            <img src="/logo.jpg" alt="DonPack Adhesives Logo" className="h-16 w-16 object-contain" onError={(e) => { e.currentTarget.src = '/logo.png'; }} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            DONPACK <span className="text-brand-red">ADHESIVES</span>
          </h2>
          <p className="text-slate-300 max-w-sm leading-relaxed mb-6">
            Premier importers and suppliers of high-grade hot melt adhesives, engineered to meet the demanding performance standards of modern, high-speed manufacturing environments.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-4 text-slate-300">
            <li><Link to="/" className="hover:text-brand-red transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-red" /> Home</Link></li>
            <li><Link to="/products" className="hover:text-brand-red transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-red" /> Products</Link></li>
            <li><Link to="/about" className="hover:text-brand-red transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-red" /> About Us</Link></li>
            <li>
              <a href="https://www.indiamart.com/donpack/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-red transition-colors">
                <ChevronRight className="w-4 h-4 text-brand-red" /> IndiaMART Profile <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </li>
          </ul>
        </div>

        {/* Products Column */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Products</h3>
          <ul className="space-y-4 text-slate-300">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link to={`/products?category=${encodeURIComponent(cat.name)}`} className="hover:text-brand-red transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-brand-red" /> {cat.name}
                </Link>
              </li>
            ))}
            {categories.length === 0 && (
              <li><Link to="/products" className="hover:text-brand-red transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-red" /> Hot Melt Adhesives</Link></li>
            )}
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">
                {info.address}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-red shrink-0" />
              <span>{info.phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-red shrink-0" />
              <a href={`mailto:${info.email}`} className="hover:text-brand-red transition-colors">{info.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand-red shrink-0" />
              <span>{info.working_hours}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Donpack Adhesives. All rights reserved.</p>
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
