import { 
  Component, 
  OnInit 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-clothing-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      id="clothing"
      class="relative w-full h-screen flex flex-col justify-center pt-20 px-6 md:px-12 lg:px-24 z-10 overflow-hidden"
    >
      <!-- Subtle warm vignette overlay (very light, does not block the video background) -->
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
            <button class="relative overflow-hidden px-8 py-3.5 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-xs font-bold tracking-[0.2em] uppercase rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/10 group">
              <span class="relative z-10 transition-colors duration-300">Explore Apparel</span>
              <span class="absolute inset-0 bg-[#E07A5F] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            </button>
          </div>
        </div>

        <!-- Right Side: Borderless Premium Product List (occupies 2/5 cols) -->
        <div
          class="md:col-span-2 flex flex-col gap-6 text-left pl-0 md:pl-8 pointer-events-auto"
        >
          <div
            *ngFor="let card of cards"
            class="group cursor-pointer transition-all duration-300 hover:translate-x-2"
          >
            <span class="text-[9px] font-mono tracking-widest text-[#E07A5F] uppercase block mb-1 font-semibold">
              {{ card.cat }}
            </span>
            <div class="flex justify-between items-baseline">
              <h3 class="text-sm font-light text-[#2A2522] tracking-wide uppercase group-hover:text-[#E07A5F] transition-colors">
                {{ card.title }}
              </h3>
              <span class="text-xs font-mono text-[#8A817C] ml-4 font-semibold">
                {{ card.price }}
              </span>
            </div>
            <div class="relative w-full h-[1px] bg-[#2A2522]/10 mt-3 overflow-hidden">
              <div class="absolute inset-0 bg-[#E07A5F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
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
  cards: any[] = [];

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 100 }).subscribe(res => {
      if (res.isSuccess && res.data && res.data.items) {
        const clothes = res.data.items.filter(p => p.subCategory === 'Clothes');
        if (clothes.length > 0) {
          this.cards = clothes.map(p => {
            let categoryName = 'Apparel';
            if (p.title.includes('Satin Slip')) categoryName = 'Silk Slips';
            else if (p.title.includes('Knit Dress')) categoryName = 'Prêt-à-Porter';
            else if (p.title.includes('Organza Gown')) categoryName = 'Evening Gowns';
            
            return {
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
        title: "Flowing Satin Slip",
        price: "$340",
        cat: "Silk Slips",
      },
      {
        title: "Asymmetric Knit Dress",
        price: "$480",
        cat: "Prêt-à-Porter",
      },
      {
        title: "Silk Organza Gown",
        price: "$1,200",
        cat: "Evening Gowns",
      },
    ];
  }
}
