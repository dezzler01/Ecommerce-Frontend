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
      class="relative w-full min-h-screen flex flex-col justify-center py-28 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <!-- Subtly shaded backdrop overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/80 via-[#FAF6F0]/20 to-transparent pointer-events-none"></div>

      <div class="max-w-6xl mx-auto w-full relative z-10 flex flex-col space-y-12">
        <!-- Top Section Header -->
        <div class="text-left">
          <span class="tracking-[0.25em] font-mono text-[10px] md:text-xs uppercase font-bold text-[#E07A5F] block mb-1">
            DEPARTMENT / ACCESSORIES &amp; FOOTWEAR
          </span>
          <h2 class="text-3xl md:text-5xl font-extralight text-[#2A2522] tracking-wider uppercase leading-tight">
            The Art of Leather <span class="font-light italic text-[#8A817C]">&amp;</span> Curvature
          </h2>
          <div class="w-24 h-[1px] bg-[#E07A5F] mt-4"></div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <!-- Left Column: Staggered Image Showcase Composition (7 cols) -->
          <div class="lg:col-span-7 grid grid-cols-2 gap-6 relative">
            <!-- Handbag Showcase Card -->
            <div class="flex flex-col space-y-4 transform hover:-translate-y-2 transition-transform duration-500">
              <div class="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-[#2A2522]/5 shadow-xl shadow-black/10 group">
                <img 
                  src="/products/handbag.png" 
                  alt="Luxury Handbag" 
                  class="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />
              </div>
              <span class="text-[9px] font-mono tracking-widest text-[#8A817C] uppercase text-left font-bold">
                [01] SCULPTED SHOULDER BAG
              </span>
            </div>

            <!-- Stiletto Heels Showcase Card (Offset downwards) -->
            <div class="flex flex-col space-y-4 pt-12 transform hover:-translate-y-2 transition-transform duration-500">
              <div class="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-[#2A2522]/5 shadow-xl shadow-black/10 group">
                <img 
                  src="/products/heels.png" 
                  alt="Designer Heels" 
                  class="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />
              </div>
              <span class="text-[9px] font-mono tracking-widest text-[#8A817C] uppercase text-left font-bold">
                [02] LEATHER STRAP HEELS
              </span>
            </div>
          </div>

          <!-- Right Column: Editorial Glassmorphism Details Box (5 cols) -->
          <div class="lg:col-span-5 flex flex-col">
            <div class="backdrop-blur-xl bg-[#110F0E]/85 p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10 text-left space-y-8">
              <!-- Department Label -->
              <span class="tracking-widest font-mono text-[9px] uppercase font-bold text-[#E07A5F] block border-b border-white/5 pb-3">
                COLLECTION HIGHLIGHTS
              </span>

              <!-- Product 1 Details -->
              <div class="space-y-3">
                <div class="flex justify-between items-baseline gap-2">
                  <h3 class="text-lg md:text-xl font-light text-white tracking-wide uppercase">
                    {{ bagProduct?.title || 'Sculpted Leather Handbag' }}
                  </h3>
                  <span class="text-xs font-mono text-[#E07A5F] font-bold">
                    \${{ bagProduct?.price || '320' }}
                  </span>
                </div>
                <p class="text-[11px] text-white/60 font-light leading-relaxed tracking-wide">
                  {{ bagProduct?.description || 'Exquisite silhouettes handcrafted from Italian full-grain leather. Designed for organic structures and meticulous attention to detail.' }}
                </p>
              </div>

              <!-- Thin Divider -->
              <div class="h-[1px] bg-white/5"></div>

              <!-- Product 2 Details -->
              <div class="space-y-3">
                <div class="flex justify-between items-baseline gap-2">
                  <h3 class="text-lg md:text-xl font-light text-white tracking-wide uppercase">
                    {{ heelProduct?.title || 'Stiletto Heels' }}
                  </h3>
                  <span class="text-xs font-mono text-[#E07A5F] font-bold">
                    \${{ heelProduct?.price || '280' }}
                  </span>
                </div>
                <p class="text-[11px] text-white/60 font-light leading-relaxed tracking-wide">
                  {{ heelProduct?.description || 'Precision engineering meets high fashion. Designed to catch light with beautiful curvature and elegant straps.' }}
                </p>
              </div>

              <!-- Explore CTA Button -->
              <div class="pt-4 flex">
                <a 
                  [routerLink]="['/products']" 
                  [queryParams]="{ target: 'Women', subcategory: 'bags' }" 
                  class="relative overflow-hidden px-8 py-3.5 bg-[#E07A5F] hover:bg-[#FBF9F6] text-[#FBF9F6] hover:text-[#2A2522] text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/25 group pointer-events-auto w-full text-center"
                >
                  <span class="relative z-10 transition-colors duration-300 group-hover:text-[#2A2522]">Explore Collection</span>
                  <span class="absolute inset-0 bg-[#FBF9F6] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
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
