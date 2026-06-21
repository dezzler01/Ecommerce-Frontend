import { 
  Component, 
  OnInit 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, ProductDto } from '../../services/product.service';

@Component({
  selector: 'app-bags-shoes-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      id="women"
      class="relative w-full h-screen flex flex-col justify-between py-24 px-6 md:px-12 lg:px-20 z-10 overflow-hidden"
    >
      <!-- Subtle warm dark gradient overlay behind text to maximize readability -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#161412]/30 via-transparent to-[#161412]/30 pointer-events-none"></div>

      <!-- Sleek department label at the top left (shifted down to clear navbar) -->
      <div class="max-w-6xl mx-auto w-full text-left pt-6 mt-16 relative z-10">
        <span class="tracking-widest font-mono text-[10px] md:text-xs uppercase font-semibold text-[#E07A5F] block mb-1">
          DEPARTMENT / ACCESSORIES & FOOTWEAR
        </span>
        <h2 class="text-2xl md:text-4xl font-extralight text-[#2A2522] tracking-wider uppercase leading-tight drop-shadow-[0_2px_10px_rgba(251,249,246,0.9)]">
          The Art of Leather <span class="font-light italic text-[#8A817C]">&amp;</span> Curvature
        </h2>
      </div>

      <!-- Panels Container -->
      <div class="w-full flex flex-col md:flex-row md:justify-between items-center md:items-stretch gap-8 my-auto relative z-10 px-4 md:px-12 lg:px-24">
        <!-- Left Side: Leather Bags Info (Asymmetrical, borderless) -->
        <div
          #card1
          class="backdrop-blur-xl bg-[#110F0E]/70 p-8 md:p-10 rounded-2xl shadow-2xl shadow-black/35 hover:shadow-[#E07A5F]/5 transition-all duration-500 w-full md:w-[380px] self-start md:self-center text-left"
        >
          <span class="tracking-widest font-mono text-[10px] md:text-xs uppercase font-semibold text-[#E07A5F] block mb-3">
            WOMEN'S LUXURY BAGS / 01
          </span>
          <h3 class="text-2xl md:text-3xl font-extralight text-white tracking-wide mb-4 uppercase leading-tight">
            {{ bagProduct?.title || 'Sculpted Leather Handbag' }}
          </h3>
          
          <div *ngIf="bagProduct" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border/10 bg-white/5 text-[10px] text-white/90 uppercase tracking-[0.15em] font-semibold mb-6">
            \${{ bagProduct.price }}
          </div>
          
          <p class="text-xs text-white/70 font-light leading-relaxed mb-8 tracking-wide">
            {{ bagProduct?.description || 'Exquisite silhouettes handcrafted from Italian full-grain leather. Designed for organic structures and meticulous attention to detail.' }}
          </p>
          
          <div class="flex gap-4">
            <a [routerLink]="['/products']" [queryParams]="{ target: 'Women', subcategory: 'bags' }" class="relative overflow-hidden px-8 py-3.5 bg-[#E07A5F] hover:bg-[#FBF9F6] text-[#FBF9F6] hover:text-[#2A2522] text-[10px] font-bold tracking-[0.2em] uppercase rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/20 group pointer-events-auto select-none">
              <span class="relative z-10 transition-colors duration-300 group-hover:text-[#2A2522]">Explore Bags</span>
              <span class="absolute inset-0 bg-[#FBF9F6] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            </a>
          </div>
        </div>

        <!-- Right Side: Heels Info (Asymmetrical, borderless, staggered) -->
        <div
          #card2
          class="backdrop-blur-xl bg-[#110F0E]/70 p-8 md:p-10 rounded-2xl shadow-2xl shadow-black/35 hover:shadow-[#E07A5F]/5 transition-all duration-500 w-full md:w-[330px] self-end md:self-center md:mt-24 text-left pointer-events-auto"
        >
          <span class="tracking-widest font-mono text-[10px] md:text-xs uppercase font-semibold text-[#E07A5F] block mb-3">
            WOMEN'S DESIGNER SHOES / 02
          </span>
          <h3 class="text-2xl md:text-3xl font-extralight text-white tracking-wide mb-4 uppercase leading-tight">
            {{ heelProduct?.title || 'Stiletto Heels' }}
          </h3>
          
          <div *ngIf="heelProduct" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/90 uppercase tracking-[0.15em] font-semibold mb-6">
            \${{ heelProduct.price }}
          </div>
          
          <p class="text-xs text-white/70 font-light leading-relaxed mb-8 tracking-wide">
            {{ heelProduct?.description || 'Precision engineering meets high fashion. Designed to catch light with beautiful curvature and elegant straps.' }}
          </p>
          
          <div class="flex gap-4">
            <a [routerLink]="['/products']" [queryParams]="{ target: 'Women', subcategory: 'shoes' }" class="relative py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white group transition-colors select-none">
              <span class="relative z-10 transition-colors duration-300 group-hover:text-[#E07A5F]">Shop Shoes</span>
              <span class="absolute bottom-0 left-0 w-full h-[1px] bg-[#E07A5F] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </a>
          </div>
        </div>
      </div>

      <!-- Balanced spacing at bottom -->
      <div class="h-6"></div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BagsShoesSectionComponent implements OnInit {
  bagProduct?: ProductDto;
  heelProduct?: ProductDto;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 100 }).subscribe(res => {
      if (res.isSuccess && res.data && res.data.items) {
        this.bagProduct = res.data.items.find(p => p.subCategory?.toLowerCase() === 'bags');
        this.heelProduct = res.data.items.find(p => p.subCategory?.toLowerCase() === 'shoes' && p.mainCategory?.toLowerCase() === 'women');
      }
    });
  }
}
