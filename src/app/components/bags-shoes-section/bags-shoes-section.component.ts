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
      class="relative w-full py-20 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <div class="max-w-6xl mx-auto w-full relative z-10">
        
        <!-- Wide Expansive Banner Panel -->
        <div class="relative w-full rounded-[2.5rem] bg-[#F3E8DD]/20 border border-[#E7D8CB] shadow-2xl shadow-black/[0.02] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 pointer-events-auto select-none overflow-hidden">
          
          <!-- Banner Left: Text & CTA -->
          <div class="flex flex-col items-start text-left space-y-6 max-w-sm md:max-w-md z-10">
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

          <!-- Banner Center: Product Image (onesie) -->
          <div class="relative flex-1 flex justify-center items-center h-[220px] md:h-[280px] z-10 w-full">
            <img 
              src="products/little_one_collection.png" 
              alt="Little One Onesie Flat-lay" 
              class="h-full object-contain transition-transform duration-[1.2s] hover:scale-105"
            />
          </div>

          <!-- Banner Right: Floating Badge -->
          <div class="w-[120px] md:w-[140px] h-[120px] md:h-[140px] rounded-3xl border border-[#E7D8CB] bg-[#F8F1EA] flex flex-col items-center justify-center p-4 z-10 shadow-md">
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
