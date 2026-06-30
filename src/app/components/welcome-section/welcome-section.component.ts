import { 
  Component, 
  Inject, 
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
  ElementRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section id="welcome-sec" class="relative w-full py-12 px-6 md:px-12 lg:px-24 overflow-hidden bg-transparent select-none">
      <!-- Soft organic blobs & decorative background shapes (Layer 1) -->
      <div class="absolute inset-0 z-0 pointer-events-none parallax-layer-1 blob-container">
        <div class="absolute top-[10%] left-[-5%] w-[350px] h-[350px] rounded-full bg-[#77DCC5]/10 blur-[60px]"></div>
        <div class="absolute top-[5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#64C9F5]/10 blur-[80px]"></div>
        <div class="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#B99AF7]/8 blur-[70px]"></div>
        <div class="absolute bottom-[5%] right-[15%] w-[350px] h-[350px] rounded-full bg-[#FFD75A]/10 blur-[60px]"></div>
      </div>

      <!-- Drifting Stars (Drift and Scale Animation - Layer 2) -->
      <div class="absolute top-[20%] left-[5%] drift-star pointer-events-none hidden md:block">
        <div class="parallax-layer-2">
          <div class="animate-drift-star">
            <svg class="w-8 h-8 text-[#B99AF7] opacity-60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="absolute top-[12%] right-[42%] drift-star pointer-events-none hidden md:block">
        <div class="parallax-layer-2">
          <div class="animate-drift-star-delayed">
            <svg class="w-10 h-10 text-[#FFD75A] opacity-75" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="absolute bottom-[30%] right-[45%] drift-star pointer-events-none hidden md:block">
        <div class="parallax-layer-2">
          <div class="animate-drift-star" style="animation-delay: 2.5s;">
            <svg class="w-6 h-6 text-[#77DCC5] opacity-60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Slow Floating Balloons (Layer 2) -->
      <div class="absolute bottom-[25%] left-[2%] balloon-left pointer-events-none hidden md:block">
        <div class="parallax-layer-2">
          <div class="animate-balloon">
            <svg class="w-12 h-16 text-[#FFD75A] opacity-60 filter drop-shadow-md" fill="currentColor" viewBox="0 0 20 26">
              <path d="M10 0 C4.5 0 0 4.5 0 10 C0 15 4.5 19 10 19 C15.5 19 20 15 20 10 C20 4.5 15.5 0 10 0 M10 19 L8 24 L12 24 Z" />
              <path d="M10 24 C10 24 12 26 10 28" stroke="currentColor" stroke-width="1.2" fill="none" />
            </svg>
          </div>
        </div>
      </div>
      <div class="absolute top-[25%] right-[2%] balloon-right pointer-events-none hidden md:block">
        <div class="parallax-layer-2">
          <div class="animate-balloon-delayed">
            <svg class="w-10 h-14 text-[#B99AF7] opacity-65 filter drop-shadow-md" fill="currentColor" viewBox="0 0 20 26">
              <path d="M10 0 C4.5 0 0 4.5 0 10 C0 15 4.5 19 10 19 C15.5 19 20 15 20 10 C20 4.5 15.5 0 10 0 M10 19 L8 24 L12 24 Z" />
              <path d="M10 24 C10 24 12 26 10 28" stroke="currentColor" stroke-width="1.2" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Main Hero Layout Grid -->
      <div class="w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <!-- Left Column: Typography Content -->
        <div class="flex flex-col items-start text-left max-w-xl space-y-6">
          <span class="bb-label font-fredoka text-[#F67B63] text-xs sm:text-sm tracking-wider uppercase font-semibold">
            CURATED FOR YOU &amp; YOUR LITTLE ONE
          </span>
          <h1 class="bb-h1 font-fredoka text-[42px] sm:text-[54px] lg:text-[62px] font-bold text-[var(--text-charcoal)] leading-[1.08]">
            Essentials for<br/>
            <span class="text-[#64C9F5]">E</span><span class="text-[#F67B63]">v</span><span class="text-[#FFD75A]">e</span><span class="text-[#77DCC5]">r</span><span class="text-[#B99AF7]">y</span>
            <span class="text-[#F67B63]">M</span><span class="text-[#F6A04D]">o</span><span class="text-[#77DCC5]">m</span><span class="text-[#64C9F5]">e</span><span class="text-[#B99AF7]">n</span><span class="text-[#F67B63]">t</span>
          </h1>
          <p class="bb-sub font-nunito text-[15px] sm:text-[17px] text-[#77685D] leading-relaxed max-w-md font-semibold">
            From mom to baby — everything you need, all in one place.
          </p>
          <div class="bb-btns flex items-center gap-4 flex-wrap pt-2">
            <a 
              [routerLink]="['/products']" 
              [queryParams]="{ target: 'All' }" 
              class="bb-btn-solid font-fredoka text-center flex items-center justify-center gap-2 hover-bounce"
            >
              <span>SHOP COLLECTIONS</span>
              <span class="text-sm">→</span>
            </a>
            <a 
              [routerLink]="['/products']" 
              [queryParams]="{ target: 'Kids' }" 
              class="bb-btn-outline font-fredoka text-center flex items-center justify-center hover-bounce"
            >
              SHOP LITTLE ONE
            </a>
          </div>
        </div>

        <!-- Right Column: Hero Child Image with Organic Background -->
        <div class="relative w-full flex justify-center lg:justify-end items-center">
          <!-- Drifting fluffy white clouds (Layer 2) -->
          <div class="absolute left-[-5%] top-[10%] drift-cloud-left pointer-events-none hidden md:block">
            <div class="parallax-layer-2">
              <div class="animate-drift-cloud">
                <div class="w-24 h-10 bg-white rounded-full opacity-90 shadow-sm relative filter blur-[0.5px]">
                  <div class="w-10 h-10 bg-white rounded-full absolute -top-4 left-4"></div>
                  <div class="w-12 h-12 bg-white rounded-full absolute -top-6 left-10"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute right-[5%] bottom-[15%] drift-cloud-right pointer-events-none hidden md:block">
            <div class="parallax-layer-2">
              <div class="animate-drift-cloud" style="animation-delay: 2.5s;">
                <div class="w-28 h-12 bg-white rounded-full opacity-90 shadow-sm relative filter blur-[0.5px]">
                  <div class="w-12 h-12 bg-white rounded-full absolute -top-5 left-5"></div>
                  <div class="w-14 h-14 bg-white rounded-full absolute -top-7 left-12"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Outer wrapper for Hero Balloon scroll trigger parallax -->
          <div class="hero-balloon-scroll-wrap w-full flex justify-center lg:justify-end items-center">
            <!-- Playful Hero Balloon Wrapper containing the Child Image (Layer 3 & Layer 4 HUDs) -->
            <div class="relative w-[320px] h-[360px] xs:w-[360px] xs:h-[410px] sm:w-[420px] sm:h-[470px] flex flex-col items-center justify-start hero-balloon-container parallax-layer-3 pointer-events-auto">
              
              <!-- Floating HUD badges (Layer 4 - Opposite Direction) -->
              <div class="absolute -top-4 -left-6 z-30 floating-hud-badge parallax-layer-4 bg-white text-[#C4633A] border border-[#FDECEF] px-3.5 py-1.5 rounded-full font-fredoka font-bold text-[10px] sm:text-xs shadow-md tracking-wider flex items-center gap-1 select-none">
                ✨ BEST SELLER
              </div>
              <div class="absolute top-[40%] -right-8 z-30 floating-hud-badge parallax-layer-4 bg-white text-[#64C9F5] border border-[#EBF7FD] px-3.5 py-1.5 rounded-full font-fredoka font-bold text-[10px] sm:text-xs shadow-md tracking-wider flex items-center gap-1 select-none">
                🎈 NEW ARRIVAL
              </div>
              <div class="absolute bottom-[20%] -left-8 z-30 floating-hud-badge parallax-layer-4 bg-[#FFD75A] text-[#2A1F1A] px-3 py-2 rounded-2xl font-fredoka font-bold text-[10px] sm:text-xs shadow-md tracking-wider flex flex-col items-center leading-none rotate-[-6deg] select-none">
                <span class="text-[8px] opacity-75 font-nunito font-semibold">SAVE</span>
                <span class="text-sm font-black">30% OFF</span>
              </div>

              <!-- Balloon Body (Wraps Image & Backdrop) -->
              <div class="relative w-[300px] h-[300px] xs:w-[340px] xs:h-[340px] sm:w-[390px] sm:h-[390px] flex items-center justify-center hero-balloon-body z-10">
                <!-- Backdrop morphing shadow -->
                <div class="absolute inset-0 bg-[#64C9F5]/25 rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] animate-morph-blob z-0"></div>
                
                <!-- Frame wrapper for image -->
                <div class="relative z-10 w-[88%] h-[88%] overflow-hidden rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] border-[6px] border-white shadow-2xl bg-white flex items-center justify-center">
                  <img 
                    src="/products/cheerful_hero_child.png" 
                    alt="Smiling Child holding Teddy Bear" 
                    class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              <!-- Balloon Knot SVG -->
              <svg class="w-6 h-4 text-white fill-current relative z-20 -mt-1 hero-balloon-knot drop-shadow-md" viewBox="0 0 20 10">
                <path d="M 0 10 L 10 0 L 20 10 Z" />
              </svg>

              <!-- Balloon String SVG -->
              <svg class="w-8 h-28 text-[#8A817C]/30 z-0 -mt-0.5 hero-balloon-string" viewBox="0 0 20 100" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M10 0 C 15 25, 5 50, 10 75 C 15 88, 8 95, 10 100" stroke-dasharray="3 4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Card Panel (Bridges Hero & Showcase) -->
      <div id="little-one" class="w-full relative z-20 welcome-categories-panel bg-white border border-[#EBF1F5] p-6 sm:p-8 rounded-[32px] shadow-[0_15px_40px_rgba(42,31,26,0.03)] flex flex-col lg:flex-row items-center justify-between gap-8">
        <!-- Left Header info -->
        <div class="flex flex-col items-start text-left max-w-sm">
          <span class="text-[11px] font-fredoka font-semibold tracking-wider text-[#F67B63] uppercase mb-1">LITTLE ONE</span>
          <h3 class="text-xl sm:text-2xl font-bold font-fredoka text-[var(--text-charcoal)] mb-2 leading-tight">Tiny Styles, Big Comfort</h3>
          <p class="text-xs sm:text-sm text-[#77685D] font-medium mb-4">Soft. Safe. Adorable.</p>
          <a 
            [routerLink]="['/products']" 
            [queryParams]="{ target: 'Kids' }" 
            class="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F67B63] hover:underline cursor-pointer transition-all font-nunito"
          >
            <span>EXPLORE COLLECTIONS</span>
            <span>→</span>
          </a>
        </div>

        <!-- Right Categories Bubbles Row -->
        <div class="flex-1 w-full flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6 lg:gap-8">
          <!-- 1. Baby Clothes -->
          <a 
            [routerLink]="['/products']" 
            [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }" 
            class="category-bubble-item flex flex-col items-center gap-2 group cursor-pointer no-underline"
          >
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FDECEF] border border-[#FDECEF] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-md">
              <img src="/products/infant_dress.png" alt="Baby Clothes" class="w-[60%] h-[60%] object-contain" />
            </div>
            <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-charcoal)] font-nunito group-hover:text-[#F67B63] transition-colors">Baby Clothes</span>
          </a>

          <!-- 2. Toys & Games -->
          <a 
            [routerLink]="['/products']" 
            [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }" 
            class="category-bubble-item flex flex-col items-center gap-2 group cursor-pointer no-underline"
          >
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFF9E6] border border-[#FFF9E6] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-md">
              <img src="/products/plush_bunny.png" alt="Toys &amp; Games" class="w-[60%] h-[60%] object-contain" />
            </div>
            <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-charcoal)] font-nunito group-hover:text-[#F6A04D] transition-colors">Toys &amp; Games</span>
          </a>

          <!-- 3. Kids Shoes -->
          <a 
            [routerLink]="['/products']" 
            [queryParams]="{ target: 'Kids', subcategory: 'shoes' }" 
            class="category-bubble-item flex flex-col items-center gap-2 group cursor-pointer no-underline"
          >
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EBF7FD] border border-[#EBF7FD] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-md">
              <img src="/products/baby_clogs.png" alt="Kids Shoes" class="w-[60%] h-[60%] object-contain" />
            </div>
            <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-charcoal)] font-nunito group-hover:text-[#64C9F5] transition-colors">Kids Shoes</span>
          </a>

          <!-- 4. Accessories -->
          <a 
            [routerLink]="['/products']" 
            [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }" 
            class="category-bubble-item flex flex-col items-center gap-2 group cursor-pointer no-underline"
          >
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EBFBF7] border border-[#EBFBF7] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-md">
              <img src="/products/diaper_bag.png" alt="Accessories" class="w-[60%] h-[60%] object-contain" />
            </div>
            <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-charcoal)] font-nunito group-hover:text-[#77DCC5] transition-colors">Accessories</span>
          </a>

          <!-- 5. Nursery -->
          <a 
            [routerLink]="['/products']" 
            [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }" 
            class="category-bubble-item flex flex-col items-center gap-2 group cursor-pointer no-underline"
          >
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFF3EB] border border-[#FFF3EB] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-md">
              <img src="/products/baby_blanket.png" alt="Nursery" class="w-[60%] h-[60%] object-contain" />
            </div>
            <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--text-charcoal)] font-nunito group-hover:text-[#B99AF7] transition-colors">Nursery</span>
          </a>

          <!-- Floating 30% Off Badge -->
          <div class="relative w-18 h-18 sm:w-20 sm:h-20 bg-[#64C9F5] text-white flex flex-col items-center justify-center rounded-[20px] shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300 select-none p-2 ml-4">
            <span class="text-[8px] uppercase tracking-wider font-bold">UP TO</span>
            <span class="text-xl sm:text-2xl font-bold font-fredoka leading-none">30%</span>
            <span class="text-[8px] uppercase tracking-wider font-bold">OFF ♡</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    /* ─── Playful Button Styling ─── */
    .bb-btn-solid { 
      background: #F67B63; 
      color: #fff; 
      border: none; 
      padding: 14px 32px; 
      font-size: 12px; 
      letter-spacing: 0.12em; 
      text-transform: uppercase; 
      border-radius: 9999px; 
      cursor: pointer; 
      font-weight: 700; 
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
      box-shadow: 0 6px 20px rgba(246, 123, 99, 0.25); 
    }
    
    .bb-btn-solid:hover { 
      background: #F6A04D;
      box-shadow: 0 8px 25px rgba(246, 160, 77, 0.35); 
    }
    
    .bb-btn-outline { 
      background: #ffffff; 
      color: #77685D; 
      border: 2px solid #EBF1F5; 
      padding: 14px 32px; 
      font-size: 12px; 
      letter-spacing: 0.12em; 
      text-transform: uppercase; 
      border-radius: 9999px; 
      cursor: pointer; 
      font-weight: 700; 
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
      box-shadow: 0 4px 15px rgba(42, 31, 26, 0.02);
    }
    
    .bb-btn-outline:hover { 
      border-color: #F67B63; 
      color: #F67B63; 
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 6px 20px rgba(246, 123, 99, 0.1);
    }
    
    .hover-bounce:hover {
      transform: translateY(-3px) scale(1.02);
    }
    .hover-bounce:active {
      transform: translateY(1px) scale(0.98);
    }

    /* ─── Micro-Animations ─── */
    @keyframes floatBalloon {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-16px) rotate(3deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    .animate-balloon {
      animation: floatBalloon 7s ease-in-out infinite;
    }
    .animate-balloon-delayed {
      animation: floatBalloon 9s ease-in-out infinite;
      animation-delay: 2s;
    }

    @keyframes driftStar {
      0% { transform: scale(1) rotate(0deg) translate(0px, 0px); }
      50% { transform: scale(1.15) rotate(15deg) translate(6px, -4px); }
      100% { transform: scale(1) rotate(0deg) translate(0px, 0px); }
    }
    .animate-drift-star {
      animation: driftStar 5s ease-in-out infinite;
    }
    .animate-drift-star-delayed {
      animation: driftStar 6.5s ease-in-out infinite;
      animation-delay: 1.5s;
    }

    @keyframes driftCloud {
      0% { transform: translateX(0px); }
      50% { transform: translateX(12px) translateY(-3px); }
      100% { transform: translateX(0px); }
    }
    .animate-drift-cloud {
      animation: driftCloud 10s ease-in-out infinite;
    }

    @keyframes morphBlob {
      0% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
      50% { border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
      100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
    }
    .animate-morph-blob {
      animation: morphBlob 10s ease-in-out infinite;
    }
    
    .rounded-blob {
      border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
    }
    @keyframes slowSway {
      0% { transform: rotate(0deg); }
      50% { transform: rotate(2.5deg); }
      100% { transform: rotate(0deg); }
    }
    .hero-balloon-string {
      transform-origin: top center;
      animation: slowSway 8s ease-in-out infinite;
    }

    .parallax-layer-1,
    .parallax-layer-2,
    .parallax-layer-3,
    .parallax-layer-4 {
      will-change: transform;
    }

    @media (prefers-reduced-motion: reduce) {
      .parallax-layer-1,
      .parallax-layer-2,
      .parallax-layer-3,
      .parallax-layer-4 {
        transform: none !important;
        animation: none !important;
        transition: none !important;
      }
    }
  `]
})
export class WelcomeSectionComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private mouseMoveListener: ((event: MouseEvent) => void) | null = null;
  private mouseLeaveListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private visibilityListener: (() => void) | null = null;
  private heroBounds: DOMRect | null = null;
  private ctx!: gsap.Context;
  private readonly enableInteractiveParallax = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any,
    private elementRef: ElementRef
  ) {}

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.ctx) {
        this.ctx.revert();
      }
      if (this.observer) {
        this.observer.disconnect();
      }
      const heroWrapper = this.document.getElementById('welcome-sec');
      if (heroWrapper) {
        if (this.mouseMoveListener) {
          heroWrapper.removeEventListener('mousemove', this.mouseMoveListener, { passive: true } as any);
        }
        if (this.mouseLeaveListener) {
          heroWrapper.removeEventListener('mouseleave', this.mouseLeaveListener);
        }
      }
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener);
        window.removeEventListener('orientationchange', this.resizeListener);
      }
      if (this.visibilityListener) {
        this.document.removeEventListener('visibilitychange', this.visibilityListener);
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.ctx = gsap.context(() => {
          this.initScrollAnimations();
          this.initMouseParallax();
        }, this.elementRef.nativeElement);
      }, 300); // Lazy settle delay
    }
  }

  private initScrollAnimations(): void {
    // Left cloud drifting left & down
    gsap.to('.drift-cloud-left', {
      scrollTrigger: {
        trigger: '#welcome-sec',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      x: -150,
      y: 50,
      opacity: 0.3,
      ease: 'none'
    });

    // Right cloud drifting right & down
    gsap.to('.drift-cloud-right', {
      scrollTrigger: {
        trigger: '#welcome-sec',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      x: 150,
      y: 50,
      opacity: 0.3,
      ease: 'none'
    });

    // Left balloon floating up & right
    gsap.to('.balloon-left', {
      scrollTrigger: {
        trigger: '#welcome-sec',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      },
      y: -280,
      x: 80,
      rotation: 15,
      opacity: 0.4,
      ease: 'none'
    });

    // Right balloon floating up & left
    gsap.to('.balloon-right', {
      scrollTrigger: {
        trigger: '#welcome-sec',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      },
      y: -280,
      x: -80,
      rotation: -15,
      opacity: 0.4,
      ease: 'none'
    });

    // Drift stars floating up & spinning
    gsap.to('.drift-star', {
      scrollTrigger: {
        trigger: '#welcome-sec',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      },
      y: -200,
      rotation: 240,
      scale: 0.6,
      opacity: 0.1,
      ease: 'none'
    });

    // Large Hero Balloon scroll parallax
    gsap.to('.hero-balloon-scroll-wrap', {
      scrollTrigger: {
        trigger: '#welcome-sec',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: -60,
      rotation: 3,
      ease: 'none'
    });

    // Large Hero Balloon Springy Hover Interactions
    const balloonContainer = this.document.querySelector('.hero-balloon-container');
    if (balloonContainer) {
      const body = balloonContainer.querySelector('.hero-balloon-body');
      const knot = balloonContainer.querySelector('.hero-balloon-knot');
      const string = balloonContainer.querySelector('.hero-balloon-string');
      
      balloonContainer.addEventListener('mouseenter', () => {
        gsap.to([body, knot], {
          scale: 1.04,
          y: -15,
          rotation: -3,
          duration: 0.5,
          ease: 'back.out(1.8)'
        });
        gsap.to(string, {
          y: -8,
          scaleY: 1.08,
          skewX: 6,
          duration: 0.5,
          ease: 'back.out(1.2)'
        });
      });

      balloonContainer.addEventListener('mouseleave', () => {
        gsap.to([body, knot], {
          scale: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)'
        });
        gsap.to(string, {
          y: 0,
          scaleY: 1,
          skewX: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    }

    // Refresh ScrollTrigger calculations
    ScrollTrigger.refresh();
  }

  private initMouseParallax(): void {
    if (!this.enableInteractiveParallax) {
      return;
    }

    // Only execute on devices with a fine pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const heroWrapper = this.document.getElementById('welcome-sec');
    if (!heroWrapper) return;

    // Define configuration for layers dynamically (Refinement 5 & 10)
    const layersConfig = [
      { selector: '.parallax-layer-1', depth: 4, duration: 1.2 }, // Blobs: ±4px, 1.2s
      { selector: '.parallax-layer-2', depth: 10, duration: 0.9 }, // Clouds/Stars: ±10px, 0.9s
      { selector: '.parallax-layer-3', depth: 16, duration: 0.6 }, // Hero Balloon: ±16px, 0.6s
      { selector: '.parallax-layer-4', depth: -22, duration: 0.4 } // HUD Badges: ±22px (inverse), 0.4s
    ];

    // Generate optimized quickTo setters
    const quickSetters = layersConfig.map(layer => {
      const elements = heroWrapper.querySelectorAll(layer.selector);
      if (elements.length === 0) return null;
      
      return {
        xSetter: gsap.quickTo(elements, 'x', { duration: layer.duration, ease: 'power2.out' }),
        ySetter: gsap.quickTo(elements, 'y', { duration: layer.duration, ease: 'power2.out' }),
        depth: layer.depth
      };
    }).filter(Boolean) as { xSetter: Function, ySetter: Function, depth: number }[];

    // Cache the bounding box calculation (Refinement 2)
    const updateBounds = () => {
      this.heroBounds = heroWrapper.getBoundingClientRect();
    };

    // Recalculate on window resize / orientationchange
    this.resizeListener = updateBounds;
    window.addEventListener('resize', this.resizeListener);
    window.addEventListener('orientationchange', this.resizeListener);

    // Mousemove handler logic (using passive event listener)
    this.mouseMoveListener = (event: MouseEvent) => {
      if (!this.heroBounds) {
        updateBounds();
      }
      
      const bounds = this.heroBounds!;
      const mouseX = event.clientX - bounds.left;
      const mouseY = event.clientY - bounds.top;
      
      const relX = (mouseX - bounds.width / 2) / (bounds.width / 2);
      const relY = (mouseY - bounds.height / 2) / (bounds.height / 2);

      quickSetters.forEach(setter => {
        setter.xSetter(relX * setter.depth);
        setter.ySetter(relY * setter.depth);
      });
    };

    // Mouseleave handler logic
    this.mouseLeaveListener = () => {
      quickSetters.forEach(setter => {
        setter.xSetter(0);
        setter.ySetter(0);
      });
    };

    let isMouseTrackingActive = false;

    const startTracking = () => {
      if (isMouseTrackingActive) return;
      heroWrapper.addEventListener('mousemove', this.mouseMoveListener!, { passive: true } as any);
      heroWrapper.addEventListener('mouseleave', this.mouseLeaveListener!);
      isMouseTrackingActive = true;
    };

    const stopTracking = () => {
      if (!isMouseTrackingActive) return;
      heroWrapper.removeEventListener('mousemove', this.mouseMoveListener!, { passive: true } as any);
      heroWrapper.removeEventListener('mouseleave', this.mouseLeaveListener!);
      isMouseTrackingActive = false;
      if (this.mouseLeaveListener) {
        this.mouseLeaveListener();
      }
    };

    // Visibility API support (Refinement 4)
    this.visibilityListener = () => {
      if (this.document.visibilityState === 'hidden') {
        stopTracking();
      } else {
        // Only resume if the hero is visible in the viewport
        if (entryCached && entryCached.isIntersecting) {
          startTracking();
        }
      }
    };
    this.document.addEventListener('visibilitychange', this.visibilityListener);

    let entryCached: IntersectionObserverEntry | null = null;

    // Use IntersectionObserver to enable tracking only when visible (Refinement 3)
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entryCached = entry;
        if (entry.isIntersecting) {
          updateBounds(); // Refresh bounds when re-entering viewport
          if (this.document.visibilityState === 'visible') {
            startTracking();
          }
        } else {
          stopTracking();
        }
      });
    }, { threshold: 0.05 });

    this.observer.observe(heroWrapper);
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
