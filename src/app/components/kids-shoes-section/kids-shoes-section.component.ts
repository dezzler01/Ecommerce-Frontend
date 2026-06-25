import { 
  Component, 
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService, ProductDto } from '../../services/product.service';

@Component({
  selector: 'app-kids-shoes-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      id="kids-shoes"
      class="relative w-full min-h-screen flex flex-col justify-center py-28 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <!-- Subtly shaded backdrop overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/80 via-[#FAF6F0]/20 to-transparent pointer-events-none"></div>

      <div class="max-w-6xl mx-auto w-full relative z-10 flex flex-col space-y-12">
        <!-- Top Section Header -->
        <div class="text-left">
          <span class="tracking-[0.25em] font-mono text-[10px] md:text-xs uppercase font-bold text-[#E07A5F] block mb-1">
            DEPARTMENT / KIDS FOOTWEAR
          </span>
          <h2 class="text-3xl md:text-5xl font-extralight text-[#2A2522] tracking-wider uppercase leading-tight">
            Kids Active <span class="font-light italic text-[#8A817C]">&amp;</span> Play
          </h2>
          <div class="w-24 h-[1px] bg-[#E07A5F] mt-4"></div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <!-- Left Column: Product Showcase Frame (5 cols) -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative w-full max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#2A2522]/5 shadow-2xl shadow-[#2A2522]/10 group">
              <!-- Vignette shading -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#161412]/20 via-transparent to-transparent z-[1]"></div>
              
              <img 
                src="/products/sneaker.png" 
                alt="Kids Active Sneakers" 
                class="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
            </div>
          </div>

          <!-- Right Column: HUD Dashboard Details Box (7 cols) -->
          <div class="lg:col-span-7 flex flex-col pointer-events-auto">
            <div class="backdrop-blur-xl bg-[#110F0E]/85 p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10 text-left grid grid-cols-1 md:grid-cols-12 gap-8">
              
              <!-- Left side of card details (8 cols) -->
              <div class="md:col-span-8 flex flex-col justify-between space-y-6">
                <div class="space-y-3">
                  <span class="text-[9px] font-mono tracking-[0.2em] text-[#E07A5F] uppercase block font-bold">
                    01 / KIDS ACTIVE FOOTWEAR
                  </span>
                  <h3 class="text-xl md:text-2xl font-light text-white tracking-wide uppercase">
                    {{ kidsSneakerProduct?.title || 'Kids Active Sneakers' }}
                  </h3>
                  <p class="text-[11px] text-white/60 font-light leading-relaxed tracking-wide">
                    {{ kidsSneakerProduct?.description || 'Soft knit uppers and lightweight, high-traction soles designed to protect growing feet.' }}
                  </p>
                </div>

                <div class="flex justify-between items-center pt-4 border-t border-white/5">
                  <span class="text-xs font-mono text-[#E07A5F] font-bold">
                    \${{ kidsSneakerProduct?.price || '110' }}
                  </span>
                  <button 
                    (click)="shopJunior()"
                    class="relative overflow-hidden px-6 py-2.5 bg-[#E07A5F] hover:bg-[#FBF9F6] text-[#FBF9F6] hover:text-[#2A2522] text-[9px] font-bold tracking-[0.15em] uppercase rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 group cursor-pointer select-none"
                  >
                    <span class="relative z-10 transition-colors duration-300 group-hover:text-[#2A2522]">Shop Kids Shoes</span>
                    <span class="absolute inset-0 bg-[#FBF9F6] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  </button>
                </div>
              </div>

              <!-- Right side of card details (4 cols) -->
              <div class="md:col-span-4 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6 space-y-4">
                <span class="text-[9px] font-mono tracking-[0.2em] text-[#E07A5F] uppercase block font-bold">
                  02 / CATEGORIES
                </span>
                <ul class="flex flex-col gap-2 text-[10px] text-white/80 font-light uppercase tracking-widest">
                  <li *ngFor="let cat of categories" class="flex items-center gap-2">
                    <span class="h-1.5 w-1.5 bg-[#E07A5F] rounded-full"></span>
                    {{ cat }}
                  </li>
                </ul>
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
export class KidsShoesSectionComponent implements OnInit {
  categories = ["Active Play", "Toddler Clogs", "Infant Soft"];
  kidsSneakerProduct?: ProductDto;
  
  private router = inject(Router);
  private productService = inject(ProductService);

  shopJunior() {
    this.router.navigate(['/products'], { queryParams: { target: 'Kids', subcategory: 'shoes' } });
  }

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 100 }).subscribe(res => {
      if (res.isSuccess && res.data && res.data.items) {
        this.kidsSneakerProduct = res.data.items.find(p => p.mainCategory?.toLowerCase() === 'kids' && (p.subCategory?.toLowerCase() === 'kids boys' || p.title.toLowerCase().includes('sneaker')));
      }
    });
  }
}
