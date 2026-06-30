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
      class="relative w-full py-6 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <div class="w-full section-container relative z-10">
        
        <!-- Two-column grid -->
        <div class="bb-grid">
          
          <!-- Left Pane: Women Collection -->
          <div class="bb-cell shadow-2xl overflow-hidden group">
            <!-- Background Image Wrapper for Zoom -->
            <div 
              class="bb-cell-bg absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
              style="background-image: url('/products/women_collection_perfect.png');"
            ></div>
            <div class="bb-cell-overlay z-10"></div>
            <div class="bb-cell-content z-20">
              <span class="bb-cell-label">Women</span>
              <h3 class="bb-h3 bb-serif">Effortless<br>Everyday Looks</h3>
              <p class="bb-cell-sub font-semibold">Timeless pieces for modern moms.</p>
              <a 
                [routerLink]="['/products']" 
                [queryParams]="{ target: 'Women' }" 
                class="bb-cell-link"
              >
                <span>Shop Women</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <!-- Right Pane: Newborn Care -->
          <div class="bb-cell shadow-2xl overflow-hidden group">
            <!-- Background Image Wrapper for Zoom -->
            <div 
              class="bb-cell-bg absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
              style="background-image: url('/products/newborn_care_collection_perfect.png');"
            ></div>
            <div class="bb-cell-overlay z-10"></div>
            <div class="bb-cell-content z-20">
              <span class="bb-cell-label">Newborn Care</span>
              <h3 class="bb-h3 bb-serif">Gentle Care,<br>Pure Love</h3>
              <p class="bb-cell-sub font-semibold">Everything for their safest start.</p>
              <a 
                [routerLink]="['/products']" 
                [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }" 
                class="bb-cell-link"
              >
                <span>Shop Newborn</span>
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
    .bb-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 24px; 
    }
    @media (max-width: 768px) {
      .bb-grid {
        grid-template-columns: 1fr;
      }
    }
    .bb-cell {
      position: relative; min-height: 320px; overflow: hidden;
      display: flex; align-items: flex-end;
      border-radius: 2.5rem;
      border: 0.5px solid var(--border-delicate);
    }
    .bb-cell-bg {
      position: absolute;
      top: -15%;
      bottom: -15%;
      left: 0;
      right: 0;
      background-size: cover;
      background-position: center;
    }
    .bb-cell-overlay {
      position: absolute; inset: 0; z-index: 2;
      background: linear-gradient(to top, rgba(42,31,26,0.8) 0%, rgba(42,31,26,0.25) 50%, rgba(42,31,26,0.02) 100%);
    }
    .bb-cell-content { position: relative; z-index: 3; padding: 28px 36px; width: 100%; text-align: left; }
    .bb-cell-label { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--bg-cheerful-cream); opacity: 0.85; font-weight: 700; display: block; margin-bottom: 6px; font-family: var(--font-heading); }
    .bb-serif { font-family: var(--font-heading) !important; }
    .bb-h3 { font-size: 32px; font-weight: 700; line-height: 1.25; margin-bottom: 6px; color: var(--bg-cheerful-cream); }
    .bb-cell-sub { font-size: 15px; color: rgba(250,246,240,0.8); margin-bottom: 14px; line-height: 1.5; font-weight: 400; font-family: var(--font-sans); }
    .bb-cell-link { font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; color: #FFF; font-weight: 700; cursor: pointer; border: none; background: none; font-family: var(--font-heading); padding: 0; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .bb-cell-link:hover { border-bottom-color: #FFF; transform: translateX(3px); }
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
