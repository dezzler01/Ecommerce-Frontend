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
      class="relative flex min-h-screen w-full flex-col justify-center items-center px-6 md:px-12 lg:px-24 py-32 select-none overflow-hidden bg-transparent"
    >
      <!-- Ambient Glassmorphic Fluid Blob -->
      <div class="ambient-blob"></div>

      <!-- Hero Typography & Actions (Centered, Clean Apple Aesthetic) -->
      <div class="max-w-4xl mx-auto w-full flex flex-col justify-center items-center text-center space-y-8 relative z-10 my-auto">
        <span class="tracking-[0.35em] font-mono text-[10px] md:text-xs uppercase font-extrabold text-[#E07A5F] block">
          Fashion, Accessories &amp; Lifestyle
        </span>
        
        <h1 class="font-serif-luxury text-5xl md:text-8xl lg:text-9xl tracking-tight text-[#2A2522] uppercase leading-[0.95] select-none font-bold drop-shadow-[0_2px_10px_rgba(251,249,246,0.9)]">
          Discover <br class="hidden md:inline"/>
          New Arrivals
        </h1>

        <div class="w-16 h-[2px] bg-[#E07A5F]"></div>

        <p class="font-sans text-xs md:text-sm text-[#6B5E57] font-light leading-relaxed max-w-lg select-none">
          Elevated minimalism meets curated luxury. Discover our new season collection of apparel, designer bags, active footwear, and maternal essentials.
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4 pointer-events-auto w-full sm:w-auto">
          <a 
            [routerLink]="['/products']" 
            [queryParams]="{ target: 'All' }" 
            class="relative overflow-hidden px-10 py-4 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-xs font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/10 group cursor-pointer text-center"
          >
            <span class="relative z-10">Shop Now</span>
            <span class="absolute inset-0 bg-[#E07A5F] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
          </a>
          <button 
            (click)="scrollToCategories()" 
            class="relative overflow-hidden px-10 py-4 bg-transparent border border-[#2A2522]/20 hover:border-[#E07A5F] text-[#2A2522] hover:text-[#E07A5F] text-xs font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 group cursor-pointer text-center"
          >
            <span class="relative z-10">Browse Collection</span>
          </button>
        </div>
      </div>

      <!-- Scroll Down Indicator -->
      <div
        (click)="scrollToCategories()"
        class="welcome-scroll-indicator flex flex-col items-center gap-2.5 z-10 mt-12 cursor-pointer pointer-events-auto animate-pulse"
      >
        <span class="text-[8px] font-mono tracking-[0.25em] uppercase text-[#8A817C]">Scroll to explore</span>
        <div class="h-8 w-[1px] bg-gradient-to-b from-[#8A817C] to-transparent"></div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .ambient-blob {
      position: absolute;
      width: 48vw;
      height: 48vw;
      max-width: 600px;
      max-height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(244, 162, 97, 0.35) 0%, rgba(224, 122, 95, 0.22) 40%, rgba(184, 79, 125, 0.15) 75%, transparent 100%);
      filter: blur(80px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 0;
      pointer-events: none;
      will-change: transform;
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
      // Subtle float/warp animation for the ambient glassmorphic blob
      gsap.to('.ambient-blob', {
        x: 'random(-60, 60)',
        y: 'random(-60, 60)',
        scale: 'random(0.9, 1.15)',
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        repeatRefresh: true
      });
    }
  }

  scrollToCategories(): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = this.document.getElementById('women');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
