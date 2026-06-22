import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface AppNotification {
  id: string;
  userId?: string;
  title?: string;
  message: string;
  type: string;
  isRead?: boolean;
  relatedEntityId?: string;
  createdAt?: string | Date;
  orderId?: string;
  orderNumber?: string;
  code?: string;
  status?: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private hubConnection: signalR.HubConnection | null = null;

  activeToasts = signal<AppNotification[]>([]);
  notifications = signal<AppNotification[]>([]);
  unreadCount = signal<number>(0);
  hasNewOrders = signal<boolean>(false);

  constructor() {
    // Re-establish connection or disconnect based on user authentication lifecycle
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.startConnection();
        this.loadNotifications();
        this.loadUnreadCount();
      } else {
        this.stopConnection();
        this.notifications.set([]);
        this.unreadCount.set(0);
      }
    });
  }

  // Load user notifications from DB
  loadNotifications() {
    this.http.get<any>(`${environment.apiUrl}/api/notifications`).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.notifications.set(res.data);
        }
      }
    });
  }

  // Load unread count from DB
  loadUnreadCount() {
    this.http.get<any>(`${environment.apiUrl}/api/notifications/unread-count`).subscribe({
      next: (res) => {
        if (res.isSuccess && typeof res.data === 'number') {
          this.unreadCount.set(res.data);
        }
      }
    });
  }

  // Mark single notification as read
  markAsRead(id: string) {
    this.http.post<any>(`${environment.apiUrl}/api/notifications/${id}/read`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.notifications.update(list => 
            list.map(n => n.id === id ? { ...n, isRead: true } : n)
          );
          this.loadUnreadCount();
        }
      }
    });
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.http.post<any>(`${environment.apiUrl}/api/notifications/read-all`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.notifications.update(list => 
            list.map(n => ({ ...n, isRead: true }))
          );
          this.unreadCount.set(0);
        }
      }
    });
  }

  // Admin: Get subscriptions list
  getSubscriptions(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/admin/notifications/subscriptions`);
  }

  // Admin: Toggle subscription
  updateSubscription(userId: string, isSubscribed: boolean): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/admin/notifications/subscriptions`, {
      userId,
      isSubscribed
    });
  }

  private startConnection() {
    if (this.hubConnection) {
      return;
    }

    const token = this.authService.getToken();
    
    // Build connection with JWT query token parameter
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/api/notification-hub`, {
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
        id: notification.id || crypto.randomUUID(),
        userId: notification.userId,
        title: notification.title || 'New Alert',
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead || false,
        relatedEntityId: notification.relatedEntityId || notification.orderId,
        createdAt: notification.createdAt || new Date(),
        orderId: notification.orderId,
        orderNumber: notification.orderNumber,
        code: notification.code,
        status: notification.status
      };

      // Append to the notifications list signal
      this.notifications.update(list => [newNotif, ...list]);
      this.unreadCount.update(c => c + 1);

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
