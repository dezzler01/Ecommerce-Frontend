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
      class="relative min-h-[85vh] w-full flex items-center px-6 md:px-12 lg:px-24 py-16 overflow-hidden bg-transparent"
    >
      <div class="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        <!-- Left Side: Editorial Content -->
        <div class="lg:col-span-5 flex flex-col items-start text-left space-y-6 select-none z-20">
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

        <!-- Right Side: Layered Still-life Composition -->
        <div class="lg:col-span-7 flex justify-center items-center relative h-[380px] md:h-[480px] w-full z-10">
          
          <!-- Floating Pearl Accessory -->
          <div class="welcome-pearl absolute top-[15%] left-[5%] w-6 h-6 rounded-full bg-gradient-to-br from-white via-[#E8D1BF] to-[#D8B89C] shadow-lg blur-[0.5px] z-20 pointer-events-none hidden md:block"></div>

          <!-- Floating "NEW ARRIVALS" Badge -->
          <div class="welcome-new-arrivals absolute top-[8%] right-[5%] z-20 w-24 h-24 rounded-full bg-[#F3E8DD]/90 backdrop-blur-sm border border-[#E7D8CB] flex flex-col items-center justify-center text-center shadow-xl p-3 select-none pointer-events-none hidden lg:flex">
            <span class="text-[8px] font-mono tracking-widest text-[#77685D] uppercase font-bold leading-tight">NEW ARRIVALS</span>
            <span class="text-[#C98A58] text-[11px] mt-1">♡</span>
          </div>

          <!-- Pediatric still-life art group -->
          <div class="hero-artwork-group relative w-full h-full pointer-events-none select-none">
            <!-- Folded Cashmere Baby Blanket -->
            <img 
              src="products/baby_blanket.png" 
              alt="Cashmere Baby Blanket" 
              class="absolute bottom-[2%] left-[10%] w-[50%] z-10 filter drop-shadow-[0_8px_16px_rgba(42,31,26,0.05)]" 
            />

            <!-- Quilted Diaper Bag -->
            <img 
              src="products/diaper_bag.png" 
              alt="Quilted Diaper Bag" 
              class="absolute bottom-[18%] right-[5%] w-[68%] z-10 filter drop-shadow-[0_15px_30px_rgba(42,31,26,0.08)] pointer-events-auto transition-transform duration-500 hover:scale-[1.03]" 
            />

            <!-- Plush Bunny Toy -->
            <img 
              src="products/plush_bunny.png" 
              alt="Plush Bunny Toy" 
              class="absolute bottom-[10%] left-[18%] w-[33%] z-20 filter drop-shadow-[0_10px_20px_rgba(42,31,26,0.08)] pointer-events-auto transition-transform duration-500 hover:scale-[1.05]" 
            />

            <!-- Elegant Baby Bottle -->
            <img 
              src="products/baby_bottle.png" 
              alt="Baby Bottle" 
              class="absolute bottom-[6%] left-[45%] w-[16%] z-30 filter drop-shadow-[0_8px_16px_rgba(42,31,26,0.06)] pointer-events-auto transition-transform duration-500 hover:scale-[1.08]" 
            />

            <!-- Baby Clogs/Booties -->
            <img 
              src="products/baby_clogs.png" 
              alt="Newborn Baby Shoes" 
              class="absolute bottom-[4%] right-[22%] w-[24%] z-30 filter drop-shadow-[0_8px_16px_rgba(42,31,26,0.06)] pointer-events-auto transition-transform duration-500 hover:scale-[1.08]" 
            />
          </div>

        </div>

      </div>

      <!-- Scroll Anchor -->
      <div
        (click)="scrollToCategories()"
        class="welcome-scroll-indicator absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 cursor-pointer pointer-events-auto animate-bounce"
      >
        <span class="text-[8px] font-mono tracking-[0.25em] uppercase text-[#77685D]">Scroll to Shop</span>
        <div class="h-4 w-[1px] bg-gradient-to-b from-[#77685D] to-transparent"></div>
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
      // Float badge and pearl
      gsap.fromTo('.welcome-new-arrivals',
        { y: -6 },
        { y: 6, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );
      gsap.fromTo('.welcome-pearl',
        { y: -10 },
        { y: 10, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );

      // Gentle layered float of products
      gsap.fromTo('.hero-artwork-group img:nth-child(2)',
        { y: -4 },
        { y: 4, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );
      gsap.fromTo('.hero-artwork-group img:nth-child(3)',
        { y: -8 },
        { y: 8, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 }
      );
      gsap.fromTo('.hero-artwork-group img:nth-child(4)',
        { y: -6 },
        { y: 6, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.2 }
      );
      gsap.fromTo('.hero-artwork-group img:nth-child(5)',
        { y: -5 },
        { y: 5, duration: 6.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.7 }
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
