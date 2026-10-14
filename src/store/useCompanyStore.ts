import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface CompanyInfo {
  id: string;
  phone: string;
  phone2?: string;
  email: string;
  address: string;
  working_hours: string;
  about_us: string;
}

const defaultInfo: CompanyInfo = {
  id: 'default',
  phone: '+91 98944 14285',
  phone2: '+91 97874 65677',
  email: 'sales@donpack.in',
  address: '42A, Duraisamy Street, 2nd Main Rd\nRajiv Nagar, Vanagaram, Chennai\nAdayalampattu, Tamil Nadu 600077, India',
  working_hours: '10:00 - 18:30',
  about_us: `<p>Welcome to Donpack, your trusted partner in advanced industrial bonding solutions. Headquartered in Chennai, we are premier importers and suppliers of high-grade hot melt adhesives, engineered to meet the demanding performance standards of modern, high-speed manufacturing environments.</p>
<p><br></p>
<p>With a deep understanding of diverse industrial workflows, we supply versatile, reliable, and premium-quality hot melt formulations designed to ensure seamless production lines and superior structural integrity for our clients across India.</p>
<p><br></p>
<h3><strong>Why Choose Donpack?</strong></h3>
<ul>
  <li><strong>Global Quality Standards:</strong> Sourced from world-class manufacturers to guarantee optimal thermal stability, precise open times, and exceptional bond strength.</li>
  <li><strong>Industry-Wide Versatility:</strong> A comprehensive portfolio capable of handling challenging surfaces, low-energy materials, and varying application machinery speeds.</li>
  <li><strong>Strategic Hub &amp; Reliability:</strong> Centrally positioned in Chennai, we offer efficient inventory management and dependable distribution to keep your industrial operations running without interruption.</li>
</ul>`,
};

interface CompanyStore {
  info: CompanyInfo;
  isLoading: boolean;
  error: string | null;
  fetchInfo: () => Promise<void>;
  updateInfo: (info: Partial<CompanyInfo>) => Promise<void>;
}

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  info: defaultInfo,
  isLoading: false,
  error: null,
  fetchInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.from('company_info').select('*').limit(1).maybeSingle();
      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist, use default
          set({ isLoading: false });
          return;
        }
        throw error;
      }
      if (data) {
        set({ info: { ...defaultInfo, ...data } });
      }
    } catch (err: any) {
      console.warn('Could not fetch company info, using defaults:', err.message);
      // Don't throw error to UI, just use defaults
    } finally {
      set({ isLoading: false });
    }
  },
  updateInfo: async (newInfo) => {
    set({ isLoading: true, error: null });
    try {
      const current = get().info;
      const updated = { ...current, ...newInfo };
      
      // We assume the table exists when they try to save
      const { data: existingData } = await supabase.from('company_info').select('id').limit(1).maybeSingle();
      
      let error;
      if (existingData) {
        const res = await supabase.from('company_info').update(updated).eq('id', existingData.id).select();
        error = res.error;
        if (!error && (!res.data || res.data.length === 0)) {
          throw new Error('Update failed. No rows were changed (check Supabase RLS policies).');
        }
      } else {
        const res = await supabase.from('company_info').insert([updated]).select();
        error = res.error;
        if (!error && (!res.data || res.data.length === 0)) {
          throw new Error('Insert failed. No rows were changed (check Supabase RLS policies).');
        }
      }

      if (error) {
        if (error.message?.includes("about_us") || error.message?.includes("phone2") || (error.message?.includes("schema cache") && error.message?.includes("column"))) {
          throw new Error("A column may be missing in your Supabase table. Please run the SQL in 'supabase_company_info.sql' in your Supabase SQL Editor: ALTER TABLE company_info ADD COLUMN IF NOT EXISTS phone2 text NOT NULL DEFAULT ''; NOTIFY pgrst, 'reload schema';");
        }
        throw error;
      }
      set({ info: updated });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }
}));
