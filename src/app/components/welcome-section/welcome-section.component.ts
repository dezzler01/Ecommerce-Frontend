import { 
  Component, 
  Inject, 
  PLATFORM_ID,
  AfterViewInit
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      class="relative w-full py-6 px-6 md:px-12 lg:px-24 overflow-hidden bg-transparent"
    >
      <div class="w-full relative z-10">
        <!-- Hero layout centered typography -->
        <div class="bb-hero">
          
          <!-- Hero Centered Typography Content -->
          <div class="bb-hero-content z-10">
            <span class="bb-label">Curated for you &amp; your little one</span>
            <h1 class="bb-h1 bb-serif">Essentials for Every Moment</h1>
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
      min-height: 520px;
      overflow: hidden; 
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .bb-hero-content { 
      position: relative; 
      z-index: 2; 
      padding: 64px 24px; 
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-width: 640px;
      margin: 0 auto;
    }
    .bb-label { font-size: 14px; letter-spacing: 0.22em; text-transform: uppercase; color: #C4633A; font-weight: 600; margin-bottom: 16px; display: block; }
    .bb-serif { font-family: 'Playfair Display', 'Cormorant Garamond', serif; }
    .bb-h1 { font-size: 64px; font-weight: 500; line-height: 1.12; margin-bottom: 18px; color: #2E2118; letter-spacing: -0.01em; }
    @media (max-width: 768px) {
      .bb-h1 {
        font-size: 40px;
      }
    }
    .bb-sub { font-size: 18px; color: #8C7B6B; line-height: 1.7; margin-bottom: 32px; max-width: 480px; font-weight: 300; }
    .bb-btns { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
    .bb-btn-solid { background: #C4633A; color: #fff; border: none; padding: 14px 28px; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; border-radius: 8px; cursor: pointer; font-family: 'Inter',sans-serif; font-weight: 500; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(196, 99, 58, 0.15); }
    .bb-btn-solid:hover { background: #2E2118; box-shadow: 0 4px 15px rgba(46, 33, 24, 0.2); }
    .bb-btn-outline { background: rgba(255,255,255,0.7); color: #2E2118; border: 1px solid #E8DDD0; padding: 14px 28px; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; border-radius: 8px; cursor: pointer; font-family: 'Inter',sans-serif; font-weight: 500; transition: all 0.3s ease; }
    .bb-btn-outline:hover { border-color: #C4633A; color: #C4633A; background: rgba(255,255,255,0.9); }
  `]
})
export class WelcomeSectionComponent implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngAfterViewInit(): void {
    // Image is static, GSAP animations removed per request
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
