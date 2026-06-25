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
        <div class="relative w-full rounded-[2.5rem] bg-[#F3E8DD]/20 border border-[#E7D8CB] shadow-2xl shadow-black/[0.02] p-8 flex items-center justify-between gap-6 pointer-events-auto select-none overflow-hidden min-h-[280px]">
          <!-- Content Left -->
          <div class="flex flex-col items-start text-left space-y-4 max-w-[50%] z-10">
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
          <!-- Artwork Right -->
          <div class="w-[50%] h-[200px] flex justify-end items-center z-0">
            <img 
              src="products/women_collection.png" 
              alt="Women Handbag and Perfume" 
              class="h-full object-contain rounded-2xl filter drop-shadow-[0_8px_16px_rgba(42,31,26,0.06)] transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        <!-- Right Pane: Newborn Care -->
        <div class="relative w-full rounded-[2.5rem] bg-[#F3E8DD]/20 border border-[#E7D8CB] shadow-2xl shadow-black/[0.02] p-8 flex items-center justify-between gap-6 pointer-events-auto select-none overflow-hidden min-h-[280px]">
          <!-- Content Left -->
          <div class="flex flex-col items-start text-left space-y-4 max-w-[55%] z-10">
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
          <!-- Artwork Right -->
          <div class="w-[45%] h-[200px] flex justify-end items-center z-0">
            <img 
              src="products/newborn_care_collection.png" 
              alt="Newborn Care Bottles and Towels" 
              class="h-full object-contain rounded-2xl filter drop-shadow-[0_8px_16px_rgba(42,31,26,0.06)] transition-transform duration-700 hover:scale-105"
            />
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
