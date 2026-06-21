import { 
  Component, 
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, ProductDto } from '../../services/product.service';

@Component({
  selector: 'app-clothing-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="clothing"
      class="relative w-full h-screen flex flex-col justify-center pt-20 px-6 md:px-12 lg:px-24 z-10 overflow-hidden"
    >
      <!-- Subtle warm vignette overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#FBF9F6]/20 via-transparent to-transparent pointer-events-none"></div>

      <div class="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-20 items-center">
        <!-- Left Side: Editorial Typography & Copy (occupies 3/5 cols) -->
        <div class="md:col-span-3 text-left">
          <span class="tracking-widest font-mono text-[10px] md:text-xs uppercase font-semibold text-[#E07A5F] block mb-3">
            DEPARTMENT / WOMEN'S PREMIUM APPAREL
          </span>
          <h2 class="text-4xl md:text-6xl font-extralight text-[#2A2522] tracking-[0.05em] mb-6 uppercase leading-tight">
            The Autumn <br/>
            <span class="font-light italic text-[#8A817C]">Silhouettes</span>
          </h2>
          <p class="text-xs md:text-sm text-[#5A504B] font-light leading-relaxed max-w-md mb-8 tracking-wide">
            Sculpted fabrics and flowing textures designed to embrace movement. Our silk organza gowns and asymmetric knitwear are meticulously tailored for the modern woman who demands sophistication.
          </p>
          <div class="pointer-events-auto">
            <button 
              (click)="exploreApparel()"
              class="relative overflow-hidden px-8 py-3.5 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-xs font-bold tracking-[0.2em] uppercase rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/10 group cursor-pointer"
            >
              <span class="relative z-10 transition-colors duration-300">Explore Apparel</span>
              <span class="absolute inset-0 bg-[#E07A5F] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            </button>
          </div>
        </div>

        <!-- Right Side: Real Product Cards from Database -->
        <div
          class="md:col-span-2 flex flex-col gap-5 text-left pl-0 md:pl-8 pointer-events-auto"
        >
          <div
            *ngFor="let card of cards; let i = index"
            (click)="viewProduct(card.id)"
            class="group cursor-pointer transition-all duration-400 hover:translate-x-1.5 flex items-start gap-4"
          >
            <!-- Product Image Thumbnail -->
            <div class="relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-md shadow-black/10 group-hover:shadow-lg group-hover:shadow-[#E07A5F]/10 transition-shadow duration-300">
              <img 
                *ngIf="card.imageUrl" 
                [src]="card.imageUrl" 
                [alt]="card.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div *ngIf="!card.imageUrl" class="w-full h-full bg-gradient-to-br from-[#E8DDD4] to-[#D4C8BE] flex items-center justify-center">
                <span class="text-[#8A817C] text-[8px] font-mono uppercase tracking-widest">{{ (i + 1) | number:'02.0' }}</span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <!-- Brand Badge -->
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-[8px] font-mono tracking-[0.2em] text-[#E07A5F] uppercase font-bold">
                  {{ card.brand || card.cat }}
                </span>
                <span *ngIf="card.material" class="text-[7px] font-mono tracking-wider text-[#8A817C]/60 uppercase">
                  · {{ card.material }}
                </span>
              </div>
              <div class="flex justify-between items-baseline gap-2">
                <h3 class="text-[13px] font-light text-[#2A2522] tracking-wide uppercase group-hover:text-[#E07A5F] transition-colors truncate">
                  {{ card.title }}
                </h3>
                <span class="text-xs font-mono text-[#2A2522] font-semibold whitespace-nowrap">
                  {{ card.price }}
                </span>
              </div>
              <p class="text-[10px] text-[#8A817C] font-light leading-relaxed mt-0.5 line-clamp-1">
                {{ card.description }}
              </p>
              <div class="relative w-full h-[1px] bg-[#2A2522]/8 mt-2.5 overflow-hidden">
                <div class="absolute inset-0 bg-[#E07A5F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ClothingSectionComponent implements OnInit {
  categories = ["Prêt-à-Porter", "Evening Gowns", "Silk Slips", "Linen Sets"];
  cards: {
    id: string;
    title: string;
    price: string;
    cat: string;
    brand: string;
    description: string;
    material: string;
    imageUrl: string;
  }[] = [];
  
  private router = inject(Router);
  private productService = inject(ProductService);
  private apiBase = 'http://localhost:5153';

  exploreApparel() {
    this.router.navigate(['/products'], { queryParams: { target: 'Women', subcategory: 'fashion' } });
  }

  viewProduct(id: string) {
    if (id) {
      this.router.navigate(['/products', id]);
    }
  }

  private resolveImageUrl(product: ProductDto): string {
    const url = product.imageUrls?.[0]?.url || product.imageUrl || '';
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${this.apiBase}${url}`;
  }

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 100 }).subscribe(res => {
      if (res.isSuccess && res.data && res.data.items) {
        const clothes = res.data.items.filter(p => p.subCategory?.toLowerCase() === 'fashion');
        if (clothes.length > 0) {
          this.cards = clothes.slice(0, 4).map(p => {
            let categoryName = 'Apparel';
            if (p.title.includes('Satin Slip')) categoryName = 'Silk Slips';
            else if (p.title.includes('Knit Dress')) categoryName = 'Prêt-à-Porter';
            else if (p.title.includes('Organza Gown')) categoryName = 'Evening Gowns';
            else if (p.title.includes('Heels') || p.title.includes('Stiletto')) categoryName = 'Designer Shoes';
            
            return {
              id: p.id,
              title: p.title,
              price: `$${p.price.toLocaleString()}`,
              cat: categoryName,
              brand: p.brandName || '',
              description: p.description || '',
              material: p.materials?.[0] || '',
              imageUrl: this.resolveImageUrl(p)
            };
          });
        } else {
          this.resetToMock();
        }
      } else {
        this.resetToMock();
      }
    }, () => {
      this.resetToMock();
    });
  }

  private resetToMock(): void {
    this.cards = [
      {
        id: '',
        title: "Flowing Satin Slip",
        price: "$340",
        cat: "Silk Slips",
        brand: "Chanel",
        description: "Sleek flowing satin slip dress made of 100% pure mulberry silk.",
        material: "Silk",
        imageUrl: ''
      },
      {
        id: '',
        title: "Asymmetric Knit Dress",
        price: "$480",
        cat: "Prêt-à-Porter",
        brand: "Zara",
        description: "Elegant asymmetric ribbed knit dress tailored to drape beautifully.",
        material: "Wool Blend",
        imageUrl: ''
      },
      {
        id: '',
        title: "Silk Organza Gown",
        price: "$1,200",
        cat: "Evening Gowns",
        brand: "Chanel",
        description: "Show-stopping silk organza gown featuring structured corsetry.",
        material: "Organza",
        imageUrl: ''
      },
    ];
  }
}
