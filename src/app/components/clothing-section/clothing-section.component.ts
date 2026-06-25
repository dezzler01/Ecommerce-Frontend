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
      class="relative w-full py-12 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <div class="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        <!-- Left Pane: Women Collection -->
        <div class="relative w-full rounded-[2.5rem] border border-[#E7D8CB] shadow-2xl p-8 flex items-center pointer-events-auto select-none overflow-hidden min-h-[300px] group">
          <!-- Full-bleed background image -->
          <img 
            src="products/women_collection.jpg" 
            alt="Women Handbag and Perfume" 
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 z-0"
          />
          
          <!-- Soft Gradient Mask for text legibility over the image -->
          <div class="absolute inset-0 bg-gradient-to-r from-[#F8F1EA]/95 via-[#F8F1EA]/50 to-transparent z-10 pointer-events-none"></div>

          <!-- Content Left -->
          <div class="relative flex flex-col items-start text-left space-y-4 max-w-[65%] z-20">
            <span class="tracking-[0.25em] font-mono text-[9px] uppercase font-bold text-[#C98A58]">
              WOMEN
            </span>
            <h3 class="font-serif-luxury text-2xl md:text-3xl tracking-tight text-[#2A1F1A] uppercase leading-[0.95]">
              Effortless <br/>
              Everyday Looks
            </h3>
            <p class="font-sans text-[11px] text-[#77685D] font-light">
              Timeless pieces for modern moms.
            </p>
            <div class="pt-2">
              <a 
                [routerLink]="['/products']" 
                [queryParams]="{ target: 'Women' }" 
                class="text-[9px] font-mono tracking-widest text-[#2A1F1A] hover:text-[#C98A58] uppercase font-bold flex items-center gap-2 border-b border-[#2A1F1A] pb-1 hover:border-[#C98A58] transition-colors"
              >
                <span>SHOP WOMEN</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Right Pane: Newborn Care -->
        <div class="relative w-full rounded-[2.5rem] border border-[#E7D8CB] shadow-2xl p-8 flex items-center pointer-events-auto select-none overflow-hidden min-h-[300px] group">
          <!-- Full-bleed background image -->
          <img 
            src="products/newborn_care_collection.jpg" 
            alt="Newborn Care Bottles and Towels" 
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 z-0"
          />

          <!-- Soft Gradient Mask for text legibility over the image -->
          <div class="absolute inset-0 bg-gradient-to-r from-[#F8F1EA]/95 via-[#F8F1EA]/50 to-transparent z-10 pointer-events-none"></div>

          <!-- Content Left -->
          <div class="relative flex flex-col items-start text-left space-y-4 max-w-[65%] z-20">
            <span class="tracking-[0.25em] font-mono text-[9px] uppercase font-bold text-[#C98A58]">
              NEWBORN CARE
            </span>
            <h3 class="font-serif-luxury text-2xl md:text-3xl tracking-tight text-[#2A1F1A] uppercase leading-[0.95]">
              Gentle Care, <br/>
              Pure Love
            </h3>
            <p class="font-sans text-[11px] text-[#77685D] font-light">
              Everything for their safest start.
            </p>
            <div class="pt-2">
              <a 
                [routerLink]="['/products']" 
                [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }" 
                class="text-[9px] font-mono tracking-widest text-[#2A1F1A] hover:text-[#C98A58] uppercase font-bold flex items-center gap-2 border-b border-[#2A1F1A] pb-1 hover:border-[#C98A58] transition-colors"
              >
                <span>SHOP NEWBORN</span>
                <span>→</span>
              </a>
            </div>
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
    this.productService.getProducts({ pageSize: 10 }).subscribe();
  }
}
