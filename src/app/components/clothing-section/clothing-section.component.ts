import { 
  Component, 
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-clothing-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section
      id="clothing"
      class="relative w-full min-h-screen flex flex-col justify-center py-28 px-6 md:px-12 lg:px-24 z-10 overflow-hidden bg-transparent"
    >
      <!-- Subtly shaded backdrop overlay -->
      <div class="absolute inset-0 bg-gradient-to-l from-[#FAF6F0]/80 via-[#FAF6F0]/20 to-transparent pointer-events-none"></div>

      <div class="max-w-6xl mx-auto w-full relative z-10 flex flex-col space-y-12">
        
        <!-- Header -->
        <div class="text-right lg:text-left">
          <span class="tracking-[0.25em] font-mono text-[10px] md:text-xs uppercase font-bold text-[#E07A5F] block mb-1">
            DEPARTMENT / WOMEN'S PREMIUM APPAREL
          </span>
          <h2 class="text-3xl md:text-5xl font-extralight text-[#2A2522] tracking-wider uppercase leading-tight">
            The Autumn <span class="font-light italic text-[#8A817C]">Silhouettes</span>
          </h2>
          <div class="w-24 h-[1px] bg-[#E07A5F] mt-4 ml-auto lg:ml-0"></div>
        </div>

        <!-- Three-Column Editorial Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <!-- Column 1: Copy & Call-To-Action (4 cols) -->
          <div class="lg:col-span-4 text-left space-y-6">
            <p class="text-xs md:text-sm text-[#5A504B] font-light leading-relaxed tracking-wide">
              Sculpted fabrics and flowing textures designed to embrace movement. Our silk organza gowns and asymmetric knitwear are meticulously tailored for the modern woman who demands sophistication.
            </p>
            <div class="pointer-events-auto">
              <button 
                (click)="exploreApparel()"
                class="relative overflow-hidden px-8 py-3.5 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-xs font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/10 group cursor-pointer"
              >
                <span class="relative z-10 transition-colors duration-300">Explore Apparel</span>
                <span class="absolute inset-0 bg-[#E07A5F] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
              </button>
            </div>
          </div>

          <!-- Column 2: Interactive Product Ledger List (3 cols) -->
          <div class="lg:col-span-3 flex flex-col gap-6 text-left pointer-events-auto">
            <div
              *ngFor="let card of cards"
              (click)="viewProduct(card.id)"
              class="group cursor-pointer transition-all duration-300 hover:translate-x-2"
            >
              <span class="text-[9px] font-mono tracking-widest text-[#E07A5F] uppercase block mb-1 font-bold">
                {{ card.cat }}
              </span>
              <div class="flex justify-between items-baseline gap-2">
                <h3 class="text-xs md:text-sm font-light text-[#2A2522] tracking-wide uppercase group-hover:text-[#E07A5F] transition-colors">
                  {{ card.title }}
                </h3>
                <span class="text-xs font-mono text-[#8A817C] font-bold">
                  {{ card.price }}
                </span>
              </div>
              <div class="relative w-full h-[1px] bg-[#2A2522]/10 mt-3 overflow-hidden">
                <div class="absolute inset-0 bg-[#E07A5F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </div>
          </div>

          <!-- Column 3: Tall Editorial Product Frame (5 cols) -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative w-full max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#2A2522]/5 shadow-2xl shadow-[#2A2522]/10 group">
              <!-- Vignette shading -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#161412]/20 via-transparent to-transparent z-[1]"></div>
              
              <img 
                src="/products/dress.png" 
                alt="Autumn Dress Showcase" 
                class="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
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
  `]
})
export class ClothingSectionComponent implements OnInit {
  categories = ["Prêt-à-Porter", "Evening Gowns", "Silk Slips", "Linen Sets"];
  cards: { id: string; title: string; price: string; cat: string }[] = [];
  
  private router = inject(Router);
  private productService = inject(ProductService);

  exploreApparel() {
    this.router.navigate(['/products'], { queryParams: { target: 'Women', subcategory: 'fashion' } });
  }

  viewProduct(id: string) {
    if (id) {
      this.router.navigate(['/products', id]);
    }
  }

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 100 }).subscribe(res => {
      if (res.isSuccess && res.data && res.data.items) {
        const clothes = res.data.items.filter(p => p.subCategory?.toLowerCase() === 'fashion');
        if (clothes.length > 0) {
          this.cards = clothes.map(p => {
            let categoryName = 'Apparel';
            if (p.title.includes('Satin Slip')) categoryName = 'Silk Slips';
            else if (p.title.includes('Knit Dress')) categoryName = 'Prêt-à-Porter';
            else if (p.title.includes('Organza Gown')) categoryName = 'Evening Gowns';
            
            return {
              id: p.id,
              title: p.title,
              price: `$${p.price.toLocaleString()}`,
              cat: categoryName
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
      },
      {
        id: '',
        title: "Asymmetric Knit Dress",
        price: "$480",
        cat: "Prêt-à-Porter",
      },
      {
        id: '',
        title: "Silk Organza Gown",
        price: "$1,200",
        cat: "Evening Gowns",
      },
    ];
  }
}
