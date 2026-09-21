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
          <ul className="list-disc pl-6 text-slate-600 space-y-3">
            <li><strong className="text-brand-navy">Global Quality Standards:</strong> Sourced from world-class manufacturers to guarantee optimal thermal stability, precise open times, and exceptional bond strength.</li>
            <li><strong className="text-brand-navy">Industry-Wide Versatility:</strong> A comprehensive portfolio capable of handling challenging surfaces, low-energy materials, and varying application machinery speeds.</li>
            <li><strong className="text-brand-navy">Strategic Hub & Reliability:</strong> Centrally positioned in Chennai, we offer efficient inventory management and dependable distribution to keep your industrial operations running without interruption.</li>
          </ul>
        </motion.div>
      </section>
    </div>
  );
}
