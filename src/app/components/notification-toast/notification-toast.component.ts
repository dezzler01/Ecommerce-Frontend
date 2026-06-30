import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 right-6 z-50 flex flex-col gap-4 w-80 pointer-events-none select-none">
      <div 
        *ngFor="let toast of activeToasts()"
        class="pointer-events-auto select-text frosted-toast animate-toast-in"
        (click)="dismiss(toast.id)"
      >
        <!-- Top accent ribbon (very subtle grey/umber luxury color indicator) -->
        <div class="toast-accent" [ngClass]="getAccentClass(toast.type)"></div>
        
        <div class="p-4 flex justify-between items-start gap-3">
          <div class="flex-1 space-y-1 text-left">
            <span class="tracking-widest font-mono text-[8px] uppercase font-bold text-[var(--color-coral)] block">
              {{ getToastTitle(toast.type) }}
            </span>
            <p class="text-[11px] font-medium leading-relaxed text-[var(--text-charcoal)]">
              {{ toast.message }}
            </p>
            <span class="text-[8px] text-[#8A817C]/60 font-mono block mt-1">
              {{ toast.timestamp | date:'HH:mm:ss' }}
            </span>
          </div>
          <button (click)="dismiss(toast.id); $event.stopPropagation()" class="text-[var(--text-charcoal)]/30 hover:text-[var(--color-coral)] text-[10px] transition-colors p-0.5">
            ✕
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .frosted-toast {
      background: rgba(255, 255, 255, 0.90);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(42, 37, 34, 0.06);
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(42, 37, 34, 0.08);
      font-family: var(--font-heading), sans-serif;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      will-change: transform, opacity;
    }
    
    .frosted-toast:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(42, 37, 34, 0.12);
      border-color: rgba(224, 122, 95, 0.25);
    }

    .toast-accent {
      height: 3px;
      width: 100%;
      background-color: #8A817C;
    }
    
    .accent-neworder {
      background: linear-gradient(to right, #F4A261, #E76F51);
    }
    
    .accent-status {
      background: linear-gradient(to right, var(--color-lavender), #E76F51);
    }
    
    .accent-promo {
      background: linear-gradient(to right, #1F85A0, #F4A261);
    }

    @keyframes toastIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .animate-toast-in {
      animation: toastIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }
  `]
})
export class NotificationToastComponent {
  private notifService = inject(NotificationService);
  activeToasts = this.notifService.activeToasts;

  dismiss(id: string) {
    this.notifService.removeToast(id);
  }

  getAccentClass(type: string): string {
    switch (type) {
      case 'NewOrder': return 'accent-neworder';
      case 'OrderStatusChanged': return 'accent-status';
      case 'PromoCodeCreated': return 'accent-promo';
      default: return '';
    }
  }

  getToastTitle(type: string): string {
    switch (type) {
      case 'NewOrder': return 'System Alert / New Acquisition';
      case 'OrderStatusChanged': return 'Fulfillment / Status Update';
      case 'PromoCodeCreated': return 'Bespoke event / promo launch';
      default: return 'Boutique Notification';
    }
  }
}
