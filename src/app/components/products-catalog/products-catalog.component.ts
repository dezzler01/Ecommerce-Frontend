import { Component, OnInit, AfterViewInit, OnDestroy, inject, signal, computed, HostListener, ViewChild, ElementRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService, ProductDto, Brand } from '../../core/services/catalog.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { MediaService } from '../../services/media.service';
import { CartService } from '../../core/services/cart.service';
import { gsap } from 'gsap';
import { lastValueFrom } from 'rxjs';

import { AppImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { resolveImageUrl } from '../../core/utils/image-resolver';

@Component({
  selector: 'app-products-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgOptimizedImage, AppImageUploaderComponent],
  template: `
    <div class="min-h-screen bg-transparent text-left font-nunito w-full overflow-x-hidden">
      <div class="animate-fade-in">
        <!-- Immersive Hero Vision Banner -->
      <div class="immersive-hero-vision">
        <!-- Lifestyle Snapshot Image -->
        <img 
          [ngSrc]="activeCategoryBannerUrl()" 
          [alt]="activeCategoryTitle()" 
          class="immersive-vision-img"
          fill
          priority
        />

        <!-- Dark Tint Vignette & Elegant Text Overlay with soft bottom fade mask -->
        <div class="editorial-banner-overlay">
          <span class="editorial-banner-subtitle">
            ALL COLLECTIONS / CURATED BOUTIQUE
          </span>
          <h2 class="editorial-banner-title">
            Explore Our <br/>
            <span class="editorial-banner-title-italic">{{ activeCategoryTitle() }}</span>
          </h2>
          <div class="editorial-banner-line"></div>
        </div>
      </div>

      <!-- Main Content Container with standard padding -->
      <div class="px-4 sm:px-6 md:px-12 pb-20">

      <!-- Horizontal Filter Bar -->
      <div class="horizontal-filter-bar mb-6">
        <div class="filter-bar-header flex flex-col items-start">
          <span class="index-title">Catalogue Index</span>
          <span class="index-ref">Ref. 026</span>
          <div class="flex gap-2">
            <button 
              *ngIf="authService.hasPermission('Products:Create')" 
              (click)="openAdminProductModal(null, $event)"
              class="mt-2.5 px-3 py-1.5 bg-[var(--color-coral)] hover:bg-[var(--color-coral)]/90 text-white text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all"
            >
              + Add Product
            </button>
            <button 
              *ngIf="authService.hasPermission('Products:Update') || authService.hasPermission('Products:Delete')" 
              (click)="toggleSelectionMode()"
              [class.bg-[var(--text-charcoal)]]="isSelectionMode()"
              [class.bg-[#8C857B]]="!isSelectionMode()"
              class="mt-2.5 px-3 py-1.5 text-white text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all"
            >
              {{ isSelectionMode() ? 'Cancel Selection' : 'Multi-Select' }}
            </button>
          </div>
        </div>

        <div class="filter-groups">
          <!-- [01] Collections Dropdown -->
          <div class="filter-group-item relative">
            <button 
              (click)="activeDropdown.set(activeDropdown() === 'collections' ? null : 'collections'); $event.stopPropagation()"
              [class.active]="activeDropdown() === 'collections'"
              class="filter-trigger-btn"
            >
              <span class="group-num">[01]</span> Collections: <span class="active-val">{{ activeConsoleTag() }}</span>
              <span class="arrow-icon">▼</span>
            </button>
            <div *ngIf="activeDropdown() === 'collections'" class="dropdown-overlay">
              <div class="dropdown-menu-list">
                <button 
                  *ngFor="let tag of ['All', 'Latest', 'Bestsellers', 'Featured', 'On Sale']"
                  (click)="setCollectionTag(tag); activeDropdown.set(null)"
                  [class.active]="activeConsoleTag() === tag"
                  class="dropdown-menu-item"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
          </div>

          <!-- [02] Keyword Search Dropdown -->
          <div class="filter-group-item relative">
            <button 
              (click)="activeDropdown.set(activeDropdown() === 'search' ? null : 'search'); $event.stopPropagation()"
              [class.active]="activeDropdown() === 'search'"
              class="filter-trigger-btn"
            >
              <span class="group-num">[02]</span> Search <span class="active-val" *ngIf="searchQuery">: "{{ searchQuery }}"</span>
              <span class="arrow-icon">▼</span>
            </button>
            <div *ngIf="activeDropdown() === 'search'" class="dropdown-overlay p-4 min-w-[240px]">
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (ngModelChange)="onSearchChange()"
                placeholder="Search catalog..."
                (click)="$event.stopPropagation()"
                class="w-full py-2 bg-transparent border-b border-[var(--text-charcoal)]/10 text-xs text-[var(--text-charcoal)] placeholder-[#6B5E57]/45 focus:outline-none focus:border-[var(--color-coral)] transition-all"
              />
            </div>
          </div>

          <!-- [03] Colors Dropdown -->
          <div class="filter-group-item relative">
            <button 
              (click)="activeDropdown.set(activeDropdown() === 'colors' ? null : 'colors'); $event.stopPropagation()"
              [class.active]="activeDropdown() === 'colors'"
              class="filter-trigger-btn"
            >
              <span class="group-num">[03]</span> Colors <span class="active-val" *ngIf="selectedColors.length > 0">({{ selectedColors.length }})</span>
              <span class="arrow-icon">▼</span>
            </button>
            <div *ngIf="activeDropdown() === 'colors'" class="dropdown-overlay dropdown-right p-4 min-w-[280px]" (click)="$event.stopPropagation()">
              <div class="flex flex-wrap gap-2.5">
                <button 
                  *ngFor="let color of availableColors()"
                  (click)="toggleColor(color.name)"
                  [ngStyle]="{'background-color': color.hexCode}"
                  [title]="color.name"
                  [class.active]="selectedColors.includes(color.name)"
                  class="color-swatch-circle"
                >
                  <span class="inner-dot" *ngIf="color.name === 'White'"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- [04] Sizes Dropdown -->
          <div class="filter-group-item relative">
            <button 
              (click)="activeDropdown.set(activeDropdown() === 'sizes' ? null : 'sizes'); $event.stopPropagation()"
              [class.active]="activeDropdown() === 'sizes'"
              class="filter-trigger-btn"
            >
              <span class="group-num">[04]</span> Sizes <span class="active-val" *ngIf="selectedSizes.length > 0">({{ selectedSizes.length }})</span>
              <span class="arrow-icon">▼</span>
            </button>
            <div *ngIf="activeDropdown() === 'sizes'" class="dropdown-overlay dropdown-right p-4 min-w-[320px] max-w-[400px] space-y-4" (click)="$event.stopPropagation()">
              <!-- Women's Sizes Section -->
              <div *ngIf="targetAudience() === 'All' || targetAudience() === 'Women'" class="space-y-2">
                <div class="text-[9px] uppercase tracking-widest font-bold text-[var(--color-lavender)] border-b border-[var(--text-charcoal)]/5 pb-1">Women's Sizes</div>
                <div class="flex flex-wrap gap-2">
                  <button 
                    *ngFor="let size of getSizesForAudience('Women')"
                    (click)="toggleSize(size)"
                    [class.active]="selectedSizes.includes(size)"
                    class="size-filter-btn"
                  >
                    {{ size }}
                  </button>
                </div>
                <div *ngIf="getSizesForAudience('Women').length === 0" class="text-[10px] text-[#8A817C] italic">No women's sizes available.</div>
              </div>

              <!-- Men's Sizes Section -->
              <div *ngIf="targetAudience() === 'All' || targetAudience() === 'Men'" class="space-y-2">
                <div class="text-[9px] uppercase tracking-widest font-bold text-[var(--color-lavender)] border-b border-[var(--text-charcoal)]/5 pb-1">Men's Sizes</div>
                <div class="flex flex-wrap gap-2">
                  <button 
                    *ngFor="let size of getSizesForAudience('Men')"
                    (click)="toggleSize(size)"
                    [class.active]="selectedSizes.includes(size)"
                    class="size-filter-btn"
                  >
                    {{ size }}
                  </button>
                </div>
                <div *ngIf="getSizesForAudience('Men').length === 0" class="text-[10px] text-[#8A817C] italic">No men's sizes available.</div>
              </div>

              <!-- Children's Sizes Section -->
              <div *ngIf="targetAudience() === 'All' || targetAudience() === 'Kids'" class="space-y-2">
                <div class="text-[9px] uppercase tracking-widest font-bold text-[var(--color-lavender)] border-b border-[var(--text-charcoal)]/5 pb-1">Children's Sizes</div>
                <div class="flex flex-wrap gap-2">
                  <button 
                    *ngFor="let size of getSizesForAudience('Kids')"
                    (click)="toggleSize(size)"
                    [class.active]="selectedSizes.includes(size)"
                    class="size-filter-btn"
                  >
                    {{ size }}
                  </button>
                </div>
                <div *ngIf="getSizesForAudience('Kids').length === 0" class="text-[10px] text-[#8A817C] italic">No children's sizes available.</div>
              </div>
            </div>
          </div>
 
          <!-- [05] Age Dropdown -->
          <div class="filter-group-item relative" *ngIf="targetAudience() !== 'Women' && targetAudience() !== 'Men'">
            <button 
              (click)="activeDropdown.set(activeDropdown() === 'age' ? null : 'age'); $event.stopPropagation()"
              [class.active]="activeDropdown() === 'age'"
              class="filter-trigger-btn"
            >
              <span class="group-num">[05]</span> Age <span class="active-val" *ngIf="selectedAge() !== 'All'">: {{ selectedAge() }}</span>
              <span class="arrow-icon">▼</span>
            </button>
            <div *ngIf="activeDropdown() === 'age'" class="dropdown-overlay dropdown-right">
              <div class="dropdown-menu-list">
                <button 
                  *ngFor="let age of ['All', '0-12 Months', '1-3 Years', '4-6 Years', '7-12 Years']"
                  (click)="setAgeFilter(age); activeDropdown.set(null)"
                  [class.active]="selectedAge() === age"
                  class="dropdown-menu-item"
                >
                  {{ age }}
                </button>
              </div>
            </div>
          </div>

          <!-- Clear Filters -->
          <div class="filter-group-item" *ngIf="hasActiveFilters()">
            <button (click)="resetFilters()" class="reset-link-btn">
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Circular Subcategories Section -->
      <div class="subcategory-circles-container mb-12">
        <div class="subcategory-circles-list">
          <div 
            *ngFor="let cat of activeSubCategoriesList()"
            (click)="toggleSubCategory(cat)"
            [class.active]="selectedSubCategory() === cat.name && selectedSubCategoryTarget() === cat.target"
            class="subcategory-circle-item"
          >
            <div class="subcategory-circle-img-wrapper">
              <img [src]="cat.img" [alt]="cat.displayName" class="subcategory-circle-img" />
            </div>
            <span class="subcategory-circle-name">{{ cat.displayName }}</span>
          </div>
        </div>
      </div>

      <!-- Asymmetric Lookbook Stream Grid -->
      <div class="w-full">
        <!-- Skeleton Loading Grid (Component initial loading mode) -->
        <div *ngIf="loading()" class="editorial-lookbook-grid mb-12">
          <!-- Render 6 skeleton cards mimicking the lookbook items -->
          <div *ngFor="let item of [1, 2, 3, 4, 5, 6]" class="lookbook-item animate-pulse border border-[#EBF1F5] bg-white flex flex-col pointer-events-none p-0">
            <!-- Skeleton Image Wrapper -->
            <div class="relative w-full pt-[125%] bg-[#F5EFEA] rounded-t-2xl">
              <!-- Backdrop Skeleton Overlay -->
              <div class="absolute inset-0 bg-[#FAF5F2]/20 backdrop-blur-[1px]"></div>
            </div>
            <!-- Skeleton Meta Details -->
            <div class="p-5 flex flex-col space-y-3.5 bg-white rounded-b-2xl">
              <!-- Size Swatches Skeleton -->
              <div class="flex gap-1 mb-1">
                <div class="w-7 h-5 bg-[#FAF5F2] rounded-md border border-[#EBF1F5]"></div>
                <div class="w-7 h-5 bg-[#FAF5F2] rounded-md border border-[#EBF1F5]"></div>
                <div class="w-7 h-5 bg-[#FAF5F2] rounded-md border border-[#EBF1F5]"></div>
              </div>
              <!-- Title Skeleton -->
              <div class="w-3/4 h-4 bg-[#F5EFEA] rounded"></div>
              <!-- Price & CTAs Row Skeleton -->
              <div class="flex justify-between items-center pt-2">
                <div class="w-1/3 h-3.5 bg-[#FAF5F2] rounded"></div>
                <div class="w-16 h-7 bg-[#C4633A]/10 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading() && filteredProducts().length === 0" class="text-center py-24 border border-dashed border-[var(--text-charcoal)]/10 rounded-2xl bg-white/10">
          <p class="text-sm text-[#6B5E57] font-light tracking-wide">No premium pieces matching your current filters.</p>
        </div>

        <div *ngIf="!loading() && filteredProducts().length > 0" class="editorial-lookbook-grid">
          <!-- Premium Lookbook Card -->
          <div 
            *ngFor="let product of filteredProducts()" 
            [routerLink]="isSelectionMode() ? null : ['/products', product.id]"
            (click)="isSelectionMode() ? toggleProductSelected(product.id, $event) : null"
            [ngClass]="{
              'lookbook-item': true,
              'opacity-70': !product.isVisible,
              'border-[var(--color-coral)] border-2 shadow-lg scale-[0.98]': isSelectionMode() && isProductSelected(product.id)
            }"
            (mouseenter)="onProductMouseEnter(product)"
            (mouseleave)="onProductMouseLeave(product)"
          >
            <!-- Image Container with Cinematic Overlay -->
            <div class="lookbook-image-wrapper">
              <img 
                *ngIf="getProductDisplayImage(product)" 
                [ngSrc]="getProductDisplayImage(product)" 
                [alt]="product.title" 
                class="lookbook-image"
                [ngClass]="{'blur-[2px]': !product.isVisible}"
                fill
                loading="lazy"
              />
              <div *ngIf="!product.imageUrl" class="w-full h-full flex flex-col items-center justify-center bg-[var(--text-charcoal)]/5 text-[#6B5E57]/60 text-[10px] uppercase tracking-[2px] font-light frosted-fallback">
                <span>No Image</span>
                <span class="text-[8px] opacity-60 mt-1 font-mono">No Image Available</span>
              </div>
              
              <!-- Visibility Overlay for Admin -->
              <div *ngIf="!product.isVisible" class="absolute inset-0 bg-[var(--text-charcoal)]/20 backdrop-blur-sm flex items-center justify-center p-3 z-[5]">
                <span class="text-[8px] uppercase tracking-[2px] font-semibold text-[#FAF5F2] bg-red-600/90 px-3 py-1 rounded shadow-md">Archived</span>
              </div>

              <!-- Select Checkbox overlay (Top Left in Selection Mode) -->
              <div *ngIf="isSelectionMode()" class="absolute top-3 left-3 z-20">
                <input 
                  type="checkbox" 
                  [checked]="isProductSelected(product.id)"
                  (click)="$event.stopPropagation()"
                  (change)="toggleProductSelected(product.id, $event)"
                  class="w-5 h-5 rounded border-[var(--text-charcoal)]/25 text-[var(--color-coral)] focus:ring-[var(--color-coral)] cursor-pointer shadow-md bg-white/95"
                />
              </div>

              <!-- Wishlist & Compare Icons (Top Left) -->
              <div class="card-icons-container" *ngIf="!isSelectionMode() && product.isVisible">
                <button class="card-icon-btn wishlist-btn" (click)="toggleWishlist(product.id, $event)">
                  <svg class="w-4.5 h-4.5" [attr.fill]="isFavorited(product.id) ? '#E30613' : 'none'" [attr.stroke]="isFavorited(product.id) ? '#E30613' : 'currentColor'" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button class="card-icon-btn compare-btn" (click)="triggerCompare(product.id, $event)">
                  <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </button>
              </div>

              <!-- Dynamic Collection Badges (Top Right) -->
              <ng-container>
                <div *ngIf="product.collectionType === 'On Sale' || (product.costPrice && product.price < product.costPrice); else checkOthers" class="card-sale-badge">
                  Sale
                </div>
                <ng-template #checkOthers>
                  <div *ngIf="product.collectionType === 'Latest'" class="card-latest-badge">
                    New
                  </div>
                  <div *ngIf="product.collectionType === 'Bestsellers'" class="card-bestseller-badge">
                    Best
                  </div>
                  <div *ngIf="product.collectionType === 'Featured'" class="card-featured-badge">
                    Feat
                  </div>
                </ng-template>
              </ng-container>

              <!-- Size Preview Overlay (Bottom of Image) -->
              <div class="card-sizes-overlay" *ngIf="product.isVisible && product.sizes && product.sizes.length > 0">
                {{ product.sizes.join(', ') | uppercase }}
              </div>

              <!-- Floating Quick Actions (visible on hover - Centered) -->
              <div class="lookbook-quick-actions" *ngIf="!isSelectionMode() && product.isVisible">
                <button 
                  [routerLink]="['/products', product.id]"
                  (click)="$event.stopPropagation()"
                  class="quick-action-btn details-btn"
                >
                  Quick view
                </button>
                <button 
                  (click)="openQuickBuy(product, $event)"
                  class="quick-action-btn buy-btn"
                >
                  Quick Shop
                </button>
              </div>
            </div>

            <!-- Product Details placed inline below the image (Left Aligned) -->
            <div class="space-y-2 text-left p-4">
              <div class="flex flex-col gap-1 text-[9px] uppercase tracking-[1.5px] font-semibold text-[#6B5E57] lookbook-subcategory">
                <div class="flex justify-between items-center w-full">
                  <span>{{ getProductCategoriesList(product) }}</span>
                  <span *ngIf="authService.hasPermission('Products:Update') || authService.hasPermission('Products:Create') || authService.hasPermission('Products:Delete')" class="text-[8px] bg-[var(--text-charcoal)]/5 px-2 py-0.5 rounded-sm">Size {{ product.shippingSize }}</span>
                </div>
                <div class="flex justify-between items-center w-full text-[8px] opacity-75 font-normal" *ngIf="product.age">
                  <span>Age: {{ product.age }}</span>
                </div>
              </div>
              
              <h3 class="lookbook-title text-[var(--text-charcoal)] transition-colors truncate leading-tight">
                {{ product.title }}
              </h3>

              <!-- Product Rating and Sold count -->
              <div class="flex items-center gap-1 text-[11px] text-[#FFD75A] font-semibold font-fredoka my-1">
                <div class="flex items-center">
                  <svg class="w-3 h-3 text-[#FFD75A]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <svg class="w-3 h-3 text-[#FFD75A]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <svg class="w-3 h-3 text-[#FFD75A]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <svg class="w-3 h-3 text-[#FFD75A]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <svg class="w-3 h-3 text-[#FFD75A]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <span class="text-[10px] text-[#77685D] font-nunito">4.9</span>
                <span class="text-[10px] text-[#77685D]/60 font-nunito">({{ (product.id.charCodeAt(0) % 25) + 15 }}+ sold)</span>
              </div>
              
              <p class="lookbook-desc line-clamp-2 min-h-[2.5rem] leading-relaxed">
                {{ product.description }}
              </p>

              <!-- Badges & Stock Status -->
              <div class="flex flex-col gap-1.5 mt-2">
                <div class="flex items-center gap-1 flex-wrap">
                  <span class="text-[8px] uppercase tracking-wider bg-[#EBF7FD] text-[#64C9F5] border border-[#64C9F5]/20 px-2 py-0.5 rounded-full font-bold font-nunito">Free Shipping</span>
                  <span class="text-[8px] uppercase tracking-wider bg-[#EBFBF7] text-[#77DCC5] border border-[#77DCC5]/20 px-2 py-0.5 rounded-full font-bold font-nunito">Inspect First</span>
                </div>
                <div class="text-[9px] uppercase tracking-wider font-bold">
                  <span *ngIf="product.stockQuantity > 3" class="text-[#77DCC5]">● In Stock</span>
                  <span *ngIf="product.stockQuantity > 0 && product.stockQuantity <= 3" class="text-[#F6A04D] animate-pulse">● Only {{ product.stockQuantity }} left</span>
                  <span *ngIf="product.stockQuantity === 0" class="text-red-500">● Out of Stock</span>
                </div>
              </div>

              <!-- Sizes Preview Row -->
              <div class="flex items-center gap-1 mt-2.5" *ngIf="product.sizes && product.sizes.length > 0">
                <span class="text-[8.5px] text-[#77685D]/60 uppercase tracking-wide font-bold font-nunito">Sizes:</span>
                <div class="flex gap-1">
                  <span *ngFor="let s of product.sizes.slice(0,4)" class="text-[8px] px-1.5 py-0.5 border border-[#EBF1F5] rounded bg-[#FAF5F2] font-bold text-[var(--text-charcoal)] font-nunito">
                    {{ s }}
                  </span>
                </div>
              </div>

              <!-- Colors & Brand Logo Row -->
              <div class="flex items-center justify-between w-full mt-3 min-h-[24px]">
                <!-- Inline Color Swatches -->
                <div class="lookbook-colors-row" *ngIf="product.colors && product.colors.length > 0">
                  <span 
                    *ngFor="let color of product.colors.slice(0, 5)"
                    class="lookbook-color-dot"
                    [ngStyle]="{'background-color': getColorHex(color)}"
                    [title]="color"
                  ></span>
                  <span *ngIf="product.colors.length > 5" class="lookbook-colors-more">+{{ product.colors.length - 5 }}</span>
                </div>
                <div *ngIf="!product.colors || product.colors.length === 0"></div>

                <!-- Brand Small Circle Logo (Right Aligned) -->
                <div *ngIf="product.brandLogoUrl" class="w-6 h-6 rounded-full overflow-hidden border border-[var(--text-charcoal)]/10 bg-white p-0.5 flex items-center justify-center flex-shrink-0 shadow-sm" [title]="product.brandName">
                  <img [src]="product.brandLogoUrl" [alt]="product.brandName" class="w-full h-full object-contain" />
                </div>
              </div>

              <!-- Price & Actions -->
              <div class="lookbook-price-row flex items-center justify-between w-full mt-2.5">
                <span class="lookbook-price font-fredoka text-base text-[#F67B63] font-bold">
                  LE {{ product.price | number:'1.2-2' }}
                </span>
                
                <!-- Customer Quick Add Button -->
                <button 
                  *ngIf="product.isVisible && !authService.hasPermission('Products:Update')"
                  (click)="openQuickBuy(product, $event); $event.stopPropagation()"
                  class="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F67B63] hover:bg-[#F6A04D] text-white text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm hover:shadow-md transition-all duration-300 font-fredoka"
                >
                  <span>+ Add</span>
                </button>

                <!-- Admin Controls -->
                <div *ngIf="authService.hasPermission('Products:Update')" class="flex gap-2" (click)="$event.stopPropagation()">
                  <button 
                    (click)="openAdminProductModal(product, $event)"
                    class="px-2.5 py-1 text-[8px] font-bold uppercase tracking-[1.5px] rounded bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
                  >
                    Edit
                  </button>
                  <button 
                    (click)="toggleVisibility(product.id); $event.stopPropagation()"
                    [ngClass]="{
                      'px-2.5 py-1 text-[8px] font-bold uppercase tracking-[1.5px] rounded shadow-sm transition-all duration-300': true,
                      'bg-emerald-600 hover:bg-emerald-700 text-white': !product.isVisible,
                      'admin-btn-outline': product.isVisible
                    }"
                  >
                    {{ product.isVisible ? 'Hide' : 'Unhide' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Infinite Scroll Sentinel + Loading Indicator -->
        <div #scrollAnchor class="w-full h-1"></div>
        <div *ngIf="loadingMore()" class="flex flex-col items-center justify-center py-10 gap-3">
          <div class="w-7 h-7 border-2 border-[var(--color-coral)]/20 border-t-[var(--color-coral)] rounded-full animate-spin"></div>
          <span class="text-[9px] uppercase tracking-[0.2em] text-[#6B5E57] font-light">Loading more pieces...</span>
        </div>
        <div *ngIf="!loadingMore() && currentPage() >= totalPages() && products().length > 0" class="flex justify-center py-8">
          <span class="text-[9px] uppercase tracking-[0.2em] text-[var(--text-charcoal)]/30 font-light">— All {{ totalProducts() }} pieces displayed —</span>
        </div>

      </div>
    </div>
  </div>


      <!-- Quick Buy Configurator Overlay Side Sheet -->
      <div *ngIf="quickBuyProduct()" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none">
        <!-- Backdrop Layer -->
        <div 
          (click)="closeQuickBuy()" 
          class="fixed inset-0 bg-[var(--text-charcoal)]/10 backdrop-blur-[3px] pointer-events-auto cursor-pointer"
        ></div>

        <!-- Frosted Glass Configurator Sheet -->
        <div class="quick-buy-sheet pointer-events-auto">
          <!-- Header -->
          <div class="flex justify-between items-center border-b border-[var(--text-charcoal)]/10 pb-4 flex-shrink-0">
            <div>
              <span class="tracking-widest font-mono text-[9px] uppercase font-bold text-[var(--color-coral)] block mb-1">
                Quick Acquisition
              </span>
              <h3 class="text-base font-fredoka text-[var(--text-charcoal)] tracking-wide uppercase truncate max-w-[280px]">
                {{ quickBuyProduct()?.title }}
              </h3>
            </div>
            <button (click)="closeQuickBuy()" class="text-[var(--text-charcoal)]/40 hover:text-[var(--color-coral)] text-sm p-1.5 transition-colors">
              ✕
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar my-4">
            <!-- Image Thumbnail -->
            <div class="w-full aspect-video rounded-xl overflow-hidden bg-[var(--text-charcoal)]/5 border border-[var(--text-charcoal)]/5 relative flex-shrink-0 animate-fade-in">
              <img 
                *ngIf="quickBuyProduct()?.imageUrl" 
                [src]="resolveImageUrl(quickBuyProduct()?.imageUrl)" 
                [alt]="quickBuyProduct()?.title" 
                class="w-full h-full object-cover"
              />
              <div *ngIf="!quickBuyProduct()?.imageUrl" class="w-full h-full flex flex-col items-center justify-center text-[var(--text-charcoal)]/40 gap-2">
                <svg class="w-8 h-8 text-[var(--color-coral)]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <span class="absolute top-3 left-3 bg-white/95 border border-[var(--text-charcoal)]/5 text-[var(--text-charcoal)]/80 text-[8px] uppercase tracking-widest font-mono px-2 py-0.5 rounded" *ngIf="quickBuyProduct()">
                {{ getProductCategoriesList(quickBuyProduct()!) }}
              </span>
            </div>

            <!-- Price & Stock -->
            <div class="flex justify-between items-center">
              <span class="text-lg font-mono text-[var(--color-coral)] font-bold">
                {{ quickBuyProduct()?.price | currency:'EGP ' }}
              </span>
              <div class="flex items-center gap-2">
                <span *ngIf="quickBuyProduct()?.stockQuantity === 0" class="text-[8px] bg-red-50 border border-red-200 text-red-500 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                  Sold Out
                </span>
                <span *ngIf="quickBuyProduct() && quickBuyProduct()!.stockQuantity > 0 && quickBuyProduct()!.stockQuantity <= 5" class="text-[8px] bg-amber-50 border border-amber-200 text-amber-600 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                  Only {{ quickBuyProduct()?.stockQuantity }} Left
                </span>
              </div>
            </div>

            <!-- Validation Error -->
            <div *ngIf="validationError()" class="p-3 bg-red-50 border border-red-200 text-red-500 text-xs rounded-xl">
              {{ validationError() }}
            </div>

            <!-- Variant Selector -->
            <div class="space-y-4">
              <!-- Colors Selector -->
              <div class="space-y-2" *ngIf="colors().length > 0">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[var(--color-coral)] block">Select Color *</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    *ngFor="let color of colors()"
                    (click)="selectColor(color)"
                    [ngClass]="{
                      'active-pill': selectedColor() === color,
                      'inactive-pill': selectedColor() !== color
                    }"
                    class="px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold border rounded-lg transition-all"
                  >
                    {{ color }}
                  </button>
                </div>
              </div>

              <!-- Sizes Selector -->
              <div class="space-y-2" *ngIf="sizes().length > 0">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[var(--color-coral)] block">Select Size *</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    *ngFor="let size of sizes()"
                    (click)="selectSize(size)"
                    [ngClass]="{
                      'active-pill': selectedSize() === size,
                      'inactive-pill': selectedSize() !== size
                    }"
                    class="px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold border rounded-lg transition-all"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- Quantity Selector -->
              <div class="space-y-2" *ngIf="quickBuyProduct() && quickBuyProduct()!.stockQuantity > 0">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[var(--color-coral)] block">Purchase Quantity</label>
                <div class="flex items-center gap-3">
                  <div class="flex items-center border border-[var(--text-charcoal)]/10 bg-[var(--text-charcoal)]/5 rounded-lg overflow-hidden quantity-wrapper">
                    <button 
                      type="button"
                      (click)="decrementQuantity()"
                      [disabled]="selectedQuantity() <= 1"
                      class="px-3 py-1 text-[var(--text-charcoal)]/60 hover:text-[var(--text-charcoal)] hover:bg-[var(--text-charcoal)]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-xs font-mono select-none"
                    >
                      －
                    </button>
                    <span class="px-4 py-1 text-[10px] font-mono font-bold text-[var(--text-charcoal)] select-none">
                      {{ selectedQuantity() }}
                    </span>
                    <button 
                      type="button"
                      (click)="incrementQuantity()"
                      [disabled]="selectedQuantity() >= quickBuyProduct()!.stockQuantity"
                      class="px-3 py-1 text-[var(--text-charcoal)]/60 hover:text-[var(--text-charcoal)] hover:bg-[var(--text-charcoal)]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-xs font-mono select-none"
                    >
                      ＋
                    </button>
                  </div>
                  <span class="text-[8px] font-mono text-[#6B5E57] uppercase tracking-widest">
                    Available: {{ quickBuyProduct()?.stockQuantity }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer CTA -->
          <div class="pt-4 border-t border-[var(--text-charcoal)]/10 space-y-3 flex-shrink-0">
            <button 
              [disabled]="quickBuyProduct()?.stockQuantity === 0"
              (click)="confirmQuickBuy()"
              class="w-full py-3.5 text-[#FAF5F2] text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex justify-center items-center gap-2 neon-btn disabled:opacity-50"
            >
              {{ quickBuyProduct()?.stockQuantity === 0 ? 'OUT OF STOCK' : 'Acquire Piece' }}
            </button>
            
            <div *ngIf="addedToCart()" class="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-bold uppercase tracking-wider text-center rounded-xl">
              ✓ Secured in Bag
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Product Editor Side Sheet -->
      <div *ngIf="isAdminModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none">
        <!-- Backdrop Layer -->
        <div 
          (click)="closeAdminProductModal()" 
          class="fixed inset-0 bg-[var(--text-charcoal)]/10 backdrop-blur-[3px] pointer-events-auto cursor-pointer"
        ></div>

        <!-- ========== STEP 1: Category Chooser ========== -->
        <div *ngIf="adminFormStep() === 'chooser'" class="admin-product-sheet admin-chooser-sheet pointer-events-auto max-w-[480px] w-full">
          <!-- Header -->
          <div class="flex justify-between items-center border-b border-[var(--text-charcoal)]/10 pb-4 flex-shrink-0">
            <div>
              <span class="tracking-widest font-mono text-[9px] uppercase font-bold text-[var(--color-coral)] block mb-1">
                New Product
              </span>
              <h3 class="text-base font-fredoka text-[var(--text-charcoal)] tracking-wide uppercase">
                Choose Collection
              </h3>
            </div>
            <button (click)="closeAdminProductModal()" class="text-[var(--text-charcoal)]/40 hover:text-[var(--color-coral)] text-sm p-1.5 transition-colors">
              ✕
            </button>
          </div>

          <!-- Chooser Cards -->
          <div class="py-6 space-y-4">
            <p class="text-[10px] uppercase tracking-widest text-[#6B5E57] font-light text-center mb-2">
              Select the collection for your new product
            </p>
            <div class="grid grid-cols-3 gap-4">
              <!-- Women Card -->
              <button 
                type="button"
                (click)="selectCategoryAndProceed('Women')"
                class="category-chooser-card group"
              >
                <div class="category-chooser-img-wrapper">
                  <img src="/products/banner_women.png" alt="Women Collection" class="category-chooser-img" />
                  <div class="category-chooser-img-overlay"></div>
                </div>
                <div class="category-chooser-info">
                  <span class="category-chooser-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </span>
                  <span class="category-chooser-title">Women</span>
                  <span class="category-chooser-subtitle">Fashion · Pajama · Bags · Shoes</span>
                  <span class="category-chooser-arrow">→</span>
                </div>
              </button>

              <!-- Men Card -->
              <button 
                type="button"
                (click)="selectCategoryAndProceed('Men')"
                class="category-chooser-card group"
              >
                <div class="category-chooser-img-wrapper">
                  <img src="/products/men_collection_perfect.png" alt="Men Collection" class="category-chooser-img" />
                  <div class="category-chooser-img-overlay"></div>
                </div>
                <div class="category-chooser-info">
                  <span class="category-chooser-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </span>
                  <span class="category-chooser-title">Men</span>
                  <span class="category-chooser-subtitle">Apparel · Shoes · Accessories</span>
                  <span class="category-chooser-arrow">→</span>
                </div>
              </button>

              <!-- Kids Card -->
              <button 
                type="button"
                (click)="selectCategoryAndProceed('Kids')"
                class="category-chooser-card group"
              >
                <div class="category-chooser-img-wrapper">
                  <img src="/products/banner_kids.png" alt="Kids Collection" class="category-chooser-img" />
                  <div class="category-chooser-img-overlay"></div>
                </div>
                <div class="category-chooser-info">
                  <span class="category-chooser-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </span>
                  <span class="category-chooser-title">Kids</span>
                  <span class="category-chooser-subtitle">Boys · Girls · Unisex · Baby</span>
                  <span class="category-chooser-arrow">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- ========== STEP 2: Product Form ========== -->
        <div *ngIf="adminFormStep() === 'form'" class="quick-buy-sheet admin-product-sheet pointer-events-auto max-w-[450px] w-full">
          <!-- Header -->
          <div class="flex justify-between items-center border-b border-[var(--text-charcoal)]/10 pb-4 flex-shrink-0">
            <div class="flex items-center gap-3">
              <!-- Back button for new products -->
              <button 
                *ngIf="!editingProductId()"
                (click)="adminFormStep.set('chooser')"
                class="text-[var(--text-charcoal)]/40 hover:text-[var(--color-coral)] text-sm p-1 transition-colors rounded-md hover:bg-[var(--color-coral)]/5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <div>
                <span class="tracking-widest font-mono text-[9px] uppercase font-bold text-[var(--color-coral)] block mb-1">
                  {{ editingProductId() ? 'Storefront Management' : formMainCategory() + ' Collection' }}
                </span>
                <h3 class="text-base font-fredoka text-[var(--text-charcoal)] tracking-wide uppercase truncate">
                  {{ editingProductId() ? 'Edit Product' : 'Create Product' }}
                </h3>
              </div>
            </div>
            <button (click)="closeAdminProductModal()" class="text-[var(--text-charcoal)]/40 hover:text-[var(--color-coral)] text-sm p-1.5 transition-colors">
              ✕
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar my-4">
            <!-- Validation Error -->
            <div *ngIf="formValidationError()" class="p-3 bg-red-50 border border-red-200 text-red-500 text-xs rounded-xl">
              {{ formValidationError() }}
            </div>

            <!-- Selected Collection Badge (for new products) -->
            <div *ngIf="!editingProductId()" class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold rounded-lg border" 
                [ngClass]="formMainCategory() === 'Women' ? 'bg-[var(--color-coral)]/10 text-[var(--color-coral)] border-[var(--color-coral)]/20' : 'bg-[var(--color-lavender)]/10 text-[var(--color-lavender)] border-[var(--color-lavender)]/20'">
                {{ formMainCategory() }} Collection
              </span>
            </div>

            <!-- Form Row: Title -->
            <div class="space-y-1">
              <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Product Title *</label>
              <input 
                type="text" 
                [ngModel]="formTitle()" 
                (ngModelChange)="formTitle.set($event)" 
                placeholder="E.g. Linen Blend Summer Dress" 
                class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all"
              />
            </div>

            <!-- Form Row: Description -->
            <div class="space-y-1">
              <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Description *</label>
              <textarea 
                [ngModel]="formDescription()" 
                (ngModelChange)="formDescription.set($event)" 
                rows="3"
                placeholder="Exquisite linen fabric drapes beautifully..." 
                class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all"
              ></textarea>
            </div>

            <!-- Form Row: Main Category & Age (for editing, or hidden category display for new) -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1" *ngIf="editingProductId()">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Collection Type *</label>
                <select 
                  [ngModel]="formMainCategory()" 
                  (ngModelChange)="formMainCategory.set($event); formSelectedSubCategories.set([])"
                  class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all"
                >
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
              
              <div class="space-y-1" *ngIf="formMainCategory() === 'Kids'">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Target Age Group *</label>
                <select 
                  [ngModel]="formAge()" 
                  (ngModelChange)="formAge.set($event)" 
                  class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all"
                >
                  <option value="0-12 Months">0-12 Months</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="4-6 Years">4-6 Years</option>
                  <option value="7-12 Years">7-12 Years</option>
                </select>
              </div>
            </div>

            <!-- Form Row: Subcategories pills -->
            <div class="space-y-1.5">
              <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Subcategories (Select multiple) *</label>
              <div class="flex flex-wrap gap-2 pt-1">
                <button 
                  *ngFor="let cat of getFormAvailableSubCategories()"
                  type="button"
                  (click)="toggleFormSubCategory(cat)"
                  [ngClass]="formSelectedSubCategories().includes(cat) ? 'active-pill' : 'inactive-pill'"
                  class="px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold border rounded-lg transition-all"
                >
                  {{ cat }}
                </button>
              </div>
            </div>

            <!-- Form Row: Collection Tag -->
            <div class="space-y-1.5 animate-fade-in">
              <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Collection Tag (Optional)</label>
              <div class="flex flex-wrap gap-2 pt-1">
                <button 
                  *ngFor="let tag of ['Latest', 'Bestsellers', 'Featured', 'On Sale']"
                  type="button"
                  (click)="formCollectionType() === tag ? formCollectionType.set('') : formCollectionType.set(tag)"
                  [ngClass]="formCollectionType() === tag ? 'active-pill' : 'inactive-pill'"
                  class="px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold border rounded-lg transition-all"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <!-- Form Row: Price & Cost Price -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Price (EGP) *</label>
                <input 
                  type="number" 
                  [ngModel]="formPrice()" 
                  (ngModelChange)="formPrice.set($event)" 
                  class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all"
                />
              </div>
              <div class="space-y-1">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Cost Price (EGP) *</label>
                <input 
                  type="number" 
                  [ngModel]="formCostPrice()" 
                  (ngModelChange)="formCostPrice.set($event)" 
                  class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all"
                />
              </div>
            </div>

            <!-- Form Row: Stock & Shipping Size -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Stock Qty *</label>
                <input 
                  type="number" 
                  [ngModel]="formStockQuantity()" 
                  (ngModelChange)="formStockQuantity.set($event)" 
                  class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all"
                />
              </div>
              <div class="space-y-1">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Shipping Size *</label>
                <select 
                  [ngModel]="formShippingSize()" 
                  (ngModelChange)="formShippingSize.set($event)" 
                  class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all"
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>
            </div>

            <!-- Form Row: Brand Selection -->
            <div class="space-y-1">
              <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Brand / Design House</label>
              <select 
                [ngModel]="formBrandId()" 
                (ngModelChange)="formBrandId.set($event)" 
                class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all animate-fade-in"
              >
                <option value="">No Brand (Independent)</option>
                <option *ngFor="let b of brands()" [value]="b.id">{{ b.name }}</option>
              </select>
            </div>

            <!-- Form Row: Multiple Images Upload (Max 10) -->
            <div class="space-y-2 pt-1">
              <div class="flex justify-between items-center">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57]">Product Images * (Up to 10)</label>
                <span class="text-[9px] text-[#8A817C] font-mono font-bold">{{ formImageUrls().length }}/10</span>
              </div>
              
              <!-- Thumbnail strip with delete button -->
              <div class="flex flex-wrap gap-2.5 items-center">
                <div 
                  *ngFor="let imgUrl of formImageUrls(); let i = index" 
                  class="relative w-14 h-14 rounded-lg border border-[var(--text-charcoal)]/10 bg-white overflow-hidden flex items-center justify-center group/img shadow-sm animate-fade-in"
                >
                  <img [src]="resolveImageUrl(imgUrl)" class="w-full h-full object-cover" />
                  <div *ngIf="i === 0" class="absolute bottom-0 left-0 right-0 bg-[var(--text-charcoal)]/80 text-[6px] text-white text-center py-0.5 font-bold uppercase tracking-wider">
                    Primary
                  </div>
                  <!-- Delete Swatch Button -->
                  <button 
                    type="button"
                    (click)="removeFormImage(i)" 
                    class="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-650 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-[7px] font-bold shadow-md opacity-0 group-hover/img:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>

                <!-- Add Image Box -->
                <label 
                  *ngIf="formImageUrls().length < 10"
                  class="w-14 h-14 rounded-lg border-2 border-dashed border-[var(--text-charcoal)]/15 hover:border-[var(--color-coral)] bg-[#FAF5F2] flex flex-col items-center justify-center text-[#8A817C] hover:text-[var(--color-coral)] cursor-pointer select-none transition-all"
                >
                  <span class="text-sm font-bold leading-none">+</span>
                  <span class="text-[6px] font-bold uppercase tracking-widest mt-0.5">Upload</span>
                  <input type="file" accept="image/*" class="hidden" (change)="uploadFormImage($event)" />
                </label>
              </div>
            </div>

            <!-- Form Row: Colors & Sizes -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1 relative form-color-dropdown-container">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Colors *</label>
                <button 
                  type="button"
                  (click)="isFormColorDropdownOpen.set(!isFormColorDropdownOpen()); $event.stopPropagation()"
                  class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all flex justify-between items-center text-left min-h-[34px]"
                >
                  <div class="flex items-center gap-1 flex-wrap overflow-hidden max-w-[90%]">
                    <span *ngIf="!formColors().trim()" class="text-[#8A817C]/60 text-[11px] font-normal">Select Colors...</span>
                    <span 
                      *ngFor="let color of formColors().split(',')" 
                      [class.hidden]="!color.trim()"
                      class="px-1.5 py-0.5 text-[9px] bg-[var(--text-charcoal)]/5 border border-[var(--text-charcoal)]/10 rounded-md text-[var(--text-charcoal)] flex items-center gap-1 font-mono uppercase font-bold"
                    >
                      <span class="w-2 h-2 rounded-full border border-black/10 flex-shrink-0" [style.background-color]="getColorHex(color.trim())"></span>
                      {{ color.trim() }}
                    </span>
                  </div>
                  <span class="text-[8px] text-[#8A817C] font-mono ml-1 flex-shrink-0">{{ isFormColorDropdownOpen() ? '▲' : '▼' }}</span>
                </button>

                <!-- Dropdown Menu -->
                <div 
                  *ngIf="isFormColorDropdownOpen()" 
                  (click)="$event.stopPropagation()"
                  class="absolute left-0 right-0 mt-1 bg-white border border-[var(--text-charcoal)]/15 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto p-2 custom-scrollbar grid grid-cols-1 gap-1"
                >
                  <button 
                    *ngFor="let color of availableColors()"
                    type="button"
                    (click)="toggleFormColor(color.name)"
                    [ngClass]="{'bg-[var(--text-charcoal)]/5 border-[var(--color-lavender)]/20': isFormColorSelected(color.name)}"
                    class="flex items-center gap-2 px-2 py-1.5 border border-transparent rounded-lg text-left text-xs text-[var(--text-charcoal)] hover:bg-[var(--text-charcoal)]/5 transition-all w-full"
                  >
                    <span class="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0" [style.background-color]="color.hexCode"></span>
                    <span class="font-medium flex-1 truncate text-[11px]">{{ color.name }}</span>
                    <span *ngIf="isFormColorSelected(color.name)" class="text-[var(--color-lavender)] font-bold text-[10px]">✓</span>
                  </button>
                </div>
              </div>
              <div class="space-y-1 relative form-size-dropdown-container">
                <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Sizes *</label>
                <button 
                  type="button"
                  (click)="isFormSizeDropdownOpen.set(!isFormSizeDropdownOpen()); $event.stopPropagation()"
                  class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all flex justify-between items-center text-left min-h-[34px]"
                >
                  <div class="flex items-center gap-1 flex-wrap overflow-hidden max-w-[90%]">
                    <span *ngIf="!formSizes().trim()" class="text-[#8A817C]/60 text-[11px] font-normal">Select Sizes...</span>
                    <span 
                      *ngFor="let size of formSizes().split(',')" 
                      [class.hidden]="!size.trim()"
                      class="px-1.5 py-0.5 text-[9px] bg-[var(--text-charcoal)]/5 border border-[var(--text-charcoal)]/10 rounded-md text-[var(--text-charcoal)] font-mono uppercase font-bold"
                    >
                      {{ size.trim() }}
                    </span>
                  </div>
                  <span class="text-[8px] text-[#8A817C] font-mono ml-1 flex-shrink-0">{{ isFormSizeDropdownOpen() ? '▲' : '▼' }}</span>
                </button>

                  <!-- Dropdown Menu -->
                  <div 
                    *ngIf="isFormSizeDropdownOpen()" 
                    (click)="$event.stopPropagation()"
                    class="absolute left-0 right-0 mt-1 bg-white border border-[var(--text-charcoal)]/15 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto p-2 custom-scrollbar space-y-3"
                  >
                    <div *ngIf="formMainCategory() === 'Women'" class="space-y-1">
                      <div class="text-[8px] uppercase tracking-widest font-bold text-[var(--color-lavender)] px-2 py-0.5 border-b border-[var(--text-charcoal)]/5">Women's Sizes</div>
                      <div class="grid grid-cols-1 gap-1">
                        <button 
                          *ngFor="let size of getFormSizesForAudience('Women')"
                          type="button"
                          (click)="toggleFormSize(size)"
                          [ngClass]="{'bg-[var(--text-charcoal)]/5 border-[var(--color-lavender)]/20': isFormSizeSelected(size)}"
                          class="flex items-center justify-between px-2.5 py-1.5 border border-transparent rounded-lg text-left text-xs text-[var(--text-charcoal)] hover:bg-[var(--text-charcoal)]/5 transition-all w-full"
                        >
                          <span class="font-medium truncate text-[11px] font-mono uppercase">{{ size }}</span>
                          <span *ngIf="isFormSizeSelected(size)" class="text-[var(--color-lavender)] font-bold text-[10px]">✓</span>
                        </button>
                      </div>
                      <div *ngIf="getFormSizesForAudience('Women').length === 0" class="text-[10px] text-[#8A817C] italic px-2">No women's sizes available.</div>
                    </div>

                    <!-- Men's sizes section (shown if mainCategory is Men) -->
                    <div *ngIf="formMainCategory() === 'Men'" class="space-y-1">
                      <div class="text-[8px] uppercase tracking-widest font-bold text-[var(--color-lavender)] px-2 py-0.5 border-b border-[var(--text-charcoal)]/5">Men's Sizes</div>
                      <div class="grid grid-cols-1 gap-1">
                        <button 
                          *ngFor="let size of getFormSizesForAudience('Men')"
                          type="button"
                          (click)="toggleFormSize(size)"
                          [ngClass]="{'bg-[var(--text-charcoal)]/5 border-[var(--color-lavender)]/20': isFormSizeSelected(size)}"
                          class="flex items-center justify-between px-2.5 py-1.5 border border-transparent rounded-lg text-left text-xs text-[var(--text-charcoal)] hover:bg-[var(--text-charcoal)]/5 transition-all w-full"
                        >
                          <span class="font-medium truncate text-[11px] font-mono uppercase">{{ size }}</span>
                          <span *ngIf="isFormSizeSelected(size)" class="text-[var(--color-lavender)] font-bold text-[10px]">✓</span>
                        </button>
                      </div>
                      <div *ngIf="getFormSizesForAudience('Men').length === 0" class="text-[10px] text-[#8A817C] italic px-2">No men's sizes available.</div>
                    </div>

                    <!-- Children's sizes section (shown if mainCategory is Kids) -->
                    <div *ngIf="formMainCategory() === 'Kids'" class="space-y-1">
                      <div class="text-[8px] uppercase tracking-widest font-bold text-[var(--color-lavender)] px-2 py-0.5 border-b border-[var(--text-charcoal)]/5">Children's Sizes</div>
                      <div class="grid grid-cols-1 gap-1">
                        <button 
                          *ngFor="let size of getFormSizesForAudience('Kids')"
                          type="button"
                          (click)="toggleFormSize(size)"
                          [ngClass]="{'bg-[var(--text-charcoal)]/5 border-[var(--color-lavender)]/20': isFormSizeSelected(size)}"
                          class="flex items-center justify-between px-2.5 py-1.5 border border-transparent rounded-lg text-left text-xs text-[var(--text-charcoal)] hover:bg-[var(--text-charcoal)]/5 transition-all w-full"
                        >
                          <span class="font-medium truncate text-[11px] font-mono uppercase">{{ size }}</span>
                          <span *ngIf="isFormSizeSelected(size)" class="text-[var(--color-lavender)] font-bold text-[10px]">✓</span>
                        </button>
                      </div>
                      <div *ngIf="getFormSizesForAudience('Kids').length === 0" class="text-[10px] text-[#8A817C] italic px-2">No children's sizes available.</div>
                    </div>
                  </div>
              </div>
            </div>

            <!-- Form Row: Visibility -->
            <div class="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                [ngModel]="formIsVisible()" 
                (ngModelChange)="formIsVisible.set($event)" 
                id="formIsVisible" 
                class="rounded border-[var(--text-charcoal)]/10 text-[var(--color-coral)] focus:ring-[var(--color-coral)]"
              />
              <label for="formIsVisible" class="text-[9px] uppercase tracking-widest font-bold text-[#6B5E57] select-none cursor-pointer">Visible to Customers</label>
            </div>

            <!-- Form Row: Shipping Override -->
            <div class="border-t border-[var(--text-charcoal)]/10 pt-3 space-y-2">
              <div class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  [ngModel]="formOverrideShipping()" 
                  (ngModelChange)="formOverrideShipping.set($event)" 
                  id="formOverrideShipping" 
                  class="rounded border-[var(--text-charcoal)]/10 text-[var(--color-coral)] focus:ring-[var(--color-coral)]"
                />
                <label for="formOverrideShipping" class="text-[9px] uppercase tracking-widest font-bold text-[#6B5E57] select-none cursor-pointer font-bold">Override Standard Shipping</label>
              </div>

              <!-- Nested Override Details -->
              <div *ngIf="formOverrideShipping()" class="pl-5 space-y-2 pt-1">
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1.5">
                    <input 
                      type="radio" 
                      id="overrideFree" 
                      [value]="true" 
                      [ngModel]="formIsFreeShipping()" 
                      (ngModelChange)="formIsFreeShipping.set($event)" 
                      name="overrideType"
                      class="text-[var(--color-coral)] focus:ring-[var(--color-coral)]"
                    />
                    <label for="overrideFree" class="text-[9px] uppercase tracking-widest font-semibold text-[#6B5E57] select-none cursor-pointer">Free Shipping</label>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <input 
                      type="radio" 
                      id="overrideFixed" 
                      [value]="false" 
                      [ngModel]="formIsFreeShipping()" 
                      (ngModelChange)="formIsFreeShipping.set($event)" 
                      name="overrideType"
                      class="text-[var(--color-coral)] focus:ring-[var(--color-coral)]"
                    />
                    <label for="overrideFixed" class="text-[9px] uppercase tracking-widest font-semibold text-[#6B5E57] select-none cursor-pointer">Fixed Shipping Rate</label>
                  </div>
                </div>

                <div *ngIf="!formIsFreeShipping()" class="space-y-1">
                  <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block">Fixed Shipping Price (EGP) *</label>
                  <input 
                    type="number" 
                    [ngModel]="formFixedShippingPrice()" 
                    (ngModelChange)="formFixedShippingPrice.set($event)" 
                    placeholder="E.g. 50" 
                    class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer CTA -->
          <div class="pt-4 border-t border-[var(--text-charcoal)]/10 space-y-3 flex-shrink-0">
            <button 
              [disabled]="formSubmitting()"
              (click)="submitAdminProductForm()"
              class="w-full py-3.5 text-[#FAF5F2] text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex justify-center items-center gap-2 neon-btn disabled:opacity-50"
            >
              {{ formSubmitting() ? 'SUBMITTING...' : (editingProductId() ? 'UPDATE PRODUCT' : 'CREATE PRODUCT') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Floating Selection Action Bar (Glassmorphic) -->
      <div *ngIf="isSelectionMode() && selectedProductIds().size > 0" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between gap-6 px-6 py-4 bg-[#FAF5F2]/85 backdrop-blur-md border border-[var(--text-charcoal)]/10 rounded-2xl shadow-xl max-w-2xl w-[90%] transition-all animate-slide-up">
        <div class="flex flex-col text-left">
          <span class="text-[9px] uppercase tracking-widest font-mono text-[var(--color-coral)] font-bold">Selection Active</span>
          <span class="text-xs text-[var(--text-charcoal)] font-semibold">{{ selectedProductIds().size }} products selected</span>
        </div>
        <div class="flex items-center gap-3">
          <button *ngIf="authService.hasPermission('Products:Update')" (click)="openBulkEditModal()" class="px-3.5 py-2 bg-[var(--color-coral)] hover:bg-[var(--color-coral)]/90 text-white text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all shadow-sm">
            ✏️ Edit Bulk
          </button>
          <button *ngIf="authService.hasPermission('Products:Update')" (click)="bulkToggleVisibility()" class="px-3.5 py-2 bg-[#8C857B] hover:bg-[var(--text-charcoal)] text-white text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all shadow-sm">
            👁️ Toggle Show
          </button>
          <button *ngIf="authService.hasPermission('Products:Delete')" (click)="bulkDelete()" class="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all shadow-sm">
            🗑️ Delete
          </button>
          <button (click)="clearSelection()" class="px-3.5 py-2 border border-[var(--text-charcoal)]/20 hover:bg-[var(--text-charcoal)]/5 text-[var(--text-charcoal)] text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all">
            Cancel
          </button>
        </div>
      </div>

      <!-- Bulk Product Editor Side Sheet -->
      <div *ngIf="isBulkEditModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none">
        <!-- Backdrop Layer -->
        <div 
          (click)="closeBulkEditModal()" 
          class="fixed inset-0 bg-[var(--text-charcoal)]/10 backdrop-blur-[3px] pointer-events-auto cursor-pointer"
        ></div>

        <!-- Frosted Glass Configurator Sheet -->
        <div class="quick-buy-sheet admin-product-sheet bulk-edit-sheet pointer-events-auto max-w-[450px] w-full">
          <!-- Header -->
          <div class="flex justify-between items-center border-b border-[var(--text-charcoal)]/10 pb-4 flex-shrink-0">
            <div>
              <span class="tracking-widest font-mono text-[9px] uppercase font-bold text-[var(--color-coral)] block mb-1">
                Storefront Management
              </span>
              <h3 class="text-base font-fredoka text-[var(--text-charcoal)] tracking-wide uppercase truncate">
                Bulk Edit {{ selectedProductIds().size }} Products
              </h3>
            </div>
            <button (click)="closeBulkEditModal()" class="text-[var(--text-charcoal)]/40 hover:text-[var(--color-coral)] text-sm p-1.5 transition-colors">
              ✕
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto space-y-5 pr-1 custom-scrollbar my-4 text-left">
            <!-- Progress Overlay when submitting -->
            <div *ngIf="bulkEditSubmitting()" class="py-8 text-center space-y-3">
              <span class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-coral)] inline-block"></span>
              <p class="text-xs text-[var(--text-charcoal)] font-semibold uppercase tracking-wider">{{ bulkEditProgress() }}</p>
            </div>

            <div *ngIf="!bulkEditSubmitting()" class="space-y-4">
              <p class="text-[10px] text-[#6B5E57] uppercase tracking-wider font-light mb-4">
                Toggle the checkbox next to any field to apply that change to all selected products.
              </p>

              <!-- Category & Collection -->
              <div class="border border-[var(--text-charcoal)]/5 p-3 rounded-xl bg-white/40 space-y-2">
                <div class="flex items-center gap-2">
                  <input type="checkbox" [(ngModel)]="bulkUpdateCategory" id="bulkUpdateCategory" class="rounded border-[var(--text-charcoal)]/15 text-[var(--color-coral)] focus:ring-[var(--color-coral)]" />
                  <label for="bulkUpdateCategory" class="text-[9px] uppercase tracking-widest font-bold text-[var(--text-charcoal)] select-none cursor-pointer">Update Collection & Subcategory</label>
                </div>
                <div *ngIf="bulkUpdateCategory()" class="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label class="text-[8px] uppercase tracking-widest font-semibold text-[#6B5E57] block mb-1">Collection *</label>
                    <select [(ngModel)]="bulkMainCategory" (ngModelChange)="bulkSubCategory.set(getBulkSubcategories()[0])" class="w-full px-2.5 py-1.5 bg-white border border-[var(--text-charcoal)]/10 rounded-lg text-xs">
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-[8px] uppercase tracking-widest font-semibold text-[#6B5E57] block mb-1">Subcategory *</label>
                    <select [(ngModel)]="bulkSubCategory" class="w-full px-2.5 py-1.5 bg-white border border-[var(--text-charcoal)]/10 rounded-lg text-xs">
                      <option *ngFor="let cat of getBulkSubcategories()" [value]="cat">{{ cat }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Price & Cost Price -->
              <div class="border border-[var(--text-charcoal)]/5 p-3 rounded-xl bg-white/40 space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="bulkUpdatePrice" id="bulkUpdatePrice" class="rounded border-[var(--text-charcoal)]/15 text-[var(--color-coral)] focus:ring-[var(--color-coral)]" />
                    <label for="bulkUpdatePrice" class="text-[9px] uppercase tracking-widest font-bold text-[var(--text-charcoal)] select-none cursor-pointer">Update Retail Price</label>
                  </div>
                  <div *ngIf="bulkUpdatePrice()" class="pl-5">
                    <input type="number" [(ngModel)]="bulkPrice" placeholder="LE" class="w-full px-3 py-1.5 bg-white border border-[var(--text-charcoal)]/10 rounded-lg text-xs" />
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="bulkUpdateCostPrice" id="bulkUpdateCostPrice" class="rounded border-[var(--text-charcoal)]/15 text-[var(--color-coral)] focus:ring-[var(--color-coral)]" />
                    <label for="bulkUpdateCostPrice" class="text-[9px] uppercase tracking-widest font-bold text-[var(--text-charcoal)] select-none cursor-pointer">Update Cost Price</label>
                  </div>
                  <div *ngIf="bulkUpdateCostPrice()" class="pl-5">
                    <input type="number" [(ngModel)]="bulkCostPrice" placeholder="LE" class="w-full px-3 py-1.5 bg-white border border-[var(--text-charcoal)]/10 rounded-lg text-xs" />
                  </div>
                </div>
              </div>

              <!-- Stock & Shipping Size -->
              <div class="border border-[var(--text-charcoal)]/5 p-3 rounded-xl bg-white/40 space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="bulkUpdateStock" id="bulkUpdateStock" class="rounded border-[var(--text-charcoal)]/15 text-[var(--color-coral)] focus:ring-[var(--color-coral)]" />
                    <label for="bulkUpdateStock" class="text-[9px] uppercase tracking-widest font-bold text-[var(--text-charcoal)] select-none cursor-pointer">Update Stock Quantity</label>
                  </div>
                  <div *ngIf="bulkUpdateStock()" class="pl-5">
                    <input type="number" [(ngModel)]="bulkStock" class="w-full px-3 py-1.5 bg-white border border-[var(--text-charcoal)]/10 rounded-lg text-xs" />
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="bulkUpdateShippingSize" id="bulkUpdateShippingSize" class="rounded border-[var(--text-charcoal)]/15 text-[var(--color-coral)] focus:ring-[var(--color-coral)]" />
                    <label for="bulkUpdateShippingSize" class="text-[9px] uppercase tracking-widest font-bold text-[var(--text-charcoal)] select-none cursor-pointer">Update Shipping Size</label>
                  </div>
                  <div *ngIf="bulkUpdateShippingSize()" class="pl-5">
                    <select [(ngModel)]="bulkShippingSize" class="w-full px-3 py-1.5 bg-white border border-[var(--text-charcoal)]/10 rounded-lg text-xs">
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Visibility -->
              <div class="border border-[var(--text-charcoal)]/5 p-3 rounded-xl bg-white/40 space-y-2">
                <div class="flex items-center gap-2">
                  <input type="checkbox" [(ngModel)]="bulkUpdateVisibility" id="bulkUpdateVisibility" class="rounded border-[var(--text-charcoal)]/15 text-[var(--color-coral)] focus:ring-[var(--color-coral)]" />
                  <label for="bulkUpdateVisibility" class="text-[9px] uppercase tracking-widest font-bold text-[var(--text-charcoal)] select-none cursor-pointer">Update Customer Visibility</label>
                </div>
                <div *ngIf="bulkUpdateVisibility()" class="pl-5 flex items-center gap-2 pt-1">
                  <input type="checkbox" [(ngModel)]="bulkIsVisible" id="bulkIsVisible" class="rounded border-[var(--text-charcoal)]/15 text-[var(--color-coral)] focus:ring-[var(--color-coral)]" />
                  <label for="bulkIsVisible" class="text-[9px] uppercase tracking-widest font-semibold text-[#6B5E57] select-none cursor-pointer">Visible to Customers</label>
                </div>
              </div>

              <!-- Colors & Sizes -->
              <div class="border border-[var(--text-charcoal)]/5 p-3 rounded-xl bg-white/40 space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="bulkUpdateColors" id="bulkUpdateColors" class="rounded border-[var(--text-charcoal)]/15 text-[var(--color-coral)] focus:ring-[var(--color-coral)]" />
                    <label for="bulkUpdateColors" class="text-[9px] uppercase tracking-widest font-bold text-[var(--text-charcoal)] select-none cursor-pointer">Update Colors</label>
                  </div>
                  <div *ngIf="bulkUpdateColors()" class="pl-5">
                    <input type="text" [(ngModel)]="bulkColors" placeholder="E.g. Tan, Blush, Sage (comma separated)" class="w-full px-3 py-1.5 bg-white border border-[var(--text-charcoal)]/10 rounded-lg text-xs" />
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="bulkUpdateSizes" id="bulkUpdateSizes" class="rounded border-[var(--text-charcoal)]/15 text-[var(--color-coral)] focus:ring-[var(--color-coral)]" />
                    <label for="bulkUpdateSizes" class="text-[9px] uppercase tracking-widest font-bold text-[var(--text-charcoal)] select-none cursor-pointer">Update Sizes</label>
                  </div>
                  <div *ngIf="bulkUpdateSizes()" class="pl-5">
                    <input type="text" [(ngModel)]="bulkSizes" placeholder="E.g. S, M, L (comma separated)" class="w-full px-3 py-1.5 bg-white border border-[var(--text-charcoal)]/10 rounded-lg text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer CTA -->
          <div class="pt-4 border-t border-[var(--text-charcoal)]/10 space-y-3 flex-shrink-0">
            <button 
              [disabled]="bulkEditSubmitting()"
              (click)="submitBulkEditForm()"
              class="w-full py-3.5 text-[#FAF5F2] text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex justify-center items-center gap-2 neon-btn disabled:opacity-50"
            >
              {{ bulkEditSubmitting() ? 'APPLYING CHANGES...' : 'SAVE BULK CHANGES' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './products-catalog.component.css'
})
export class ProductsCatalogComponent implements OnInit, AfterViewInit, OnDestroy {
  private catalogService = inject(CatalogService);
  public authService = inject(AuthService);
  private alertService = inject(AlertService);
  private mediaService = inject(MediaService);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private platformId = inject(PLATFORM_ID);
  resolveImageUrl = resolveImageUrl;

  @ViewChild('scrollAnchor') scrollAnchorRef!: ElementRef<HTMLDivElement>;
  private scrollObserver?: IntersectionObserver;

  activeDropdown = signal<string | null>(null);

  // Selection & Bulk Edit States
  isSelectionMode = signal<boolean>(false);
  selectedProductIds = signal<Set<string>>(new Set());
  isBulkEditModalOpen = signal<boolean>(false);
  bulkEditSubmitting = signal<boolean>(false);
  bulkEditProgress = signal<string>('');

  // Bulk Edit Form Signals
  bulkUpdatePrice = signal<boolean>(false);
  bulkPrice = signal<number>(0);
  bulkUpdateCostPrice = signal<boolean>(false);
  bulkCostPrice = signal<number>(0);
  bulkUpdateStock = signal<boolean>(false);
  bulkStock = signal<number>(0);
  bulkUpdateShippingSize = signal<boolean>(false);
  bulkShippingSize = signal<string>('Small');
  bulkUpdateVisibility = signal<boolean>(false);
  bulkIsVisible = signal<boolean>(true);
  bulkUpdateCategory = signal<boolean>(false);
  bulkMainCategory = signal<string>('Women');
  bulkSubCategory = signal<string>('fashion');
  bulkUpdateColors = signal<boolean>(false);
  bulkColors = signal<string>('');
  bulkUpdateSizes = signal<boolean>(false);
  bulkSizes = signal<string>('');

  toggleSelectionMode(): void {
    const active = !this.isSelectionMode();
    this.isSelectionMode.set(active);
    if (!active) {
      this.selectedProductIds.set(new Set());
    }
  }

  toggleProductSelected(productId: string, event: Event): void {
    event.stopPropagation();
    this.selectedProductIds.update(set => {
      const next = new Set(set);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }

  isProductSelected(productId: string): boolean {
    return this.selectedProductIds().has(productId);
  }

  clearSelection(): void {
    this.selectedProductIds.set(new Set());
  }

  getBulkSubcategories(): string[] {
    const main = this.bulkMainCategory();
    if (main === 'Women') {
      return ['fashion', 'pajama', 'bags', 'shoes', 'accessors'];
    }
    return ['kids boys', 'girls', 'unisex collection', 'baby needs', 'accessors'];
  }

  openBulkEditModal(): void {
    this.bulkUpdatePrice.set(false);
    this.bulkPrice.set(0);
    this.bulkUpdateCostPrice.set(false);
    this.bulkCostPrice.set(0);
    this.bulkUpdateStock.set(false);
    this.bulkStock.set(0);
    this.bulkUpdateShippingSize.set(false);
    this.bulkShippingSize.set('Small');
    this.bulkUpdateVisibility.set(false);
    this.bulkIsVisible.set(true);
    this.bulkUpdateCategory.set(false);
    this.bulkMainCategory.set('Women');
    this.bulkSubCategory.set('fashion');
    this.bulkUpdateColors.set(false);
    this.bulkColors.set('');
    this.bulkUpdateSizes.set(false);
    this.bulkSizes.set('');
    
    this.isBulkEditModalOpen.set(true);

    setTimeout(() => {
      const scrollableElements = document.querySelectorAll('.bulk-edit-sheet, .bulk-edit-sheet .overflow-y-auto');
      scrollableElements.forEach(el => el.scrollTop = 0);

      gsap.fromTo('.bulk-edit-sheet', 
        { y: '40px', opacity: 0 }, 
        { y: '0px', opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }, 50);
  }

  closeBulkEditModal(): void {
    gsap.to('.bulk-edit-sheet', {
      y: '40px',
      opacity: 0,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => {
        this.isBulkEditModalOpen.set(false);
      }
    });
  }

  async submitBulkEditForm() {
    this.bulkEditSubmitting.set(true);
    
    const selectedIds = Array.from(this.selectedProductIds());
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedIds.length; i++) {
      const id = selectedIds[i];
      const product = this.products().find(p => p.id === id);
      if (!product) continue;

      this.bulkEditProgress.set(`Updating product ${i + 1} of ${selectedIds.length}: ${product.title}...`);

      const categoryIds = product.categories && product.categories.length > 0 ? product.categories.map(c => c.id) : [product.categoryId];
      const primaryCategoryGuid = product.categoryId;
      const colorsArr = product.colors || [];
      const sizesArr = product.sizes || [];

      const updateData: any = {
        title: product.title,
        description: product.description,
        price: product.price,
        costPrice: product.costPrice || Math.round(product.price * 0.6),
        stockQuantity: product.stockQuantity,
        isVisible: product.isVisible,
        categoryId: primaryCategoryGuid,
        shippingSize: product.shippingSize || 'Small',
        imageUrl: product.imageUrl || '',
        age: product.age || null,
        categoryIds: categoryIds,
        colors: colorsArr,
        sizes: sizesArr,
        overrideStandardShipping: product.overrideStandardShipping || false,
        isFreeShipping: product.isFreeShipping || false,
        fixedShippingPrice: product.fixedShippingPrice || null
      };

      if (this.bulkUpdatePrice()) {
        updateData.price = this.bulkPrice();
      }
      if (this.bulkUpdateCostPrice()) {
        updateData.costPrice = this.bulkCostPrice();
      }
      if (this.bulkUpdateStock()) {
        updateData.stockQuantity = this.bulkStock();
      }
      if (this.bulkUpdateShippingSize()) {
        updateData.shippingSize = this.bulkShippingSize();
      }
      if (this.bulkUpdateVisibility()) {
        updateData.isVisible = this.bulkIsVisible();
      }
      if (this.bulkUpdateCategory()) {
        const mainCat = this.bulkMainCategory();
        const subCat = this.bulkSubCategory();
        const catId = this.getCategoryGuid(subCat, mainCat);
        if (catId) {
          updateData.categoryId = catId;
          updateData.categoryIds = [catId];
        }
      }
      if (this.bulkUpdateColors()) {
        updateData.colors = this.bulkColors() ? this.bulkColors().split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
      }
      if (this.bulkUpdateSizes()) {
        updateData.sizes = this.bulkSizes() ? this.bulkSizes().split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
      }

      try {
        await lastValueFrom(this.catalogService.updateProduct(id, updateData));
        successCount++;
      } catch (err) {
        console.error(`Failed to update product ${product.title}`, err);
        failCount++;
      }
    }

    this.bulkEditSubmitting.set(false);
    this.isBulkEditModalOpen.set(false);
    this.isSelectionMode.set(false);
    this.selectedProductIds.set(new Set());
    
    this.loadProducts();
    this.alertService.showAlert({
      title: 'Bulk Update Complete',
      message: `Bulk update completed successfully!\nUpdated: ${successCount}\nFailed: ${failCount}`,
      type: 'success'
    });
  }

  async bulkToggleVisibility() {
    const selectedIds = Array.from(this.selectedProductIds());
    if (selectedIds.length === 0) return;
    
    this.loading.set(true);
    let successCount = 0;
    
    for (const id of selectedIds) {
      try {
        await lastValueFrom(this.catalogService.toggleProductVisibility(id));
        successCount++;
      } catch (err) {
        console.error(err);
      }
    }
    
    this.isSelectionMode.set(false);
    this.selectedProductIds.set(new Set());
    this.loadProducts();
    this.alertService.showAlert({
      title: 'Visibility Updated',
      message: `Successfully toggled visibility for ${successCount} products.`,
      type: 'success'
    });
  }

  async bulkDelete() {
    const selectedIds = Array.from(this.selectedProductIds());
    if (selectedIds.length === 0) return;
    
    this.alertService.showAlert({
      title: 'Confirm Bulk Deletion',
      message: `Are you sure you want to delete ${selectedIds.length} selected products? This action cannot be undone.`,
      type: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        this.loading.set(true);
        let successCount = 0;
        let failCount = 0;

        for (const id of selectedIds) {
          try {
            await lastValueFrom(this.catalogService.deleteProduct(id));
            successCount++;
          } catch (err) {
            console.error(err);
            failCount++;
          }
        }

        this.isSelectionMode.set(false);
        this.selectedProductIds.set(new Set());
        this.loadProducts();
        
        this.alertService.showAlert({
          title: 'Deletion Complete',
          message: `Bulk deletion complete.\nDeleted: ${successCount}\nFailed: ${failCount}`,
          type: 'success'
        });
      }
    });
  }

  hasActiveFilters(): boolean {
    return this.searchQuery !== '' || 
           this.selectedColors.length > 0 || 
           this.selectedSizes.length > 0 || 
           this.activeConsoleTag() !== 'All' ||
           this.selectedSubCategory() !== 'All' ||
           this.selectedAge() !== 'All';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-group-item')) {
      this.activeDropdown.set(null);
    }
    if (!target.closest('.form-color-dropdown-container')) {
      this.isFormColorDropdownOpen.set(false);
    }
    if (!target.closest('.form-size-dropdown-container')) {
      this.isFormSizeDropdownOpen.set(false);
    }
    if (!target.closest('.card-color-dropdown-container')) {
      this.activeCardColorDropdown.set(null);
    }
  }

  addToCart(product: ProductDto): void {
    this.cartService.addItem({
      productId: product.id,
      productName: product.title,
      unitPrice: product.price,
      quantity: 1,
      imageUrl: product.imageUrl || undefined
    });
  }

  // Component States
  products = signal<ProductDto[]>([]);
  loading = signal<boolean>(true);
  targetAudience = signal<string>('All');
  brands = signal<Brand[]>([]);
  selectedBrandId = signal<string | null>(null);

  // Filters
  searchQuery = '';
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  selectedSubCategory = signal<string>('All');
  selectedSubCategoryTarget = signal<string>('All');
  selectedAge = signal<string>('All');

  // Metadata limits for facets (initialized with static fallback, updated dynamically from DB)
  availableColors = signal<any[]>([
    { name: 'Tan', hexCode: '#C49E7A' },
    { name: 'Black', hexCode: '#1F1B1A' },
    { name: 'Gold', hexCode: '#D4AF37' },
    { name: 'Silver', hexCode: '#B0B5BC' },
    { name: 'Champagne', hexCode: '#F1E5D7' },
    { name: 'Emerald', hexCode: '#3B7A57' },
    { name: 'Oatmeal', hexCode: '#E3DFD5' },
    { name: 'Charcoal', hexCode: '#434A54' },
    { name: 'Blush', hexCode: '#ECC8BF' },
    { name: 'Ivory', hexCode: '#FDFBF7' },
    { name: 'Taupe', hexCode: '#8C857B' },
    { name: 'Sage', hexCode: '#9EB0A2' },
    { name: 'Blue', hexCode: '#7F9BB0' },
    { name: 'White', hexCode: '#FFFFFF' }
  ]);

  availableSizes = signal<any[]>([
    { name: 'One Size', targetAudience: 'Both', sortOrder: 0, categoryType: 'Universal' },
    { name: 'XS', targetAudience: 'Women', sortOrder: 1, categoryType: 'Women Clothing' },
    { name: 'S', targetAudience: 'Women', sortOrder: 2, categoryType: 'Women Clothing' },
    { name: 'M', targetAudience: 'Women', sortOrder: 3, categoryType: 'Women Clothing' },
    { name: 'L', targetAudience: 'Women', sortOrder: 4, categoryType: 'Women Clothing' },
    { name: 'XL', targetAudience: 'Women', sortOrder: 5, categoryType: 'Women Clothing' },
    { name: 'XXL', targetAudience: 'Women', sortOrder: 6, categoryType: 'Women Clothing' },
    { name: '37', targetAudience: 'Women', sortOrder: 7, categoryType: 'Women Shoes' },
    { name: '38', targetAudience: 'Women', sortOrder: 8, categoryType: 'Women Shoes' },
    { name: '39', targetAudience: 'Women', sortOrder: 9, categoryType: 'Women Shoes' },
    { name: '40', targetAudience: 'Women', sortOrder: 10, categoryType: 'Women Shoes' },
    { name: '41', targetAudience: 'Women', sortOrder: 11, categoryType: 'Women Shoes' },
    { name: '3-6 Months (62-68cm)', targetAudience: 'Kids', sortOrder: 12, categoryType: 'Kids Clothing' },
    { name: '6-9 Months (68-74cm)', targetAudience: 'Kids', sortOrder: 13, categoryType: 'Kids Clothing' },
    { name: '9-12 Months (74-80cm)', targetAudience: 'Kids', sortOrder: 14, categoryType: 'Kids Clothing' },
    { name: '12-18 Months (80-86cm)', targetAudience: 'Kids', sortOrder: 15, categoryType: 'Kids Clothing' },
    { name: '1.5-2 Years (86-92cm)', targetAudience: 'Kids', sortOrder: 16, categoryType: 'Kids Clothing' },
    { name: '2-3 Years (92-98cm)', targetAudience: 'Kids', sortOrder: 17, categoryType: 'Kids Clothing' },
    { name: '3-4 Years (98-104cm)', targetAudience: 'Kids', sortOrder: 18, categoryType: 'Kids Clothing' },
    { name: '4-5 Years (104-110cm)', targetAudience: 'Kids', sortOrder: 19, categoryType: 'Kids Clothing' },
    { name: '5-6 Years (110-116cm)', targetAudience: 'Kids', sortOrder: 20, categoryType: 'Kids Clothing' },
    { name: '6-7 Years (116-122cm)', targetAudience: 'Kids', sortOrder: 21, categoryType: 'Kids Clothing' },
    { name: 'EU 19', targetAudience: 'Kids', sortOrder: 22, categoryType: 'Kids Shoes' },
    { name: 'EU 20.5', targetAudience: 'Kids', sortOrder: 23, categoryType: 'Kids Shoes' },
    { name: 'EU 21.5', targetAudience: 'Kids', sortOrder: 24, categoryType: 'Kids Shoes' },
    { name: 'EU 23', targetAudience: 'Kids', sortOrder: 25, categoryType: 'Kids Shoes' },
    { name: 'EU 24', targetAudience: 'Kids', sortOrder: 26, categoryType: 'Kids Shoes' },
    { name: 'EU 25.5', targetAudience: 'Kids', sortOrder: 27, categoryType: 'Kids Shoes' },
    { name: 'EU 26.5', targetAudience: 'Kids', sortOrder: 28, categoryType: 'Kids Shoes' },
    { name: 'EU 28', targetAudience: 'Kids', sortOrder: 29, categoryType: 'Kids Shoes' },
    { name: 'EU 29', targetAudience: 'Kids', sortOrder: 30, categoryType: 'Kids Shoes' },
    { name: 'EU 30.5', targetAudience: 'Kids', sortOrder: 31, categoryType: 'Kids Shoes' },
    { name: 'EU 32', targetAudience: 'Kids', sortOrder: 32, categoryType: 'Kids Shoes' },
    { name: 'EU 33', targetAudience: 'Kids', sortOrder: 33, categoryType: 'Kids Shoes' },
    { name: 'EU 34.5', targetAudience: 'Kids', sortOrder: 34, categoryType: 'Kids Shoes' },
    { name: 'EU 35.5', targetAudience: 'Kids', sortOrder: 35, categoryType: 'Kids Shoes' }
  ]);

  activeAvailableSizes = computed(() => {
    const target = this.targetAudience();
    const all = this.availableSizes();
    if (target === 'Women' || target === 'Men') {
      return all.filter(s => s.targetAudience === 'Women' || s.targetAudience === 'Both').map(s => s.name);
    } else if (target === 'Kids') {
      return all.filter(s => s.targetAudience === 'Kids' || s.targetAudience === 'Both').map(s => s.name);
    } else {
      return all.map(s => s.name);
    }
  });

  getSizesForAudience(audience: string): string[] {
    const subCat = this.selectedSubCategory().toLowerCase();
    const effectiveAudience = audience === 'Men' ? 'Women' : audience;
    
    return this.availableSizes()
      .filter(s => {
        if (s.targetAudience !== effectiveAudience && s.targetAudience !== 'Both') {
          return false;
        }
        
        if (subCat === 'shoes') {
          return s.categoryType === (effectiveAudience === 'Women' ? 'Women Shoes' : 'Kids Shoes') || s.categoryType === 'Universal';
        } else if (subCat === 'fashion' || subCat === 'pajama' || subCat === 'kids boys' || subCat === 'girls' || subCat === 'unisex collection') {
          return s.categoryType === (effectiveAudience === 'Women' ? 'Women Clothing' : 'Kids Clothing') || s.categoryType === 'Universal';
        }
        
        return true;
      })
      .map(s => s.name);
  }

  getFormSizesForAudience(audience: string): string[] {
    const subCats = this.formSelectedSubCategories().map(s => s.toLowerCase());
    const isShoes = subCats.includes('shoes');
    const isApparel = subCats.some(s => s === 'fashion' || s === 'pajama' || s === 'kids boys' || s === 'girls' || s === 'unisex collection');
    const effectiveAudience = audience === 'Men' ? 'Women' : audience;

    return this.availableSizes()
      .filter(s => {
        if (s.targetAudience !== effectiveAudience && s.targetAudience !== 'Both') {
          return false;
        }

        if (isShoes) {
          return s.categoryType === (effectiveAudience === 'Women' ? 'Women Shoes' : 'Kids Shoes') || s.categoryType === 'Universal';
        } else if (isApparel) {
          return s.categoryType === (effectiveAudience === 'Women' ? 'Women Clothing' : 'Kids Clothing') || s.categoryType === 'Universal';
        }

        return true;
      })
      .map(s => s.name);
  }

  colorHexMap = computed(() => {
    const map: Record<string, string> = {};
    this.availableColors().forEach(c => {
      map[c.name.toLowerCase()] = c.hexCode;
    });
    return map;
  });

  getColorHex(color: string): string {
    return this.colorHexMap()[color.toLowerCase()] || '#CCCCCC';
  }

  isFormColorSelected(color: string): boolean {
    const val = this.formColors() || '';
    const current = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    return current.includes(color);
  }

  toggleFormColor(color: string): void {
    const val = this.formColors() || '';
    let current = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (current.includes(color)) {
      current = current.filter(c => c !== color);
    } else {
      current.push(color);
    }
    this.formColors.set(current.join(', '));
  }

  getFormAvailableSizes(): string[] {
    const mainCat = this.formMainCategory();
    const all = this.availableSizes();
    if (mainCat === 'Women' || mainCat === 'Men') {
      return all.filter(s => s.targetAudience === 'Women' || s.targetAudience === 'Both').map(s => s.name);
    } else if (mainCat === 'Kids') {
      return all.filter(s => s.targetAudience === 'Kids' || s.targetAudience === 'Both').map(s => s.name);
    } else {
      return all.map(s => s.name);
    }
  }

  isFormSizeSelected(size: string): boolean {
    const val = this.formSizes() || '';
    const current = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    return current.map(s => s.toLowerCase()).includes(size.toLowerCase());
  }

  toggleFormSize(size: string): void {
    const val = this.formSizes() || '';
    let current = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const lowerSize = size.toLowerCase();
    const index = current.findIndex(s => s.toLowerCase() === lowerSize);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(size);
    }
    this.formSizes.set(current.join(', '));
  }

  uploadFormImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && this.formImageUrls().length < 10) {
      this.mediaService.upload(file).subscribe({
        next: (res) => {
          if (res.isSuccess && res.url) {
            this.formImageUrls.update(urls => [...urls, res.url]);
            if (!this.formImageUrl()) {
              this.formImageUrl.set(res.url);
            }
          }
        }
      });
    }
  }

  removeFormImage(index: number): void {
    this.formImageUrls.update(urls => {
      const updated = urls.filter((_, i) => i !== index);
      if (updated.length > 0) {
        this.formImageUrl.set(updated[0]);
      } else {
        this.formImageUrl.set('');
      }
      return updated;
    });
  }

  activeCategoryTitle = computed(() => {
    const target = this.targetAudience();
    if (target === 'Women') return "WOMEN collection";
    if (target === 'Men') return "MEN collection";
    if (target === 'Kids') return "Kids collection";
    return "ALL COLLECTIONS";
  });

  activeCategoryBannerUrl = computed(() => {
    const target = this.targetAudience();
    if (target === 'Women') return '/products/banner_women.png';
    if (target === 'Men') return '/products/men_collection_perfect.png';
    if (target === 'Kids') return '/products/banner_kids.png';
    return '/products/banner_all.png';
  });

  activeSubCategoriesList = computed(() => {
    const target = this.targetAudience();
    const womenCats = [
      { name: 'fashion', displayName: 'Fashion', img: '/products/casual_dress_2.png', target: 'Women' },
      { name: 'pajama', displayName: 'Pajama', img: '/products/dress.png', target: 'Women' },
      { name: 'bags', displayName: 'Bags', img: '/products/handbag.png', target: 'Women' },
      { name: 'shoes', displayName: 'Shoes', img: '/products/heels.png', target: 'Women' },
      { name: 'accessors', displayName: 'Accessories', img: '/products/handbag_2.png', target: 'Women' }
    ];
    const menCats = [
      { name: 'fashion', displayName: 'Apparel', img: '/products/men_apparel_bubble.png', target: 'Men' },
      { name: 'shoes', displayName: 'Shoes', img: '/products/men_shoes_bubble.png', target: 'Men' },
      { name: 'accessors', displayName: 'Accessories', img: '/products/men_accessories_bubble.png', target: 'Men' }
    ];
    const kidsCats = [
      { name: 'kids boys', displayName: 'Boys', img: '/products/sneaker.png', target: 'Kids' },
      { name: 'girls', displayName: 'Girls', img: '/products/infant_dress.png', target: 'Kids' },
      { name: 'unisex collection', displayName: 'Unisex', img: '/products/baby_clogs.png', target: 'Kids' },
      { name: 'baby needs', displayName: 'Baby Needs', img: '/products/baby_bib.png', target: 'Kids' },
      { name: 'shoes', displayName: 'Shoes', img: '/products/sneaker.png', target: 'Kids' },
      { name: 'accessors', displayName: 'Accessories', img: '/products/diaper_bag.png', target: 'Kids' }
    ];

    if (target === 'Women') {
      return womenCats;
    } else if (target === 'Men') {
      return menCats;
    } else if (target === 'Kids') {
      return kidsCats;
    } else {
      return [
        ...womenCats.map(c => ({ ...c, displayName: 'Women ' + c.displayName })),
        ...menCats.map(c => ({ ...c, displayName: 'Men ' + c.displayName })),
        ...kidsCats.map(c => ({ ...c, displayName: 'Kids ' + c.displayName }))
      ];
    }
  });

  filteredProducts = computed(() => {
    let result = this.products();
    const target = this.targetAudience();

    // 1. Filter by Target Audience (Women's vs Kids)
    if (target !== 'All') {
      result = result.filter(p => p.mainCategory.toLowerCase() === target.toLowerCase());
    }

    // 1.5 Filter by sub-category
    const subCat = this.selectedSubCategory();
    const subCatTarget = this.selectedSubCategoryTarget();
    if (subCat !== 'All') {
      result = result.filter(p => {
        if (subCatTarget !== 'All' && p.mainCategory.toLowerCase() !== subCatTarget.toLowerCase()) {
          return false;
        }
        // Special mapping: if target is Kids and subCat is 'shoes', filter kids products that are shoes!
        if (subCatTarget.toLowerCase() === 'kids' && subCat.toLowerCase() === 'shoes') {
          if (p.categories && p.categories.length > 0) {
            if (p.categories.some(c => c.name.toLowerCase() === 'shoes')) {
              return true;
            }
          }
          const titleLower = p.title.toLowerCase();
          return titleLower.includes('sneaker') || titleLower.includes('shoe') || titleLower.includes('clog') || titleLower.includes('heel');
        }
        if (p.categories && p.categories.length > 0) {
          return p.categories.some(c => c.name.toLowerCase() === subCat.toLowerCase());
        }
        return p.subCategory && p.subCategory.toLowerCase() === subCat.toLowerCase();
      });
    }

    // 1.7 Filter by Age
    const selectedAgeGroup = this.selectedAge();
    if (selectedAgeGroup !== 'All') {
      result = result.filter(p => p.age === selectedAgeGroup);
    }

    // 2. Filter by search query
    if (this.searchQuery) {
      const term = this.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(term)) ||
        (p.categories && p.categories.some(c => c.name.toLowerCase().includes(term)))
      );
    }

    // 3. Filter by selected colors
    if (this.selectedColors.length > 0) {
      result = result.filter(p => 
        p.colors && p.colors.some(c => this.selectedColors.includes(c))
      );
    }

    // 4. Filter by selected sizes
    if (this.selectedSizes.length > 0) {
      result = result.filter(p => 
        p.sizes && p.sizes.some(s => this.selectedSizes.includes(s))
      );
    }

    // 5. If user is guest or lacks Products:Read permission, exclude invisible products
    if (!this.authService.hasPermission('Products:Read')) {
      result = result.filter(p => p.isVisible);
    }

    // 6. Filter by Brand Id
    const brandId = this.selectedBrandId();
    if (brandId) {
      result = result.filter(p => p.brandId === brandId);
    }

    return result;
  });

  // Quick Buy Signals & Computed
  quickBuyProduct = signal<ProductDto | null>(null);
  selectedColor = signal<string>('');
  selectedSize = signal<string>('');
  selectedQuantity = signal<number>(1);
  addedToCart = signal<boolean>(false);
  validationError = signal<string>('');

  // Admin Form States
  isAdminModalOpen = signal<boolean>(false);
  adminFormStep = signal<'chooser' | 'form'>('chooser');
  editingProductId = signal<string | null>(null);
  formTitle = signal<string>('');
  formDescription = signal<string>('');
  formPrice = signal<number>(0);
  formCostPrice = signal<number>(0);
  formStockQuantity = signal<number>(0);
  formMainCategory = signal<string>('Women');
  formSelectedSubCategories = signal<string[]>([]);
  formAge = signal<string>('');
  formImageUrl = signal<string>('');
  formImageUrls = signal<string[]>([]);
  formColors = signal<string>('');
  isFormColorDropdownOpen = signal<boolean>(false);
  isFormSizeDropdownOpen = signal<boolean>(false);
  activeCardColorDropdown = signal<string | null>(null);
  formSizes = signal<string>('');
  formShippingSize = signal<string>('Small');
  formIsVisible = signal<boolean>(true);
  formOverrideShipping = signal<boolean>(false);
  formIsFreeShipping = signal<boolean>(false);
  formFixedShippingPrice = signal<number | null>(null);
  formValidationError = signal<string>('');
  formSubmitting = signal<boolean>(false);
  formBrandId = signal<string>('');
  formCollectionType = signal<string>('');

  readonly subCategoryGuidMap: Record<string, string> = {
    'fashion': '11111111-1111-1111-1111-111111111111',
    'pajama': '22222222-2222-2222-2222-222222222222',
    'bags': '33333333-3333-3333-3333-333333333333',
    'shoes_Women': '44444444-4444-4444-4444-444444444444',
    'accessors_Women': '55555555-5555-5555-5555-555555555555',
    'kids boys': '66666666-6666-6666-6666-666666666666',
    'girls': '77777777-7777-7777-7777-777777777777',
    'unisex collection': '88888888-8888-8888-8888-888888888888',
    'baby needs': '99999999-9999-9999-9999-999999999999',
    'accessors_Kids': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'shoes_Kids': 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'accessors_Men': 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'shoes_Men': 'dddddddd-dddd-dddd-dddd-dddddddddddd'
  };

  getCategoryGuid(name: string, mainCategory: string): string {
    if (name === 'accessors' || name === 'shoes') {
      return this.subCategoryGuidMap[`${name}_${mainCategory}`] || '';
    }
    return this.subCategoryGuidMap[name] || '';
  }

  getFormAvailableSubCategories = computed(() => {
    const main = this.formMainCategory();
    if (main === 'Women') {
      return ['fashion', 'pajama', 'bags', 'shoes', 'accessors'];
    } else if (main === 'Men') {
      return ['fashion', 'shoes', 'accessors'];
    }
    return ['kids boys', 'girls', 'unisex collection', 'baby needs', 'shoes', 'accessors'];
  });

  colors = computed(() => {
    const p = this.quickBuyProduct();
    return p && p.colors ? p.colors : [];
  });

  sizes = computed(() => {
    const p = this.quickBuyProduct();
    return p && p.sizes ? p.sizes : [];
  });

  openQuickBuy(product: ProductDto, event: Event): void {
    event.stopPropagation();
    this.quickBuyProduct.set(product);
    if (product.colors && product.colors.length > 0) {
      this.selectedColor.set(product.colors[0]);
    } else {
      this.selectedColor.set('');
    }
    if (product.sizes && product.sizes.length > 0) {
      this.selectedSize.set(product.sizes[0]);
    } else {
      this.selectedSize.set('');
    }
    this.selectedQuantity.set(product.stockQuantity > 0 ? 1 : 0);
    this.validationError.set('');
    this.addedToCart.set(false);

    setTimeout(() => {
      const scrollableElements = document.querySelectorAll('.quick-buy-sheet, .quick-buy-sheet .overflow-y-auto');
      scrollableElements.forEach(el => el.scrollTop = 0);

      gsap.fromTo('.quick-buy-sheet', 
        { y: '40px', opacity: 0 }, 
        { y: '0px', opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }, 50);
  }

  closeQuickBuy(): void {
    gsap.to('.quick-buy-sheet', {
      y: '40px',
      opacity: 0,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => {
        this.quickBuyProduct.set(null);
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

  incrementQuantity(): void {
    const max = this.quickBuyProduct()?.stockQuantity || 0;
    if (this.selectedQuantity() < max) {
      this.selectedQuantity.update(q => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.selectedQuantity() > 1) {
      this.selectedQuantity.update(q => q - 1);
    }
  }

  confirmQuickBuy(): void {
    this.validationError.set('');
    this.addedToCart.set(false);
    const p = this.quickBuyProduct();
    if (!p || p.stockQuantity === 0) return;

    if (this.colors().length > 0 && !this.selectedColor()) {
      this.validationError.set('Please select an option for Color.');
      return;
    }
    if (this.sizes().length > 0 && !this.selectedSize()) {
      this.validationError.set('Please select an option for Size.');
      return;
    }

    this.cartService.addItem(p, this.selectedQuantity(), this.selectedSize() || undefined, this.selectedColor() || undefined);

    this.addedToCart.set(true);
    setTimeout(() => {
      this.addedToCart.set(false);
      this.closeQuickBuy();
    }, 1500);
  }

  ngOnInit(): void {
    // Fetch brands list for select dropdown
    this.catalogService.getBrands().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.brands.set(res.data);
        }
      }
    });

    // Fetch dynamic colors and sizes from DB
    this.catalogService.getColors().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.availableColors.set(res.data);
        }
      }
    });

    this.catalogService.getSizes().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.availableSizes.set(res.data);
        }
      }
    });

    // React to query parameter changes
    this.route.queryParams.subscribe(params => {
      const target = params['target'] || 'All';
      this.targetAudience.set(target);
      
      const subCat = params['subcategory'] || 'All';
      this.selectedSubCategory.set(subCat);
      this.selectedSubCategoryTarget.set(subCat === 'All' ? 'All' : target);

      if (target === 'Women' || target === 'Men') {
        this.selectedAge.set('All');
      }

      const brandParam = params['brand'] || null;
      this.selectedBrandId.set(brandParam);

      this.loadProducts();

      // Trigger GSAP entry animation from the left smoothly
      setTimeout(() => {
        gsap.fromTo('.editorial-banner-subtitle', 
          { x: -50, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }
        );
        gsap.fromTo('.editorial-banner-title', 
          { x: -70, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.1 }
        );
        gsap.fromTo('.editorial-banner-line', 
          { x: -40, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.2 }
        );
      }, 50);
    });
  }

  activeConsoleTag = signal<string>('All');
  currentPage = signal<number>(1);
  pageSize = 20;
  loadingMore = signal<boolean>(false);
  totalPages = signal<number>(1);
  totalProducts = signal<number>(0);

  setCollectionTag(tag: string): void {
    this.activeConsoleTag.set(tag);
    this.currentPage.set(1);
    this.loadProducts(false);
  }

  loadProducts(append: boolean = false): void {
    if (!append) {
      this.currentPage.set(1);
      this.loading.set(true);
    }
    const tag = this.activeConsoleTag();
    const collectionType = tag === 'All' ? undefined : tag;
    const brandId = this.selectedBrandId() || undefined;
    
    this.catalogService.getProducts({ 
      collectionType, 
      page: this.currentPage(), 
      pageSize: this.pageSize, 
      brandId 
    }).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data && res.data.items) {
          const items = res.data.items.map(p => {
            // Seeding alternative images in database used duplicate URLs.
            // Map actual distinct images to demonstrate the automatic hover slideshow.
            if (p.imageUrls && p.imageUrls.length > 0) {
              p.imageUrls = p.imageUrls.map((img, idx) => {
                if (idx === 0) return img;
                let newUrl = img.url;
                if (p.title.includes('Handbag') || p.title.includes('Bag')) {
                  newUrl = '/products/handbag_2.png';
                } else if (p.title.includes('Dress') || p.title.includes('Slip') || p.title.includes('Gown')) {
                  newUrl = '/products/casual_dress_2.png';
                } else if (p.title.includes('Heels')) {
                  newUrl = '/products/handbag.png';
                } else if (p.title.includes('Sneakers')) {
                  newUrl = '/products/baby_clogs.png';
                }
                return { ...img, url: newUrl };
              });
            }
            return p;
          });

          if (append) {
            this.products.set([...this.products(), ...items]);
          } else {
            this.products.set(items);
          }

          if (res.data.metadata) {
            this.totalPages.set(res.data.metadata.totalPages);
            this.totalProducts.set(res.data.metadata.totalCount);
          }
        }
        this.loading.set(false);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadingMore.set(false);
      }
    });
  }

  loadMore(): void {
    if (this.loadingMore() || this.currentPage() >= this.totalPages()) return;
    this.loadingMore.set(true);
    this.currentPage.update(p => p + 1);
    this.loadProducts(true);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Small delay to ensure the sentinel is in the DOM
    setTimeout(() => this.setupInfiniteScroll(), 300);
  }

  setupInfiniteScroll(): void {
    if (!this.scrollAnchorRef?.nativeElement) return;
    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.loadMore();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );
    this.scrollObserver.observe(this.scrollAnchorRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.scrollObserver?.disconnect();
  }

  onSearchChange(): void {
    // Computed signals handle filtering reactively
  }

  toggleColor(color: string): void {
    const idx = this.selectedColors.indexOf(color);
    if (idx > -1) {
      this.selectedColors.splice(idx, 1);
    } else {
      this.selectedColors.push(color);
    }
    this.products.set([...this.products()]); // Trigger computation update
  }

  toggleSize(size: string): void {
    const idx = this.selectedSizes.indexOf(size);
    if (idx > -1) {
      this.selectedSizes.splice(idx, 1);
    } else {
      this.selectedSizes.push(size);
    }
    this.products.set([...this.products()]); // Trigger computation update
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedColors = [];
    this.selectedSizes = [];
    this.selectedSubCategory.set('All');
    this.selectedSubCategoryTarget.set('All');
    this.selectedAge.set('All');
    this.products.set([...this.products()]); // Trigger computation update
  }

  toggleSubCategory(cat: { name: string, target: string }): void {
    if (this.selectedSubCategory() === cat.name && this.selectedSubCategoryTarget() === cat.target) {
      this.selectedSubCategory.set('All');
      this.selectedSubCategoryTarget.set('All');
    } else {
      this.selectedSubCategory.set(cat.name);
      this.selectedSubCategoryTarget.set(cat.target);
    }
    this.products.set([...this.products()]); // Trigger computation update
  }

  setAgeFilter(age: string): void {
    this.selectedAge.set(age);
    this.products.set([...this.products()]); // Trigger computation update
  }

  getProductCategoriesList(product: ProductDto): string {
    if (product.categories && product.categories.length > 0) {
      return product.categories.map(c => c.name).join(', ');
    }
    return product.subCategory || '';
  }

  hasManageProductsPermission(): boolean {
    return this.authService.hasPermission('Products:Read') || 
           this.authService.hasPermission('Products:Create') || 
           this.authService.hasPermission('Products:Update') || 
           this.authService.hasPermission('Products:Delete');
  }

  toggleVisibility(id: string): void {
    this.catalogService.toggleProductVisibility(id).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          // Update the localized visibility status in the signal list
          const updatedList = this.products().map(p => {
            if (p.id === id) {
              return { ...p, isVisible: res.data.isVisible };
            }
            return p;
          });
          this.products.set(updatedList);
        }
      }
    });
  }

  toggleFormSubCategory(cat: string): void {
    const current = this.formSelectedSubCategories();
    if (current.includes(cat)) {
      this.formSelectedSubCategories.set(current.filter(c => c !== cat));
    } else {
      this.formSelectedSubCategories.set([...current, cat]);
    }
  }

  selectCategoryAndProceed(category: string): void {
    this.formMainCategory.set(category);
    this.formSelectedSubCategories.set([]);
    this.adminFormStep.set('form');

    setTimeout(() => {
      const scrollableElements = document.querySelectorAll('.admin-product-sheet, .admin-product-sheet .overflow-y-auto');
      scrollableElements.forEach(el => el.scrollTop = 0);

      gsap.fromTo('.admin-product-sheet', 
        { x: '40px', opacity: 0 }, 
        { x: '0px', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }, 50);
  }

  openAdminProductModal(product: ProductDto | null, event: Event): void {
    event.stopPropagation();
    this.formValidationError.set('');
    
    if (product) {
      // Editing: skip chooser, go straight to form
      this.adminFormStep.set('form');
      this.editingProductId.set(product.id);
      this.formTitle.set(product.title);
      this.formDescription.set(product.description);
      this.formPrice.set(product.price);
      this.formCostPrice.set(product.costPrice || Math.round(product.price * 0.6));
      this.formStockQuantity.set(product.stockQuantity);
      this.formMainCategory.set(product.mainCategory);
      
      const subCats = product.categories ? product.categories.map(c => c.name) : [product.subCategory];
      this.formSelectedSubCategories.set(subCats);
      this.formAge.set(product.age || '');
      this.formImageUrl.set(product.imageUrl || '');
      this.formImageUrls.set(product.imageUrls ? product.imageUrls.map(i => i.url) : []);
      this.formColors.set(product.colors ? product.colors.join(', ') : '');
      this.formSizes.set(product.sizes ? product.sizes.join(', ') : '');
      this.formShippingSize.set(product.shippingSize || 'Small');
      this.formIsVisible.set(product.isVisible);
      this.formOverrideShipping.set(product.overrideStandardShipping || false);
      this.formIsFreeShipping.set(product.isFreeShipping || false);
      this.formFixedShippingPrice.set(product.fixedShippingPrice || null);
      this.formBrandId.set(product.brandId || '');
      this.formCollectionType.set(product.collectionType || '');
    } else {
      // New product: show chooser step first
      this.adminFormStep.set('chooser');
      this.editingProductId.set(null);
      this.formTitle.set('');
      this.formDescription.set('');
      this.formPrice.set(0);
      this.formCostPrice.set(0);
      this.formStockQuantity.set(0);
      this.formMainCategory.set('Women');
      this.formSelectedSubCategories.set([]);
      this.formAge.set('');
      this.formImageUrl.set('');
      this.formImageUrls.set([]);
      this.formColors.set('');
      this.formSizes.set('');
      this.formShippingSize.set('Small');
      this.formIsVisible.set(true);
      this.formOverrideShipping.set(false);
      this.formIsFreeShipping.set(false);
      this.formFixedShippingPrice.set(null);
      this.formBrandId.set('');
      this.formCollectionType.set('');
    }

    this.isFormColorDropdownOpen.set(false);
    this.isFormSizeDropdownOpen.set(false);
    this.isAdminModalOpen.set(true);

    setTimeout(() => {
      const targetSheet = product ? '.admin-product-sheet' : '.admin-chooser-sheet';
      const scrollableElements = document.querySelectorAll(targetSheet + ', ' + targetSheet + ' .overflow-y-auto');
      scrollableElements.forEach(el => el.scrollTop = 0);

      gsap.fromTo(targetSheet, 
        { y: '40px', opacity: 0 }, 
        { y: '0px', opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }, 50);
  }

  closeAdminProductModal(): void {
    gsap.to('.admin-product-sheet', {
      y: '40px',
      opacity: 0,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => {
        this.isAdminModalOpen.set(false);
      }
    });
  }



  submitAdminProductForm(): void {
    this.formValidationError.set('');
    
    if (!this.formTitle().trim()) {
      this.formValidationError.set('Title is required.');
      return;
    }
    if (!this.formDescription().trim()) {
      this.formValidationError.set('Description is required.');
      return;
    }
    if (this.formPrice() <= 0) {
      this.formValidationError.set('Price must be greater than 0.');
      return;
    }
    if (this.formSelectedSubCategories().length === 0) {
      this.formValidationError.set('Select at least one subcategory.');
      return;
    }

    const mainCat = this.formMainCategory();
    const colorsArr = this.formColors() ? this.formColors().split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    const sizesArr = this.formSizes() ? this.formSizes().split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    const editId = this.editingProductId();
    const ageVal = mainCat === 'Women' ? null : (this.formAge() || null);
    const finalUrls = this.formImageUrls().length > 0 ? this.formImageUrls() : (this.formImageUrl() ? [this.formImageUrl()] : []);

    this.formSubmitting.set(true);

    if (editId) {
      const categoryIds = this.formSelectedSubCategories().map(cat => this.getCategoryGuid(cat, mainCat)).filter(id => id.length > 0);
      const primaryCategoryGuid = categoryIds.length > 0 ? categoryIds[0] : '11111111-1111-1111-1111-111111111111';
      
      const updateData = {
        title: this.formTitle(),
        description: this.formDescription(),
        price: this.formPrice(),
        costPrice: this.formCostPrice(),
        stockQuantity: this.formStockQuantity(),
        isVisible: this.formIsVisible(),
        categoryId: primaryCategoryGuid,
        shippingSize: this.formShippingSize(),
        imageUrl: finalUrls.length > 0 ? finalUrls[0] : '',
        imageUrls: finalUrls.map((url, idx) => ({
          id: '00000000-0000-0000-0000-000000000000',
          url: url,
          sortOrder: idx,
          altText: this.formTitle()
        })),
        age: ageVal,
        categoryIds: categoryIds,
        colors: colorsArr,
        sizes: sizesArr,
        overrideStandardShipping: this.formOverrideShipping(),
        isFreeShipping: this.formIsFreeShipping(),
        fixedShippingPrice: this.formFixedShippingPrice(),
        brandId: this.formBrandId() || null,
        collectionType: this.formCollectionType() || null
      };
  
      this.catalogService.updateProduct(editId, updateData).subscribe({
        next: (res) => {
          this.formSubmitting.set(false);
          if (res.isSuccess) {
            this.loadProducts();
            this.closeAdminProductModal();
          } else {
            this.formValidationError.set(res.message || 'Failed to update product.');
          }
        },
        error: (err) => {
          this.formSubmitting.set(false);
          this.formValidationError.set(err.error?.message || 'Error occurred during update.');
        }
      });
    } else {
      const primarySubCategory = this.formSelectedSubCategories()[0];
      const createData = {
        title: this.formTitle(),
        description: this.formDescription(),
        price: this.formPrice(),
        costPrice: this.formCostPrice(),
        stockQuantity: this.formStockQuantity(),
        mainCategory: mainCat,
        subCategory: primarySubCategory,
        colors: colorsArr,
        sizes: sizesArr,
        shippingSize: this.formShippingSize(),
        isVisible: this.formIsVisible(),
        imageUrl: finalUrls.length > 0 ? finalUrls[0] : '',
        imageUrls: finalUrls,
        age: ageVal,
        subCategories: this.formSelectedSubCategories(),
        overrideStandardShipping: this.formOverrideShipping(),
        isFreeShipping: this.formIsFreeShipping(),
        fixedShippingPrice: this.formFixedShippingPrice(),
        brandId: this.formBrandId() || null,
        collectionType: this.formCollectionType() || null
      };
 
      this.catalogService.bulkAddProducts([createData]).subscribe({
        next: (res) => {
          this.formSubmitting.set(false);
          if (res.isSuccess) {
            this.loadProducts();
            this.closeAdminProductModal();
          } else {
            this.formValidationError.set(res.message || 'Failed to create product.');
          }
        },
        error: (err) => {
          this.formSubmitting.set(false);
          this.formValidationError.set(err.error?.message || 'Error occurred during creation.');
        }
      });
    }
  }

  // Hover slideshow logic for product images
  hoveredProduct = signal<ProductDto | null>(null);
  hoveredImageIndex = signal<number>(0);
  private hoverInterval: any = null;

  onProductMouseEnter(product: ProductDto): void {
    const imagesCount = product.imageUrls ? product.imageUrls.length : 0;
    if (imagesCount <= 1) return;

    this.clearHoverInterval();
    this.hoveredProduct.set(product);
    this.hoveredImageIndex.set(0);

    // Automatically cycle through images every 1.25s (1250ms)
    this.hoverInterval = setInterval(() => {
      this.hoveredImageIndex.update(idx => (idx + 1) % imagesCount);
    }, 1250);
  }

  onProductMouseLeave(product: ProductDto): void {
    const active = this.hoveredProduct();
    if (active && active.id === product.id) {
      this.clearHoverInterval();
      this.hoveredProduct.set(null);
      this.hoveredImageIndex.set(0);
    }
  }

  private clearHoverInterval(): void {
    if (this.hoverInterval) {
      clearInterval(this.hoverInterval);
      this.hoverInterval = null;
    }
  }

  getProductDisplayImage(product: ProductDto): string {
    const activeHovered = this.hoveredProduct();
    let url = '';
    if (activeHovered && activeHovered.id === product.id && product.imageUrls && product.imageUrls.length > 0) {
      url = product.imageUrls[this.hoveredImageIndex()].url;
    } else {
      url = product.imageUrl || '';
    }
    return this.resolveImageUrl(url);
  }

  favorites = signal<Set<string>>(new Set());

  toggleWishlist(productId: string, event: Event): void {
    event.stopPropagation();
    this.favorites.update(fav => {
      const newFav = new Set(fav);
      if (newFav.has(productId)) {
        newFav.delete(productId);
      } else {
        newFav.add(productId);
      }
      return newFav;
    });
  }

  isFavorited(productId: string): boolean {
    return this.favorites().has(productId);
  }

  triggerCompare(productId: string, event: Event): void {
    event.stopPropagation();
    console.log('Triggered compare for product:', productId);
  }
}
