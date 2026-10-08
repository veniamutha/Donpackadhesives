import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string; // uuid
  name: string;
  apps?: string[];
  desc: string;
  images: string[];
  longDesc: string;
  specs: Record<string, string>;
  category?: string; // New category field
};

interface ProductStore {
  selectedCategory: string;
  setCategory: (cat: string) => void;
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  selectedCategory: 'All',
  setCategory: (cat) => set({ selectedCategory: cat }),
  
  products: [],
  categories: [],
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
  },
  
  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      set({ categories: data || [] });
    } catch (err: any) {
      console.error('Error fetching categories:', err);
    }
  }
}));
