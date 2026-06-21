import { Component, inject, PLATFORM_ID, AfterViewInit, OnInit, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VideoScrollCanvasComponent } from '../video-scroll-canvas/video-scroll-canvas.component';
import { WelcomeSectionComponent } from '../welcome-section/welcome-section.component';
import { BagsShoesSectionComponent } from '../bags-shoes-section/bags-shoes-section.component';
import { ClothingSectionComponent } from '../clothing-section/clothing-section.component';
import { KidsShoesSectionComponent } from '../kids-shoes-section/kids-shoes-section.component';
import { MothersChildrenSectionComponent } from '../mothers-children-section/mothers-children-section.component';
import { CatalogService, Brand } from '../../core/services/catalog.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-storefront-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
      <footer class="relative z-20 w-full py-12 px-6 md:px-12 border-t border-[#2A2522]/5 bg-[#FBF9F6] text-[#8A817C] pointer-events-auto">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-[9px] tracking-[0.2em] uppercase font-light text-left">
          <!-- Col 1: Collections -->
          <div>
            <h4 class="font-bold text-[#2A2522] mb-4">Collections</h4>
            <ul class="flex flex-col gap-2.5">
              <li><a href="#women" class="hover:text-[#E07A5F] transition-colors">Women's Accessories</a></li>
              <li><a href="#clothing" class="hover:text-[#E07A5F] transition-colors">Premium Apparel</a></li>
              <li><a href="#mothers" class="hover:text-[#E07A5F] transition-colors">Maternity Luxe</a></li>
            </ul>
          </div>
          <!-- Col 2: Assistance -->
          <div>
            <h4 class="font-bold text-[#2A2522] mb-4">Assistance</h4>
            <ul class="flex flex-col gap-2.5">
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Customer Support</a></li>
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Shipping & Returns</a></li>
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Size Guide</a></li>
            </ul>
          </div>
          <!-- Col 3: Corporate -->
          <div>
            <h4 class="font-bold text-[#2A2522] mb-4">Corporate</h4>
            <ul class="flex flex-col gap-2.5">
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Our Story</a></li>
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Sustainability</a></li>
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Careers</a></li>
            </ul>
          </div>
          <!-- Col 4: Social & Connect -->
          <div>
            <h4 class="font-bold text-[#2A2522] mb-4">Social &amp; Connect</h4>
            <ul class="flex flex-col gap-3 lowercase tracking-wider text-xs">
              <li>
                <a href="https://instagram.com" target="_blank" class="hover:text-[#E07A5F] transition-all flex items-center gap-2 group">
                  <svg class="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" class="hover:text-[#E07A5F] transition-all flex items-center gap-2 group">
                  <svg class="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="https://pinterest.com" target="_blank" class="hover:text-[#E07A5F] transition-all flex items-center gap-2 group">
                  <svg class="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.164 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.27 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.621 0 11.985-5.367 11.985-11.988C24.005 5.367 18.638 0 12.017 0z"/>
                  </svg>
                  <span>Pinterest</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Advanced Footer Newsletter Section -->
        <div class="max-w-6xl mx-auto w-full pt-8 pb-4 border-t border-[#2A2522]/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          <div class="space-y-2">
            <h4 class="font-bold text-[#2A2522] text-[9px] tracking-[0.2em] uppercase">Newsletter Subscription</h4>
            <p class="leading-relaxed text-[11px] lowercase tracking-normal text-[#8A817C] max-w-sm">
              subscribe to receive notices of private sales, new collections, and bespoke designs.
            </p>
          </div>
          <div class="relative w-full max-w-[320px]">
            <input 
              type="email" 
              placeholder="enter your email address" 
              class="w-full bg-[#FAF6F0] border border-[#2A2522]/15 rounded-md py-3 pl-4 pr-12 text-xs text-[#2A2522] placeholder-[#8A817C]/60 tracking-wider focus:outline-none"
            />
            <button class="absolute right-0 top-0 h-full px-4 text-[#2A2522] hover:text-[#E07A5F] transition-colors duration-300">
              <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="max-w-6xl mx-auto w-full pt-8 border-t border-[#2A2522]/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.2em] text-[#8A817C]">
          <div>© {{ currentYear }}. All Rights Reserved.</div>
          <div class="flex gap-6 uppercase text-[8px] tracking-widest font-mono">
            <a href="#" class="hover:text-[#E07A5F] transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-[#E07A5F] transition-colors">Terms of Service</a>
            <a href="#" class="hover:text-[#E07A5F] transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class StorefrontLandingComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private catalogService = inject(CatalogService);
  private router = inject(Router);
  experienceLoaded = false;
  currentYear = new Date().getFullYear();
  currentSection = 0;
  featuredBrands = signal<Brand[]>([]);

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
