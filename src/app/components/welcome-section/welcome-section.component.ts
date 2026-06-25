import { 
  Component, 
  Inject, 
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      class="relative flex min-h-[92vh] w-full flex-col justify-center items-center px-6 md:px-12 lg:px-24 py-32 select-none overflow-hidden bg-transparent"
    >
      <!-- High-Performance Animated 3D-Feeling Glassmorphic Blob Background -->
      <div class="blob-container">
        <div class="blob-1"></div>
        <div class="blob-2"></div>
        <div class="blob-3"></div>
      </div>

      <!-- Core Centered Brand Shop Pitch -->
      <div class="max-w-3xl mx-auto text-center flex flex-col items-center space-y-6 relative z-10">
        <!-- Minimal Category Header Tag -->
        <span class="tracking-[0.3em] font-mono text-[10px] md:text-xs uppercase font-bold text-[#E07A5F] block">
          FASHION / ACCESSORIES / BABY LUXE
        </span>
        
        <!-- Elegant Serif Main Statement -->
        <h1 class="font-serif-luxury text-4xl md:text-6xl lg:text-7xl tracking-tight text-[#2A2522] uppercase leading-[1.05] max-w-2xl select-none">
          Discover <span class="font-light italic text-[#8C857B]">New</span> <br class="hidden sm:block" /> Arrivals
        </h1>

        <!-- Subtle Underline Accent -->
        <div class="w-16 h-[1.5px] bg-[#E07A5F] my-2"></div>

        <!-- Clean Explanatory Shop Copy -->
        <p class="font-sans text-xs md:text-sm text-[#6B5E57] font-light leading-relaxed max-w-lg select-none">
          Handcrafted full-grain leather bags, designer footwear, and certified organic infant essentials. Elevated, safe, and sophisticated designs made for everyday moments.
        </p>

        <!-- Centered High-Contrast Shop Buttons -->
        <div class="flex flex-wrap justify-center gap-4 pt-4 pointer-events-auto">
          <a 
            [routerLink]="['/products']" 
            [queryParams]="{ target: 'All' }" 
            class="relative overflow-hidden px-8 py-4 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/10 group cursor-pointer"
          >
            <span class="relative z-10">Shop All Collections</span>
            <span class="absolute inset-0 bg-[#E07A5F] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
          </a>
          <button 
            (click)="scrollToCategories()" 
            class="relative overflow-hidden px-8 py-4 bg-transparent border border-[#2A2522]/20 hover:border-[#E07A5F] text-[#2A2522] hover:text-[#E07A5F] text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 group cursor-pointer"
          >
            <span class="relative z-10">Browse Catalog</span>
          </button>
        </div>
      </div>

      <!-- High-Conversion Subtle Scroll Anchor -->
      <div
        (click)="scrollToCategories()"
        class="welcome-scroll-indicator flex flex-col items-center gap-3 z-10 mt-16 cursor-pointer pointer-events-auto animate-bounce"
      >
        <span class="text-[8px] font-mono tracking-[0.25em] uppercase text-[#8A817C]">Scroll to Shop</span>
        <div class="h-8 w-[1px] bg-gradient-to-b from-[#8A817C] to-transparent"></div>
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
export class WelcomeSectionComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any
  ) {}

  scrollToCategories(): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = this.document.getElementById('women');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
