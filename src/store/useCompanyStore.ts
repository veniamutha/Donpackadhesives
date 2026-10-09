import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface CompanyInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
}

const defaultInfo: CompanyInfo = {
  id: 'default',
  phone: '+91 97874 65677',
  email: 'sales@donpack.in',
  address: '42A, Duraisamy Street, 2nd Main Rd\nRajiv Nagar, Vanagaram, Chennai\nAdayalampattu, Tamil Nadu 600077, India',
  working_hours: '10:00 - 18:30',
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

      if (error) throw error;
      set({ info: updated });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }
}));
