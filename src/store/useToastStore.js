import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],
  dismissToast: (id) => set((state) => ({
    toasts: state.toasts.filter((toast) => toast.id !== id)
  })),
  showToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      get().dismissToast(id);
    }, 3000);
  }
}));
