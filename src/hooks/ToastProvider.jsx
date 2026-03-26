import { createContext, useContext, ReactNode } from 'react';
import { useToast, ToastContainer, ToastType } from './useToast'; const ToastContext = createContext(undefined); export const ToastProvider = ({ children }) => { const { toasts, showToast, showSuccess, showError, showWarning, removeToast } = useToast(); return ( {children} );
}; export const useAppToast = ()=> { const context = useContext(ToastContext); if (!context) { throw new Error('useAppToast must be used within ToastProvider'); } return context;
