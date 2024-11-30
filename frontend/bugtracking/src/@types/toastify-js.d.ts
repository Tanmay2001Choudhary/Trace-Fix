declare module 'toastify-js' {
  interface ToastifyOptions {
    text?: string;
    duration?: number;
    gravity?: 'top' | 'bottom';
    position?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    className?: string;
    close?: boolean;
    stopOnFocus?: boolean;
  }

  export default function Toastify(options: ToastifyOptions): {
    showToast: () => void;
  };
}
