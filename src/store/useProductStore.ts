import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Product = {
  id: string; // uuid
  name: string;
  apps: string[];
  desc: string;
  images: string[];
  longDesc: string;
  specs: Record<string, string>;
};

type Application = 'All' | 'Packaging' | 'Furniture' | 'Guns' | string;

interface ProductStore {
  selectedApplication: Application;
  setApplication: (app: Application) => void;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  selectedApplication: 'All',
  setApplication: (app) => set({ selectedApplication: app }),
  
  products: [],
  isLoading: true,
  error: null,
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      set({ products: data || [], isLoading: false });
    } catch (err: any) {
      console.error('Error fetching products:', err);
      set({ error: err.message || 'Failed to load products', isLoading: false });
    }
  }
}));
