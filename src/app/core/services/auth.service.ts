import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CurrentUser {
  username: string;
  role: string;
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  username: string;
  roleName: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors: any;
}

export interface GuestCheckoutContext {
  customerName: string;
  primaryPhone: string;
  secondaryPhone?: string;
  detailedAddress: string;
  governorate: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber?: string;
  secondaryPhoneNumber?: string;
  addressDetails?: string;
  governorate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5153/api/auth';
 
  // Reactive state subjects
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userPermissionsSubject = new BehaviorSubject<string[]>([]);
 
  // Expose as public Observables
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public userPermissions$ = this.userPermissionsSubject.asObservable();
 
  constructor(private http: HttpClient) {
    this.loadSessionFromStorage();
  }
 
  /**
   * Log in user using credentials
   */
  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.isSuccess && response.data) {
          this.saveSession(response.data);
        }
      })
    );
  }
 
  /**
   * Register a new user
   */
  register(user: { fullName: string; email: string; password: string; roleId: string }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/register`, user);
  }

  /**
   * Get user profile details
   */
  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/profile`);
  }

  /**
   * Update user profile details
   */
  updateProfile(profile: UserProfile): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.apiUrl}/profile`, profile);
  }

  /**
   * Log out the current user and clear session
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_permissions');
    localStorage.removeItem('user_info');
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.userPermissionsSubject.next([]);
  }

  /**
   * Helper to retrieve active token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Helper to verify if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const permissions = this.userPermissionsSubject.value;
    return permissions.includes(permission);
  }

  /**
   * Dynamically update local session permissions in real-time
   */
  updateLocalPermissions(permissions: string[]): void {
    localStorage.setItem('user_permissions', JSON.stringify(permissions));
    
    const user = this.currentUserSubject.value;
    if (user) {
      user.permissions = permissions;
      this.currentUserSubject.next({ ...user });
    }
    this.userPermissionsSubject.next(permissions);
  }

  // --- Guest Checkout Context Management ---
  
  /**
   * Saves guest details locally for checkout convenience
   */
  saveGuestCheckoutContext(context: GuestCheckoutContext): void {
    localStorage.setItem('guest_checkout_context', JSON.stringify(context));
  }

  /**
   * Retrieves saved guest details
   */
  getGuestCheckoutContext(): GuestCheckoutContext | null {
    const contextStr = localStorage.getItem('guest_checkout_context');
    if (!contextStr) return null;
    try {
      return JSON.parse(contextStr);
    } catch {
      return null;
    }
  }

  /**
   * Clears saved guest details
   */
  clearGuestCheckoutContext(): void {
    localStorage.removeItem('guest_checkout_context');
  }

  // --- Internal Session Helpers ---

  private loadSessionFromStorage(): void {
    const token = this.getToken();
    const userInfoStr = localStorage.getItem('user_info');
    const permissionsStr = localStorage.getItem('user_permissions');

    if (token && userInfoStr && permissionsStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        const permissions = JSON.parse(permissionsStr);

        if (this.isTokenExpired(token)) {
          this.logout();
          return;
        }

        const user: CurrentUser = {
          username: userInfo.username,
          role: userInfo.role,
          permissions: permissions
        };

        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        this.userPermissionsSubject.next(permissions);
      } catch {
        this.logout();
      }
    }
  }

  private saveSession(authResponse: AuthResponse): void {
    const token = authResponse.token;
    const decoded = this.decodeToken(token);
    
    let permissions: string[] = [];
    if (decoded && decoded.permissions) {
      permissions = Array.isArray(decoded.permissions) 
        ? decoded.permissions 
        : [decoded.permissions];
    }

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_permissions', JSON.stringify(permissions));
    
    const userInfo = {
      username: authResponse.username,
      role: authResponse.roleName
    };
    localStorage.setItem('user_info', JSON.stringify(userInfo));

    const user: CurrentUser = {
      username: userInfo.username,
      role: userInfo.role,
      permissions: permissions
    };

    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.userPermissionsSubject.next(permissions);
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  }
}
