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

      <!-- Featured Brands Showcase Section (Luxury Circular Cards) -->
      <section *ngIf="featuredBrands().length > 0" class="relative z-20 w-full py-16 px-6 md:px-12 bg-[#FBF9F6] border-t border-[#2A2522]/5 text-center text-[#2A2522]">
        <div class="max-w-6xl mx-auto space-y-12">
          <!-- Header -->
          <div class="space-y-3">
            <span class="tracking-widest font-mono text-[9px] uppercase font-bold text-[#E07A5F] block">Design Houses</span>
            <h3 class="text-3xl font-serif-luxury font-light uppercase tracking-widest text-[#2A2522] text-[24px]">Featured Partner Brands</h3>
            <div class="w-16 h-px bg-[#E07A5F] mx-auto mt-4"></div>
          </div>

          <!-- Cards Grid -->
          <div class="flex flex-wrap gap-8 justify-center items-center pt-4">
            <div 
              *ngFor="let brand of featuredBrands()"
              (click)="onBrandClick(brand.id)"
              class="group cursor-pointer flex flex-col items-center space-y-4 transition-transform duration-500 hover:-translate-y-2"
            >
              <!-- Circular Logo Card with soft shadow and zoom/rotation effects -->
              <div class="w-28 h-28 rounded-full overflow-hidden border border-[#2A2522]/5 bg-white shadow-xs p-5 flex items-center justify-center transition-all duration-500 group-hover:shadow-md group-hover:border-[#E07A5F]/20 group-hover:rotate-6">
                <img 
                  [src]="brand.logoUrl" 
                  [alt]="brand.name" 
                  class="w-full h-full object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                />
              </div>
              <!-- Brand Name -->
              <span class="font-serif-luxury text-xs uppercase tracking-[0.2em] font-medium text-[#8A817C] group-hover:text-[#2A2522] transition-colors duration-300">
                {{ brand.name }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Real scrollable footer at the bottom of the page (occupies normal flow, z-index 20) -->
      <footer class="relative z-20 w-full py-12 px-6 md:px-12 border-t border-[#2A2522]/5 bg-[#FBF9F6] text-[#8A817C] pointer-events-auto">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-[9px] tracking-[0.2em] uppercase font-light text-left">
          <!-- Col 1: Collections -->
          <div>
            <h4 class="font-bold text-[#2A2522] mb-4">Collections</h4>
            <ul class="flex flex-col gap-2">
              <li><a href="#women" class="hover:text-[#E07A5F] transition-colors">Women's Accessories</a></li>
              <li><a href="#clothing" class="hover:text-[#E07A5F] transition-colors">Premium Apparel</a></li>
              <li><a href="#mothers" class="hover:text-[#E07A5F] transition-colors">Maternity Luxe</a></li>
            </ul>
          </div>
          <!-- Col 2: Assistance -->
          <div>
            <h4 class="font-bold text-[#2A2522] mb-4">Assistance</h4>
            <ul class="flex flex-col gap-2">
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Customer Support</a></li>
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Shipping & Returns</a></li>
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Size Guide</a></li>
            </ul>
          </div>
          <!-- Col 3: Corporate -->
          <div>
            <h4 class="font-bold text-[#2A2522] mb-4">Corporate</h4>
            <ul class="flex flex-col gap-2">
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Our Story</a></li>
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Sustainability</a></li>
              <li><a href="#" class="hover:text-[#E07A5F] transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>
        <div class="max-w-6xl mx-auto w-full pt-6 border-t border-[#2A2522]/5 text-center text-[10px] tracking-[0.2em]">
          © {{ currentYear }}. All Rights Reserved.
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
