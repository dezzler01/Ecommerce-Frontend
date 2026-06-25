import { 
  Component, 
  Inject, 
  PLATFORM_ID,
  AfterViewInit
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      class="relative w-full py-6 px-6 md:px-12 lg:px-24 overflow-hidden bg-transparent"
    >
      <div class="max-w-6xl mx-auto w-full relative z-10">
        <!-- Hero card layout from fullbleed HTML -->
        <!-- Hero layout merged transparently with main page background -->
        <div class="bb-hero">
          <!-- Abstract backdrop decorations behind products -->
          <div class="bb-hero-abstract-bg"></div>
          
          <!-- Floating "NEW ARRIVALS" Badge -->
          <div class="bb-hero-badge welcome-new-arrivals select-none pointer-events-none">
            <span>New</span>
            <span>Arrivals</span>
            <span class="text-[11px] text-[#C4633A] mt-0.5">♡</span>
          </div>

          <!-- Hero Left Column Text -->
          <div class="bb-hero-content z-10">
            <span class="bb-label">Curated for you &amp; your little one</span>
            <h1 class="bb-h1 bb-serif">Essentials for<br>Every Moment</h1>
            <p class="bb-sub">From mom to baby — everything you need, all in one place.</p>
            <div class="bb-btns">
              <a 
                [routerLink]="['/products']" 
                [queryParams]="{ target: 'All' }" 
                class="bb-btn-solid text-center flex items-center justify-center gap-2"
              >
                <span>Shop Collections</span>
                <span class="text-xs">→</span>
              </a>
              <a 
                [routerLink]="['/products']" 
                [queryParams]="{ target: 'Kids' }" 
                class="bb-btn-outline text-center flex items-center justify-center"
              >
                Shop Little One
              </a>
            </div>
          </div>

          <!-- Hero Right Column Transparent Isolated Products Cluster -->
          <div class="bb-hero-products-wrapper select-none pointer-events-none">
            <img 
              src="/products/hero_products_isolated.webp" 
              alt="Isolated Baby Essentials" 
              class="hero-floating-products h-full w-full object-contain"
            />
          </div>
        </div>
      </div>

      <!-- Scroll Anchor -->
      <div
        (click)="scrollToCategories()"
        class="welcome-scroll-indicator absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer pointer-events-auto animate-bounce hidden md:flex"
      >
        <span class="text-[8px] font-mono tracking-[0.25em] uppercase text-[#8C7B6B]">Scroll to Shop</span>
        <div class="h-4 w-[1px] bg-gradient-to-b from-[#8C7B6B] to-transparent"></div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .bb-hero {
      position: relative; 
      width: 100%; 
      min-height: 480px;
      overflow: hidden; 
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      align-items: center;
    }
    @media (max-width: 768px) {
      .bb-hero {
        grid-template-columns: 1fr;
        min-height: auto;
        padding-bottom: 24px;
      }
    }
    .bb-hero-abstract-bg {
      position: absolute; 
      top: 0; 
      right: 0; 
      bottom: 0; 
      width: 50%;
      background: radial-gradient(circle at 70% 50%, rgba(244, 162, 97, 0.15) 0%, rgba(184, 79, 125, 0.05) 50%, transparent 100%);
      z-index: 1;
      pointer-events: none;
    }
    @media (max-width: 768px) {
      .bb-hero-abstract-bg {
        width: 100%;
        height: 50%;
        bottom: 0;
        top: auto;
      }
    }
    .bb-hero-badge {
      position: absolute; top: 24px; right: 24px; z-index: 4;
      background: rgba(237,217,200,0.88); border-radius: 50%;
      width: 68px; height: 68px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em;
      color: #7A5C40; font-weight: 500; text-align: center; line-height: 1.3;
      border: 0.5px solid #C8A882;
      box-shadow: 0 10px 30px rgba(150,110,80,0.08);
    }
    .bb-hero-content { position: relative; z-index: 2; padding: 48px 52px; }
    @media (max-width: 768px) {
      .bb-hero-content {
        padding: 36px 24px;
      }
    }
    .bb-hero-products-wrapper {
      position: relative;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      z-index: 2;
    }
    @media (max-width: 768px) {
      .bb-hero-products-wrapper {
        height: 280px;
        padding: 16px;
      }
    }
    .hero-floating-products {
      max-height: 380px;
      filter: drop-shadow(0 20px 35px rgba(42, 33, 24, 0.12));
    }
    @media (max-width: 768px) {
      .hero-floating-products {
        max-height: 250px;
      }
    }
    .bb-label { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #C4633A; font-weight: 500; margin-bottom: 8px; display: block; }
    .bb-serif { font-family: 'Playfair Display', 'Cormorant Garamond', serif; }
    .bb-h1 { font-size: 38px; font-weight: 600; line-height: 1.15; margin-bottom: 12px; color: #2E2118; }
    @media (max-width: 768px) {
      .bb-h1 {
        font-size: 28px;
      }
    }
    .bb-sub { font-size: 13px; color: #8C7B6B; line-height: 1.65; margin-bottom: 24px; max-width: 280px; font-weight: 300; }
    .bb-btns { display: flex; gap: 12px; flex-wrap: wrap; }
    .bb-btn-solid { background: #C4633A; color: #fff; border: none; padding: 12px 24px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 8px; cursor: pointer; font-family: 'Inter',sans-serif; font-weight: 500; transition: all 0.3s ease; }
    .bb-btn-solid:hover { background: #2E2118; }
    .bb-btn-outline { background: rgba(255,255,255,0.7); color: #2E2118; border: 1px solid #E8DDD0; padding: 12px 24px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 8px; cursor: pointer; font-family: 'Inter',sans-serif; font-weight: 500; transition: all 0.3s ease; }
    .bb-btn-outline:hover { border-color: #C4633A; color: #C4633A; }
  `]
})
export class WelcomeSectionComponent implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.fromTo('.welcome-new-arrivals',
        { y: -6 },
        { y: 6, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );
      
      // Floating animation for the isolated products cluster
      gsap.fromTo('.hero-floating-products',
        { y: -10 },
        { y: 10, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );
    }
  }

  scrollToCategories(): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = this.document.getElementById('little-one');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
