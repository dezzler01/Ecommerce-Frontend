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
  selector: 'app-kids-shoes-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      id="kids-shoes"
      class="relative w-full py-6 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <div class="w-full section-container relative z-10">
        
        <!-- Wide Expansive Banner Panel with full-bleed background -->
        <div class="bb-strip shadow-2xl overflow-hidden group">
          <!-- Parallax & Hover Zoom background image -->
          <div 
            class="bb-strip-bg absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
            style="background-image: url('/products/men_collection_perfect.png');"
          ></div>
          
          <div class="bb-strip-content z-20">
            <span class="bb-label">Collection / Men</span>
            <h2 class="bb-h2 bb-serif">Timeless <br/>&amp; Tailored</h2>
            <p class="bb-tagline">Sharp silhouettes and contemporary essentials for the modern man.</p>
            <div class="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-wider text-[#C4633A]/60 font-bold cursor-not-allowed select-none">
              <span>Coming Soon</span>
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            </div>
          </div>

          <div class="bb-disc-badge z-20">
            <span class="bb-disc-up">Men's</span>
            <span class="bb-disc-pct">SOON</span>
            <span class="bb-disc-off">Coming</span>
            <span class="text-[11px] text-[#C4633A] mt-0.5 block">⚡</span>
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
    .bb-label { font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: #C4633A; font-weight: 600; margin-bottom: 8px; display: block; }
    .bb-serif { font-family: 'Playfair Display', 'Cormorant Garamond', serif; }
    .bb-h2 { font-size: 42px; font-weight: 600; line-height: 1.15; margin-bottom: 8px; color: #2E2118; text-transform: uppercase; }
    @media (max-width: 768px) {
      .bb-h2 {
        font-size: 30px;
      }
    }
    .bb-tagline { font-size: 16px; color: #8C7B6B; margin-bottom: 16px; font-weight: 300; max-width: 320px; }
    .bb-link { font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: #C4633A; font-weight: 600; cursor: pointer; border: none; background: none; font-family: 'Inter',sans-serif; padding: 0; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; border-bottom: 1px solid transparent; transition: all 0.3s; }
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
    .bb-disc-up { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7B6B; display: block; margin-bottom: 2px; }
    .bb-disc-pct { font-size: 30px; font-weight: 600; color: #C4633A; font-family: 'Playfair Display', 'Cormorant Garamond', serif; line-height: 1; letter-spacing: 0.05em; }
    .bb-disc-off { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7B6B; display: block; margin-top: 2px; }
  `]
})
export class KidsShoesSectionComponent implements OnInit {
  sneakerProduct?: ProductDto;
  resolveImageUrl = resolveImageUrl;

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 100 }).subscribe(res => {
      if (res.isSuccess && res.data && res.data.items) {
        this.sneakerProduct = res.data.items.find(p => 
          p.mainCategory?.toLowerCase() === 'kids' && 
          p.subCategory?.toLowerCase() === 'shoes'
        );
      }
    });
  }
}
