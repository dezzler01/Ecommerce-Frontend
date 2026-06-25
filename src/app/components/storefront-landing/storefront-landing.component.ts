import { Component, inject, PLATFORM_ID, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WelcomeSectionComponent } from '../welcome-section/welcome-section.component';
import { BagsShoesSectionComponent } from '../bags-shoes-section/bags-shoes-section.component';
import { ClothingSectionComponent } from '../clothing-section/clothing-section.component';
import { KidsShoesSectionComponent } from '../kids-shoes-section/kids-shoes-section.component';
import { MothersChildrenSectionComponent } from '../mothers-children-section/mothers-children-section.component';
import { CatalogService, Brand } from '../../core/services/catalog.service';
import { AlertService } from '../../services/alert.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-storefront-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    WelcomeSectionComponent,
    BagsShoesSectionComponent,
    ClothingSectionComponent,
    KidsShoesSectionComponent,
    MothersChildrenSectionComponent
  ],
  template: `
    <!-- Natural scrolling container -->
    <div class="relative w-full overflow-x-hidden flex flex-col bg-[#FAF6F0] text-[#2A2522]">
      <!-- Global subtle vignette backdrop overlay -->
      <div class="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-[#161412]/5 via-transparent to-[#161412]/10 mix-blend-multiply opacity-50"></div>

      <!-- Sections rendered in vertical order -->
      <app-welcome-section class="w-full"></app-welcome-section>
      
      <app-bags-shoes-section class="w-full"></app-bags-shoes-section>
      
      <app-clothing-section class="w-full"></app-clothing-section>
      
      <app-kids-shoes-section class="w-full"></app-kids-shoes-section>
      
      <app-mothers-children-section class="w-full"></app-mothers-children-section>
    </div>
  `
})
export class StorefrontLandingComponent implements OnInit, OnDestroy {
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
      gsap.registerPlugin(ScrollTrigger);
      setTimeout(() => {
        this.initScrollAnimations();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
  }

  private initScrollAnimations() {
    // 1. Hero Blob fade out and shrink on scroll
    gsap.to('.ambient-blob', {
      scrollTrigger: {
        trigger: 'app-welcome-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      scale: 0.35,
      opacity: 0,
      y: -100,
      ease: 'none'
    });

    // 2. Bags & Shoes section reveal and pinning
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: 'app-bags-shoes-section',
        start: 'top top',
        end: '+=500',
        pin: true,
        scrub: 1
      }
    });
    tl1.fromTo('app-bags-shoes-section .lg:col-span-7 > div',
      { y: 150, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.25, duration: 1.5, ease: 'power3.out' }
    );
    tl1.fromTo('app-bags-shoes-section .lg:col-span-5',
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out' },
      '-=1.0'
    );

    // 3. Apparel (Clothing) section reveal and pinning
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: 'app-clothing-section',
        start: 'top top',
        end: '+=500',
        pin: true,
        scrub: 1
      }
    });
    tl2.fromTo('app-clothing-section .lg:col-span-4',
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }
    );
    tl2.fromTo('app-clothing-section .lg:col-span-3 > div',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: 'power3.out' },
      '-=1.0'
    );
    tl2.fromTo('app-clothing-section .lg:col-span-5',
      { scale: 0.82, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.8, ease: 'power4.out' },
      '-=1.0'
    );

    // 4. Kids Shoes section reveal and pinning
    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: 'app-kids-shoes-section',
        start: 'top top',
        end: '+=500',
        pin: true,
        scrub: 1
      }
    });
    tl3.fromTo('app-kids-shoes-section .lg:col-span-5',
      { x: -100, scale: 0.9, opacity: 0 },
      { x: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
    );
    tl3.fromTo('app-kids-shoes-section .lg:col-span-7',
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out' },
      '-=1.0'
    );

    // 5. Mothers & Children section reveal and pinning
    const tl4 = gsap.timeline({
      scrollTrigger: {
        trigger: 'app-mothers-children-section',
        start: 'top top',
        end: '+=500',
        pin: true,
        scrub: 1
      }
    });
    tl4.fromTo('app-mothers-children-section .lg:col-span-7',
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }
    );
    tl4.fromTo('app-mothers-children-section .lg:col-span-5',
      { x: 100, scale: 0.9, opacity: 0 },
      { x: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' },
      '-=1.0'
    );
  }

  onBrandClick(brandId: string) {
    this.router.navigate(['/products'], { queryParams: { brand: brandId } });
  }
}
