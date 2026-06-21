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
