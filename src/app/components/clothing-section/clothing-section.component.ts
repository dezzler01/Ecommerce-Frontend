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
      <div class="max-w-6xl mx-auto w-full relative z-10">
        
        <!-- Two-column grid -->
        <div class="bb-grid">
          
          <!-- Left Pane: Women Collection -->
          <div 
            class="bb-cell shadow-2xl" 
            style="background-image: url('/products/women_collection.jpg');"
          >
            <div class="bb-cell-overlay"></div>
            <div class="bb-cell-content">
              <span class="bb-cell-label">Women</span>
              <h3 class="bb-h3 bb-serif" style="font-style: italic;">Effortless<br>Everyday Looks</h3>
              <p class="bb-cell-sub">Timeless pieces for modern moms.</p>
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
          <div 
            class="bb-cell shadow-2xl" 
            style="background-image: url('/products/newborn_care_collection.jpg');"
          >
            <div class="bb-cell-overlay"></div>
            <div class="bb-cell-content">
              <span class="bb-cell-label">Newborn Care</span>
              <h3 class="bb-h3 bb-serif" style="font-weight: 600;">Gentle Care,<br>Pure Love</h3>
              <p class="bb-cell-sub">Everything for their safest start.</p>
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
      border: 0.5px solid #E8DDD0;
      background-size: cover;
      background-position: center;
    }
    .bb-cell-overlay {
      position: absolute; inset: 0; z-index: 2;
      background: linear-gradient(to top, rgba(46,33,24,0.75) 0%, rgba(46,33,24,0.2) 50%, rgba(46,33,24,0.02) 100%);
    }
    .bb-cell-content { position: relative; z-index: 3; padding: 28px 36px; width: 100%; }
    .bb-cell-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #FAF6F0; opacity: 0.85; font-weight: 500; display: block; margin-bottom: 6px; }
    .bb-serif { font-family: 'Playfair Display', 'Cormorant Garamond', serif; }
    .bb-h3 { font-size: 24px; font-weight: 400; line-height: 1.25; margin-bottom: 6px; color: #FAF6F0; }
    .bb-cell-sub { font-size: 11px; color: rgba(250,246,240,0.8); margin-bottom: 14px; line-height: 1.5; font-weight: 300; }
    .bb-cell-link { font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; color: #FFF; font-weight: 600; cursor: pointer; border: none; background: none; font-family: 'Inter',sans-serif; padding: 0; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; border-bottom: 1px solid transparent; transition: all 0.3s; }
    .bb-cell-link:hover { border-bottom-color: #FFF; }
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
