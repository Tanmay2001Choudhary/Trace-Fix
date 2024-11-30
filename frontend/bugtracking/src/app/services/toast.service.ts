import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastSubject = new BehaviorSubject<Toast[]>(this.toasts);

  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error') {
    const newToast: Toast = { message, type };
    this.toasts.push(newToast);
    this.toastSubject.next(this.toasts);

    setTimeout(() => {
      this.removeToast(newToast);
    }, 3000); // Adjust time as needed
  }

  private removeToast(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
    this.toastSubject.next(this.toasts);
  }
}
