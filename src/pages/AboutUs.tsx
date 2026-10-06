import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <div className="bg-white min-h-[calc(100vh-64px)] pt-8">
      <section id="about" className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 lg:px-24 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-brand-navy mb-6">About DONPACK ADHESIVES</h2>
          
          <p className="text-slate-600 mb-4 leading-relaxed">
            Welcome to Donpack, your trusted partner in advanced industrial bonding solutions. Headquartered in Chennai, we are premier importers and suppliers of high-grade hot melt adhesives, engineered to meet the demanding performance standards of modern, high-speed manufacturing environments.
          </p>
          
          <p className="text-slate-600 mb-12 leading-relaxed">
            With a deep understanding of diverse industrial workflows, we supply versatile, reliable, and premium-quality hot melt formulations designed to ensure seamless production lines and superior structural integrity for our clients across India.
          </p>

          <h3 className="text-xl font-bold text-brand-navy mb-4 border-b pb-2 border-slate-100">Why Choose Donpack?</h3>
          <ul className="list-disc pl-6 text-slate-600 space-y-3 mb-12">
            <li><strong className="text-brand-navy">Global Quality Standards:</strong> Sourced from world-class manufacturers to guarantee optimal thermal stability, precise open times, and exceptional bond strength.</li>
            <li><strong className="text-brand-navy">Industry-Wide Versatility:</strong> A comprehensive portfolio capable of handling challenging surfaces, low-energy materials, and varying application machinery speeds.</li>
            <li><strong className="text-brand-navy">Strategic Hub & Reliability:</strong> Centrally positioned in Chennai, we offer efficient inventory management and dependable distribution to keep your industrial operations running without interruption.</li>
          </ul>

          <h3 className="text-xl font-bold text-brand-navy mb-4 border-b pb-2 border-slate-100">Our Location</h3>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 bg-slate-200 relative">
              <iframe 
                src="https://maps.google.com/maps?q=42A%2C%20Duraisamy%20Street%2C%202nd%20Main%20Rd%2C%20Rajiv%20Nagar%2C%20Vanagaram%2C%20Chennai%2C%20Adayalampattu%2C%20Tamil%20Nadu%20600077&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
                title="Donpack Adhesives Location Map"
              ></iframe>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-slate-600">
                <strong>Donpack Adhesives</strong><br/>
                42A, Duraisamy Street, 2nd Main Rd<br/>
                Rajiv Nagar, Vanagaram, Chennai
              </div>
              <a 
                href="https://maps.app.goo.gl/muVbU3q7NNmnQhFFA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-green text-brand-navy font-semibold px-6 py-3 rounded-full hover:bg-[#86efac] hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Get Directions
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
