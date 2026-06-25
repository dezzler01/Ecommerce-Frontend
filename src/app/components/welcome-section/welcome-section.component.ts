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
        <div class="bb-hero shadow-2xl bg-[#F8F1EA]">
          <div class="bb-hero-overlay"></div>
          
          <!-- Background Abstract Underlays inside the hero card -->
          <div class="absolute right-0 top-0 bottom-0 w-[55%] h-full z-0 overflow-hidden pointer-events-none hidden md:block">
            <!-- Glowing translucent peach/champagne sphere decoration -->
            <div class="absolute right-[10%] top-[10%] w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-[#F4A261]/25 to-[#E76F51]/10 filter blur-xl opacity-75"></div>
            <!-- Underlaid abstract luxury texture matching the silk background -->
            <div class="absolute right-0 bottom-0 w-full h-[85%] bg-[url('/products/editorial_page_bg_canvas.jpg')] bg-[position:bottom_right] bg-no-repeat bg-[size:160%_auto] opacity-50 mix-blend-multiply"></div>
          </div>
          
          <!-- Floating "NEW ARRIVALS" Badge -->
          <div class="bb-hero-badge welcome-new-arrivals select-none pointer-events-none">
            <span>New</span>
            <span>Arrivals</span>
            <span class="text-[11px] text-[#C4633A] mt-0.5">♡</span>
          </div>

          <!-- Left content card over layout -->
          <div class="bb-hero-content select-none">
            <span class="bb-label">Curated for you &amp; your little one</span>
            <h1 class="bb-h1 bb-serif">Essentials for<br>Every Moment</h1>
            <p class="bb-sub">From mom to baby — everything you need, all in one place.</p>
            <div class="bb-btns">
              <a 
                [routerLink]="['/products']" 
                [queryParams]="{ target: 'All' }" 
                class="bb-btn-solid text-center flex items-center justify-center gap-2 pointer-events-auto"
              >
                <span>Shop Collections</span>
                <span class="text-xs">→</span>
              </a>
              <a 
                [routerLink]="['/products']" 
                [queryParams]="{ target: 'Kids' }" 
                class="bb-btn-outline text-center flex items-center justify-center pointer-events-auto"
              >
                Shop Little One
              </a>
            </div>
          </div>

          <!-- Right isolated products layer container -->
          <div class="absolute right-[5%] bottom-[5%] w-[45%] h-[90%] z-10 flex items-center justify-center pointer-events-none hidden md:flex">
            <div class="welcome-hero-cluster w-full h-full flex items-center justify-center">
              <img 
                src="/products/hero_products_isolated.webp" 
                alt="Luxury maternity &amp; baby collection" 
                class="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_45px_rgba(42,33,24,0.16)]"
              />
            </div>
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
      position: relative; width: 100%; min-height: 480px;
      overflow: hidden; display: flex; align-items: center;
      border-radius: 2.5rem;
      border: 0.5px solid #E8DDD0;
    }
    @media (max-width: 768px) {
      .bb-hero {
        min-height: 380px;
        background-image: url('/products/hero_products_isolated.webp');
        background-size: contain;
        background-position: bottom right;
        background-repeat: no-repeat;
      }
    }
    .bb-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to right, #F8F1EA 35%, rgba(248,241,234,0.85) 55%, rgba(248,241,234,0.1) 100%);
      z-index: 1;
    }
    @media (max-width: 768px) {
      .bb-hero-overlay {
        background: linear-gradient(to bottom, rgba(248,241,234,0.98) 25%, rgba(248,241,234,0.88) 70%, rgba(248,241,234,0.3) 100%);
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
    .bb-hero-content { position: relative; z-index: 2; padding: 48px 52px; max-width: 50%; }
    @media (max-width: 768px) {
      .bb-hero-content {
        max-width: 100%;
        padding: 36px 24px;
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

      // Re-attach floating script to transparent product cluster wrapper
      gsap.fromTo('.welcome-hero-cluster',
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
