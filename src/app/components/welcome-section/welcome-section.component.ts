import { 
  Component, 
  Inject, 
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      class="relative flex h-screen w-full flex-col justify-between py-24 select-none overflow-hidden"
    >
      <!-- Main Brand Logo & Welcome Message (Positioned in vertical center, left-aligned) -->
      <div class="welcome-content-container my-auto z-10 flex flex-col items-start text-left w-full pl-12 md:pl-24 select-none relative">
        <!-- Soft watercolor glow matching the Facebook page banner colors -->
        <div class="brand-watercolor-glow"></div>
        
        <div class="relative z-10 max-w-2xl space-y-6">
          <span class="text-[#E07A5F] font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-bold block">
            Luxury Women &amp; Baby Boutique
          </span>
          <h1 class="font-serif-luxury text-5xl md:text-7xl font-light tracking-wide text-[#2A2522] leading-[1.1]">
            Picks&amp;More
          </h1>
          <p class="text-xs md:text-sm text-[#6B5E57] tracking-wider leading-relaxed font-light max-w-lg lowercase">
            A curated experience in modern luxury, handcrafted design, and premium organic materials. Tailored with care for mothers, children, and the refined contemporary home.
          </p>
          <div class="pt-2">
            <button 
              (click)="scrollToCategories()" 
              class="group px-7 py-3 border border-[#2A2522]/30 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-[#2A2522] rounded-xl bg-transparent hover:bg-[#2A2522] hover:text-[#FBF9F6] hover:border-[#2A2522] transition-all duration-500 cursor-pointer pointer-events-auto flex items-center gap-2"
            >
              <span>Explore Boutique</span>
              <svg class="w-3.5 h-3.5 fill-none stroke-current stroke-[1.5] transition-transform duration-500 group-hover:translate-y-1" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Scroll Down Indicator (Blinking pulse handled via Tailwind) -->
      <div
        class="welcome-scroll-indicator flex flex-col items-center gap-3 z-10 mt-auto self-center animate-pulse"
      >
        <div class="h-14 w-[1px] bg-gradient-to-b from-[#8A817C] to-transparent"></div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    .brand-watercolor-glow {
      background: radial-gradient(circle, rgba(244, 162, 97, 0.28) 0%, rgba(224, 122, 95, 0.18) 35%, rgba(231, 111, 81, 0.08) 60%, rgba(251, 249, 246, 0) 80%);
      filter: blur(30px);
      position: absolute;
      width: 140%;
      height: 140%;
      top: -20%;
      left: -20%;
      z-index: 0;
      pointer-events: none;
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
      const container = this.document.getElementById('scroll-trigger-container');
      if (container) {
        const scrollHeight = container.scrollHeight;
        window.scrollTo({
          top: scrollHeight * 0.20, // Scroll to Section 2
          behavior: 'smooth'
        });
      }
    }
  }
}
