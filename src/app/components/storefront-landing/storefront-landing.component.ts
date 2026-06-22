import { Component, inject, PLATFORM_ID, AfterViewInit, OnInit, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoScrollCanvasComponent } from '../video-scroll-canvas/video-scroll-canvas.component';
import { WelcomeSectionComponent } from '../welcome-section/welcome-section.component';
import { BagsShoesSectionComponent } from '../bags-shoes-section/bags-shoes-section.component';
import { ClothingSectionComponent } from '../clothing-section/clothing-section.component';
import { KidsShoesSectionComponent } from '../kids-shoes-section/kids-shoes-section.component';
import { MothersChildrenSectionComponent } from '../mothers-children-section/mothers-children-section.component';
import { CatalogService, Brand } from '../../core/services/catalog.service';
import { AlertService } from '../../services/alert.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-storefront-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    VideoScrollCanvasComponent,
    WelcomeSectionComponent,
    BagsShoesSectionComponent,
    ClothingSectionComponent,
    KidsShoesSectionComponent,
    MothersChildrenSectionComponent
  ],
  template: `
    <!-- Container driving the entire scroll trigger range -->
    <div
      id="scroll-trigger-container"
      class="relative w-full overflow-x-hidden"
    >
      <!-- Scroll Canvas component (fixed in background) -->
      <app-video-scroll-canvas
        (loadComplete)="onExperienceLoaded()"
        (progressUpdate)="onProgressUpdate($event)"
      ></app-video-scroll-canvas>

      <!-- Global vignette/overlay for canvas depth -->
      <div class="fixed inset-0 pointer-events-none z-[2] bg-gradient-to-b from-[#161412]/5 via-transparent to-[#161412]/20 mix-blend-multiply opacity-75"></div>

      <!-- Overlay UI content (fixed viewport overlays that fade in/out on scroll) -->
      <div
        class="fixed inset-0 z-10 w-full h-screen pointer-events-none"
        [class.opacity-100]="experienceLoaded"
        [class.opacity-0]="!experienceLoaded"
      >
        <!-- Section 1: Welcome -->
        <div 
          id="overlay-section-0"
          class="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-auto"
        >
          <app-welcome-section></app-welcome-section>
        </div>

        <!-- Section 2: Bags & Shoes -->
        <div 
          id="overlay-section-1"
          class="absolute inset-0 w-full h-full pointer-events-none opacity-0"
        >
          <app-bags-shoes-section></app-bags-shoes-section>
        </div>

        <!-- Section 3: Clothing -->
        <div 
          id="overlay-section-2"
          class="absolute inset-0 w-full h-full pointer-events-none opacity-0"
        >
          <app-clothing-section></app-clothing-section>
        </div>

        <!-- Section 4: Kids Shoes -->
        <div 
          id="overlay-section-3"
          class="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none opacity-0"
        >
          <app-kids-shoes-section class="flex-1 flex flex-col min-h-0"></app-kids-shoes-section>
        </div>

        <!-- Section 5: Mothers & Children -->
        <div 
          id="overlay-section-4"
          class="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none opacity-0"
        >
          <app-mothers-children-section class="flex-1 flex flex-col min-h-0"></app-mothers-children-section>
        </div>
      </div>

      <!-- Spacer to drive the scroll range for fixed canvas + overlays -->
      <div class="h-[500vh] w-full pointer-events-none"></div>

      <!-- Real scrollable footer at the bottom of the page (occupies normal flow, z-index 20) -->
      <footer class="relative z-20 w-full pt-16 pb-10 px-6 md:px-12 border-t border-[#E07A5F]/15 bg-[#12100E] text-[#FAF6F0]/65 pointer-events-auto overflow-hidden">
        <!-- Top decorative noise overlay / watercolor line -->
        <div class="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#F4A261] via-[#E07A5F] to-[#B84F7D] opacity-40"></div>

        <div class="max-w-6xl mx-auto flex flex-col gap-12">
          
          <!-- Tier 1: Brand & Link Columns -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-[9px] tracking-[0.2em] uppercase font-light text-left">
            <!-- Brand Monogram Column -->
            <div class="lg:col-span-2 pr-0 lg:pr-8 flex flex-col justify-start">
              <div class="logo-container relative h-9 w-32 flex items-center justify-center cursor-pointer select-none mb-4">
                <svg class="logo-svg-animate absolute inset-0 w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="footer-watercolor-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#F4A261" stop-opacity="0.8"/>
                      <stop offset="30%" stop-color="#E76F51" stop-opacity="0.9"/>
                      <stop offset="65%" stop-color="#F38E75" stop-opacity="0.8"/>
                      <stop offset="100%" stop-color="#B84F7D" stop-opacity="0.8"/>
                    </linearGradient>
                  </defs>
                  <path d="M 40,88 C 110,65 230,78 350,70 C 470,62 520,78 560,88 C 575,92 570,102 555,108 C 510,128 390,122 280,128 C 170,134 90,118 45,108 C 30,105 30,92 40,88 Z" fill="url(#footer-watercolor-gradient)" />
                </svg>
                <span class="logo-text relative z-10 text-[13px] font-black tracking-[-0.03em] text-[#FAF6F0] uppercase select-none font-sans">
                  Picks&amp;More
                </span>
              </div>
              <p class="text-[10px] tracking-widest leading-relaxed lowercase text-[#FAF6F0]/50 normal-case mb-4 pr-4">
                Curating timeless luxury apparel, premium footwear, and elegant accessories for women, infants, and select children collections. Designed for modern living with heritage precision.
              </p>
            </div>

            <!-- Col 2: Collections -->
            <div>
              <h4 class="font-bold text-[#FAF6F0] mb-5 tracking-[0.25em]">Collections</h4>
              <ul class="flex flex-col gap-3">
                <li><a [routerLink]="['/products']" [queryParams]="{ target: 'Women', subcategory: 'bags' }" class="hover:text-[#E07A5F] hover:translate-x-0.5 transition-all inline-block duration-300">Women's Accessories</a></li>
                <li><a [routerLink]="['/products']" [queryParams]="{ target: 'Women', subcategory: 'fashion' }" class="hover:text-[#E07A5F] hover:translate-x-0.5 transition-all inline-block duration-300">Premium Apparel</a></li>
                <li><a [routerLink]="['/products']" [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }" class="hover:text-[#E07A5F] hover:translate-x-0.5 transition-all inline-block duration-300">Maternity Luxe</a></li>
              </ul>
            </div>

            <!-- Col 3: Assistance -->
            <div>
              <h4 class="font-bold text-[#FAF6F0] mb-5 tracking-[0.25em]">Assistance</h4>
              <ul class="flex flex-col gap-3">
                <li><button (click)="openTrackOrderModal($event)" class="hover:text-[#E07A5F] hover:translate-x-0.5 transition-all text-left bg-transparent border-none p-0 outline-none uppercase tracking-[0.2em] font-light text-[9px] cursor-pointer duration-300">Track My Order</button></li>
                <li><a href="#" (click)="openStaticFallback($event, 'Shipping & Returns')" class="hover:text-[#E07A5F] hover:translate-x-0.5 transition-all inline-block duration-300">Shipping &amp; Returns</a></li>
                <li><a href="#" (click)="openStaticFallback($event, 'Size Guide')" class="hover:text-[#E07A5F] hover:translate-x-0.5 transition-all inline-block duration-300">Size Guide</a></li>
              </ul>
            </div>

            <!-- Col 4: Corporate -->
            <div>
              <h4 class="font-bold text-[#FAF6F0] mb-5 tracking-[0.25em]">Corporate</h4>
              <ul class="flex flex-col gap-3">
                <li><a href="#" (click)="openStaticFallback($event, 'Our Story')" class="hover:text-[#E07A5F] hover:translate-x-0.5 transition-all inline-block duration-300">Our Story</a></li>
                <li><a href="#" (click)="openStaticFallback($event, 'Sustainability')" class="hover:text-[#E07A5F] hover:translate-x-0.5 transition-all inline-block duration-300">Sustainability</a></li>
                <li><a href="#" (click)="openStaticFallback($event, 'Careers')" class="hover:text-[#E07A5F] hover:translate-x-0.5 transition-all inline-block duration-300">Careers</a></li>
              </ul>
            </div>
          </div>

          <!-- Tier 2: Premium Newsletter Block -->
          <div class="border-t border-b border-white/5 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="text-left max-w-md">
              <h5 class="text-[10px] font-bold text-[#FAF6F0] tracking-[0.25em] uppercase mb-1">Newsletter Subscription</h5>
              <p class="text-[9px] text-[#FAF6F0]/50 tracking-wider lowercase normal-case">Be the first to receive updates on seasonal catalog drops, editorial highlights, and VIP-only events.</p>
            </div>
            <div class="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Email Address" 
                class="px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/30 text-[10px] rounded-lg tracking-widest focus:outline-none focus:border-[#E07A5F] transition-all min-w-[240px] uppercase font-mono"
              />
              <button 
                (click)="openStaticFallback($event, 'Newsletter Subscription')"
                class="px-6 py-2.5 bg-[#E07A5F] hover:bg-[#F38E75] text-[#12100E] text-[9px] font-extrabold uppercase tracking-[0.2em] rounded-lg transition-all shadow-[0_0_12px_rgba(224,122,95,0.2)] active:scale-95 duration-300"
              >
                Subscribe
              </button>
            </div>
          </div>

          <!-- Tier 3: Social & Connect + Legal & Copyright -->
          <div class="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.2em] text-[#FAF6F0]/50 font-light border-t border-white/0 pt-2">
            <!-- Copyright & Social Icons -->
            <div class="flex flex-col sm:flex-row items-center gap-6">
              <div>© {{ currentYear }} picks&amp;more. All Rights Reserved.</div>
              <ul class="flex items-center gap-4 lowercase tracking-wider text-[11px]">
                <li>
                  <a href="https://instagram.com" target="_blank" class="hover:text-[#E07A5F] transition-all flex items-center gap-1.5 group">
                    <svg class="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="https://facebook.com" target="_blank" class="hover:text-[#E07A5F] transition-all flex items-center gap-1.5 group">
                    <svg class="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="https://pinterest.com" target="_blank" class="hover:text-[#E07A5F] transition-all flex items-center gap-1.5 group">
                    <svg class="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.164 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.27 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.621 0 11.985-5.367 11.985-11.988C24.005 5.367 18.638 0 12.017 0z"/>
                    </svg>
                    <span>Pinterest</span>
                  </a>
                </li>
              </ul>
            </div>

            <!-- Legal Links -->
            <div class="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 uppercase text-[8px] tracking-widest font-mono">
              <a href="#" (click)="openStaticFallback($event, 'Privacy Policy')" class="hover:text-[#E07A5F] transition-colors">Privacy Policy</a>
              <a href="#" (click)="openStaticFallback($event, 'Terms of Service')" class="hover:text-[#E07A5F] transition-colors">Terms of Service</a>
              <a href="#" (click)="openStaticFallback($event, 'Cookie Policy')" class="hover:text-[#E07A5F] transition-colors">Cookies</a>
            </div>
          </div>

        </div>
      </footer>

      <!-- Premium Glassmorphic Live Order Tracking Modal -->
      <div *ngIf="isTrackOrderModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
        <!-- Backdrop Layer -->
        <div 
          (click)="closeTrackOrderModal()" 
          class="fixed inset-0 bg-[#2A2522]/15 backdrop-blur-[4px] cursor-pointer"
        ></div>

        <!-- Frosted Glass Modal Sheet -->
        <div class="relative w-full max-w-lg bg-[#FAF6F0]/85 backdrop-blur-xl border border-[#2A2522]/10 p-6 md:p-8 rounded-2xl flex flex-col space-y-5 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl z-10 text-left">
          <!-- Close Button -->
          <button (click)="closeTrackOrderModal()" class="absolute top-4 right-4 text-[#2A2522]/40 hover:text-[#E07A5F] text-sm p-1.5 transition-colors cursor-pointer">
            ✕
          </button>

          <!-- Header -->
          <div class="border-b border-[#2A2522]/10 pb-3">
            <span class="tracking-widest font-mono text-[9px] uppercase font-bold text-[#E07A5F] block mb-1">
              Active Logistics Pipeline
            </span>
            <h3 class="text-base font-serif-luxury font-light text-[#2A2522] tracking-wider uppercase">
              Track Your Order
            </h3>
          </div>

          <!-- Input query row -->
          <div class="space-y-2">
            <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Order Reference ID (GUID) *</label>
            <div class="flex gap-2">
              <input 
                type="text" 
                [(ngModel)]="trackOrderId" 
                (ngModelChange)="trackingError.set('')"
                placeholder="E.g. d3b07384-d113-40e1-a3f2-861f2113d077" 
                class="flex-1 px-3 py-2 bg-white/70 border border-[#2A2522]/10 rounded-lg text-xs text-[#2A2522] focus:outline-none focus:border-[#E07A5F] transition-all"
              />
              <button 
                (click)="trackOrder()" 
                [disabled]="trackingLoading()"
                class="px-5 py-2 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {{ trackingLoading() ? 'Querying...' : 'Query' }}
              </button>
            </div>
            <p *ngIf="trackingError()" class="text-[9px] text-red-500 font-semibold tracking-wide uppercase mt-1">
              {{ trackingError() }}
            </p>
          </div>

          <!-- Spinner -->
          <div *ngIf="trackingLoading()" class="flex flex-col items-center py-6 justify-center space-y-2">
            <div class="w-6 h-6 border-2 border-[#E07A5F]/20 border-t-[#E07A5F] rounded-full animate-spin"></div>
            <span class="text-[9px] uppercase tracking-wider text-[#6B5E57] font-light">Querying Live Hub...</span>
          </div>

          <!-- Order Status & Stepper Info -->
          <div *ngIf="!trackingLoading() && trackedOrder()" class="space-y-5 pt-2 animate-fade-in">
            <!-- Stepper UI -->
            <div class="space-y-3">
              <h4 class="text-[8px] uppercase tracking-widest font-bold text-[#E07A5F]">Logistics Status</h4>
              <div class="flex justify-between items-center relative py-2">
                <!-- Progress Line -->
                <div class="absolute left-0 right-0 top-1/2 h-[2px] bg-[#2A2522]/10 -translate-y-1/2 z-0"></div>
                <!-- Active Progress Line -->
                <div 
                  [ngStyle]="{
                    'width': getStepPercentage(trackedOrder().orderStatus)
                  }"
                  class="absolute left-0 top-1/2 h-[2px] bg-[#E07A5F] -translate-y-1/2 z-0 transition-all duration-700"
                ></div>

                <!-- Step 1: Pending -->
                <div class="flex flex-col items-center z-10">
                  <div 
                    [ngClass]="{
                      'bg-[#E07A5F] text-white border-[#E07A5F]': isStepActive(trackedOrder().orderStatus, 0),
                      'bg-white text-[#6B5E57] border-[#2A2522]/10': !isStepActive(trackedOrder().orderStatus, 0)
                    }"
                    class="w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-bold transition-colors duration-300"
                  >
                    1
                  </div>
                  <span class="text-[7px] uppercase tracking-wider mt-1 text-center font-medium max-w-[60px] text-[#2A2522]">Pending Verification</span>
                </div>

                <!-- Step 2: Confirmed -->
                <div class="flex flex-col items-center z-10">
                  <div 
                    [ngClass]="{
                      'bg-[#E07A5F] text-white border-[#E07A5F]': isStepActive(trackedOrder().orderStatus, 1),
                      'bg-white text-[#6B5E57] border-[#2A2522]/10': !isStepActive(trackedOrder().orderStatus, 1)
                    }"
                    class="w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-bold transition-colors duration-300"
                  >
                    2
                  </div>
                  <span class="text-[7px] uppercase tracking-wider mt-1 text-center font-medium max-w-[60px] text-[#2A2522]">Preparing Order</span>
                </div>

                <!-- Step 3: Out For Delivery -->
                <div class="flex flex-col items-center z-10">
                  <div 
                    [ngClass]="{
                      'bg-[#E07A5F] text-white border-[#E07A5F]': isStepActive(trackedOrder().orderStatus, 2),
                      'bg-white text-[#6B5E57] border-[#2A2522]/10': !isStepActive(trackedOrder().orderStatus, 2)
                    }"
                    class="w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-bold transition-colors duration-300"
                  >
                    3
                  </div>
                  <span class="text-[7px] uppercase tracking-wider mt-1 text-center font-medium max-w-[60px] text-[#2A2522]">Out For Delivery</span>
                </div>

                <!-- Step 4: Delivered -->
                <div class="flex flex-col items-center z-10">
                  <div 
                    [ngClass]="{
                      'bg-[#E07A5F] text-white border-[#E07A5F]': isStepActive(trackedOrder().orderStatus, 3),
                      'bg-white text-[#6B5E57] border-[#2A2522]/10': !isStepActive(trackedOrder().orderStatus, 3)
                    }"
                    class="w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-bold transition-colors duration-300"
                  >
                    4
                  </div>
                  <span class="text-[7px] uppercase tracking-wider mt-1 text-center font-medium max-w-[60px] text-[#2A2522]">Delivered</span>
                </div>
              </div>
            </div>

            <!-- Rejected banner -->
            <div *ngIf="trackedOrder().orderStatus === 'ReturnedRejected'" class="p-3 bg-red-50 border border-red-200 text-red-500 rounded-xl text-[10px] uppercase font-bold tracking-widest text-center">
              ⚠ Order Rejected or Returned
            </div>

            <!-- Meta details -->
            <div class="grid grid-cols-2 gap-4 bg-white/45 p-4 rounded-xl border border-[#2A2522]/5 text-[9px] tracking-widest uppercase text-[#6B5E57]">
              <div>
                <span class="opacity-60 block mb-0.5">Order Date</span>
                <span class="font-bold text-[#2A2522]">{{ trackedOrder().orderDate | date:'medium' }}</span>
              </div>
              <div>
                <span class="opacity-60 block mb-0.5">Payment Method</span>
                <span class="font-bold text-[#2A2522]">{{ trackedOrder().paymentMethod }}</span>
              </div>
              <div>
                <span class="opacity-60 block mb-0.5">Shipment Target</span>
                <span class="font-bold text-[#2A2522]">{{ trackedOrder().shippingAddress.fullName }}</span>
              </div>
              <div>
                <span class="opacity-60 block mb-0.5">Contact Phone</span>
                <span class="font-bold text-[#2A2522]">{{ trackedOrder().shippingAddress.phoneNumber }}</span>
              </div>
              <div class="col-span-2">
                <span class="opacity-60 block mb-0.5">Destination Address</span>
                <span class="font-bold text-[#2A2522]">{{ trackedOrder().shippingAddress.street }}, {{ trackedOrder().shippingAddress.city }}, {{ trackedOrder().shippingAddress.governorate }}</span>
              </div>
            </div>

            <!-- Purchased items -->
            <div class="space-y-2">
              <h4 class="text-[8px] uppercase tracking-widest font-bold text-[#E07A5F]">Items Secured</h4>
              <div class="max-h-[150px] overflow-y-auto custom-scrollbar border border-[#2A2522]/5 rounded-xl divide-y divide-[#2A2522]/5 bg-white/45">
                <div *ngFor="let item of trackedOrder().items" class="p-3 flex justify-between items-center text-[9px] uppercase tracking-widest text-[#2A2522]">
                  <div class="flex flex-col gap-0.5">
                    <span class="font-bold">{{ item.productTitle || 'Premium Boutique Specimen' }}</span>
                    <span class="text-[7px] text-[#6B5E57] font-normal">Qty: {{ item.quantity }} × LE {{ item.unitPrice | number:'1.2-2' }}</span>
                  </div>
                  <span class="font-mono font-bold">LE {{ (item.quantity * item.unitPrice) | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>

            <!-- Totals row -->
            <div class="flex justify-between items-center border-t border-[#2A2522]/10 pt-3 text-[10px] uppercase tracking-widest text-[#2A2522]">
              <div class="flex flex-col gap-0.5">
                <span class="opacity-70 text-[8px]">Including LE {{ trackedOrder().shippingCost | number:'1.2-2' }} shipping</span>
                <span class="font-bold">Total Valuation</span>
              </div>
              <span class="font-mono text-base font-bold text-[#E07A5F]">LE {{ trackedOrder().totalPrice | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StorefrontLandingComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private catalogService = inject(CatalogService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  experienceLoaded = false;
  currentYear = new Date().getFullYear();
  currentSection = 0;
  featuredBrands = signal<Brand[]>([]);

  openStaticFallback(event: Event, pageName: string) {
    event.preventDefault();
    this.alertService.showAlert({
      title: pageName,
      message: `The ${pageName} page is currently under development. Our luxury curation team is finalizing this brand experience to ensure perfection. Please check back shortly.`,
      type: 'info',
      confirmText: 'Understood'
    });
  }

  isTrackOrderModalOpen = signal<boolean>(false);
  trackOrderId = '';
  trackedOrder = signal<any>(null);
  trackingError = signal<string>('');
  trackingLoading = signal<boolean>(false);

  openTrackOrderModal(event: Event) {
    event.preventDefault();
    this.trackOrderId = '';
    this.trackedOrder.set(null);
    this.trackingError.set('');
    this.trackingLoading.set(false);
    this.isTrackOrderModalOpen.set(true);
  }

  closeTrackOrderModal() {
    this.isTrackOrderModalOpen.set(false);
  }

  trackOrder() {
    const id = this.trackOrderId.trim();
    if (!id) {
      this.trackingError.set('Please enter an Order reference ID.');
      return;
    }

    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!guidRegex.test(id)) {
      this.trackingError.set('Please enter a valid 36-character Order ID (GUID).');
      return;
    }

    this.trackingError.set('');
    this.trackingLoading.set(true);
    this.trackedOrder.set(null);

    this.catalogService.trackOrder(id).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.trackedOrder.set(res.data);
        } else {
          this.trackingError.set(res.message || 'Unable to find order. Please verify the reference ID.');
        }
        this.trackingLoading.set(false);
      },
      error: (err) => {
        this.trackingError.set(err.error?.message || 'Order not found. Please verify the reference ID.');
        this.trackingLoading.set(false);
      }
    });
  }

  isStepActive(status: string, stepIndex: number): boolean {
    const statusMap: Record<string, number> = {
      'PendingVerification': 0,
      'ConfirmedPreparing': 1,
      'OutForDelivery': 2,
      'Delivered': 3
    };
    if (status === 'ReturnedRejected') return false;
    const currentStep = statusMap[status] ?? 0;
    return currentStep >= stepIndex;
  }

  getStepPercentage(status: string): string {
    const statusMap: Record<string, string> = {
      'PendingVerification': '0%',
      'ConfirmedPreparing': '33%',
      'OutForDelivery': '66%',
      'Delivered': '100%'
    };
    return statusMap[status] ?? '0%';
  }

  ngOnInit() {
    this.catalogService.getBrands().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          const featured = res.data.filter(b => b.showInCards);
          this.featuredBrands.set(featured);
        }
      }
    });
  }

  onBrandClick(brandId: string) {
    this.router.navigate(['/products'], { queryParams: { brand: brandId } });
  }

  onExperienceLoaded() {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof document !== 'undefined') {
        document.body.classList.add('intro-running');
      }
    }
    this.experienceLoaded = true;

    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          onComplete: () => {
            if (typeof document !== 'undefined') {
              document.body.classList.remove('intro-running');
            }
          }
        });

        // 1. Background Video Canvas Focus Reveal
        tl.set('app-video-scroll-canvas canvas', {
          scale: 1.12,
          filter: 'blur(15px) contrast(1.1)',
          opacity: 0
        });

        tl.to('app-video-scroll-canvas canvas', {
          scale: 1.0,
          filter: 'blur(0px) contrast(1.0)',
          opacity: 1,
          duration: 1.8
        }, 0);

        // 2. Welcome Glow & Scroll Indicator Reveal
        tl.fromTo('.brand-watercolor-glow, .welcome-scroll-indicator',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1.4 },
          0.4
        );
      }
    }, 50);
  }

  onProgressUpdate(progress: number) {
    if (progress < 0.20) {
      this.currentSection = 0;
    } else if (progress < 0.40) {
      this.currentSection = 1;
    } else if (progress < 0.60) {
      this.currentSection = 2;
    } else if (progress < 0.80) {
      this.currentSection = 3;
    } else {
      this.currentSection = 4;
    }
  }
}
