import { Component, inject, AfterViewInit, PLATFORM_ID, effect, computed, signal, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../../services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { gsap } from 'gsap';
import { resolveImageUrl } from '../../core/utils/image-resolver';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header [ngClass]="headerClass">
      <div class="max-w-6xl mx-auto w-full flex justify-between items-center">
        <!-- Left/Center Zone: Logo & Core Catalog Links -->
        <div class="flex items-center gap-10">
          <!-- Logo -->
          <div [routerLink]="['/']" class="logo-container relative h-9 w-32 flex items-center justify-center cursor-pointer select-none pointer-events-auto">
            <!-- Watercolor SVG Accent -->
            <svg class="logo-svg-animate absolute inset-0 w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="nav-watercolor-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#F4A261" stop-opacity="0.85"/>
                  <stop offset="30%" stop-color="#E76F51" stop-opacity="0.95"/>
                  <stop offset="65%" stop-color="#F38E75" stop-opacity="0.88"/>
                  <stop offset="100%" stop-color="#B84F7D" stop-opacity="0.9"/>
                  <animate attributeName="x1" dur="7s" values="0%;40%;0%" repeatCount="indefinite" />
                  <animate attributeName="x2" dur="7s" values="100%;140%;100%" repeatCount="indefinite" />
                </linearGradient>
                <filter id="nav-paint-bleed">
                  <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise">
                    <animate attributeName="baseFrequency" dur="12s" values="0.014;0.017;0.014" repeatCount="indefinite" />
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                  <feGaussianBlur in="displaced" stdDeviation="1.0" />
                </filter>
              </defs>
              <g filter="url(#nav-paint-bleed)">
                <path d="M 40,88 C 110,65 230,78 350,70 C 470,62 520,78 560,88 C 575,92 570,102 555,108 C 510,128 390,122 280,128 C 170,134 90,118 45,108 C 30,105 30,92 40,88 Z" fill="url(#nav-watercolor-gradient)" />
              </g>
            </svg>
            <span class="logo-text relative z-10 text-[13px] font-black tracking-[-0.03em] text-[#1A1816] uppercase select-none font-sans">
              Picks&amp;More
            </span>
          </div>

          <!-- Core Catalog Links -->
          <nav [ngClass]="showScrolledState ? 'drop-shadow-[0_1px_2px_rgba(251,249,246,0.9)]' : 'drop-shadow-[0_1px_2px_rgba(26,24,22,0.45)]'" class="flex gap-6 text-[9px] font-extrabold uppercase tracking-[0.2em] items-center transition-all">
            <a [routerLink]="['/']" [ngClass]="linkClass('/')" class="transition-colors relative group py-1">
              Home
              <span class="absolute bottom-0 left-0 w-full h-[1px] nav-line-gradient transition-transform duration-300 origin-left" [ngClass]="isLinkActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"></span>
            </a>
            <a [routerLink]="['/products']" [queryParams]="{ target: 'Women' }" [ngClass]="linkClass('/products', 'Women')" class="transition-colors relative group py-1">
              WOMEN collection
              <span class="absolute bottom-0 left-0 w-full h-[1px] nav-line-gradient transition-transform duration-300 origin-left" [ngClass]="isLinkActive('/products', 'Women') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"></span>
            </a>
            <a [routerLink]="['/products']" [queryParams]="{ target: 'Kids' }" [ngClass]="linkClass('/products', 'Kids')" class="transition-colors relative group py-1">
              Kids collection
              <span class="absolute bottom-0 left-0 w-full h-[1px] nav-line-gradient transition-transform duration-300 origin-left" [ngClass]="isLinkActive('/products', 'Kids') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"></span>
            </a>
            <a [routerLink]="['/products']" [queryParams]="{ target: 'All' }" [ngClass]="linkClass('/products', 'All')" class="transition-colors relative group py-1">
              ALL COLLECTIONS
              <span class="absolute bottom-0 left-0 w-full h-[1px] bg-[#E07A5F] transition-transform duration-300 origin-left" [ngClass]="isLinkActive('/products', 'All') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"></span>
            </a>
          </nav>
        </div>

        <!-- Right Flex Zone: Minimalist Floating Layout -->
        <div class="flex items-center gap-6 select-none">
          <!-- Cart Wrapper with hover dropdown -->
          <div class="relative group py-1 flex items-center justify-center">
            <a [routerLink]="['/cart']" [ngClass]="linkClass('/cart')" class="transition-colors relative flex items-center justify-center h-8 w-8 rounded-full hover:bg-[#E07A5F]/10 transition-all select-none">
              <span class="relative flex items-center justify-center">
                <!-- Shopping Cart Trolley SVG Icon -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span *ngIf="cartCount() > 0" 
                      [ngClass]="{ 'badge-pop': animateBadge() }"
                      class="absolute -top-2 -right-2 neon-badge text-[7px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-white/10 z-20 transition-transform duration-300">
                  {{ cartCount() }}
                </span>
              </span>
            </a>

            <!-- Mini-Cart Dropdown -->
            <div class="absolute right-0 top-full mt-2 w-72 bg-[#0A0A0F]/85 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 text-left">
              <span class="text-[8px] font-mono tracking-widest text-[#E07A5F] uppercase font-bold block mb-3 border-b border-white/5 pb-2">Bag Preview ({{ cartCount() }})</span>
              
              <div *ngIf="cartItems().length === 0" class="py-6 text-center text-[10px] text-white/40 font-light">
                Your shopping bag is empty.
              </div>

              <div *ngIf="cartItems().length > 0" class="space-y-3 mb-4 max-h-[220px] overflow-y-auto pr-1">
                <div *ngFor="let item of latestItems()" class="flex items-center gap-3 pb-3 border-b border-white/5 last:border-b-0 last:pb-0">
                  <div class="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 border border-white/5">
                    <img *ngIf="item.imageUrl" [src]="resolveImageUrl(item.imageUrl)" [alt]="item.productName" class="w-full h-full object-cover"/>
                    <div *ngIf="!item.imageUrl" class="w-full h-full flex items-center justify-center text-[7px] text-white/30 uppercase tracking-widest font-semibold bg-white/5">No img</div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5 class="text-[10px] text-white/95 uppercase tracking-wide font-normal truncate">{{ item.productName }}</h5>
                    <div class="flex gap-1.5 text-[8px] text-white/40 font-mono mt-0.5" *ngIf="item.size || item.color">
                      <span *ngIf="item.size">S: {{ item.size }}</span>
                      <span *ngIf="item.color">C: {{ item.color }}</span>
                    </div>
                    <div class="flex justify-between items-center text-[9px] font-mono text-white/50 mt-0.5">
                      <span>Qty: {{ item.quantity }}</span>
                      <span>{{ item.unitPrice | currency:'EGP ' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-t border-white/5 pt-3 flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="text-[8px] text-white/40 uppercase tracking-wider font-semibold">Subtotal</span>
                  <span class="text-[11px] font-mono text-white/95 font-bold">{{ subtotal() | currency:'EGP ' }}</span>
                </div>
                <a 
                  [routerLink]="['/cart']" 
                  class="px-4 py-2 bg-[#E07A5F] hover:bg-[#F38E75] text-[#1A1816] text-[9px] font-extrabold uppercase tracking-widest rounded-lg transition-all shadow-[0_0_8px_rgba(224,122,95,0.3)]"
                >
                  Checkout
                </a>
              </div>
            </div>
          </div>
          

          <span [ngClass]="showScrolledState ? 'bg-[#4A4340]/25' : 'bg-[#FBF9F6]/40'" class="h-3.5 w-[1px] transition-colors"></span>
          
          <ng-container *ngIf="authService.currentUser() as user; else guestNav">
            <!-- Advanced Profile Pill with Hover Dropdown -->
            <div class="relative profile-badge-wrapper py-1">
              <!-- Pill Trigger -->
              <div 
                [ngClass]="showScrolledState ? 'profile-pill-scrolled' : ''"
                class="profile-pill-container"
              >
                <!-- Initial Avatar Circle -->
                <div class="h-5.5 w-5.5 rounded-full bg-gradient-to-tr from-[#E07A5F] to-[#B84F7D] flex items-center justify-center text-[9px] font-black text-white uppercase shadow-sm group-hover/profile:scale-105 transition-all duration-300">
                  {{ getUserInitials(user.username) }}
                </div>
                <!-- Username -->
                <span [ngClass]="showScrolledState ? 'text-[#4A4340]' : 'text-[#FBF9F6]/90'" class="font-bold tracking-[0.05em] text-[9.5px] transition-colors duration-300">
                  {{ user.username }}
                </span>
                <!-- Caret Down Icon -->
                <svg [ngClass]="showScrolledState ? 'text-[#4A4340]/60' : 'text-[#FBF9F6]/60'" class="w-2.5 h-2.5 transition-transform duration-300 dropdown-arrow" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <!-- Advanced Dropdown Panel -->
              <div class="profile-dropdown-panel">
                <!-- User Header -->
                <div class="border-b border-white/10 pb-2.5 mb-2.5">
                  <span class="text-[8px] font-mono tracking-widest text-[#E07A5F] uppercase font-bold block mb-1">Authenticated User</span>
                  <div class="text-[10px] text-white/95 font-semibold truncate">{{ user.username }}</div>
                  <div class="text-[7.5px] text-white/45 font-mono mt-0.5 tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded-sm inline-block">
                    {{ user.role || 'Patron' }}
                  </div>
                </div>

                <!-- Menu Items -->
                <div class="space-y-1">
                  <a 
                    *ngIf="showAdminLink()"
                    [routerLink]="['/admin/dashboard']"
                    class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-[9px] uppercase tracking-wider font-semibold transition-all text-left cursor-pointer"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                    Store Dashboard
                  </a>
                  <button 
                    (click)="openSettingsModal()" 
                    class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-[9px] uppercase tracking-wider font-semibold transition-all text-left"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Profile Settings
                  </button>

                  <button 
                    (click)="authService.logout()" 
                    class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-[9px] uppercase tracking-wider font-semibold transition-all text-left"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </ng-container>
          
          <ng-template #guestNav>
            <button 
              (click)="authService.showLoginModal.set(true)" 
              [ngClass]="showScrolledState ? 'nav-link-scrolled' : 'nav-link-transparent'" 
              class="font-extrabold uppercase tracking-[0.2em] text-[9px] transition-colors"
            >
              Sign In
            </button>
          </ng-template>
        </div>
      </div>
    </header>

    <!-- Premium Profile Settings Glassmorphic Modal -->
    <div 
      *ngIf="showSettingsModal()" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1816]/65 backdrop-blur-sm transition-all duration-300"
    >
      <div 
        class="w-full max-w-md bg-[#FBF9F6]/95 backdrop-blur-md border border-[#2A2522]/10 rounded-3xl p-7 shadow-2xl space-y-6 text-left relative"
      >
        <!-- Close Button -->
        <button 
          (click)="showSettingsModal.set(false)" 
          class="absolute top-4 right-4 text-[#8A817C] hover:text-[#E07A5F] text-sm p-1.5 transition-colors"
        >
          ✕
        </button>

        <!-- Header -->
        <div>
          <span class="tracking-widest font-mono text-[9px] uppercase font-bold text-[#E07A5F] block mb-1">Account settings</span>
          <h3 class="text-xl font-light text-[#2A2522] tracking-[0.03em] uppercase">Edit Profile Info</h3>
          <div class="w-12 h-[1.5px] bg-[#E07A5F] mt-2"></div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loadingProfile()" class="flex justify-center items-center py-12">
          <span class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E07A5F]"></span>
        </div>

        <!-- Error / Success Alert -->
        <div *ngIf="settingsMessage()" class="p-3 text-[10px] rounded-xl text-center font-medium" 
             [ngClass]="settingsIsError() ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'">
          {{ settingsMessage() }}
        </div>

        <!-- Profile Form -->
        <form *ngIf="!loadingProfile()" (submit)="saveSettings($event)" class="space-y-4">
          <!-- Full Name -->
          <div class="space-y-1">
            <label class="text-[9px] uppercase tracking-widest font-bold text-[#8A817C] block">Full Name</label>
            <input 
              type="text" 
              [(ngModel)]="profileData.fullName" 
              name="fullName" 
              required 
              class="w-full px-3.5 py-2.5 bg-white/70 border border-[#2A2522]/10 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#E07A5F] transition-all"
            />
          </div>

          <!-- Primary Phone -->
          <div class="space-y-1">
            <label class="text-[9px] uppercase tracking-widest font-bold text-[#8A817C] block">Primary Phone</label>
            <input 
              type="text" 
              [(ngModel)]="profileData.phoneNumber" 
              name="phoneNumber" 
              placeholder="E.g. 01001234567"
              class="w-full px-3.5 py-2.5 bg-white/70 border border-[#2A2522]/10 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#E07A5F] transition-all"
            />
          </div>

          <!-- Secondary Phone -->
          <div class="space-y-1">
            <label class="text-[9px] uppercase tracking-widest font-bold text-[#8A817C] block">Secondary Phone</label>
            <input 
              type="text" 
              [(ngModel)]="profileData.secondaryPhoneNumber" 
              name="secondaryPhoneNumber" 
              placeholder="E.g. 01229876543"
              class="w-full px-3.5 py-2.5 bg-white/70 border border-[#2A2522]/10 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#E07A5F] transition-all"
            />
          </div>

          <!-- Governorate -->
          <div class="space-y-1">
            <label class="text-[9px] uppercase tracking-widest font-bold text-[#8A817C] block">Governorate</label>
            <select 
              [(ngModel)]="profileData.governorate" 
              name="governorate" 
              required
              class="w-full px-3.5 py-2.5 bg-white/70 border border-[#2A2522]/10 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#E07A5F] transition-all"
            >
              <option value="" disabled>Select Governorate</option>
              <option value="Cairo">Cairo</option>
              <option value="Giza">Giza</option>
              <option value="Alexandria">Alexandria</option>
              <option value="Qalyubia">Qalyubia</option>
              <option value="Sharqia">Sharqia</option>
              <option value="Gharbia">Gharbia</option>
              <option value="Dakahlia">Dakahlia</option>
              <option value="Beheira">Beheira</option>
              <option value="Menofia">Menofia</option>
              <option value="Kafr El Sheikh">Kafr El Sheikh</option>
              <option value="Damietta">Damietta</option>
              <option value="Port Said">Port Said</option>
              <option value="Ismailia">Ismailia</option>
              <option value="Suez">Suez</option>
              <option value="Fayoum">Fayoum</option>
              <option value="Beni Suef">Beni Suef</option>
              <option value="Minya">Minya</option>
              <option value="Assiut">Assiut</option>
              <option value="Sohag">Sohag</option>
              <option value="Qena">Qena</option>
              <option value="Luxor">Luxor</option>
              <option value="Aswan">Aswan</option>
              <option value="Red Sea">Red Sea</option>
              <option value="New Valley">New Valley</option>
              <option value="Matrouh">Matrouh</option>
              <option value="North Sinai">North Sinai</option>
              <option value="South Sinai">South Sinai</option>
            </select>
          </div>

          <!-- Address Details -->
          <div class="space-y-1">
            <label class="text-[9px] uppercase tracking-widest font-bold text-[#8A817C] block">Detailed Address</label>
            <textarea 
              [(ngModel)]="profileData.addressDetails" 
              name="addressDetails" 
              rows="2.5" 
              placeholder="Street name, building, apartment..." 
              class="w-full px-3.5 py-2.5 bg-white/70 border border-[#2A2522]/10 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#E07A5F] transition-all"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-2">
            <button 
              type="button" 
              (click)="showSettingsModal.set(false)" 
              class="flex-1 py-2.5 border border-[#2A2522]/15 text-[#4A4340] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#2A2522]/5 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="savingProfile()" 
              class="flex-1 py-2.5 bg-[#E07A5F] hover:bg-[#2A2522] text-[#FBF9F6] text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <span *ngIf="savingProfile()" class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @keyframes badgePop {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
    .badge-pop {
      animation: badgePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .neon-badge {
      background-color: #FF0055;
      box-shadow: 0 0 10px #FF0055;
      color: #FFFFFF;
    }

    /* Custom Navbar link styles for transparent header over dark banner overlay */
    .nav-link-transparent {
      color: rgba(251, 249, 246, 0.9) !important;
      text-shadow: 0 1px 3px rgba(10, 10, 15, 0.7);
      transition: color 0.3s ease, text-shadow 0.3s ease;
    }
    .nav-link-transparent:hover {
      color: #FFFFFF !important;
      text-shadow: 0 1px 5px rgba(224, 122, 95, 0.6);
    }

    /* Custom Navbar link styles when header is scrolled */
    .nav-link-scrolled {
      color: #4A4340 !important;
      text-shadow: none !important;
      transition: color 0.3s ease;
    }
    .nav-link-scrolled:hover {
      color: #2A2522 !important;
    }

    /* Active link styles */
    .nav-link-active-transparent {
      color: #E07A5F !important;
      text-shadow: 0 1px 3px rgba(10, 10, 15, 0.5);
      font-weight: 800 !important;
    }
    .nav-link-active-scrolled {
      color: #E07A5F !important;
      text-shadow: none !important;
      font-weight: 800 !important;
    }

    /* Icon styles */
    .nav-icon-transparent {
      color: rgba(251, 249, 246, 0.75) !important;
      filter: drop-shadow(0 1px 2px rgba(10, 10, 15, 0.6));
      transition: color 0.3s ease, filter 0.3s ease;
    }
    .nav-icon-transparent:hover {
      color: #FFFFFF !important;
    }
    .nav-icon-scrolled {
      color: rgba(74, 67, 64, 0.7) !important;
      filter: none !important;
      transition: color 0.3s ease;
    }
    .nav-icon-scrolled:hover {
      color: #2A2522 !important;
    }

    /* Advanced profile badge pill */
    .profile-pill-container {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 12px;
      border-radius: 9999px;
      border: 1px solid rgba(251, 249, 246, 0.2);
      background: rgba(251, 249, 246, 0.05);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 1px 3px rgba(10, 10, 15, 0.1);
      cursor: pointer;
      user-select: none;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .profile-pill-container:hover {
      border-color: rgba(224, 122, 95, 0.45);
      box-shadow: 0 3px 12px rgba(224, 122, 95, 0.12);
      background: rgba(251, 249, 246, 0.1);
    }

    .profile-pill-scrolled {
      border-color: rgba(74, 67, 64, 0.15) !important;
      background: rgba(74, 67, 64, 0.03) !important;
    }
    .profile-pill-scrolled:hover {
      border-color: rgba(224, 122, 95, 0.35) !important;
      background: rgba(74, 67, 64, 0.06) !important;
    }

    /* Advanced profile dropdown panel */
    .profile-dropdown-panel {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 10px;
      width: 200px;
      background: rgba(10, 10, 15, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(224, 122, 95, 0.25);
      border-radius: 18px;
      padding: 14px;
      box-shadow: 0 12px 35px rgba(10, 10, 15, 0.45);
      opacity: 0;
      transform: translateY(8px);
      pointer-events: none;
      z-index: 100;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }

    /* Invisible hover bridge pseudo-element */
    .profile-dropdown-panel::before {
      content: '';
      position: absolute;
      top: -15px;
      left: 0;
      right: 0;
      height: 15px;
      background: transparent;
    }

    .profile-badge-wrapper:hover .profile-dropdown-panel {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .profile-badge-wrapper:hover .dropdown-arrow {
      transform: rotate(180deg);
    }

    .header-vignette {
      background: linear-gradient(to bottom, rgba(26, 24, 22, 0.45) 0%, rgba(26, 24, 22, 0.2) 65%, rgba(26, 24, 22, 0) 100%) !important;
      transition: background 0.3s ease;
    }

    .nav-line-gradient {
      background: linear-gradient(to right, #F4A261, #E76F51, #F38E75, #B84F7D) !important;
    }

    /* Logo Hover and Floating Animations */
    @keyframes logoFloat {
      0% { transform: translateY(0px) rotate(0deg) scale(1); }
      50% { transform: translateY(-1.5px) rotate(0.5deg) scale(1.02); }
      100% { transform: translateY(0px) rotate(0deg) scale(1); }
    }
    .logo-svg-animate {
      animation: logoFloat 5s ease-in-out infinite;
      transform-origin: center;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .logo-container:hover .logo-svg-animate {
      animation-play-state: paused;
      transform: scale(1.08) translateY(-2px) rotate(-1deg);
    }
    .logo-text {
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .logo-container:hover .logo-text {
      transform: scale(1.05);
    }
  `]
})
export class NavbarComponent implements AfterViewInit {
  authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private cartService = inject(CartService);
  resolveImageUrl = resolveImageUrl;

  // Cart properties wired to unified CartService
  cartCount = this.cartService.cartCount;
  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;
  animateBadge = signal(false);

  // Profile Settings Signals
  showSettingsModal = signal(false);
  loadingProfile = signal(false);
  savingProfile = signal(false);
  settingsMessage = signal('');
  settingsIsError = signal(false);

  profileData: UserProfile = {
    fullName: '',
    email: '',
    phoneNumber: '',
    secondaryPhoneNumber: '',
    addressDetails: '',
    governorate: ''
  };

  latestItems = computed(() => {
    return this.cartItems().slice(-3).reverse();
  });

  constructor() {
    // Watch for cart count changes to trigger bounce/scale animation reactively
    effect(() => {
      const count = this.cartCount();
      if (count > 0) {
        this.animateBadge.set(true);
        setTimeout(() => this.animateBadge.set(false), 300);
      }
    }, { allowSignalWrites: true });
  }

  scrolled = signal(false);

  get isHomePage(): boolean {
    const path = this.router.url.split('?')[0];
    return path === '/' || path === '';
  }

  get showScrolledState(): boolean {
    return this.scrolled() && !this.isHomePage;
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled.set(window.scrollY > 20);
    }
  }

  linkClass(routePath: string, targetParam?: string): string {
    const isActive = this.isLinkActive(routePath, targetParam);
    if (this.showScrolledState) {
      return isActive ? 'nav-link-active-scrolled' : 'nav-link-scrolled';
    } else {
      return isActive ? 'nav-link-active-transparent' : 'nav-link-transparent';
    }
  }

  get headerClass(): string {
    // If scrolled, use a translucent blurred backdrop matching our luxury champagne background.
    // If at the top, the header has a subtle top-down dark vignette to guarantee text legibility over any lifestyle banner.
    if (this.showScrolledState) {
      return 'fixed top-0 left-0 right-0 z-40 bg-[#FDFBF9]/60 backdrop-blur-md py-3.5 px-6 md:px-12 transition-all duration-300';
    }
    return 'fixed top-0 left-0 right-0 z-40 header-vignette py-3.5 px-6 md:px-12 transition-all duration-300';
  }

  isLinkActive(routePath: string, targetParam?: string): boolean {
    const url = this.router.url;
    const path = url.split('?')[0];

    // If the base path doesn't match, the link is not active!
    if (path !== routePath) {
      return false;
    }

    if (routePath === '/products') {
      const hasTarget = url.includes('target=');
      if (targetParam) {
        if (!hasTarget && targetParam === 'All') {
          return true;
        }
        return url.includes(`target=${targetParam}`);
      }
      return !hasTarget;
    }
    return true;
  }

  getUserInitials(username: string): string {
    if (!username) return 'U';
    const parts = username.split(/[\s\.\-_]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, Math.min(username.length, 2)).toUpperCase();
  }

  openSettingsModal(): void {
    this.showSettingsModal.set(true);
    this.loadingProfile.set(true);
    this.settingsMessage.set('');
    
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.loadingProfile.set(false);
        if (res.isSuccess && res.data) {
          this.profileData = { ...res.data };
        } else {
          this.settingsMessage.set(res.message || 'Failed to load profile details.');
          this.settingsIsError.set(true);
        }
      },
      error: (err) => {
        this.loadingProfile.set(false);
        this.settingsMessage.set(err?.error?.message || 'Error loading profile from server.');
        this.settingsIsError.set(true);
      }
    });
  }

  saveSettings(e: Event): void {
    e.preventDefault();
    this.savingProfile.set(true);
    this.settingsMessage.set('');

    this.authService.updateProfile(this.profileData).subscribe({
      next: (res) => {
        this.savingProfile.set(false);
        if (res.isSuccess) {
          this.settingsMessage.set('Profile updated successfully!');
          this.settingsIsError.set(false);
          setTimeout(() => {
            this.showSettingsModal.set(false);
          }, 1200);
        } else {
          this.settingsMessage.set(res.message || 'Failed to save changes.');
          this.settingsIsError.set(true);
        }
      },
      error: (err) => {
        this.savingProfile.set(false);
        this.settingsMessage.set(err?.error?.message || 'Server error saving profile changes.');
        this.settingsIsError.set(true);
      }
    });
  }

  showAdminLink(): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;
    return user.permissions.includes('Orders:Read') || 
           user.permissions.includes('Products:Read') ||
           user.permissions.includes('Shipping:Read');
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const isHome = this.router.url === '/' || this.router.url === '';
      
      // Force initial scroll state check on load to avoid visual desync
      setTimeout(() => {
        this.scrolled.set(window.scrollY > 20);
      }, 50);

      gsap.fromTo('header', 
        { 
          opacity: 0, 
          y: -60 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.0, 
          delay: isHome ? 0.6 : 0.05, 
          ease: 'power4.out' 
        }
      );
    }
  }
}
