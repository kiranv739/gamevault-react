import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],
  dismissToast: (id) => set((state) => ({
    toasts: state.toasts.filter((toast) => toast.id !== id)
  })),
  showToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const safeMessage = typeof message === 'string'
      ? message
      : (typeof message?.msg === 'string' ? message.msg : 'Something went wrong');
    set((state) => ({
      toasts: [...state.toasts, { id, message: safeMessage, type }]
    }));
    setTimeout(() => {
      get().dismissToast(id);
    }, 3000);
  }
}));
