import { Injectable, inject, signal, effect } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';

export interface AppNotification {
  id: string;
  type: string;
  message: string;
  orderId?: string;
  orderNumber?: string;
  code?: string;
  status?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private authService = inject(AuthService);
  private hubConnection: signalR.HubConnection | null = null;

  activeToasts = signal<AppNotification[]>([]);
  hasNewOrders = signal<boolean>(false);

  constructor() {
    // Re-establish connection or disconnect based on user authentication lifecycle
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.startConnection();
      } else {
        this.stopConnection();
      }
    });
  }

  private startConnection() {
    if (this.hubConnection) {
      return;
    }

    const token = this.authService.getToken();
    
    // Build connection with JWT query token parameter
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5153/api/notification-hub', {
        accessTokenFactory: () => token || '',
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR NotificationHub connected successfully.');
        
        // If user has admin capabilities, request the hub to join them to the Admin group
        const hasAdminCaps = this.authService.hasPermission('Orders:Read') || 
                             this.authService.hasPermission('Products:Create') ||
                             this.authService.hasPermission('Shipping:Read');
        if (hasAdminCaps) {
          this.hubConnection?.invoke('JoinAdminGroup')
            .then(() => console.log('Successfully joined SignalR Admin group.'))
            .catch(err => console.error('Error invoking JoinAdminGroup:', err));
        }
      })
      .catch(err => console.error('Error initiating SignalR connection:', err));

    this.hubConnection.on('ReceiveNotification', (notification: any) => {
      console.log('Notification received:', notification);
      
      const newNotif: AppNotification = {
        id: crypto.randomUUID(),
        type: notification.type,
        message: notification.message,
        orderId: notification.orderId,
        orderNumber: notification.orderNumber,
        code: notification.code,
        status: notification.status,
        timestamp: new Date()
      };

      // Add to toast queue
      this.activeToasts.update(toasts => [...toasts, newNotif]);

      // Set hasNewOrders to true if an admin order notification comes in
      if (notification.type === 'NewOrder') {
        this.hasNewOrders.set(true);
      }

      // Automatically remove toast after 5 seconds
      setTimeout(() => {
        this.removeToast(newNotif.id);
      }, 5000);
    });
  }

  private stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => {
          console.log('SignalR connection closed.');
          this.hubConnection = null;
        });
    }
  }

  removeToast(id: string) {
    this.activeToasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
