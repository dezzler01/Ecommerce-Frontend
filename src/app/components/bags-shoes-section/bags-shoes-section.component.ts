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
      <div class="w-full section-container relative z-10">
        
        <!-- Wide Expansive Banner Panel with full-bleed background -->
        <div class="bb-strip shadow-2xl overflow-hidden group">
          <!-- Parallax & Hover Zoom background image -->
          <div 
            class="bb-strip-bg absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
            style="background-image: url('/products/little_one_collection_perfect.jpg');"
          ></div>
          
          <div class="bb-strip-content z-20">
            <span class="bb-label">Little One</span>
            <h2 class="bb-h2 bb-serif">Tiny Styles,<br>Big Comfort</h2>
            <p class="bb-tagline">Soft. Safe. Adorable.</p>
            <a 
              [routerLink]="['/products']" 
              [queryParams]="{ target: 'Kids', subcategory: 'baby needs' }"
              class="bb-link"
            >
              <span>Explore Collection</span>
              <span>→</span>
            </a>
          </div>

          <div class="bb-disc-badge z-20">
            <span class="bb-disc-up">Up to</span>
            <span class="bb-disc-pct">30%</span>
            <span class="bb-disc-off">Off</span>
            <span class="text-[11px] text-[#C4633A] mt-0.5 block">♡</span>
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
    .bb-strip {
      position: relative; width: 100%; min-height: 280px; overflow: hidden;
      display: flex; align-items: center;
      border-radius: 2.5rem;
      border: 0.5px solid #E8DDD0;
    }
    .bb-strip-bg {
      position: absolute;
      top: -15%;
      bottom: -15%;
      left: 0;
      right: 0;
      background-size: cover;
      background-position: center;
    }
    .bb-strip-content { position: relative; z-index: 2; padding: 48px 52px; }
    @media (max-width: 768px) {
      .bb-strip-content {
        padding: 32px 24px;
      }
    }
    .bb-label { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #C4633A; font-weight: 500; margin-bottom: 8px; display: block; }
    .bb-serif { font-family: 'Playfair Display', 'Cormorant Garamond', serif; }
    .bb-h2 { font-size: 32px; font-weight: 600; line-height: 1.15; margin-bottom: 8px; color: #2E2118; }
    @media (max-width: 768px) {
      .bb-h2 {
        font-size: 24px;
      }
    }
    .bb-tagline { font-size: 12px; color: #8C7B6B; margin-bottom: 16px; font-weight: 300; }
    .bb-link { font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: #C4633A; font-weight: 600; cursor: pointer; border: none; background: none; font-family: 'Inter',sans-serif; padding: 0; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; border-bottom: 1px solid transparent; transition: all 0.3s; }
    .bb-link:hover { border-bottom-color: #C4633A; }
    
    .bb-disc-badge {
      position: absolute; right: 52px; top: 50%; transform: translateY(-50%); z-index: 3;
      background: rgba(250,246,240,0.9); border: 0.5px solid #E8DDD0; border-radius: 20px;
      padding: 16px 20px; text-align: center; min-width: 90px;
      box-shadow: 0 10px 30px rgba(150,110,80,0.08);
    }
    @media (max-width: 768px) {
      .bb-disc-badge {
        position: relative;
        right: auto;
        top: auto;
        transform: none;
        margin-left: 24px;
        margin-bottom: 24px;
        display: inline-block;
      }
    }
    .bb-disc-up { font-size: 8px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7B6B; display: block; margin-bottom: 2px; }
    .bb-disc-pct { font-size: 28px; font-weight: 600; color: #C4633A; font-family: 'Playfair Display', 'Cormorant Garamond', serif; line-height: 1; }
    .bb-disc-off { font-size: 8px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7B6B; display: block; margin-top: 2px; }
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
