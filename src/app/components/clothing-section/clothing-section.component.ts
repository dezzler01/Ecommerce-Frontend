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
  selector: 'app-clothing-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      id="clothing"
      class="relative w-full min-h-screen flex flex-col justify-center py-28 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <!-- Spacious Editorial Layout Grid -->
      <div class="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 my-auto">
        
        <!-- Left Side: Editorial Typography & Copy (5 cols) -->
        <div class="lg:col-span-5 flex flex-col items-start text-left space-y-6">
          <span class="tracking-[0.25em] font-mono text-[10px] md:text-xs uppercase font-bold text-[#E07A5F] block">
            COLLECTION / PREMIUM APPAREL
          </span>
          <h2 class="font-serif-luxury text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#2A2522] uppercase leading-tight select-none">
            Autumn <br/>
            <span class="font-light italic text-[#8A817C]">Silhouettes</span>
          </h2>
          <div class="w-16 h-[1.5px] bg-[#E07A5F] my-2"></div>
          <p class="font-sans text-xs md:text-sm text-[#6B5E57] font-light leading-relaxed max-w-md select-none">
            Fluid satin and delicate silk layers designed to drape effortlessly. Pieces that move with grace, celebrating form and premium texture.
          </p>
          <div class="pt-4 pointer-events-auto">
            <a 
              [routerLink]="['/products']" 
              [queryParams]="{ target: 'Women', subcategory: 'fashion' }" 
              class="relative overflow-hidden px-8 py-4 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/10 group cursor-pointer"
            >
              <span class="relative z-10">Explore Apparel</span>
              <span class="absolute inset-0 bg-[#E07A5F] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            </a>
          </div>
        </div>

        <!-- Right Side: Single Editorial Hero Product Showcase (7 cols) -->
        <div class="lg:col-span-7 flex justify-center lg:justify-end relative select-none">
          <!-- Background Radial Glow -->
          <div class="absolute inset-0 bg-[radial-gradient(circle,rgba(224,122,95,0.08)_0%,transparent_75%)] pointer-events-none"></div>

          <!-- Product: Flowing Satin Slip -->
          <div *ngIf="dressProduct" class="editorial-float flex flex-col space-y-4 relative z-10 max-w-md w-full">
            <div class="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden border border-[#2A2522]/5 shadow-2xl shadow-black/10 group pointer-events-auto">
              <img 
                [src]="resolveImageUrl(dressProduct.imageUrl)" 
                [alt]="dressProduct.title" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <!-- Colorful Quick-Shop Reveal Overlay -->
              <div class="absolute inset-0 bg-[#E07A5F]/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-6 text-center z-20">
                <span class="px-3 py-1 text-[8px] font-mono font-bold bg-white text-[#E07A5F] rounded-full uppercase tracking-wider mb-2 shadow-sm">Ref. 03 / APPAREL</span>
                <h4 class="text-sm font-bold text-white uppercase tracking-wide mb-1 drop-shadow-md text-center">{{ dressProduct.title }}</h4>
                <span class="text-xs font-mono text-white font-bold mb-4 drop-shadow-sm">{{ dressProduct.price | currency:'EGP ' }}</span>
                <a [routerLink]="['/products', dressProduct.id]" class="px-5 py-2.5 bg-white text-[#2A2522] hover:bg-[#2A2522] hover:text-white text-[9px] font-black uppercase tracking-widest rounded-full transition-all shadow-lg transform hover:scale-105 active:scale-95">
                  [ Quick Shop ⚡ ]
                </a>
              </div>
            </div>
            <span class="text-[9px] font-mono tracking-widest text-[#8A817C] uppercase text-center font-bold">
              [03] {{ dressProduct.title }}
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
export class ClothingSectionComponent implements OnInit {
  dressProduct?: ProductDto;
  resolveImageUrl = resolveImageUrl;

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 100 }).subscribe(res => {
      if (res.isSuccess && res.data && res.data.items) {
        this.dressProduct = res.data.items.find(p => p.subCategory?.toLowerCase() === 'fashion' && p.title.toLowerCase().includes('slip'));
      }
    });
  }
}
