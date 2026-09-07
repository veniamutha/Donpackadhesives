import { useState } from 'react';
import { X, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';

export default function AdminLoginModal() {
  const { isAdminLoginModalOpen, setAdminLoginModalOpen, setAdmin } = useUIStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '12345') {
      setAdmin(true);
      setAdminLoginModalOpen(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleClose = () => {
    setAdminLoginModalOpen(false);
    setPassword('');
    setError(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
          onClick={handleClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
        >
          <div className="bg-brand-navy p-6 text-white flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-3">
              <Lock className="w-6 h-6 text-brand-green" />
              <h2 className="text-xl font-bold">Admin Access</h2>
            </div>
            <button 
              onClick={handleClose}
              className="relative z-10 text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          </div>

          <form onSubmit={handleLogin} className="p-6">
            <p className="text-slate-600 mb-6 text-sm">
              Please enter the administrative password to access the dashboard.
            </p>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-brand-green focus:border-brand-green'} transition-colors`}
                placeholder="Enter password"
              />
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium"
                >
                  <AlertCircle className="w-4 h-4" /> Incorrect password
                </motion.p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-brand-navy hover:bg-slate-800 text-white rounded-lg font-bold transition-colors shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
