import { 
  Component, 
  Inject, 
  PLATFORM_ID,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, ProductDto } from '../../services/product.service';
import { resolveImageUrl } from '../../core/utils/image-resolver';
import { gsap } from 'gsap';

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      class="relative flex min-h-screen w-full flex-col justify-center py-28 px-6 md:px-12 lg:px-24 select-none overflow-hidden bg-transparent"
    >
      <!-- High-Performance Animated 3D-Feeling Glassmorphic Blob Background -->
      <div class="blob-container">
        <div class="blob-1"></div>
        <div class="blob-2"></div>
        <div class="blob-3"></div>
      </div>

      <div class="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 my-auto">
        <!-- Left Side: Editorial Typography & Copy (6 cols) -->
        <div class="lg:col-span-6 flex flex-col items-start text-left space-y-6">
          <span class="tracking-[0.3em] font-mono text-[10px] md:text-xs uppercase font-bold text-[#E07A5F] block">
            PLAYTIME MEETS MODERN STREETWEAR
          </span>
          <h1 class="font-sans font-black text-4xl md:text-6xl lg:text-7xl tracking-tight text-[#2A2522] uppercase leading-[1.05] select-none">
            Gear Up The <br/>
            <span class="text-[#E07A5F]">Little Legends</span>
          </h1>
          <div class="w-16 h-[4px] bg-[#E07A5F] rounded-full my-1"></div>
          <p class="font-sans text-xs md:text-sm text-[#6B5E57] font-normal leading-relaxed max-w-md select-none">
            High-contrast sneakers, organic romper suits, and premium baby gear. Designed with a playful storefront aesthetic for active kids in motion.
          </p>
          <div class="flex flex-wrap gap-4 pt-4 pointer-events-auto">
            <a 
              [routerLink]="['/products']" 
              [queryParams]="{ target: 'Kids' }" 
              class="relative overflow-hidden px-8 py-4 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-[10px] font-bold tracking-[0.2em] uppercase rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/10 group cursor-pointer"
            >
              <span class="relative z-10">Shop Kids Collection ⚡</span>
              <span class="absolute inset-0 bg-[#E07A5F] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            </a>
            <button 
              (click)="scrollToCategories()" 
              class="relative overflow-hidden px-8 py-4 bg-white border border-[#2A2522]/10 hover:border-[#E07A5F] text-[#2A2522] hover:text-[#E07A5F] text-[10px] font-bold tracking-[0.2em] uppercase rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-black/5 group cursor-pointer"
            >
              <span class="relative z-10">Explore Catalog</span>
            </button>
          </div>
        </div>

        <!-- Right Side: Playful Floating Products (6 cols) -->
        <div class="lg:col-span-6 grid grid-cols-2 gap-6 relative select-none">
          <!-- Sneaker Floating Card -->
          <div *ngIf="sneakerProduct" class="hero-float-1 flex flex-col space-y-3 p-4 bg-white/70 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl max-w-[240px] mx-auto pointer-events-auto">
            <div class="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#F7F5F0]">
              <img 
                [src]="resolveImageUrl(sneakerProduct.imageUrl)" 
                [alt]="sneakerProduct.title" 
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute top-2 right-2">
                <span class="px-2 py-0.5 text-[8px] font-mono font-bold bg-[#E07A5F] text-white rounded-full uppercase tracking-wider">NEW</span>
              </div>
            </div>
            <div class="flex flex-col text-left space-y-1">
              <h4 class="text-[10px] font-bold text-[#2A2522] tracking-wide truncate">{{ sneakerProduct.title }}</h4>
              <div class="flex justify-between items-center">
                <span class="text-[10px] font-mono font-bold text-[#E07A5F]">{{ sneakerProduct.price | currency:'EGP ' }}</span>
                <a [routerLink]="['/products', sneakerProduct.id]" class="px-3 py-1 bg-[#2A2522] hover:bg-[#E07A5F] text-white text-[8px] font-bold rounded-lg transition-all">
                  Shop ⚡
                </a>
              </div>
            </div>
          </div>

          <!-- Romper Floating Card -->
          <div *ngIf="romperProduct" class="hero-float-2 flex flex-col space-y-3 p-4 bg-white/70 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl max-w-[240px] mx-auto pt-12 pointer-events-auto">
            <div class="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#F7F5F0]">
              <img 
                [src]="resolveImageUrl(romperProduct.imageUrl)" 
                [alt]="romperProduct.title" 
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute top-2 right-2">
                <span class="px-2 py-0.5 text-[8px] font-mono font-bold bg-[#B4F0D2] text-[#1D3E2F] rounded-full uppercase tracking-wider">Organic</span>
              </div>
            </div>
            <div class="flex flex-col text-left space-y-1">
              <h4 class="text-[10px] font-bold text-[#2A2522] tracking-wide truncate">{{ romperProduct.title }}</h4>
              <div class="flex justify-between items-center">
                <span class="text-[10px] font-mono font-bold text-[#E07A5F]">{{ romperProduct.price | currency:'EGP ' }}</span>
                <a [routerLink]="['/products', romperProduct.id]" class="px-3 py-1 bg-[#2A2522] hover:bg-[#E07A5F] text-white text-[8px] font-bold rounded-lg transition-all">
                  Shop ⚡
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- High-Conversion Subtle Scroll Anchor -->
      <div
        (click)="scrollToCategories()"
        class="welcome-scroll-indicator flex flex-col items-center gap-3 z-10 mt-12 cursor-pointer pointer-events-auto animate-bounce"
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
export class WelcomeSectionComponent implements OnInit {
  sneakerProduct?: ProductDto;
  romperProduct?: ProductDto;
  resolveImageUrl = resolveImageUrl;

  private productService = inject(ProductService);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 100 }).subscribe(res => {
      if (res.isSuccess && res.data && res.data.items) {
        this.sneakerProduct = res.data.items.find(p => 
          p.mainCategory?.toLowerCase() === 'kids' && 
          p.subCategory?.toLowerCase() === 'shoes'
        );
        this.romperProduct = res.data.items.find(p => 
          p.mainCategory?.toLowerCase() === 'kids' && 
          p.title.toLowerCase().includes('romper')
        );
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        gsap.to('.hero-float-1', {
          y: -15,
          rotation: 8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
        gsap.to('.hero-float-2', {
          y: 15,
          rotation: -6,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: 0.5
        });
      }, 200);
    }
  }

  scrollToCategories(): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = this.document.getElementById('kids-shoes');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
