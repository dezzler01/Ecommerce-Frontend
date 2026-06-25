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
      id="little-one"
      class="relative w-full py-6 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <div class="max-w-6xl mx-auto w-full relative z-10">
        
        <!-- Wide Expansive Banner Panel with Glassmorphism & Foreground Image -->
        <div class="relative w-full rounded-[2.5rem] editorial-glass-card shadow-2xl overflow-hidden min-h-[300px] flex flex-col md:flex-row items-center justify-between p-8 md:p-12 pointer-events-auto select-none group">
          
          <!-- Foreground transparent product image on the right -->
          <img 
            src="products/little_one_collection.png" 
            alt="Little One Onesie Flat-lay" 
            class="absolute right-[5%] md:right-[15%] bottom-0 h-[100%] md:h-[110%] object-contain transition-transform duration-[1.2s] group-hover:scale-105 z-0"
          />
          
          <!-- Soft light mask for content area -->
          <div class="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent z-10 pointer-events-none"></div>

          <!-- Banner Left: Text & CTA on top of image -->
          <div class="relative flex flex-col items-start text-left space-y-6 max-w-xs md:max-w-md z-20">
            <span class="tracking-[0.25em] font-mono text-[10px] md:text-xs uppercase font-bold text-[#C98A58]">
              LITTLE ONE
            </span>
            <h2 class="font-serif-luxury text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#2A1F1A] uppercase leading-[0.95]">
              Tiny Styles, <br/>
              Big Comfort
            </h2>
            <p class="font-sans text-xs md:text-sm text-[#77685D] font-light">
              Soft. Safe. Adorable.
            </p>
            <div class="pt-4">
              <a 
                [routerLink]="['/products']" 
                [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }" 
                class="text-[9px] font-mono tracking-widest text-[#2A1F1A] hover:text-[#C98A58] uppercase font-bold flex items-center gap-2 border-b border-[#2A1F1A] pb-1 hover:border-[#C98A58] transition-colors"
              >
                <span>EXPLORE COLLECTION</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <!-- Banner Right: Floating Badge on top of image -->
          <div class="relative w-[120px] md:w-[130px] h-[120px] md:h-[130px] rounded-3xl border border-white/40 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-4 z-20 shadow-md">
            <span class="text-[8px] font-mono text-[#77685D] uppercase tracking-wider mb-1">UP TO</span>
            <span class="text-3xl font-serif-luxury font-bold text-[#C98A58] leading-none">30%</span>
            <span class="text-[8px] font-mono text-[#77685D] uppercase tracking-wider mt-1">OFF</span>
            <span class="text-[#C98A58] text-[10px] mt-2">♡</span>
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
    this.productService.getProducts({ pageSize: 10 }).subscribe();
  }
}
