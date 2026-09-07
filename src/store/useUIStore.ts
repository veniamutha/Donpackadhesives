import { create } from 'zustand';

interface UIStore {
  isQuoteModalOpen: boolean;
  setQuoteModalOpen: (isOpen: boolean) => void;
  isAdmin: boolean;
  setAdmin: (isAdmin: boolean) => void;
  isAdminLoginModalOpen: boolean;
  setAdminLoginModalOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isQuoteModalOpen: false,
  setQuoteModalOpen: (isOpen) => set({ isQuoteModalOpen: isOpen }),
  isAdmin: false,
  setAdmin: (isAdmin) => set({ isAdmin }),
  isAdminLoginModalOpen: false,
  setAdminLoginModalOpen: (isOpen) => set({ isAdminLoginModalOpen: isOpen }),
}));
