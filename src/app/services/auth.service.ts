import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService as CoreAuthService, CurrentUser, AuthResponse, ApiResponse, GuestCheckoutContext, UserProfile } from '../core/services/auth.service';

export type { CurrentUser, AuthResponse, ApiResponse, GuestCheckoutContext, UserProfile };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private coreAuth = inject(CoreAuthService);

  // Expose signals and observables for UI compatibility
  currentUser = signal<CurrentUser | null>(null);
  showLoginModal = signal<boolean>(false);
  isAuthenticated = computed(() => this.currentUser() !== null);
  isAuthenticated$ = this.coreAuth.isAuthenticated$;
  userPermissions$ = this.coreAuth.userPermissions$;

  constructor() {
    // Sync core reactive state to compatibility signals
    this.coreAuth.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.coreAuth.login(credentials);
  }

  register(user: { fullName: string; email: string; password: string; roleId: string }): Observable<ApiResponse<string>> {
    return this.coreAuth.register(user);
  }

  logout(): void {
    this.coreAuth.logout();
    this.showLoginModal.set(false);
  }

  getToken(): string | null {
    return this.coreAuth.getToken();
  }

  hasPermission(permission: string): boolean {
    return this.coreAuth.hasPermission(permission);
  }

  updateLocalPermissions(permissions: string[]): void {
    this.coreAuth.updateLocalPermissions(permissions);
  }

  // Guest Checkout context helper forwards
  saveGuestCheckoutContext(context: GuestCheckoutContext): void {
    this.coreAuth.saveGuestCheckoutContext(context);
  }

  getGuestCheckoutContext(): GuestCheckoutContext | null {
    return this.coreAuth.getGuestCheckoutContext();
  }

  clearGuestCheckoutContext(): void {
    this.coreAuth.clearGuestCheckoutContext();
  }

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.coreAuth.getProfile();
  }

  updateProfile(profile: UserProfile): Observable<ApiResponse<UserProfile>> {
    return this.coreAuth.updateProfile(profile);
  }
}
