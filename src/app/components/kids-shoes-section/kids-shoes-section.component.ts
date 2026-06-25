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
      class="w-full bg-[#FAF6F0] border-t border-[#E8DDD0] py-6 flex items-center justify-center z-10 overflow-hidden select-none"
    >
      <div class="max-w-6xl mx-auto w-full px-6 md:px-12">
        <div class="bb-trust">
          
          <!-- Item 1: Fast & Reliable Delivery -->
          <div class="bb-trust-item">
            <div class="bb-trust-icon">
              <svg class="w-3.5 h-3.5 text-[#C4633A]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v11.177m0-11.177h-1.197a1.875 1.875 0 00-1.582.805l-3 4.2a1.875 1.875 0 00-.281.932v4.062a1.125 1.125 0 001.125 1.125H9.75M8.25 14.25h1.5M16.5 14.25h1.5" />
              </svg>
            </div>
            <div>
              <p class="bb-trust-title">Fast &amp; Reliable Delivery</p>
              <p class="bb-trust-sub">Across Egypt</p>
            </div>
          </div>

          <!-- Item 2: Premium Quality -->
          <div class="bb-trust-item">
            <div class="bb-trust-icon">
              <svg class="w-3.5 h-3.5 text-[#C4633A]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div>
              <p class="bb-trust-title">Premium Quality</p>
              <p class="bb-trust-sub">Curated with care</p>
            </div>
          </div>

          <!-- Item 3: Safe for Your Little One -->
          <div class="bb-trust-item">
            <div class="bb-trust-icon">
              <svg class="w-3.5 h-3.5 text-[#C4633A]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.599-3.75A11.952 11.952 0 0112 2.744z" />
              </svg>
            </div>
            <div>
              <p class="bb-trust-title">Safe for Your Little One</p>
              <p class="bb-trust-sub">Trusted &amp; tested</p>
            </div>
          </div>

          <!-- Item 4: Easy Returns -->
          <div class="bb-trust-item">
            <div class="bb-trust-icon">
              <svg class="w-3.5 h-3.5 text-[#C4633A]" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <p class="bb-trust-title">Easy Returns</p>
              <p class="bb-trust-sub">Hassle-free</p>
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
    .bb-trust { 
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      gap: 16px; 
      background: transparent;
    }
    @media (max-width: 768px) {
      .bb-trust {
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
    }
    .bb-trust-item { display: flex; align-items: center; gap: 10px; }
    .bb-trust-icon { 
      width: 32px; height: 32px; 
      background: #EDD9C8; 
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; 
      flex-shrink: 0; 
      border: 0.5px solid rgba(196,177,152,0.4);
    }
    .bb-trust-title { font-size: 10.5px; font-weight: 500; color: #2E2118; margin: 0; line-height: 1.3; }
    .bb-trust-sub { font-size: 9px; color: #8C7B6B; margin: 0; font-weight: 300; }
  `]
})
export class KidsShoesSectionComponent implements OnInit {
  sneakerProduct?: ProductDto;
  resolveImageUrl = resolveImageUrl;

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 10 }).subscribe();
  }
}
