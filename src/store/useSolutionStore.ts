import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Solution = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url?: string;
  image_file_path?: string;
  created_at?: string;
};

interface SolutionState {
  solutions: Solution[];
  isLoading: boolean;
  error: string | null;
  fetchSolutions: () => Promise<void>;
}

export const useSolutionStore = create<SolutionState>((set) => ({
  solutions: [],
  isLoading: false,
  error: null,
  
  fetchSolutions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('industry_solutions')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      set({ solutions: data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));
