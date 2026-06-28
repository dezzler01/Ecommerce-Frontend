import { Component, inject, AfterViewInit, PLATFORM_ID, effect, computed, signal, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService, UserProfile } from '../../services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { gsap } from 'gsap';
import { resolveImageUrl } from '../../core/utils/image-resolver';
import { NotificationService, AppNotification } from '../../services/notification.service';
import { ProductService, ProductDto } from '../../services/product.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header [ngClass]="headerClass">
      <div class="w-full flex justify-between items-center md:grid md:grid-cols-3">
        <!-- Left Zone: Logo -->
        <div class="flex justify-start items-center">
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
            <span class="logo-text relative z-10 text-[18px] font-black tracking-[-0.03em] text-[#1A1816] uppercase select-none font-sans">
              Picks&amp;More
            </span>
          </div>
        </div>

        <!-- Center Zone: Core Catalog Links -->
        <div class="hidden md:flex justify-center items-center">
          <nav [ngClass]="scrolled() ? 'nav-scrolled-state' : 'nav-floating-dock'" class="flex gap-10 text-[12px] font-bold uppercase tracking-[0.2em] items-center transition-all duration-300">
            <a [routerLink]="['/']" [ngClass]="linkClass('/')" class="transition-colors relative group py-1">
              Home
              <span class="absolute bottom-0 left-0 w-full h-[1px] nav-line-gradient transition-transform duration-300 origin-left" [ngClass]="isLinkActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"></span>
            </a>

            <!-- Women collection with hover dropdown -->
            <div class="relative group py-1">
              <a [routerLink]="['/products']" [queryParams]="{ target: 'Women' }" [ngClass]="linkClass('/products', 'Women')" class="transition-colors relative flex items-center gap-1">
                <span>Women</span>
                <svg class="w-2.5 h-2.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                <span class="absolute bottom-0 left-0 w-full h-[1px] nav-line-gradient transition-transform duration-300 origin-left" [ngClass]="isLinkActive('/products', 'Women') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"></span>
              </a>
              <!-- Subsections Panel -->
              <div class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-[#FBF9F6]/95 backdrop-blur-md border border-[#E8DDD0] rounded-xl p-3 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 text-left normal-case dropdown-hover-bridge">
                <div class="flex flex-col gap-2">
                  <a [routerLink]="['/products']" [queryParams]="{ target: 'Women', subcategory: 'fashion' }" class="text-[10px] tracking-widest text-[#2A1F1A]/80 hover:text-[#C4633A] uppercase font-bold py-1.5 px-2.5 rounded-lg hover:bg-[#C4633A]/5 transition-all">Apparel</a>
                  <a [routerLink]="['/products']" [queryParams]="{ target: 'Women', subcategory: 'shoes' }" class="text-[10px] tracking-widest text-[#2A1F1A]/80 hover:text-[#C4633A] uppercase font-bold py-1.5 px-2.5 rounded-lg hover:bg-[#C4633A]/5 transition-all">Shoes</a>
                  <a [routerLink]="['/products']" [queryParams]="{ target: 'Women', subcategory: 'bags' }" class="text-[10px] tracking-widest text-[#2A1F1A]/80 hover:text-[#C4633A] uppercase font-bold py-1.5 px-2.5 rounded-lg hover:bg-[#C4633A]/5 transition-all">Bags &amp; Handbags</a>
                </div>
              </div>
            </div>

            <!-- Men collection: Coming Soon -->
            <div class="relative py-1 flex items-center gap-1.5 cursor-not-allowed select-none">
              <span class="text-[12px] font-bold uppercase tracking-[0.2em] text-[#2A1F1A]/40">Men</span>
              <span class="text-[7.5px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 bg-red-500 text-white rounded-md scale-[0.85] origin-left select-none animate-pulse">Coming Soon</span>
            </div>

            <!-- Kids collection with hover dropdown -->
            <div class="relative group py-1">
              <a [routerLink]="['/products']" [queryParams]="{ target: 'Kids' }" [ngClass]="linkClass('/products', 'Kids')" class="transition-colors relative flex items-center gap-1">
                <span>Kids</span>
                <svg class="w-2.5 h-2.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                <span class="absolute bottom-0 left-0 w-full h-[1px] nav-line-gradient transition-transform duration-300 origin-left" [ngClass]="isLinkActive('/products', 'Kids') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"></span>
              </a>
              <!-- Subsections Panel -->
              <div class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-[#FBF9F6]/95 backdrop-blur-md border border-[#E8DDD0] rounded-xl p-3 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 text-left normal-case dropdown-hover-bridge">
                <div class="flex flex-col gap-2">
                  <a [routerLink]="['/products']" [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }" class="text-[10px] tracking-widest text-[#2A1F1A]/80 hover:text-[#C4633A] uppercase font-bold py-1.5 px-2.5 rounded-lg hover:bg-[#C4633A]/5 transition-all">Baby Needs</a>
                  <a [routerLink]="['/products']" [queryParams]="{ target: 'Kids', subcategory: 'girls' }" class="text-[10px] tracking-widest text-[#2A1F1A]/80 hover:text-[#C4633A] uppercase font-bold py-1.5 px-2.5 rounded-lg hover:bg-[#C4633A]/5 transition-all">Girls collection</a>
                  <a [routerLink]="['/products']" [queryParams]="{ target: 'Kids', subcategory: 'kids boys' }" class="text-[10px] tracking-widest text-[#2A1F1A]/80 hover:text-[#C4633A] uppercase font-bold py-1.5 px-2.5 rounded-lg hover:bg-[#C4633A]/5 transition-all">Boys collection</a>
                  <a [routerLink]="['/products']" [queryParams]="{ target: 'Kids', subcategory: 'shoes' }" class="text-[10px] tracking-widest text-[#2A1F1A]/80 hover:text-[#C4633A] uppercase font-bold py-1.5 px-2.5 rounded-lg hover:bg-[#C4633A]/5 transition-all">Shoes</a>
                </div>
              </div>
            </div>

            <a [routerLink]="['/products']" [queryParams]="{ target: 'All' }" [ngClass]="linkClass('/products', 'All')" class="transition-colors relative group py-1">
              All Collections
              <span class="absolute bottom-0 left-0 w-full h-[1px] bg-[#E07A5F] transition-transform duration-300 origin-left" [ngClass]="isLinkActive('/products', 'All') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"></span>
            </a>
          </nav>
        </div>

        <!-- Right Flex Zone: Minimalist Floating Layout -->
        <div class="flex justify-end items-center gap-6 select-none md:ml-auto">
          <!-- Search Icon (Triggers Advanced Overlay) -->
          <button 
            (click)="toggleSearchOverlay(true)" 
            class="text-[#2A1F1A] hover:text-[#C98A58] transition-colors relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-[#C98A58]/10 transition-all select-none pointer-events-auto focus:outline-none"
            aria-label="Search Collection"
          >
            <svg class="w-[22px] h-[22px] transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
            </svg>
          </button>

          <!-- Cart Wrapper with hover dropdown -->
          <div class="relative group py-1 flex items-center justify-center pointer-events-auto">
            <a [routerLink]="['/cart']" class="text-[#2A1F1A] hover:text-[#C98A58] transition-colors relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-[#C98A58]/10 transition-all select-none">
              <span class="relative flex items-center justify-center">
                <!-- Shopping Cart Trolley SVG Icon -->
                <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span *ngIf="cartCount() > 0" 
                      [ngClass]="{ 'badge-pop': animateBadge() }"
                      class="absolute -top-2 -right-2 bg-[#C98A58] text-white text-[7px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-[#F8F1EA] z-20 transition-transform duration-300">
                  {{ cartCount() }}
                </span>
              </span>
            </a>

            <!-- Mini-Cart Dropdown -->
            <div class="absolute right-0 top-full mt-2 w-72 bg-[#F8F1EA]/95 backdrop-blur-md border border-[#E7D8CB] rounded-xl p-4 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 text-left">
              <span class="text-[8px] font-mono tracking-widest text-[#C98A58] uppercase font-bold block mb-3 border-b border-[#E7D8CB] pb-2">Bag Preview ({{ cartCount() }})</span>
              
              <div *ngIf="cartItems().length === 0" class="py-6 text-center text-[10px] text-[#77685D] font-light">
                Your shopping bag is empty.
              </div>

              <div *ngIf="cartItems().length > 0" class="space-y-3 mb-4 max-h-[220px] overflow-y-auto pr-1">
                <div *ngFor="let item of latestItems()" class="flex items-center gap-3 pb-3 border-b border-[#E7D8CB] last:border-b-0 last:pb-0">
                  <div class="w-10 h-10 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-[#E7D8CB]">
                    <img *ngIf="item.imageUrl" [src]="resolveImageUrl(item.imageUrl)" [alt]="item.productName" class="w-full h-full object-cover"/>
                    <div *ngIf="!item.imageUrl" class="w-full h-full flex items-center justify-center text-[7px] text-[#77685D] uppercase tracking-widest font-semibold bg-white/5">No img</div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5 class="text-[10px] text-[#2A1F1A] uppercase tracking-wide font-normal truncate">{{ item.productName }}</h5>
                    <div class="flex gap-1.5 text-[8px] text-[#77685D] font-mono mt-0.5" *ngIf="item.size || item.color">
                      <span *ngIf="item.size">S: {{ item.size }}</span>
                      <span *ngIf="item.color">C: {{ item.color }}</span>
                    </div>
                    <div class="flex justify-between items-center text-[9px] font-mono text-[#77685D] mt-0.5">
                      <span>Qty: {{ item.quantity }}</span>
                      <span>{{ item.unitPrice | currency:'EGP ' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-t border-[#E7D8CB] pt-3 flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="text-[8px] text-[#77685D] uppercase tracking-wider font-semibold">Subtotal</span>
                  <span class="text-[11px] font-mono text-[#2A1F1A] font-bold">{{ subtotal() | currency:'EGP ' }}</span>
                </div>
                <a 
                  [routerLink]="['/cart']" 
                  class="px-4 py-2 bg-[#C98A58] hover:bg-[#2A1F1A] text-white text-[9px] font-extrabold uppercase tracking-widest rounded-lg transition-all shadow-[0_0_8px_rgba(201,138,88,0.3)]"
                >
                  Checkout
                </a>
              </div>
            </div>
          </div>
          

          <span class="hidden sm:block h-3.5 w-[1px] bg-[#E7D8CB]"></span>
          
          <ng-container *ngIf="authService.currentUser() as user; else guestNav">
            <!-- Premium Notification Bell with Dropdown -->
            <div class="relative notification-bell-wrapper py-1 mr-3 flex items-center pointer-events-auto">
              <!-- Bell Trigger -->
              <button 
                (click)="toggleNotificationsDropdown($event)"
                class="relative p-1.5 rounded-full hover:bg-[#C98A58]/10 text-[#2A1F1A] hover:text-[#C98A58] transition-colors focus:outline-none flex items-center justify-center"
                aria-label="Notifications"
              >
                <!-- Bell SVG Icon -->
                <svg class="w-[22px] h-[22px] transition-transform duration-300 hover:scale-105" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                
                <!-- Unread count badge -->
                <span 
                  *ngIf="notificationService.unreadCount() > 0"
                  class="absolute top-0 right-0 min-w-[13px] h-[13px] bg-[#C98A58] text-white text-[7.5px] font-black rounded-full flex items-center justify-center px-0.5 border border-white/20 animate-pulse"
                >
                  {{ notificationService.unreadCount() }}
                </span>
              </button>

              <!-- Notifications Dropdown Panel -->
              <div 
                *ngIf="isNotificationsDropdownOpen()" 
                class="absolute right-0 top-full mt-2 w-[340px] md:w-[380px] bg-[#F8F1EA]/98 border border-[#E7D8CB] rounded-2xl shadow-2xl p-4.5 backdrop-blur-xl z-50 text-left"
                (click)="$event.stopPropagation()"
              >
                <div class="flex justify-between items-center border-b border-[#E7D8CB] pb-2.5 mb-2.5">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[10px] font-mono tracking-widest text-[#C98A58] uppercase font-bold">Alert Ledger</span>
                    <span *ngIf="notificationService.unreadCount() > 0" class="text-[8px] bg-[#C98A58]/20 text-[#C98A58] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                      {{ notificationService.unreadCount() }} New
                    </span>
                  </div>
                  <button 
                    *ngIf="notificationService.notifications().length > 0"
                    (click)="markAllAsRead()"
                    class="text-[9px] font-mono uppercase tracking-widest text-[#77685D] hover:text-[#C98A58] transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <!-- Notifications List -->
                <div class="max-h-[260px] overflow-y-auto custom-scrollbar space-y-2 mb-1 pr-1.5">
                  <!-- Empty State -->
                  <div *ngIf="notificationService.notifications().length === 0" class="py-10 text-center">
                    <span class="text-[9.5px] uppercase tracking-widest text-[#77685D] font-medium block">Canvas is peaceful</span>
                    <span class="text-[8px] uppercase tracking-widest text-[#77685D]/60 mt-1 block">No notifications recorded</span>
                  </div>

                  <!-- Notification Item -->
                  <div 
                    *ngFor="let note of notificationService.notifications()" 
                    (click)="markAsRead(note)"
                    [ngClass]="note.isRead ? 'opacity-55 hover:opacity-85' : 'bg-[#C98A58]/5 border-l-2 border-[#C98A58] pl-2.5'"
                    class="p-3 rounded-lg border border-[#E7D8CB] bg-white/[0.01] hover:bg-[#C98A58]/5 transition-all cursor-pointer relative group/item"
                  >
                    <div class="flex justify-between items-start gap-2">
                      <span class="text-[11px] font-bold text-[#2A1F1A] uppercase tracking-wide truncate max-w-[75%]">{{ note.title }}</span>
                      <span class="text-[8px] text-[#77685D] font-mono tracking-tighter">{{ formatTimeAgo(note.createdAt) }}</span>
                    </div>
                    <p class="text-[10.5px] text-[#4A3C35] mt-1 font-normal leading-relaxed break-words">{{ note.message }}</p>
                    
                    <!-- Quick action context link -->
                    <div *ngIf="note.relatedEntityId" class="mt-1.5 flex justify-end">
                      <span class="text-[8.5px] font-mono text-[#C98A58] uppercase tracking-widest group-hover/item:underline">
                        Reference Details →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Small vertical divider -->
            <span class="hidden sm:block h-3.5 w-[1px] bg-[#E7D8CB] mr-3"></span>

            <!-- Advanced Profile Pill with Hover Dropdown -->
            <div class="relative profile-badge-wrapper py-1 pointer-events-auto">
              <!-- Pill Trigger -->
              <div class="profile-pill-container profile-pill-scrolled">
                <!-- Initial Avatar Circle -->
                <div class="h-5.5 w-5.5 rounded-full bg-gradient-to-tr from-[#C98A58] to-[#D8B89C] flex items-center justify-center text-[9px] font-black text-white uppercase shadow-sm group-hover/profile:scale-105 transition-all duration-300">
                  {{ getUserInitials(user.username) }}
                </div>
                <!-- Username -->
                <span class="hidden sm:inline font-bold tracking-[0.05em] text-[9.5px] text-[#2A1F1A] transition-colors duration-300">
                  {{ user.username }}
                </span>
                <!-- Caret Down Icon -->
                <svg class="hidden sm:block w-2.5 h-2.5 text-[#2A1F1A]/60 transition-transform duration-300 dropdown-arrow" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <!-- Advanced Dropdown Panel -->
              <div class="profile-dropdown-panel bg-[#F8F1EA] border border-[#E7D8CB] text-[#2A1F1A]">
                <!-- User Header -->
                <div class="border-b border-[#E7D8CB] pb-2.5 mb-2.5">
                  <span class="text-[8px] font-mono tracking-widest text-[#C98A58] uppercase font-bold block mb-1">Authenticated User</span>
                  <div class="text-[10px] text-[#2A1F1A] font-semibold truncate">{{ user.username }}</div>
                  <div class="text-[7.5px] text-[#77685D] font-mono mt-0.5 tracking-widest uppercase bg-[#C98A58]/10 px-2 py-0.5 rounded-sm inline-block">
                    {{ user.role || 'Patron' }}
                  </div>
                </div>

                <!-- Menu Items -->
                <div class="space-y-1">
                  <a 
                    *ngIf="showAdminLink()"
                    [routerLink]="['/admin/dashboard']"
                    class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[#2A1F1A]/70 hover:text-[#2A1F1A] hover:bg-[#C98A58]/10 text-[9px] uppercase tracking-wider font-semibold transition-all text-left cursor-pointer"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                    Store Dashboard
                  </a>
                  <button 
                    (click)="openSettingsModal()" 
                    class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[#2A1F1A]/70 hover:text-[#2A1F1A] hover:bg-[#C98A58]/10 text-[9px] uppercase tracking-wider font-semibold transition-all text-left"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Profile Settings
                  </button>

                  <button 
                    (click)="openTrackingModal()" 
                    class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[#2A1F1A]/70 hover:text-[#2A1F1A] hover:bg-[#C98A58]/10 text-[9px] uppercase tracking-wider font-semibold transition-all text-left"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.12-1.057L1.5 5.25m0 0A2.25 2.25 0 0 1 3.75 3h15a2.25 2.25 0 0 1 2.25 2.25m-18 0h18M16.5 18.75a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.875c.621 0 1.125-.504 1.125-1.125V11.25m-18 0h18" />
                    </svg>
                    Track Orders
                  </button>

                  <button 
                    (click)="authService.logout()" 
                    class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-500/10 text-[9px] uppercase tracking-wider font-semibold transition-all text-left"
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
            <div class="flex items-center gap-1">
              <!-- Guest Track Order Button -->
              <button 
                (click)="openTrackingModal()"
                class="flex items-center justify-center h-9 w-9 rounded-full hover:bg-[#C98A58]/10 text-[#2A1F1A] hover:text-[#C98A58] transition-colors focus:outline-none pointer-events-auto"
                aria-label="Track Order"
                title="Track Order"
              >
                <svg class="w-[20px] h-[20px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.375c.621 0 1.125-.504 1.125-1.125V11.25M9 9h6.75M12 4.5v15m0-15a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3m0-15a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3" />
                </svg>
              </button>
              <button 
                (click)="authService.showLoginModal.set(true)" 
                class="hidden sm:flex items-center justify-center h-9 w-9 rounded-full hover:bg-[#C98A58]/10 text-[#2A1F1A] hover:text-[#C98A58] transition-colors focus:outline-none pointer-events-auto"
                aria-label="Account"
              >
                <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </button>
            </div>
          </ng-template>

          <!-- Hamburger Toggle Button -->
          <button 
            (click)="isMobileMenuOpen.set(!isMobileMenuOpen())"
            [ngClass]="showScrolledState ? 'text-[#2A2522]' : 'text-[#FBF9F6]'"
            class="md:hidden relative z-50 flex items-center justify-center w-8 h-8 focus:outline-none pointer-events-auto transition-colors duration-300 ml-2"
          >
            <span class="sr-only">Toggle Menu</span>
            <div class="flex flex-col justify-between w-5 h-3 transform transition-all duration-300">
              <span [ngClass]="isMobileMenuOpen() ? 'rotate-45 translate-y-[5px]' : ''" class="w-full h-[1.5px] bg-current transform transition-all duration-300 origin-center"></span>
              <span [ngClass]="isMobileMenuOpen() ? '-rotate-45 -translate-y-[5.5px]' : ''" class="w-full h-[1.5px] bg-current transform transition-all duration-300 origin-center"></span>
            </div>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Drawer Overlay -->
    <div 
      (click)="isMobileMenuOpen.set(false)"
      [ngClass]="isMobileMenuOpen() ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      class="fixed inset-0 z-40 bg-[#1A1816]/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
    ></div>

    <!-- Mobile Menu Drawer Content -->
    <div 
      [ngClass]="isMobileMenuOpen() ? 'translate-x-0 shadow-2xl' : 'translate-x-full'"
      class="fixed top-0 right-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-[#FDFBF9]/95 backdrop-blur-xl border-l border-[#2A2522]/10 md:hidden flex flex-col p-6 transition-transform duration-500 ease-out z-50 pointer-events-auto"
    >
      <!-- Close button and header -->
      <div class="h-16 flex items-center justify-between border-b border-[#2A2522]/5 pb-4 mb-6">
        <span class="text-[10px] font-mono tracking-widest text-[#E07A5F] uppercase font-bold">Catalog Navigation</span>
        <button (click)="isMobileMenuOpen.set(false)" class="text-[#8A817C] hover:text-[#E07A5F] text-xs p-1 transition-colors">
          ✕
        </button>
      </div>

      <!-- Vertical Catalog Routes -->
      <nav class="flex flex-col gap-6 text-[10px] font-extrabold uppercase tracking-[0.25em] text-left">
        <a [routerLink]="['/']" (click)="isMobileMenuOpen.set(false)" [ngClass]="isLinkActive('/') ? 'text-[#E07A5F]' : 'text-[#2A2522]'" class="transition-colors py-1 block">
          Home
        </a>
        <a [routerLink]="['/products']" [queryParams]="{ target: 'Women' }" (click)="isMobileMenuOpen.set(false)" [ngClass]="isLinkActive('/products', 'Women') ? 'text-[#E07A5F]' : 'text-[#2A2522]'" class="transition-colors py-1 block">
          Women
        </a>
        <div class="py-1 block flex items-center justify-between text-[#2A2522]/40 cursor-not-allowed select-none">
          <span>Men</span>
          <span class="text-[7.5px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 bg-red-500 text-white rounded-md scale-[0.85] origin-right select-none animate-pulse">Coming Soon</span>
        </div>
        <a [routerLink]="['/products']" [queryParams]="{ target: 'Kids' }" (click)="isMobileMenuOpen.set(false)" [ngClass]="isLinkActive('/products', 'Kids') ? 'text-[#E07A5F]' : 'text-[#2A2522]'" class="transition-colors py-1 block">
          Kids
        </a>
        <a [routerLink]="['/products']" [queryParams]="{ target: 'All' }" (click)="isMobileMenuOpen.set(false)" [ngClass]="isLinkActive('/products', 'All') ? 'text-[#E07A5F]' : 'text-[#2A2522]'" class="transition-colors py-1 block">
          All Collections
        </a>
        <a [routerLink]="['/cart']" (click)="isMobileMenuOpen.set(false)" [ngClass]="isLinkActive('/cart') ? 'text-[#E07A5F]' : 'text-[#2A2522]'" class="transition-colors py-1 block flex items-center justify-between">
          <span>My Bag ({{ cartCount() }})</span>
          <span class="w-4 h-4 rounded-full bg-[#FF0055] text-[7.5px] font-bold text-white flex items-center justify-center border border-white/10" *ngIf="cartCount() > 0">
            {{ cartCount() }}
          </span>
        </a>
      </nav>

      <!-- Bottom Session Settings/Profile -->
      <div class="mt-auto border-t border-[#2A2522]/5 pt-6 space-y-4 text-left">
        <ng-container *ngIf="authService.currentUser() as user; else guestMobileNav">
          <div class="flex items-center gap-3">
            <div class="h-7 w-7 rounded-full bg-gradient-to-tr from-[#E07A5F] to-[#B84F7D] flex items-center justify-center text-[10px] font-black text-white uppercase shadow-sm">
              {{ getUserInitials(user.username) }}
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-[10.5px] font-bold text-[#2A2522] truncate">{{ user.username }}</span>
              <span class="text-[7.5px] font-mono tracking-widest text-[#8A817C] uppercase">{{ user.role || 'Patron' }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <a 
              *ngIf="showAdminLink()"
              [routerLink]="['/admin/dashboard']"
              (click)="isMobileMenuOpen.set(false)"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#2A2522]/70 hover:text-[#2A2522] hover:bg-[#2A2522]/5 text-[9px] uppercase tracking-wider font-semibold transition-all text-left"
            >
              Store Dashboard
            </a>
            <button 
              (click)="isMobileMenuOpen.set(false); openSettingsModal()" 
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#2A2522]/70 hover:text-[#2A2522] hover:bg-[#2A2522]/5 text-[9px] uppercase tracking-wider font-semibold transition-all text-left"
            >
              Profile Settings
            </button>
            <button 
              (click)="openTrackingModal()" 
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#2A2522]/70 hover:text-[#2A2522] hover:bg-[#2A2522]/5 text-[9px] uppercase tracking-wider font-semibold transition-all text-left"
            >
              Track Orders
            </button>
            <button 
              (click)="isMobileMenuOpen.set(false); authService.logout()" 
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/5 text-[9px] uppercase tracking-wider font-semibold transition-all text-left"
            >
              Logout
            </button>
          </div>
        </ng-container>
        
        <ng-template #guestMobileNav>
          <button 
            (click)="openTrackingModal()" 
            class="w-full py-2 mb-2 border border-[#2A2522]/10 hover:bg-[#2A2522]/5 text-[#2A2522] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
          >
            Track Order
          </button>
          <button 
            (click)="isMobileMenuOpen.set(false); authService.showLoginModal.set(true)" 
            class="w-full py-2.5 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all"
          >
            Sign In
          </button>
        </ng-template>
      </div>
    </div>

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

    <!-- Premium Order Tracking & History Modal -->
    <div 
      *ngIf="showTrackingModal()" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1816]/65 backdrop-blur-sm transition-all duration-300"
    >
      <div 
        class="w-full max-w-2xl bg-[#FBF9F6]/95 backdrop-blur-md border border-[#2A2522]/10 rounded-3xl p-7 shadow-2xl space-y-6 text-left relative flex flex-col max-h-[90vh] overflow-hidden"
      >
        <!-- Close Button -->
        <button 
          (click)="showTrackingModal.set(false)" 
          class="absolute top-4 right-4 text-[#8A817C] hover:text-[#E07A5F] text-sm p-1.5 transition-colors"
        >
          ✕
        </button>

        <!-- Header -->
        <div>
          <span class="tracking-widest font-mono text-[9px] uppercase font-bold text-[#E07A5F] block mb-1">Customer Panel</span>
          <h3 class="text-xl font-light text-[#2A2522] tracking-[0.03em] uppercase">Track Order & History</h3>
          <div class="w-12 h-[1.5px] bg-[#E07A5F] mt-2"></div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex border-b border-[#2A2522]/5 pb-2 gap-4">
          <button 
            (click)="activeHistoryTab.set('track')" 
            [ngClass]="activeHistoryTab() === 'track' ? 'border-[#E07A5F] text-[#2A2522] font-semibold' : 'border-transparent text-[#8A817C]'"
            class="pb-2 border-b-2 text-[10px] uppercase tracking-wider font-bold transition-all focus:outline-none"
          >
            Track Package
          </button>
          <button 
            (click)="setHistoryTab()" 
            [ngClass]="activeHistoryTab() === 'history' ? 'border-[#E07A5F] text-[#2A2522] font-semibold' : 'border-transparent text-[#8A817C]'"
            class="pb-2 border-b-2 text-[10px] uppercase tracking-wider font-bold transition-all focus:outline-none"
          >
            Order History
          </button>
        </div>

        <!-- Scrollable Content container -->
        <div class="flex-1 overflow-y-auto pr-1 space-y-4 min-h-[300px]">
          <!-- TAB 1: GUEST / MANUAL TRACK PACKAGE -->
          <div *ngIf="activeHistoryTab() === 'track'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Order Identifier (GUID)</label>
                <input 
                  type="text" 
                  [(ngModel)]="trackingOrderId" 
                  name="trackingOrderId"
                  placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 
                  class="w-full px-4 py-2.5 bg-[#FBF9F6]/50 border border-[#2A2522]/10 rounded-xl text-xs text-[#2A2522] placeholder-[#8A817C]/40 focus:outline-none focus:ring-1 focus:ring-[#E07A5F] focus:border-[#E07A5F]"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Last 4 digits of Phone</label>
                <input 
                  type="text" 
                  [(ngModel)]="trackingPhone" 
                  name="trackingPhone"
                  placeholder="e.g. 5678" 
                  maxlength="4"
                  class="w-full px-4 py-2.5 bg-[#FBF9F6]/50 border border-[#2A2522]/10 rounded-xl text-xs text-[#2A2522] placeholder-[#8A817C]/40 focus:outline-none focus:ring-1 focus:ring-[#E07A5F] focus:border-[#E07A5F]"
                />
              </div>
            </div>

            <button 
              (click)="trackOrder()" 
              [disabled]="trackingLoading()"
              class="w-full py-2.5 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
            >
              {{ trackingLoading() ? 'Locating Package...' : 'Track Package' }}
            </button>

            <!-- Error message -->
            <div *ngIf="trackingError()" class="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl">
              {{ trackingError() }}
            </div>

            <!-- Tracked Order Results -->
            <div *ngIf="trackedOrder()" class="border border-[#2A2522]/5 rounded-2xl p-4 bg-[#FBF9F6]/50 space-y-4 animate-fade-in">
              <div class="flex justify-between items-center border-b border-[#2A2522]/5 pb-2">
                <div>
                  <span class="text-[9px] uppercase tracking-wider text-[#8A817C]">Order #{{ trackedOrder().orderNumber }}</span>
                  <span class="block text-[10px] text-[#2A2522] font-semibold">{{ trackedOrder().orderDate | date:'mediumDate' }}</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[8px] uppercase font-bold text-white" 
                      [style.background-color]="getStatusColor(trackedOrder().status)">
                  {{ getStatusLabel(trackedOrder().status) }}
                </span>
              </div>

              <!-- Visual Status Progress Bar -->
              <div class="space-y-2">
                <label class="text-[8px] uppercase tracking-widest font-black text-[#8A817C] block">Shipping Status Timeline</label>
                <div class="relative flex justify-between items-center pt-2">
                  <!-- Connection bar -->
                  <div class="absolute left-3 right-3 top-5.5 h-1 bg-[#2A2522]/5 z-0"></div>
                  <div class="absolute left-3 top-5.5 h-1 bg-[#E07A5F] transition-all duration-500 z-0"
                       [style.width]="getTimelineProgressWidth(trackedOrder().status)"></div>

                  <!-- Step 1: Pending -->
                  <div class="flex flex-col items-center gap-1 z-0">
                    <span class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-colors"
                          [ngClass]="isStepActive('PendingVerification', trackedOrder().status) ? 'bg-[#E07A5F]' : 'bg-[#8A817C]/20 text-[#8A817C]'">1</span>
                    <span class="text-[8px] uppercase tracking-wider text-[#8A817C]">Pending</span>
                  </div>

                  <!-- Step 2: Preparing -->
                  <div class="flex flex-col items-center gap-1 z-0">
                    <span class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-colors"
                          [ngClass]="isStepActive('ConfirmedPreparing', trackedOrder().status) ? 'bg-[#E07A5F]' : 'bg-[#8A817C]/20 text-[#8A817C]'">2</span>
                    <span class="text-[8px] uppercase tracking-wider text-[#8A817C]">Preparing</span>
                  </div>

                  <!-- Step 3: Out for Delivery -->
                  <div class="flex flex-col items-center gap-1 z-0">
                    <span class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-colors"
                          [ngClass]="isStepActive('OutForDelivery', trackedOrder().status) ? 'bg-[#E07A5F]' : 'bg-[#8A817C]/20 text-[#8A817C]'">3</span>
                    <span class="text-[8px] uppercase tracking-wider text-[#8A817C]">On Way</span>
                  </div>

                  <!-- Step 4: Finalized (Delivered / Returned) -->
                  <div class="flex flex-col items-center gap-1 z-0">
                    <span class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-colors"
                          [ngClass]="isStepFinished(trackedOrder().status) ? 'bg-[#E07A5F]' : 'bg-[#8A817C]/20 text-[#8A817C]'">
                      {{ trackedOrder().status === 'ReturnedRejected' ? '✕' : '✓' }}
                    </span>
                    <span class="text-[8px] uppercase tracking-wider text-[#8A817C]">
                      {{ trackedOrder().status === 'ReturnedRejected' ? 'Returned' : 'Delivered' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Items Summary -->
              <div class="space-y-1.5 pt-2">
                <label class="text-[8px] uppercase tracking-widest font-black text-[#8A817C] block">Package Items</label>
                <div class="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                  <div *ngFor="let item of trackedOrder().items" class="flex justify-between items-center text-xs py-1 border-b border-[#2A2522]/5">
                    <span class="text-[#2A2522] font-light">{{ item.productName }} <span class="text-[#8A817C] text-[10px]">x{{ item.quantity }}</span></span>
                    <span class="text-[#2A2522] font-semibold">EGP {{ item.unitPrice * item.quantity | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>

              <!-- Totals Details -->
              <div class="flex justify-between items-center pt-2 border-t border-[#2A2522]/5 text-xs">
                <span class="text-[#8A817C]">Delivery Fee: EGP {{ trackedOrder().shippingCost | number:'1.2-2' }}</span>
                <span class="text-[#2A2522] font-bold">Total: EGP {{ trackedOrder().totalPrice | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- TAB 2: REGISTERED CUSTOMER ORDER HISTORY -->
          <div *ngIf="activeHistoryTab() === 'history'" class="space-y-4">
            <!-- If Guest User accesses History tab -->
            <div *ngIf="!authService.currentUser()" class="text-center py-8 space-y-3">
              <p class="text-xs text-[#8A817C] font-light">Please register or log in to view your complete shopping and order history ledger.</p>
              <button 
                (click)="showTrackingModal.set(false); authService.showLoginModal.set(true)"
                class="px-5 py-2 bg-[#E07A5F] hover:bg-[#2A2522] text-[#FBF9F6] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                Log In / Register
              </button>
            </div>

            <!-- Logged-in view -->
            <div *ngIf="authService.currentUser()">
              <div *ngIf="historyLoading()" class="flex justify-center items-center py-12">
                <span class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E07A5F]"></span>
              </div>

              <div *ngIf="!historyLoading() && historyOrders().length === 0" class="text-center py-12">
                <p class="text-xs text-[#8A817C] font-light">No orders placed yet. Start your curated shopping journey!</p>
              </div>

              <!-- Orders List -->
              <div *ngIf="!historyLoading() && historyOrders().length > 0" class="space-y-3">
                <div *ngFor="let order of historyOrders()" class="border border-[#2A2522]/5 rounded-2xl p-4 bg-[#FBF9F6]/50 space-y-3">
                  <div class="flex justify-between items-center">
                    <div>
                      <span class="text-[9px] uppercase tracking-wider text-[#8A817C]">Order #{{ order.orderNumber }}</span>
                      <span class="block text-[10px] text-[#2A2522] font-semibold">{{ order.orderDate | date:'mediumDate' }}</span>
                    </div>
                    <div class="text-right space-y-1">
                      <span class="px-2 py-0.5 rounded text-[8px] uppercase font-bold text-white" 
                            [style.background-color]="getStatusColor(order.status)">
                        {{ getStatusLabel(order.status) }}
                      </span>
                      <span class="block text-xs font-bold text-[#E07A5F]">EGP {{ order.totalPrice | number:'1.2-2' }}</span>
                    </div>
                  </div>

                  <!-- Order expansion trigger button -->
                  <button 
                    (click)="toggleOrderDetails(order)" 
                    class="w-full py-1.5 bg-[#2A2522]/5 hover:bg-[#E07A5F]/10 text-[#2A2522] hover:text-[#E07A5F] text-[9px] uppercase tracking-wider font-bold rounded-lg transition-all"
                  >
                    {{ selectedHistoryOrder()?.id === order.id ? 'Hide Details' : 'View Tracking Details' }}
                  </button>

                  <!-- Expanded order details inside history card -->
                  <div *ngIf="selectedHistoryOrder()?.id === order.id" class="pt-3 border-t border-[#2A2522]/5 space-y-3 animate-fade-in">
                    <!-- Progress timeline -->
                    <div class="relative flex justify-between items-center pt-2">
                      <div class="absolute left-3 right-3 top-5.5 h-1 bg-[#2A2522]/5 z-0"></div>
                      <div class="absolute left-3 top-5.5 h-1 bg-[#E07A5F] transition-all duration-500 z-0"
                           [style.width]="getTimelineProgressWidth(order.status)"></div>

                      <div class="flex flex-col items-center gap-1 z-0">
                        <span class="h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white transition-colors"
                              [ngClass]="isStepActive('PendingVerification', order.status) ? 'bg-[#E07A5F]' : 'bg-[#8A817C]/20 text-[#8A817C]'">1</span>
                        <span class="text-[7px] uppercase tracking-wider text-[#8A817C]">Pending</span>
                      </div>
                      <div class="flex flex-col items-center gap-1 z-0">
                        <span class="h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white transition-colors"
                              [ngClass]="isStepActive('ConfirmedPreparing', order.status) ? 'bg-[#E07A5F]' : 'bg-[#8A817C]/20 text-[#8A817C]'">2</span>
                        <span class="text-[7px] uppercase tracking-wider text-[#8A817C]">Preparing</span>
                      </div>
                      <div class="flex flex-col items-center gap-1 z-0">
                        <span class="h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white transition-colors"
                              [ngClass]="isStepActive('OutForDelivery', order.status) ? 'bg-[#E07A5F]' : 'bg-[#8A817C]/20 text-[#8A817C]'">3</span>
                        <span class="text-[7px] uppercase tracking-wider text-[#8A817C]">On Way</span>
                      </div>
                      <div class="flex flex-col items-center gap-1 z-0">
                        <span class="h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white transition-colors"
                              [ngClass]="isStepFinished(order.status) ? 'bg-[#E07A5F]' : 'bg-[#8A817C]/20 text-[#8A817C]'">
                          {{ order.status === 'ReturnedRejected' ? '✕' : '✓' }}
                        </span>
                        <span class="text-[7px] uppercase tracking-wider text-[#8A817C]">
                          {{ order.status === 'ReturnedRejected' ? 'Returned' : 'Delivered' }}
                        </span>
                      </div>
                    </div>

                    <!-- Items inside history card -->
                    <div class="space-y-1 pt-1">
                      <div *ngFor="let item of order.items" class="flex justify-between items-center text-[11px] py-0.5">
                        <span class="text-[#2A2522] font-light">{{ item.productName }} <span class="text-[#8A817C]">x{{ item.quantity }}</span></span>
                        <span class="text-[#2A2522] font-semibold">EGP {{ item.unitPrice * item.quantity | number:'1.2-2' }}</span>
                      </div>
                    </div>

                    <!-- Address/Payment summary -->
                    <div class="text-[10px] text-[#8A817C] leading-normal pt-1 border-t border-[#2A2522]/5">
                      <strong>Address:</strong> {{ order.shippingAddress?.detailedAddress }}, {{ order.shippingAddress?.governorate }} <br/>
                      <strong>Payment:</strong> {{ order.paymentMethod }} | Delivery Fee: EGP {{ order.shippingCost | number:'1.2-2' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="flex justify-end pt-3 border-t border-[#2A2522]/5">
          <button 
            (click)="showTrackingModal.set(false)" 
            class="px-5 py-2 border border-[#2A2522]/10 hover:bg-[#2A2522]/5 text-[#2A2522] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Advanced Search Fullscreen Glassmorphic Overlay -->
    <div 
      *ngIf="showSearchOverlay()" 
      class="fixed inset-0 z-[100] flex flex-col bg-[#1A1816]/75 backdrop-blur-2xl p-6 md:p-20 text-left animate-fade-in pointer-events-auto"
    >
      <div class="max-w-4xl mx-auto w-full flex flex-col h-full relative">
        <!-- Close Button -->
        <button 
          (click)="toggleSearchOverlay(false)" 
          class="absolute top-0 right-0 text-white/50 hover:text-white text-2xl transition-colors focus:outline-none"
          aria-label="Close Search"
        >
          ✕
        </button>
        
        <!-- Search Input Area -->
        <div class="mt-12 md:mt-24 border-b border-white/10 pb-6 relative">
          <input 
            id="navbar-search-input"
            type="text" 
            [ngModel]="searchQuery()"
            (ngModelChange)="onSearchInput($event)"
            placeholder="What are you looking for?" 
            class="w-full text-2xl md:text-5xl font-light font-serif-luxury text-white bg-transparent outline-none placeholder:text-white/20 tracking-wide border-none focus:ring-0"
            autocomplete="off"
          />
          <span class="absolute right-0 bottom-6 text-white/40 text-[10px] font-mono tracking-widest hidden sm:inline">ESC TO CLOSE</span>
        </div>

        <!-- Interactive Content Area -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
          <!-- Left Column: Quick Suggestions / Trends -->
          <div class="md:col-span-1 space-y-6">
            <div>
              <span class="text-[8px] font-mono tracking-[0.25em] text-[#C98A58] uppercase font-black block mb-4">Trending Curations</span>
              <div class="flex flex-wrap gap-2">
                <button (click)="onSearchInput('Diaper Bag')" class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[9px] uppercase tracking-widest transition-all border border-white/5 font-semibold">Diaper Bag</button>
                <button (click)="onSearchInput('Bunny')" class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[9px] uppercase tracking-widest transition-all border border-white/5 font-semibold">Bunny</button>
                <button (click)="onSearchInput('Shoes')" class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[9px] uppercase tracking-widest transition-all border border-white/5 font-semibold">Baby Shoes</button>
                <button (click)="onSearchInput('Dress')" class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[9px] uppercase tracking-widest transition-all border border-white/5 font-semibold">Dresses</button>
              </div>
            </div>
            
            <div class="pt-4 border-t border-white/5">
              <span class="text-[8px] font-mono tracking-[0.25em] text-[#C98A58] uppercase font-black block mb-3">Hotkeys</span>
              <p class="text-[9px] text-white/50 leading-relaxed font-light">Press <kbd class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[8px]">Ctrl</kbd> + <kbd class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[8px]">K</kbd> anywhere to query.</p>
            </div>
          </div>

          <!-- Right Column: Search Results list -->
          <div class="md:col-span-2 space-y-6">
            <span class="text-[8px] font-mono tracking-[0.25em] text-[#C98A58] uppercase font-black block">
              {{ searching() ? 'Searching Ledger...' : (searchResults().length > 0 ? 'Discovered Matches (' + searchResults().length + ')' : 'Search Ledger') }}
            </span>

            <!-- Loading state spinner -->
            <div *ngIf="searching()" class="py-12 flex justify-center">
              <span class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C98A58]"></span>
            </div>

            <!-- Empty results state -->
            <div *ngIf="!searching() && searchQuery().length >= 2 && searchResults().length === 0" class="py-8 text-white/40 font-light text-xs">
              No items matched your query. Try searching for something else.
            </div>

            <!-- Default Prompt -->
            <div *ngIf="!searching() && searchQuery().length < 2" class="py-8 text-white/30 font-light text-xs">
              Begin typing to query our premium collection.
            </div>

            <!-- Search Results list -->
            <div *ngIf="!searching() && searchResults().length > 0" class="space-y-4">
              <div 
                *ngFor="let item of searchResults()" 
                [routerLink]="['/products', item.id]"
                (click)="toggleSearchOverlay(false)"
                class="flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group"
              >
                <!-- Product Image -->
                <div class="w-12 h-12 rounded-xl bg-white overflow-hidden flex-shrink-0">
                  <img 
                    *ngIf="item.imageUrl" 
                    [src]="resolveImageUrl(item.imageUrl)" 
                    [alt]="item.title" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <!-- Product text metadata -->
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-semibold text-white truncate uppercase tracking-wider">{{ item.title }}</h5>
                  <p class="text-[9px] text-[#C98A58] mt-1 font-mono">{{ item.price | currency:'EGP ' }}</p>
                </div>
                <!-- Action Arrow -->
                <span class="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all text-xs">→</span>
              </div>
            </div>
          </div>
        </div>
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
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(201, 138, 88, 0.35);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(201, 138, 88, 0.6);
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
      width: 220px;
      background: rgba(248, 241, 234, 0.98);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(231, 216, 203, 0.9);
      border-radius: 18px;
      padding: 14px;
      box-shadow: 0 12px 35px rgba(42, 31, 26, 0.15);
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
  notificationService = inject(NotificationService);
  private productService = inject(ProductService);
  private http = inject(HttpClient);
  resolveImageUrl = resolveImageUrl;

  isNotificationsDropdownOpen = signal<boolean>(false);
  showSearchOverlay = signal<boolean>(false);
  searchQuery = signal<string>('');
  searchResults = signal<ProductDto[]>([]);
  searching = signal<boolean>(false);

  toggleSearchOverlay(open: boolean) {
    this.showSearchOverlay.set(open);
    if (open) {
      this.searchQuery.set('');
      this.searchResults.set([]);
      setTimeout(() => {
        const inputEl = document.getElementById('navbar-search-input');
        if (inputEl) inputEl.focus();
      }, 120);
    }
  }

  onSearchInput(query: string) {
    this.searchQuery.set(query);
    if (query.trim().length >= 2) {
      this.searching.set(true);
      this.productService.getProducts({ textTerm: query, pageSize: 5 }).subscribe({
        next: (res) => {
          this.searching.set(false);
          if (res.isSuccess && res.data) {
            this.searchResults.set(res.data.items || []);
          }
        },
        error: () => {
          this.searching.set(false);
        }
      });
    } else {
      this.searchResults.set([]);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleSearchHotkeys(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.toggleSearchOverlay(true);
    }
    if (event.key === 'Escape') {
      this.toggleSearchOverlay(false);
    }
  }

  toggleNotificationsDropdown(event: Event) {
    event.stopPropagation();
    this.isNotificationsDropdownOpen.update(v => !v);
  }

  markAsRead(note: AppNotification) {
    if (note.id && !note.isRead) {
      this.notificationService.markAsRead(note.id);
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  formatTimeAgo(dateInput: string | Date | undefined): string {
    if (!dateInput) return 'just now';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.isNotificationsDropdownOpen.set(false);
  }

  // Cart properties wired to unified CartService
  cartCount = this.cartService.cartCount;
  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;
  animateBadge = signal(false);
  isMobileMenuOpen = signal<boolean>(false);

  // Profile Settings Signals
  showSettingsModal = signal(false);
  loadingProfile = signal(false);
  savingProfile = signal(false);
  settingsMessage = signal('');
  settingsIsError = signal(false);

  // Tracking Modal & Order History State
  showTrackingModal = signal(false);
  trackingOrderId = '';
  trackingPhone = '';
  trackingLoading = signal(false);
  trackingError = signal('');
  trackedOrder = signal<any | null>(null);
  historyOrders = signal<any[]>([]);
  historyLoading = signal(false);
  activeHistoryTab = signal<'track' | 'history'>('track');
  selectedHistoryOrder = signal<any | null>(null);

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
    return true;
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled.set(window.scrollY > 20);
    }
  }

  linkClass(routePath: string, targetParam?: string): string {
    const isActive = this.isLinkActive(routePath, targetParam);
    return isActive ? 'nav-link-active-scrolled' : 'nav-link-scrolled';
  }

  get headerClass(): string {
    const scrollClass = this.scrolled() ? ' scrolled' : '';
    return 'fixed top-0 left-0 right-0 z-40 navbar-luxury-glass' + scrollClass + ' flex items-center px-6 md:px-12 transition-all duration-300';
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

  openTrackingModal() {
    this.trackingOrderId = '';
    this.trackingPhone = '';
    this.trackingError.set('');
    this.trackedOrder.set(null);
    this.historyOrders.set([]);
    this.selectedHistoryOrder.set(null);
    this.isMobileMenuOpen.set(false);

    if (this.authService.currentUser()) {
      this.activeHistoryTab.set('history');
      this.loadHistoryOrders();
    } else {
      this.activeHistoryTab.set('track');
    }
    this.showTrackingModal.set(true);
  }

  setHistoryTab() {
    this.activeHistoryTab.set('history');
    if (this.authService.currentUser() && this.historyOrders().length === 0) {
      this.loadHistoryOrders();
    }
  }

  trackOrder() {
    this.trackingError.set('');
    this.trackedOrder.set(null);

    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!this.trackingOrderId || !guidRegex.test(this.trackingOrderId.trim())) {
      this.trackingError.set('Please enter a valid Order ID (GUID format).');
      return;
    }
    if (!this.trackingPhone || this.trackingPhone.trim().length !== 4 || !/^\d+$/.test(this.trackingPhone.trim())) {
      this.trackingError.set('Please enter exactly 4 digits of the phone number.');
      return;
    }

    this.trackingLoading.set(true);
    this.http.get<any>(`http://localhost:5153/api/orders/track/${this.trackingOrderId.trim()}?phone=${this.trackingPhone.trim()}`).subscribe({
      next: (res: any) => {
        this.trackingLoading.set(false);
        if (res.isSuccess && res.data) {
          this.trackedOrder.set(res.data);
        } else {
          this.trackingError.set(res.message || 'Order not found. Check ID and Phone.');
        }
      },
      error: (err: any) => {
        this.trackingLoading.set(false);
        this.trackingError.set(err?.error?.message || 'Order not found. Please verify details.');
      }
    });
  }

  loadHistoryOrders() {
    this.historyLoading.set(true);
    const token = localStorage.getItem('auth_token');
    this.http.get<any>('http://localhost:5153/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.historyLoading.set(false);
        if (res.isSuccess && res.data) {
          this.historyOrders.set(res.data);
        }
      },
      error: () => {
        this.historyLoading.set(false);
      }
    });
  }

  toggleOrderDetails(order: any) {
    if (this.selectedHistoryOrder()?.id === order.id) {
      this.selectedHistoryOrder.set(null);
    } else {
      this.selectedHistoryOrder.set(order);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PendingVerification': return '#F59E0B';
      case 'ConfirmedPreparing': return '#3B82F6';
      case 'OutForDelivery': return '#8B5CF6';
      case 'Delivered': return '#10B981';
      case 'ReturnedRejected': return '#EF4444';
      default: return '#6B7280';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PendingVerification': return 'Pending Verification';
      case 'ConfirmedPreparing': return 'Preparing';
      case 'OutForDelivery': return 'Out for Delivery';
      case 'Delivered': return 'Delivered';
      case 'ReturnedRejected': return 'Returned / Rejected';
      default: return status;
    }
  }

  getTimelineProgressWidth(status: string): string {
    switch (status) {
      case 'PendingVerification': return '0%';
      case 'ConfirmedPreparing': return '33%';
      case 'OutForDelivery': return '66%';
      case 'Delivered': return '100%';
      case 'ReturnedRejected': return '100%';
      default: return '0%';
    }
  }

  isStepActive(step: string, currentStatus: string): boolean {
    const statuses = ['PendingVerification', 'ConfirmedPreparing', 'OutForDelivery', 'Delivered', 'ReturnedRejected'];
    const stepIdx = statuses.indexOf(step);
    const currIdx = statuses.indexOf(currentStatus);
    if (currIdx === 4 && step === 'Delivered') return false; // Returned
    return currIdx >= stepIdx;
  }

  isStepFinished(status: string): boolean {
    return status === 'Delivered' || status === 'ReturnedRejected';
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
