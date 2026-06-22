import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  const valid = hasUpperCase && hasNumber && hasSpecial && value.length >= 8;
  return !valid ? { passwordStrength: true } : null;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div 
      *ngIf="authService.showLoginModal()" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2522]/40 backdrop-blur-md transition-all duration-500"
      (click)="closeModal()"
    >
      <!-- Modal Container: Dual-pane configuration -->
      <div 
        class="w-full max-w-4xl h-[600px] bg-[#FBF9F6]/90 border border-[#2A2522]/10 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 scale-100 backdrop-blur-md"
        [ngClass]="{ 'border-[#E07A5F]/20': isRegister() }"
        (click)="$event.stopPropagation()"
      >
        <!-- Left Cinematic Pane -->
        <div class="hidden md:block w-1/2 relative bg-black select-none pointer-events-none">
          <video 
            #loginVideo
            src="/logo_reveal.mp4" 
            autoplay 
            loop 
            [muted]="true"
            playsinline 
            class="absolute inset-0 w-full h-full object-cover"
          ></video>
          <!-- Vignette overlay to anchor luxury typography -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          <!-- Brand Overlaid content -->
          <div class="absolute bottom-12 left-10 right-10 z-10 text-left">
            <h1 class="text-3xl font-serif text-[#FBF9F6] tracking-[0.25em] uppercase font-light leading-none mb-3">
              Picks & More
            </h1>
            <div class="w-12 h-[1px] bg-[#E07A5F] mb-4"></div>
            <p class="text-xs text-[#EEDFD2]/80 uppercase tracking-[0.2em] font-medium leading-relaxed">
              Curated with intention.<br/>
              Crafted for refined styles.
            </p>
          </div>
        </div>

        <!-- Right Form Pane -->
        <div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-[#FBF9F6]/95">
          <!-- Top aesthetic accent bar -->
          <div 
            class="absolute top-0 left-0 right-0 h-[3px] transition-all duration-300"
            [style.background-color]="isRegister() ? '#E07A5F' : '#8A817C'"
          ></div>

          <!-- Close Button -->
          <button 
            (click)="closeModal()" 
            class="absolute top-6 right-6 text-[#8A817C] hover:text-[#2A2522] transition-colors p-1"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="space-y-6">
            <!-- Header -->
            <div class="text-left">
              <h2 class="text-2xl font-light tracking-[0.15em] text-[#2A2522] uppercase">
                {{ isRegister() ? 'Create Account' : 'Welcome Back' }}
              </h2>
              <p class="text-[10px] text-[#8A817C] tracking-widest uppercase mt-2 leading-relaxed">
                {{ isRegister() ? 'Join our curated shopping journey' : 'Sign in to access your custom profile' }}
              </p>
            </div>

            <!-- Status Messages -->
            <div 
              *ngIf="message()" 
              class="p-4 rounded-lg text-xs tracking-wider border transition-all duration-300 animate-fade-in"
              [ngClass]="{
                'bg-emerald-50 text-emerald-800 border-emerald-200': isSuccess(),
                'bg-red-50 text-red-800 border-red-200 animate-shake-error': !isSuccess()
              }"
            >
              {{ message() }}
            </div>

            <!-- Form -->
            <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <!-- Name Field (Register Only) -->
              <div *ngIf="isRegister()" class="space-y-1.5 animate-slide-down">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8A817C] block">Full Name</label>
                <input 
                  type="text" 
                  formControlName="fullName"
                  placeholder="Alexander Mercer"
                  class="w-full px-4 py-3 bg-[#FBF9F6]/50 border rounded-lg text-sm text-[#2A2522] placeholder-[#8A817C]/40 focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-[#E07A5F] transition-all duration-300"
                  [ngClass]="isFieldInvalid('fullName') ? 'border-red-400' : 'border-[#2A2522]/10'"
                />
                <span *ngIf="isFieldInvalid('fullName')" class="text-[10px] text-red-500 block mt-1">
                  Full Name is required and must be at least 3 characters.
                </span>
              </div>

              <!-- Email Field -->
              <div class="space-y-1.5">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8A817C] block">Email Address</label>
                <input 
                  type="email" 
                  formControlName="email"
                  placeholder="name@example.com"
                  class="w-full px-4 py-3 bg-[#FBF9F6]/50 border rounded-lg text-sm text-[#2A2522] placeholder-[#8A817C]/40 focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-[#E07A5F] transition-all duration-300"
                  [ngClass]="isFieldInvalid('email') ? 'border-red-400' : 'border-[#2A2522]/10'"
                />
                <span *ngIf="isFieldInvalid('email')" class="text-[10px] text-red-500 block mt-1">
                  Please enter a valid email address.
                </span>
              </div>

              <!-- Password Field -->
              <div class="space-y-1.5">
                <label class="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8A817C] block">Password</label>
                <input 
                  type="password" 
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-3 bg-[#FBF9F6]/50 border rounded-lg text-sm text-[#2A2522] placeholder-[#8A817C]/40 focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-[#E07A5F] transition-all duration-300"
                  [ngClass]="isFieldInvalid('password') ? 'border-red-400' : 'border-[#2A2522]/10'"
                />
                <span *ngIf="isFieldInvalid('password')" class="text-[10px] text-red-500 block mt-1 leading-relaxed">
                  Password must be at least 8 characters with a capital letter, a number, and a special character.
                </span>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                [disabled]="loading() || authForm.invalid && (authForm.touched || isRegister())"
                class="w-full py-3.5 mt-4 bg-[#2A2522] hover:bg-[#E07A5F] active:scale-[0.98] text-[#FBF9F6] text-xs font-semibold tracking-[0.2em] uppercase rounded-xl shadow-md hover:shadow-lg hover:shadow-[#E07A5F]/15 transition-all duration-300 disabled:opacity-55 flex justify-center items-center gap-2"
              >
                <span *ngIf="loading()" class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                {{ loading() ? 'Processing...' : (isRegister() ? 'Register' : 'Sign In') }}
              </button>
            </form>
          </div>

          <!-- Toggle Mode -->
          <div class="mt-6 pt-6 border-t border-[#2A2522]/5 text-center">
            <p class="text-xs text-[#8A817C] tracking-wide">
              {{ isRegister() ? 'Already have an account?' : "Don't have an account?" }}
              <button 
                type="button" 
                (click)="toggleMode()"
                class="text-[#E07A5F] hover:text-[#2A2522] font-semibold transition-colors ml-1 uppercase tracking-widest text-[10px]"
              >
                {{ isRegister() ? 'Sign In' : 'Register' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0px 1000px #FBF9F6 inset !important;
      -webkit-text-fill-color: #2A2522 !important;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shakeError {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-4px); }
      40%, 80% { transform: translateX(4px); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-slide-down {
      animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-shake-error {
      animation: shakeError 0.4s ease-in-out;
    }
  `]
})
export class LoginComponent implements AfterViewInit {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  @ViewChild('loginVideo') loginVideoRef!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    // Force mute programmatically — some browsers ignore the HTML muted attribute
    const vid = this.loginVideoRef?.nativeElement;
    if (vid) {
      vid.muted = true;
      vid.volume = 0;
    }
  }

  // Constants
  readonly CUSTOMER_ROLE_ID = 'c3b07384-d113-40e1-a3f2-861f2113d077';
  readonly ADMIN_ROLE_ID = 'a3b07384-d113-40e1-a3f2-861f2113d077';

  // Component states
  isRegister = signal<boolean>(false);
  loading = signal<boolean>(false);
  message = signal<string>('');
  isSuccess = signal<boolean>(false);

  // Form Group definitions
  authForm = this.fb.group({
    fullName: ['', []], // Clear validators initially as component starts in Login mode
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordValidator]]
  });

  toggleMode() {
    const nextVal = !this.isRegister();
    this.isRegister.set(nextVal);
    this.message.set('');
    this.authForm.reset();
    
    // Configure validation rules contextually based on mode
    const nameControl = this.authForm.get('fullName');
    if (nextVal) {
      nameControl?.setValidators([Validators.required, Validators.minLength(3)]);
    } else {
      nameControl?.clearValidators();
    }
    nameControl?.updateValueAndValidity();
  }

  closeModal() {
    this.authService.showLoginModal.set(false);
    this.isRegister.set(false);
    this.message.set('');
    this.authForm.reset();
    
    // Clear name validators since we default back to login mode on close
    const nameControl = this.authForm.get('fullName');
    nameControl?.clearValidators();
    nameControl?.updateValueAndValidity();
  }

  isFieldInvalid(name: string): boolean {
    const control = this.authForm.get(name);
    if (!control) return false;
    
    // Ignore validation for fullName in login mode
    if (name === 'fullName' && !this.isRegister()) {
      return false;
    }
    
    return control.invalid && control.touched;
  }

  decodeToken(token: string): any {
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

  onSubmit() {
    // Trigger validation styling
    this.authForm.markAllAsTouched();

    if (this.authForm.invalid && (this.authForm.touched || this.isRegister())) {
      this.isSuccess.set(false);
      this.message.set('Please resolve all validation errors in the form.');
      return;
    }

    const email = this.authForm.get('email')?.value ?? '';
    const password = this.authForm.get('password')?.value ?? '';
    const fullName = this.authForm.get('fullName')?.value ?? '';

    this.message.set('');
    this.loading.set(true);

    if (this.isRegister()) {
      const payload = {
        fullName,
        email,
        password,
        roleId: this.CUSTOMER_ROLE_ID
      };

      this.authService.register(payload).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.isSuccess.set(true);
            this.message.set('Registration successful! Autologging in...');
            
            // Auto login on successful registration
            setTimeout(() => {
              this.authService.login({ email, password }).subscribe({
                next: (loginRes) => {
                  this.loading.set(false);
                  if (loginRes.isSuccess) {
                    this.handleRoleBasedRouting(loginRes.data.token);
                  } else {
                    this.isRegister.set(false);
                    this.message.set('Registration completed. Please sign in.');
                  }
                },
                error: () => {
                  this.loading.set(false);
                  this.isRegister.set(false);
                  this.message.set('Registration completed. Please sign in.');
                }
              });
            }, 1000);
          } else {
            this.loading.set(false);
            this.isSuccess.set(false);
            this.message.set(res.message || 'Registration failed.');
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.isSuccess.set(false);
          this.message.set(err?.error?.message || 'Server error. Please try again.');
        }
      });
    } else {
      this.authService.login({ email, password }).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.isSuccess) {
            this.isSuccess.set(true);
            this.message.set('Login successful!');
            setTimeout(() => {
              this.handleRoleBasedRouting(res.data.token);
            }, 500);
          } else {
            this.isSuccess.set(false);
            this.message.set(res.message || 'Invalid email or password.');
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.isSuccess.set(false);
          this.message.set(err?.error?.message || 'Authentication failed.');
        }
      });
    }
  }

  private handleRoleBasedRouting(token: string) {
    const decoded = this.decodeToken(token);
    const role = decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    
    // Clean up modal states
    this.closeModal();
    
    if (role === 'Admin') {
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
