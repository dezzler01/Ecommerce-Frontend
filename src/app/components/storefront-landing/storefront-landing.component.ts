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
      
      <app-kids-shoes-section class="w-full"></app-kids-shoes-section>
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

      // 4. Trust Items (Kids Shoes Section) Staggered Reveal
      gsap.fromTo('app-kids-shoes-section .bb-trust-item',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: 'app-kids-shoes-section',
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
