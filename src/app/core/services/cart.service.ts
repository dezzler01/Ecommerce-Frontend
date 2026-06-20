import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSignal = signal<CartItem[]>([]);

  // Expose cart items as a read-only signal
  cartItems = this.itemsSignal.asReadonly();

  // Total count of items in the cart
  cartCount = computed(() => {
    return this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0);
  });

  // Subtotal price of items in the cart
  subtotal = computed(() => {
    return this.itemsSignal().reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  });

  constructor() {
    this.loadCart();
  }

  loadCart(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('cart_items');
      if (stored) {
        try {
          const items = JSON.parse(stored) as CartItem[];
          this.itemsSignal.set(items);
        } catch {
          this.itemsSignal.set([]);
        }
      }
    }
  }

  saveCart(items: CartItem[]): void {
    this.itemsSignal.set(items);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('cart_items', JSON.stringify(items));
    }
  }

  addItem(itemOrProduct: CartItem | any, quantity?: number, size?: string, color?: string): void {
    let item: CartItem;
    if (quantity !== undefined) {
      const p = itemOrProduct;
      item = {
        productId: p.id || p.productId,
        productName: p.title || p.productName,
        unitPrice: p.price || p.unitPrice,
        quantity: quantity,
        imageUrl: p.imageUrl || undefined,
        size: size || undefined,
        color: color || undefined
      };
    } else {
      item = itemOrProduct;
    }

    const items = [...this.itemsSignal()];
    const existing = items.find(i => 
      i.productId === item.productId && 
      i.size === item.size && 
      i.color === item.color
    );
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
    }
    this.saveCart(items);
  }

  removeItem(index: number): void {
    const items = [...this.itemsSignal()];
    items.splice(index, 1);
    this.saveCart(items);
  }

  changeQty(index: number, change: number): void {
    const items = [...this.itemsSignal()];
    const item = items[index];
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        items.splice(index, 1);
      }
      this.saveCart(items);
    }
  }

  clearCart(): void {
    this.saveCart([]);
  }
}
