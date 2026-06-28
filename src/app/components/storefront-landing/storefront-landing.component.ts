import { Component, inject, PLATFORM_ID, OnInit, AfterViewInit, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WelcomeSectionComponent } from '../welcome-section/welcome-section.component';
import { BagsShoesSectionComponent } from '../bags-shoes-section/bags-shoes-section.component';
import { ClothingSectionComponent } from '../clothing-section/clothing-section.component';
import { KidsShoesSectionComponent } from '../kids-shoes-section/kids-shoes-section.component';
import { CatalogService, Brand } from '../../core/services/catalog.service';
import { AlertService } from '../../services/alert.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-storefront-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    WelcomeSectionComponent,
    BagsShoesSectionComponent,
    ClothingSectionComponent,
    KidsShoesSectionComponent
  ],
  template: `
    <!-- Natural scrolling container with unified background canvas -->
    <div class="relative w-full overflow-x-hidden flex flex-col text-[#2A1F1A] storefront-unified-canvas">
      <!-- Global subtle vignette backdrop overlay -->
      <div class="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-[#2A1F1A]/3 via-transparent to-[#2A1F1A]/8 mix-blend-multiply opacity-20"></div>

      <!-- Sections rendered in vertical order -->
      <app-welcome-section class="w-full relative z-20 animate-fade-in"></app-welcome-section>
      
      <app-bags-shoes-section class="w-full"></app-bags-shoes-section>
      
      <app-clothing-section class="w-full"></app-clothing-section>

      <!-- Trust Benefits Strip -->
      <section class="w-full bg-[#FAF6F0] border-t border-[#E8DDD0] py-12 flex items-center justify-center z-10 overflow-hidden select-none pointer-events-auto">
        <div class="w-full px-6 md:px-12 lg:px-24">
          <div class="bb-trust grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <!-- Item 1: Fast & Reliable Delivery -->
            <div class="bb-trust-item flex items-center gap-4">
              <div class="bb-trust-icon w-10 h-10 bg-[#EDD9C8] rounded-full flex items-center justify-center flex-shrink-0 border border-[#E8DDD0]">
                <svg class="w-5 h-5 text-[#C4633A]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v11.177m0-11.177h-1.197a1.875 1.875 0 00-1.582.805l-3 4.2a1.875 1.875 0 00-.281.932v4.062a1.125 1.125 0 001.125 1.125H9.75M8.25 14.25h1.5M16.5 14.25h1.5" />
                </svg>
              </div>
              <div>
                <p class="bb-trust-title font-bold text-[13px] text-[#2E2118] uppercase tracking-wide">Fast &amp; Reliable Delivery</p>
                <p class="bb-trust-sub text-[11px] text-[#8C7B6B] font-light">Across Egypt</p>
              </div>
            </div>

            <!-- Item 2: Premium Quality -->
            <div class="bb-trust-item flex items-center gap-4">
              <div class="bb-trust-icon w-10 h-10 bg-[#EDD9C8] rounded-full flex items-center justify-center flex-shrink-0 border border-[#E8DDD0]">
                <svg class="w-5 h-5 text-[#C4633A]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <div>
                <p class="bb-trust-title font-bold text-[13px] text-[#2E2118] uppercase tracking-wide">Premium Quality</p>
                <p class="bb-trust-sub text-[11px] text-[#8C7B6B] font-light">Curated with care</p>
              </div>
            </div>

            <!-- Item 3: Safe for Your Little One -->
            <div class="bb-trust-item flex items-center gap-4">
              <div class="bb-trust-icon w-10 h-10 bg-[#EDD9C8] rounded-full flex items-center justify-center flex-shrink-0 border border-[#E8DDD0]">
                <svg class="w-5 h-5 text-[#C4633A]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.599-3.75A11.952 11.952 0 0112 2.744z" />
                </svg>
              </div>
              <div>
                <p class="bb-trust-title font-bold text-[13px] text-[#2E2118] uppercase tracking-wide">Safe for Your Little One</p>
                <p class="bb-trust-sub text-[11px] text-[#8C7B6B] font-light">Trusted &amp; tested</p>
              </div>
            </div>

            <!-- Item 4: Easy Returns -->
            <div class="bb-trust-item flex items-center gap-4">
              <div class="bb-trust-icon w-10 h-10 bg-[#EDD9C8] rounded-full flex items-center justify-center flex-shrink-0 border border-[#E8DDD0]">
                <svg class="w-5 h-5 text-[#C4633A]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <div>
                <p class="bb-trust-title font-bold text-[13px] text-[#2E2118] uppercase tracking-wide">Easy Returns</p>
                <p class="bb-trust-sub text-[11px] text-[#8C7B6B] font-light">Hassle-free</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  `
})
export class StorefrontLandingComponent implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private catalogService = inject(CatalogService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  experienceLoaded = true;
  currentYear = new Date().getFullYear();
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

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.fromTo('.blob-container',
          { opacity: 0, scale: 0.9 },
          { opacity: 0.65, scale: 1, duration: 1.6 },
          0.1
        );
      }, 50);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Hero Load Entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
      heroTl.fromTo('app-welcome-section .bb-label',
        { y: -25, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.1 }
      );
      heroTl.fromTo('app-welcome-section .bb-h1',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1 },
        '-=0.95'
      );
      heroTl.fromTo('app-welcome-section .bb-sub',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1 },
        '-=0.95'
      );
      heroTl.fromTo('app-welcome-section .bb-btns',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1 },
        '-=0.85'
      );

      // 2. Bags & Shoes (Little One) Card Reveal & Parallax Background
      gsap.fromTo('app-bags-shoes-section .bb-strip',
        { y: 60, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: 'app-bags-shoes-section',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('app-bags-shoes-section .bb-strip-bg',
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: 'app-bags-shoes-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );

      gsap.fromTo('app-bags-shoes-section .bb-disc-badge',
        { scale: 0.3, opacity: 0, rotation: -12 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.4,
          ease: 'elastic.out(1, 0.75)',
          delay: 0.25,
          scrollTrigger: {
            trigger: 'app-bags-shoes-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 3. Clothing Section (Women & Newborn) Grid Reveal & Parallax Backgrounds
      gsap.fromTo('app-clothing-section .bb-cell',
        { y: 80, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.3,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: 'app-clothing-section',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('app-clothing-section .bb-cell:first-child .bb-cell-bg',
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: 'app-clothing-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );

      gsap.fromTo('app-clothing-section .bb-cell:last-child .bb-cell-bg',
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: 'app-clothing-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );



      // 5. Trust Items Staggered Reveal at the bottom
      gsap.fromTo('.bb-trust .bb-trust-item',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.bb-trust',
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  onBrandClick(brandId: string) {
    this.router.navigate(['/products'], { queryParams: { brand: brandId } });
  }
}
