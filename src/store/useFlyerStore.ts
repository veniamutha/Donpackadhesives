import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Flyer {
  id: string;
  title: string | null;
  image_url: string;
  created_at: string;
}

interface FlyerStore {
  flyers: Flyer[];
  isLoading: boolean;
  error: string | null;
  fetchFlyers: () => Promise<void>;
}

export const useFlyerStore = create<FlyerStore>((set) => ({
  flyers: [],
  isLoading: false,
  error: null,
  fetchFlyers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('flyers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ flyers: data as Flyer[], isLoading: false });
    } catch (err: any) {
      console.error('Error fetching flyers:', err);
      set({ error: err.message, isLoading: false });
    }
  },
}));
