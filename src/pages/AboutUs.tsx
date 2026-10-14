import { motion } from 'framer-motion';
import { useCompanyStore } from '../store/useCompanyStore';

export default function AboutUs() {
  const { info } = useCompanyStore();

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
          <h1 className="text-3xl font-bold text-brand-navy mb-6">About DONPACK ADHESIVES</h1>

          
          <div 
            className="mb-12 text-slate-600 leading-relaxed [&>p]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-brand-navy [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:border-b [&>h3]:pb-2 [&>h3]:border-slate-100 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-3 [&>ul]:mb-12 [&_strong]:text-brand-navy"
            dangerouslySetInnerHTML={{ __html: info.about_us || '' }}
          />

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
                <div className="mt-2 text-xs sm:text-sm text-slate-700 flex flex-col gap-0.5">
                  <a href={`tel:${(info.phone || '').replace(/[^0-9+]/g, '')}`} className="font-semibold text-brand-navy hover:text-brand-red transition-colors">
                    📞 {info.phone}
                  </a>
                  {info.phone2 && (
                    <a href={`tel:${(info.phone2 || '').replace(/[^0-9+]/g, '')}`} className="text-slate-600 hover:text-brand-red transition-colors">
                      📞 {info.phone2}
                    </a>
                  )}
                </div>
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
