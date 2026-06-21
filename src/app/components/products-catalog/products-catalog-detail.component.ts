import { Component, OnInit, inject, signal, computed, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CatalogService, ProductDto } from '../../core/services/catalog.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../services/auth.service';
import { gsap } from 'gsap';
import { resolveImageUrl } from '../../core/utils/image-resolver';

@Component({
  selector: 'app-products-catalog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products-catalog-detail.component.html',
  styleUrl: './products-catalog-detail.component.css'
})
export class ProductsCatalogDetailComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);
  private http = inject(HttpClient);
  authService = inject(AuthService);
  resolveImageUrl = resolveImageUrl;

  @ViewChild('mainImage') mainImageRef!: ElementRef<HTMLImageElement>;

  product = signal<ProductDto | null>(null);
  loading = signal<boolean>(true);
  error = signal<string>('');

  // Gallery signals
  activeImageIndex = signal<number>(0);
  activeImageUrl = computed(() => {
    const p = this.product();
    if (!p) return '';
    const images = p.imageUrls;
    let url = '';
    if (images && images.length > 0) {
      const idx = this.activeImageIndex();
      if (idx >= 0 && idx < images.length) {
        url = images[idx].url;
      }
    } else {
      url = p.imageUrl || '';
    }
    return resolveImageUrl(url);
  });

  selectImage(index: number): void {
    if (this.activeImageIndex() === index) return;
    
    // Smooth crossfade animation
    if (this.mainImageRef && this.mainImageRef.nativeElement) {
      gsap.to(this.mainImageRef.nativeElement, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          this.activeImageIndex.set(index);
          gsap.to(this.mainImageRef.nativeElement, {
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out'
          });
        }
      });
    } else {
      this.activeImageIndex.set(index);
    }
  }

  // Variants selection state
  selectedColor = signal<string>('');
  selectedSize = signal<string>('');
  validationError = signal<string>('');
  addedToCart = signal<boolean>(false);
  selectedQuantity = signal<number>(1);

  reviews = signal<any[]>([]);

  // Review submission state
  newComment = signal<string>('');
  newRating = signal<number>(5);
  submittingReview = signal<boolean>(false);
  reviewError = signal<string>('');
  reviewSuccess = signal<string>('');

  evaluationScore = computed(() => {
    const list = this.reviews();
    if (list.length === 0) return 5;
    const total = list.reduce((sum, r) => sum + r.rating, 0);
    return Math.round(total / list.length);
  });

  incrementQuantity(): void {
    const max = this.product()?.stockQuantity || 0;
    if (this.selectedQuantity() < max) {
      this.selectedQuantity.update(q => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.selectedQuantity() > 1) {
      this.selectedQuantity.update(q => q - 1);
    }
  }

  getProductCategoriesList(product: ProductDto | null): string {
    if (!product) return '';
    if (product.categories && product.categories.length > 0) {
      return product.categories.map(c => c.name).join(', ');
    }
    return product.subCategory || '';
  }

  getStars(rating: number): number[] {
    return Array(rating);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating);
  }

  myProductOrders = signal<any[]>([]);
  loadingOrders = signal<boolean>(false);

  loadMyOrders(productId: string): void {
    const isAuth = this.authService.currentUser() !== null;
    if (!isAuth) {
      this.myProductOrders.set([]);
      return;
    }

    this.loadingOrders.set(true);
    this.http.get<any>('http://localhost:5153/api/orders/my-orders').subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          const matched = res.data.filter((order: any) => 
            order.items && order.items.some((item: any) => item.productId === productId)
          );
          this.myProductOrders.set(matched);
        } else {
          this.myProductOrders.set([]);
        }
        this.loadingOrders.set(false);
      },
      error: () => {
        this.myProductOrders.set([]);
        this.loadingOrders.set(false);
      }
    });
  }

  getProductQtyInOrder(order: any): number {
    const p = this.product();
    if (!p || !order.items) return 0;
    const item = order.items.find((i: any) => i.productId === p.id);
    return item ? item.quantity : 0;
  }

  loadProductReviews(productId: string): void {
    this.http.get<any>(`http://localhost:5153/api/products/${productId}/reviews`).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.reviews.set(res.data);
        } else {
          this.reviews.set([]);
        }
      },
      error: () => {
        this.reviews.set([]);
      }
    });
  }

  submitReview(): void {
    this.reviewError.set('');
    this.reviewSuccess.set('');
    const p = this.product();
    if (!p) return;

    const comment = this.newComment().trim();
    if (!comment) {
      this.reviewError.set('Please write a comment for your appraisal.');
      return;
    }

    const rating = this.newRating();
    if (rating < 1 || rating > 5) {
      this.reviewError.set('Rating must be between 1 and 5 stars.');
      return;
    }

    this.submittingReview.set(true);
    this.http.post<any>(`http://localhost:5153/api/products/${p.id}/reviews`, {
      comment: comment,
      rating: rating
    }).subscribe({
      next: (res) => {
        this.submittingReview.set(false);
        if (res.isSuccess && res.data) {
          this.reviewSuccess.set('Appraisal recorded in backend matrix.');
          this.newComment.set('');
          this.newRating.set(5);
          this.loadProductReviews(p.id);
        } else {
          this.reviewError.set(res.message || 'Unable to record review.');
        }
      },
      error: (err) => {
        this.submittingReview.set(false);
        this.reviewError.set(err?.error?.message || 'Server error occurred submitting appraisal.');
      }
    });
  }

  // Available variants computed from metadata
  colors = computed(() => {
    const p = this.product();
    return p && p.colors ? p.colors : [];
  });

  sizes = computed(() => {
    const p = this.product();
    return p && p.sizes ? p.sizes : [];
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchProduct(id);
      } else {
        this.error.set('Product reference identity missing.');
        this.loading.set(false);
      }
    });
  }

  ngAfterViewInit(): void {
  }

  fetchProduct(id: string): void {
    this.loading.set(true);
    this.error.set('');
    this.catalogService.getProductById(id).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.product.set(res.data);
          this.activeImageIndex.set(0);
          this.selectedQuantity.set(res.data.stockQuantity > 0 ? 1 : 0);
          this.loadMyOrders(res.data.id);
          this.loadProductReviews(res.data.id);
          
          // Pre-select first available color/size if they exist
          if (res.data.colors && res.data.colors.length > 0) {
            this.selectedColor.set(res.data.colors[0]);
          }
          if (res.data.sizes && res.data.sizes.length > 0) {
            this.selectedSize.set(res.data.sizes[0]);
          }
        } else {
          this.error.set(res.message || 'Unable to retrieve product details.');
        }
        this.loading.set(false);
        if (res.isSuccess && res.data) {
          setTimeout(() => {
            gsap.fromTo('.glass-container', 
              { opacity: 0, y: 40 }, 
              { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
          }, 50);
        }
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Server error occurred fetching details.');
        this.loading.set(false);
      }
    });
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
    this.validationError.set('');
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
    this.validationError.set('');
  }

  zoomImage(zoomIn: boolean): void {
    if (this.mainImageRef && this.mainImageRef.nativeElement) {
      gsap.to(this.mainImageRef.nativeElement, {
        scale: zoomIn ? 1.08 : 1,
        duration: 0.6,
        ease: 'power1.out'
      });
    }
  }

  closeSheet(): void {
    gsap.to('.glass-container', {
      opacity: 0,
      y: 40,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => {
        this.router.navigate(['/products']);
      }
    });
  }

  acquireProduct(): void {
    this.validationError.set('');
    this.addedToCart.set(false);
    const p = this.product();
    if (!p || p.stockQuantity === 0) return;

    // Validate variants
    if (this.colors().length > 0 && !this.selectedColor()) {
      this.validationError.set('Please select an option for Color.');
      return;
    }

    if (this.sizes().length > 0 && !this.selectedSize()) {
      this.validationError.set('Please select an option for Size.');
      return;
    }

    // Add to Cart
    this.cartService.addItem(p, this.selectedQuantity(), this.selectedSize() || undefined, this.selectedColor() || undefined);

    this.addedToCart.set(true);
    setTimeout(() => {
      this.addedToCart.set(false);
    }, 3000);
  }
}
