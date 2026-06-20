import { 
  Component, 
  OnInit 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, ProductDto } from '../../services/product.service';

@Component({
  selector: 'app-kids-shoes-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="kids-shoes"
      class="relative w-full flex-1 flex flex-col justify-between pt-8 pb-4 px-6 md:px-12 lg:px-20 z-10 overflow-hidden"
    >
      <!-- Sleek department label at the top center/left (shifted down to clear navbar) -->
      <div class="max-w-6xl mx-auto w-full text-left pt-6 mt-16 relative z-10">
        <span class="tracking-widest font-mono text-[10px] md:text-xs uppercase font-semibold text-[#E07A5F] block mb-1">
          DEPARTMENT / JUNIOR ACTIVE
        </span>
        <h2 class="text-2xl md:text-4xl font-extralight text-[#2A2522] tracking-wider uppercase leading-tight drop-shadow-[0_2px_10px_rgba(251,249,246,0.9)]">
          Junior Active <span class="font-light italic text-[#8A817C]">&amp;</span> Play
        </h2>
      </div>

      <!-- Bottom HUD Horizontal Row Dashboard -->
      <div class="w-full mt-auto mb-6 z-10 pointer-events-auto">
        <div
          class="backdrop-blur-xl bg-[#110F0E]/70 border-t border-b border-white/5 py-8 px-8 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-7xl mx-auto rounded-2xl shadow-2xl shadow-black/40 text-left"
        >
          <!-- HUD Section 1: Product details -->
          <div class="flex flex-col justify-between md:col-span-2">
            <div>
              <span class="text-[9px] font-mono tracking-[0.2em] text-[#E07A5F] uppercase block mb-2 font-semibold">
                01 / Junior Footwear
              </span>
              <h3 class="text-lg font-light text-white tracking-wide uppercase mb-2">
                {{ kidsSneakerProduct?.title || 'Junior Active Sneakers' }}
              </h3>
              <p class="text-[11px] text-white/60 font-light leading-relaxed mb-4">
                {{ kidsSneakerProduct?.description || 'Soft knit uppers and lightweight, high-traction soles designed to protect growing feet.' }}
              </p>
            </div>
            <div class="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
              <span class="text-xs font-mono text-white/90 font-semibold">\${{ kidsSneakerProduct?.price || '110' }}</span>
              <button class="relative overflow-hidden px-6 py-2 bg-[#E07A5F] hover:bg-[#FBF9F6] text-[#FBF9F6] hover:text-[#2A2522] text-[9px] font-bold tracking-[0.15em] uppercase rounded transition-all duration-300 transform hover:-translate-y-0.5 group pointer-events-auto">
                <span class="relative z-10 transition-colors duration-300 group-hover:text-[#2A2522]">Shop Junior</span>
                <span class="absolute inset-0 bg-[#FBF9F6] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
              </button>
            </div>
          </div>

          <!-- HUD Section 2: Department info -->
          <div class="flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
            <span class="text-[9px] font-mono tracking-[0.2em] text-[#E07A5F] uppercase block mb-3 font-semibold">
              02 / Active Categories
            </span>
            <ul class="flex flex-col gap-2.5 text-[10px] text-white/85 font-light uppercase tracking-widest">
              <li *ngFor="let cat of categories" class="flex items-center gap-2">
                <span class="h-1 w-1 bg-[#E07A5F] rounded-full"></span>
                {{ cat }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 0%;
      min-height: 0;
    }
  `]
})
export class KidsShoesSectionComponent implements OnInit {
  categories = ["Active Play Sneakers", "Toddler Athletics", "Lightweight Runners"];
  kidsSneakerProduct?: ProductDto;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 100 }).subscribe(res => {
      if (res.isSuccess && res.data && res.data.items) {
        this.kidsSneakerProduct = res.data.items.find(p => p.mainCategory === 'Kids');
      }
    });
  }
}
