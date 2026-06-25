import { 
  Component, 
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, ProductDto } from '../../services/product.service';
import { resolveImageUrl } from '../../core/utils/image-resolver';

@Component({
  selector: 'app-bags-shoes-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      id="women"
      class="relative w-full min-h-screen flex flex-col justify-center py-28 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <!-- Spacious Editorial Layout Grid -->
      <div class="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 my-auto">
        
        <!-- Left Side: Editorial Typography & Copy (5 cols) -->
        <div class="lg:col-span-5 flex flex-col items-start text-left space-y-6">
          <span class="tracking-[0.25em] font-mono text-[10px] md:text-xs uppercase font-bold text-[#E07A5F] block">
            COLLECTION / BAGS &amp; FOOTWEAR
          </span>
          <h2 class="font-serif-luxury text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#2A2522] uppercase leading-tight select-none">
            The Art of Leather <br/>
            <span class="font-light italic text-[#8A817C]">&amp;</span> Curvature
          </h2>
          <div class="w-16 h-[1.5px] bg-[#E07A5F] my-2"></div>
          <p class="font-sans text-xs md:text-sm text-[#6B5E57] font-light leading-relaxed max-w-md select-none">
            Exquisite silhouettes handcrafted from Italian full-grain leather, combining organic curves with rigid structures. Precision engineering meets high fashion.
          </p>
          <div class="pt-4 pointer-events-auto">
            <a 
              [routerLink]="['/products']" 
              [queryParams]="{ target: 'Women', subcategory: 'bags' }" 
              class="relative overflow-hidden px-8 py-4 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/10 group cursor-pointer"
            >
              <span class="relative z-10">Explore Collection</span>
              <span class="absolute inset-0 bg-[#E07A5F] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            </a>
          </div>
        </div>

        <!-- Right Side: Staggered Asymmetric Image Showcase (7 cols) -->
        <div class="lg:col-span-7 grid grid-cols-2 gap-8 items-start relative select-none">
          <!-- Background Radial Glow under items to remove flat white look -->
          <div class="absolute inset-0 bg-[radial-gradient(circle,rgba(224,122,95,0.08)_0%,transparent_75%)] pointer-events-none"></div>

          <!-- Product 1: Handbag -->
          <div *ngIf="bagProduct" class="editorial-float flex flex-col space-y-4 pt-16 relative z-10">
            <div class="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#2A2522]/5 shadow-2xl shadow-black/10 group pointer-events-auto">
              <img 
                [src]="resolveImageUrl(bagProduct.imageUrl)" 
                [alt]="bagProduct.title" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <!-- Glassmorphic Reveal Overlay -->
              <div class="absolute inset-0 bg-[#110F0E]/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-6 text-center z-20">
                <span class="text-[9px] font-mono tracking-widest text-[#E07A5F] uppercase font-bold mb-2">Ref. 01 / BAGS</span>
                <h4 class="text-sm font-light text-white uppercase tracking-wide mb-1">{{ bagProduct.title }}</h4>
                <span class="text-xs font-mono text-white/90 font-bold mb-4">{{ bagProduct.price | currency:'EGP ' }}</span>
                <a [routerLink]="['/products', bagProduct.id]" class="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all">
                  [ Quick Shop ]
                </a>
              </div>
            </div>
            <span class="text-[9px] font-mono tracking-widest text-[#8A817C] uppercase text-center font-bold">
              [01] {{ bagProduct.title }}
            </span>
          </div>

          <!-- Product 2: Stiletto Heels -->
          <div *ngIf="heelProduct" class="editorial-float flex flex-col space-y-4 relative z-10">
            <div class="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#2A2522]/5 shadow-2xl shadow-black/10 group pointer-events-auto">
              <img 
                [src]="resolveImageUrl(heelProduct.imageUrl)" 
                [alt]="heelProduct.title" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <!-- Glassmorphic Reveal Overlay -->
              <div class="absolute inset-0 bg-[#110F0E]/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-6 text-center z-20">
                <span class="text-[9px] font-mono tracking-widest text-[#E07A5F] uppercase font-bold mb-2">Ref. 02 / SHOES</span>
                <h4 class="text-sm font-light text-white uppercase tracking-wide mb-1">{{ heelProduct.title }}</h4>
                <span class="text-xs font-mono text-white/90 font-bold mb-4">{{ heelProduct.price | currency:'EGP ' }}</span>
                <a [routerLink]="['/products', heelProduct.id]" class="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all">
                  [ Quick Shop ]
                </a>
              </div>
            </div>
            <span class="text-[9px] font-mono tracking-widest text-[#8A817C] uppercase text-center font-bold">
              [02] {{ heelProduct.title }}
            </span>
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
  `]
})
export class BagsShoesSectionComponent implements OnInit {
  bagProduct?: ProductDto;
  heelProduct?: ProductDto;
  resolveImageUrl = resolveImageUrl;

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 100 }).subscribe(res => {
      if (res.isSuccess && res.data && res.data.items) {
        this.bagProduct = res.data.items.find(p => p.subCategory?.toLowerCase() === 'bags');
        this.heelProduct = res.data.items.find(p => p.subCategory?.toLowerCase() === 'shoes' && p.mainCategory?.toLowerCase() === 'women');
      }
    });
  }
}
