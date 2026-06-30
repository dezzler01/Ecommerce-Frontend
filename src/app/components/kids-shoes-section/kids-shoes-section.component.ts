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
      class="relative w-full py-6 px-4 sm:px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <div class="w-full section-container relative z-10">
        
        <!-- Wide Expansive Banner Panel with full-bleed background -->
        <div class="bb-strip shadow-2xl overflow-hidden group">
          <!-- Parallax & Hover Zoom background image -->
          <div 
            class="bb-strip-bg absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
            style="background-image: url('/products/men_collection_perfect.png');"
          ></div>
          
          <!-- Stronger gradient on mobile so text is readable over the photo -->
          <div class="absolute inset-y-0 left-0 z-10 pointer-events-none
                      w-full bg-gradient-to-r from-[#FAF5F2]/65 via-[#FAF5F2]/30 to-[#FAF5F2]/0
                      sm:w-[85%] sm:from-[#FAF5F2]/55 sm:via-[#FAF5F2]/25
                      md:w-[60%] md:from-[#FAF5F2]/45 md:via-[#FAF5F2]/20"></div>
          
          <!-- Content: padded-right so it never slides under the badge -->
          <div class="bb-strip-content z-20 pr-[90px] xs:pr-[100px] sm:pr-[120px] md:pr-[160px] text-left">
            <span class="bb-label">Collection / Men</span>
            <h2 class="bb-h2 bb-serif">Timeless <br/>&#38; Tailored</h2>
            <p class="bb-tagline">Sharp silhouettes and contemporary essentials for the modern man.</p>
            <div class="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] uppercase tracking-wider text-[#F67B63]/60 font-bold cursor-not-allowed select-none font-nunito">
              <span>Coming Soon</span>
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            </div>
          </div>

          <!-- Badge — always absolute, always on the right -->
          <div class="bb-disc-badge z-20">
            <span class="bb-disc-up">Men's</span>
            <span class="bb-disc-pct">SOON</span>
            <span class="bb-disc-off">Coming</span>
            <span class="text-[11px] text-[#F67B63] mt-0.5 block">⚡</span>
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

    /* ── Banner Strip ── */
    .bb-strip {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: 2.5rem;
      border: 0.5px solid var(--border-delicate);
      display: flex;
      align-items: stretch;
      min-height: 220px;
    }
    @media (min-width: 640px) {
      .bb-strip {
        min-height: 260px;
      }
    }
    @media (min-width: 1024px) {
      .bb-strip {
        min-height: 300px;
      }
    }

    /* ── Background zoom image ── */
    .bb-strip-bg {
      position: absolute;
      top: -15%; bottom: -15%; left: 0; right: 0;
      background-size: cover;
      background-position: center;
    }

    /* ── Content block ── */
    .bb-strip-content {
      position: relative;
      z-index: 20;
      padding: 28px 20px;
      flex: 1;
    }
    @media (min-width: 480px) {
      .bb-strip-content { padding: 36px 32px; }
    }
    @media (min-width: 768px) {
      .bb-strip-content { padding: 48px 52px; }
    }

    /* ── Typography ── */
    .bb-label {
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #F67B63;
      font-weight: 700;
      margin-bottom: 6px;
      display: block;
      font-family: var(--font-heading);
    }
    @media (min-width: 640px) {
      .bb-label { font-size: 13px; margin-bottom: 8px; }
    }

    .bb-serif { font-family: var(--font-heading) !important; }

    .bb-h2 {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 6px;
      color: var(--text-charcoal);
      text-transform: uppercase;
    }
    @media (min-width: 480px) {
      .bb-h2 { font-size: 32px; }
    }
    @media (min-width: 768px) {
      .bb-h2 { font-size: 42px; margin-bottom: 8px; }
    }

    .bb-tagline {
      font-size: 13px;
      color: #77685D;
      margin-bottom: 14px;
      font-weight: 600;
      max-width: 240px;
      line-height: 1.5;
      font-family: var(--font-sans);
    }
    @media (min-width: 640px) {
      .bb-tagline { font-size: 15px; max-width: 300px; margin-bottom: 16px; }
    }
    @media (min-width: 768px) {
      .bb-tagline { font-size: 16px; max-width: 320px; }
    }

    /* ── Disc badge ── */
    .bb-disc-badge {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 30;
      background: rgba(255,253,249,0.92);
      border: 0.5px solid var(--border-delicate);
      border-radius: 16px;
      padding: 10px 12px;
      text-align: center;
      min-width: 68px;
      box-shadow: 0 8px 24px rgba(42,31,26,0.04);
    }
    @media (min-width: 480px) {
      .bb-disc-badge {
        right: 24px;
        padding: 13px 16px;
        min-width: 78px;
        border-radius: 18px;
      }
    }
    @media (min-width: 768px) {
      .bb-disc-badge {
        right: 52px;
        padding: 16px 20px;
        min-width: 90px;
        border-radius: 20px;
      }
    }

    .bb-disc-up  { font-size: 9px;  text-transform: uppercase; letter-spacing: 0.1em; color: #77685D; display: block; margin-bottom: 2px; font-family: var(--font-sans); }
    .bb-disc-pct { font-size: 22px; font-weight: 700; color: #F67B63; line-height: 1; letter-spacing: 0.05em; font-family: var(--font-heading); }
    .bb-disc-off { font-size: 9px;  text-transform: uppercase; letter-spacing: 0.1em; color: #77685D; display: block; margin-top: 2px; font-family: var(--font-sans); }

    @media (min-width: 640px) {
      .bb-disc-up  { font-size: 10px; }
      .bb-disc-pct { font-size: 28px; }
      .bb-disc-off { font-size: 10px; }
    }
    @media (min-width: 768px) {
      .bb-disc-pct { font-size: 30px; }
    }
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
