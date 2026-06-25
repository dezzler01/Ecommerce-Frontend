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
      class="relative min-h-[92vh] w-full flex items-center px-6 md:px-12 lg:px-24 py-32 overflow-hidden bg-transparent"
    >
      <!-- Background Blobs (Champagne/Ivory themed blur blobs) -->
      <div class="blob-container">
        <div class="blob-1" style="background: radial-gradient(circle, rgba(216,184,156,0.35) 0%, rgba(243,232,221,0.05) 70%);"></div>
        <div class="blob-2" style="background: radial-gradient(circle, rgba(201,138,88,0.2) 0%, rgba(248,241,234,0.05) 70%);"></div>
        <div class="blob-3" style="background: radial-gradient(circle, rgba(232,209,191,0.3) 0%, rgba(243,232,221,0.05) 70%);"></div>
      </div>

      <div class="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        <!-- Left Side: Editorial Content (5 cols) -->
        <div class="lg:col-span-5 flex flex-col items-start text-left space-y-8 select-none">
          <span class="tracking-[0.25em] font-mono text-[10px] md:text-xs uppercase font-bold text-[#C98A58] block">
            CURATED FOR YOU &amp; YOUR LITTLE ONE
          </span>
          <h1 class="font-serif-luxury text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#2A1F1A] uppercase leading-[0.95] max-w-xl">
            Essentials <br/>
            <span class="font-light italic text-[#77685D]">for Every</span> <br/>
            Moment
          </h1>
          <div class="w-16 h-[1.5px] bg-[#C98A58] my-1"></div>
          <p class="font-sans text-sm md:text-base text-[#77685D] font-light leading-relaxed max-w-md">
            From mom to baby — everything you need, all in one place.
          </p>
          <div class="flex flex-wrap gap-4 pt-2 pointer-events-auto w-full">
            <a 
              [routerLink]="['/products']" 
              [queryParams]="{ target: 'All' }" 
              class="px-8 py-4 bg-[#C98A58] hover:bg-[#2A1F1A] text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-[12px] transition-all duration-300 shadow-lg shadow-[#C98A58]/10 hover:shadow-[#2A1F1A]/10 text-center flex items-center justify-center gap-2"
            >
              <span>Shop Collections</span>
              <span class="text-xs">→</span>
            </a>
            <a 
              [routerLink]="['/products']" 
              [queryParams]="{ target: 'Kids' }" 
              class="px-8 py-4 bg-transparent border border-[#D8B89C] hover:border-[#C98A58] text-[#2A1F1A] hover:text-[#C98A58] text-[10px] font-bold tracking-[0.2em] uppercase rounded-[12px] transition-all duration-300 text-center flex items-center justify-center"
            >
              Shop Little One
            </a>
          </div>
        </div>

        <!-- Right Side: Full-bleed Premium Still-life Scene (7 cols) -->
        <div class="lg:col-span-7 flex justify-center items-center relative h-[400px] md:h-[500px] w-full">
          <!-- Large glowing champagne sphere behind -->
          <div class="absolute w-[320px] md:w-[450px] h-[320px] md:h-[450px] rounded-full bg-gradient-to-tr from-[#E8D1BF]/40 to-[#D8B89C]/30 blur-[2px] shadow-inner select-none pointer-events-none z-0"></div>
          
          <!-- Floating Pearl Accessory -->
          <div class="absolute top-[25%] left-[5%] w-6 h-6 rounded-full bg-gradient-to-br from-white via-[#E8D1BF] to-[#D8B89C] shadow-lg blur-[0.5px] z-20 animate-pulse pointer-events-none"></div>

          <!-- Floating "NEW ARRIVALS" Badge -->
          <div class="absolute top-[15%] right-[5%] z-20 w-24 h-24 rounded-full bg-[#F3E8DD]/90 backdrop-blur-sm border border-[#E7D8CB] flex flex-col items-center justify-center text-center shadow-xl p-3 select-none pointer-events-none">
            <span class="text-[8px] font-mono tracking-widest text-[#77685D] uppercase font-bold leading-tight">NEW ARRIVALS</span>
            <span class="text-[#C98A58] text-[11px] mt-1">♡</span>
          </div>

          <!-- Pediatric still-life art group (GSAP floating target) -->
          <div class="hero-artwork-group relative w-full h-full flex items-center justify-center z-10 pointer-events-none select-none">
            <!-- Full bleed generated still-life composition -->
            <img src="products/hero_cover.png" alt="Bespoke Pedestal Still-life" class="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(42,31,26,0.1)] rounded-[2.5rem]" />
          </div>
        </div>

      </div>

      <!-- High-Conversion Scroll Anchor -->
      <div
        (click)="scrollToCategories()"
        class="welcome-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 cursor-pointer pointer-events-auto animate-bounce"
      >
        <span class="text-[8px] font-mono tracking-[0.25em] uppercase text-[#77685D]">Scroll to Shop</span>
        <div class="h-6 w-[1px] bg-gradient-to-b from-[#77685D] to-transparent"></div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class WelcomeSectionComponent implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.fromTo('.hero-artwork-group',
        { y: -10 },
        {
          y: 10,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        }
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
