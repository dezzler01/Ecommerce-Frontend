import { Injectable, signal } from '@angular/core';
import { ProductDto } from './catalog.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistCompareService {
  // Favorites/Wishlist state
  favorites = signal<ProductDto[]>([]);
  
  // Compare List state (max 2 items)
  compareList = signal<ProductDto[]>([]);

  constructor() {
    this.loadFavoritesFromStorage();
  }

  // Favorites logic
  private loadFavoritesFromStorage(): void {
    try {
      const data = localStorage.getItem('wishlist_items');
      if (data) {
        this.favorites.set(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to parse wishlist from storage', e);
    }
  }

  private saveFavoritesToStorage(): void {
    try {
      localStorage.setItem('wishlist_items', JSON.stringify(this.favorites()));
    } catch (e) {
      console.error('Failed to save wishlist to storage', e);
    }
  }

  toggleFavorite(product: ProductDto): void {
    const list = this.favorites();
    const index = list.findIndex(p => p.id === product.id);
    if (index >= 0) {
      // Remove
      this.favorites.set(list.filter(p => p.id !== product.id));
    } else {
      // Add
      this.favorites.set([...list, product]);
    }
    this.saveFavoritesToStorage();
  }

  isFavorite(productId: string): boolean {
    return this.favorites().some(p => p.id === productId);
  }

  // Compare logic
  addToCompare(product: ProductDto): void {
    const list = this.compareList();
    const exists = list.some(p => p.id === product.id);
    if (exists) return;

    if (list.length >= 2) {
      // Replace the second item
      this.compareList.set([list[0], product]);
    } else {
      this.compareList.set([...list, product]);
    }
  }

  removeFromCompare(productId: string): void {
    this.compareList.set(this.compareList().filter(p => p.id !== productId));
  }

  isInCompare(productId: string): boolean {
    return this.compareList().some(p => p.id === productId);
  }

  clearCompare(): void {
    this.compareList.set([]);
  }
}
