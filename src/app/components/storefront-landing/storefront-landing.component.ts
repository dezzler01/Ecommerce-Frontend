import { Component, inject, PLATFORM_ID, OnInit, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
          [style.opacity]="currentSection === 0 ? '1' : '0'"
          class="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none transition-opacity duration-700"
        >
          <app-welcome-section class="flex-1 flex flex-col min-h-0"></app-welcome-section>
        </div>

        <!-- Section 2: Bags & Shoes -->
        <div
          [style.opacity]="currentSection === 1 ? '1' : '0'"
          class="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none transition-opacity duration-700 opacity-0"
        >
          <app-bags-shoes-section class="flex-1 flex flex-col min-h-0"></app-bags-shoes-section>
        </div>

        <!-- Section 3: Clothing -->
        <div
          [style.opacity]="currentSection === 2 ? '1' : '0'"
          class="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none transition-opacity duration-700 opacity-0"
        >
          <app-clothing-section class="flex-1 flex flex-col min-h-0"></app-clothing-section>
        </div>

        <!-- Section 4: Kids Shoes -->
        <div
          [style.opacity]="currentSection === 3 ? '1' : '0'"
          class="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none transition-opacity duration-700 opacity-0"
        >
          <app-kids-shoes-section class="flex-1 flex flex-col min-h-0"></app-kids-shoes-section>
        </div>

        <!-- Section 5: Mothers & Children -->
        <div
          [style.opacity]="currentSection === 4 ? '1' : '0'"
          class="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none opacity-0"
        >
          <app-mothers-children-section class="flex-1 flex flex-col min-h-0"></app-mothers-children-section>
        </div>
      </div>

      <!-- Spacer to drive the scroll range for fixed canvas + overlays -->
      <div class="h-[500vh] w-full pointer-events-none"></div>
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
