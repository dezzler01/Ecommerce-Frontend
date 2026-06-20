import { Injectable, signal } from '@angular/core';

export interface AlertConfig {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  isOpen = signal<boolean>(false);
  title = signal<string>('');
  message = signal<string>('');
  type = signal<'success' | 'error' | 'info' | 'warning'>('success');
  confirmText = signal<string>('OK');
  cancelText = signal<string | null>(null);
  
  private onConfirmCallback: (() => void) | null = null;
  private onCancelCallback: (() => void) | null = null;

  showAlert(config: AlertConfig): void {
    this.title.set(config.title);
    this.message.set(config.message);
    this.type.set(config.type || 'success');
    this.confirmText.set(config.confirmText || 'OK');
    this.cancelText.set(config.cancelText || null);
    this.onConfirmCallback = config.onConfirm || null;
    this.onCancelCallback = config.onCancel || null;
    this.isOpen.set(true);
  }

  confirm(): void {
    this.isOpen.set(false);
    if (this.onConfirmCallback) {
      this.onConfirmCallback();
      this.onConfirmCallback = null;
    }
  }

  cancel(): void {
    this.isOpen.set(false);
    if (this.onCancelCallback) {
      this.onCancelCallback();
      this.onCancelCallback = null;
    }
  }
}
