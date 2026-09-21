import { ShieldCheck, Globe, Leaf, Box, Layers, ShoppingBag, BedDouble, Tag, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';

export default function Home() {
  const { setQuoteModalOpen } = useUIStore();
  return (
    <div>
      {/* Centered Full-Width Hero Section */}
      <section id="home" className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/hero_glue.png)' }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent z-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-20 pb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
          >
            Advanced Adhesive <br className="hidden sm:block" /> Solutions
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-lg sm:text-xl text-slate-100 mb-10 max-w-2xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium"
          >
            DONPACK ADHESIVES delivers innovative, high-performance hot-melt technology tailored for demanding industrial and packaging applications worldwide.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto"
          >
            <a href="#products" className="bg-brand-navy hover:bg-slate-800 text-white px-8 py-4 rounded font-bold text-lg transition-colors shadow-lg">
              Explore Products
            </a>
            <button 
              onClick={() => setQuoteModalOpen(true)}
              className="bg-brand-navy hover:bg-slate-800 text-white px-8 py-4 rounded font-bold text-lg transition-colors shadow-lg border border-brand-navy"
            >
              Get a Quote
            </button>
          </motion.div>

          {/* Feature Icons Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-base font-medium text-white/90"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-brand-green" />
              <span>Strong Bond</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-brand-green" />
              <span>Global Supply</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-brand-green" />
              <span>Sustainable</span>
            </div>
          </motion.div>
        </div>

        {/* Trust Badge (Bottom corner) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 md:px-6 md:py-4 rounded-xl shadow-2xl hidden sm:block"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-4xl drop-shadow-lg">⭐</span>
            <div>
              <p className="font-bold text-lg leading-tight drop-shadow-md">Trusted by 500+</p>
              <p className="text-sm text-white/80 font-medium">Manufacturers in India</p>
            </div>
          </div>
        </motion.div>
      </section>



      {/* Solutions Section Placeholder */}
      <section id="solutions" className="bg-brand-bg py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-24 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-6">Industry Solutions</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              We cater to a wide spectrum of industrial sectors, providing specialized adhesive solutions engineered for performance and reliability.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Solution 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=800" alt="Carton Sealing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-6 left-6 w-12 h-12 bg-brand-navy rounded-lg flex items-center justify-center shadow-lg border-2 border-white z-10">
                  <Box className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-8 pt-10">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Carton Sealing & Packaging</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  High-tack formulations ensuring secure, tamper-evident seals for boxes and heavy-duty corrugated cartons.
                </p>
              </div>
            </motion.div>

            {/* Solution 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800" alt="Laminated Packaging" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-6 left-6 w-12 h-12 bg-brand-navy rounded-lg flex items-center justify-center shadow-lg border-2 border-white z-10">
                  <Layers className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-8 pt-10">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Laminated Packaging</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Advanced bonding for mono-cartons, complex laminates, and metalized polyester (Met-Pet) substrates.
                </p>
              </div>
            </motion.div>

            {/* Solution 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1760565030346-4b947220fe3a?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Paper Bag Manufacturing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-6 left-6 w-12 h-12 bg-brand-navy rounded-lg flex items-center justify-center shadow-lg border-2 border-white z-10">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-8 pt-10">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Paper Bag Manufacturing</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Clean-running, fast-setting adhesives optimized for automated paper bag production and handle attachment.
                </p>
              </div>
            </motion.div>

            {/* Solution 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800" alt="Mattress Manufacturing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-6 left-6 w-12 h-12 bg-brand-navy rounded-lg flex items-center justify-center shadow-lg border-2 border-white z-10">
                  <BedDouble className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-8 pt-10">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Mattress Manufacturing</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Durable, flexible adhesives built to withstand the structural demands of the bedding and furniture industry.
                </p>
              </div>
            </motion.div>

            {/* Solution 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=800" alt="PET Bottle Labeling" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-6 left-6 w-12 h-12 bg-brand-navy rounded-lg flex items-center justify-center shadow-lg border-2 border-white z-10">
                  <Tag className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-8 pt-10">
                <h3 className="text-xl font-bold text-slate-800 mb-3">PET Bottle Labeling</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  High-performance labeling adhesives designed for high-speed bottling and container lines.
                </p>
              </div>
            </motion.div>

            {/* Solution 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img src="https://plus.unsplash.com/premium_photo-1726736512382-dde5c56ecdd1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRhaWx5JTIwZXNzZW50aWFsc3xlbnwwfHwwfHx8MA%3D%3D" alt="Hygiene Sectors" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-6 left-6 w-12 h-12 bg-brand-navy rounded-lg flex items-center justify-center shadow-lg border-2 border-white z-10">
                  <HeartHandshake className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-8 pt-10">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Hygiene & Custom Sectors</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Safe, reliable bonding solutions tailored for non-woven hygiene products and various multi-substrate assembly needs.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


    </div>
  );
}
