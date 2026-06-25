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
      class="relative min-h-screen w-full flex items-center px-6 md:px-12 lg:px-24 py-32 overflow-hidden bg-[#F8F1EA]"
    >
      <!-- Full-bleed background image -->
      <img 
        src="products/hero_cover.jpg" 
        alt="Essentials for Every Moment" 
        class="absolute inset-0 w-full h-full object-cover object-[center_right] md:object-[68%_center] lg:object-right z-0 select-none pointer-events-none"
      />

      <!-- Soft Gradient Mask for text legibility over the image -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#F8F1EA]/95 via-[#F8F1EA]/50 to-transparent z-10 pointer-events-none"></div>

      <div class="max-w-6xl mx-auto w-full relative z-20">
        <!-- Left Side: Editorial Content -->
        <div class="flex flex-col items-start text-left space-y-8 select-none max-w-xl">
          <span class="tracking-[0.25em] font-mono text-[10px] md:text-xs uppercase font-bold text-[#C98A58] block">
            CURATED FOR YOU &amp; YOUR LITTLE ONE
          </span>
          <h1 class="font-serif-luxury text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#2A1F1A] uppercase leading-[0.95]">
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
      </div>

      <!-- Floating Pearl Accessory -->
      <div class="welcome-pearl absolute top-[25%] right-[38%] w-6 h-6 rounded-full bg-gradient-to-br from-white via-[#E8D1BF] to-[#D8B89C] shadow-lg blur-[0.5px] z-20 pointer-events-none hidden md:block"></div>

      <!-- Floating "NEW ARRIVALS" Badge -->
      <div class="welcome-new-arrivals absolute top-[18%] right-[10%] z-20 w-24 h-24 rounded-full bg-[#F3E8DD]/90 backdrop-blur-sm border border-[#E7D8CB] flex flex-col items-center justify-center text-center shadow-xl p-3 select-none pointer-events-none hidden lg:flex">
        <span class="text-[8px] font-mono tracking-widest text-[#77685D] uppercase font-bold leading-tight">NEW ARRIVALS</span>
        <span class="text-[#C98A58] text-[11px] mt-1">♡</span>
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
      gsap.fromTo('.welcome-new-arrivals',
        { y: -8 },
        {
          y: 8,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        }
      );
      gsap.fromTo('.welcome-pearl',
        { y: -12 },
        {
          y: 12,
          duration: 7,
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
