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
    <!-- Natural scrolling container with clean background -->
    <div class="relative w-full overflow-x-hidden flex flex-col text-[#2A1F1A]">
      <!-- Global subtle vignette backdrop overlay -->
      <div class="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-[#2A1F1A]/3 via-transparent to-[#2A1F1A]/8 mix-blend-multiply opacity-20"></div>

      <!-- Sections rendered in vertical order -->
      <app-welcome-section class="w-full animate-fade-in"></app-welcome-section>
      
      <app-bags-shoes-section class="w-full opacity-0"></app-bags-shoes-section>
      
      <app-clothing-section class="w-full opacity-0"></app-clothing-section>
      
      <app-kids-shoes-section class="w-full opacity-0"></app-kids-shoes-section>
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
      const sections = [
        'app-bags-shoes-section',
        'app-clothing-section',
        'app-kids-shoes-section'
      ];
      
      sections.forEach(secSelector => {
        // Fade in section container as it enters scroll view
        gsap.to(secSelector, {
          opacity: 1,
          duration: 0.4,
          scrollTrigger: {
            trigger: secSelector,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });

        // Register ScrollTrigger fade-up transitions on the panels
        gsap.fromTo(`${secSelector} .max-w-6xl`, 
          { 
            y: 40, 
            opacity: 0 
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: secSelector,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }
  }

  onBrandClick(brandId: string) {
    this.router.navigate(['/products'], { queryParams: { brand: brandId } });
  }
}
