import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService, GuestCheckoutContext } from '../../services/auth.service';
import { CartService, CartItem } from '../../core/services/cart.service';
import { resolveImageUrl } from '../../core/utils/image-resolver';

@Component({
  selector: 'app-checkout-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-transparent pt-28 pb-20 px-6 md:px-12 lg:px-24 text-left animate-fade-in">
      <div class="max-w-4xl mx-auto w-full">
        <!-- Header -->
        <div class="mb-10">
          <span class="tracking-widest font-mono text-[10px] uppercase font-semibold text-[#E07A5F] block mb-2">Fulfillment Console</span>
          <h2 class="text-3xl font-extralight text-[#2A2522] tracking-[0.05em] uppercase">Shopping Bag &amp; Checkout</h2>
        </div>

        <div *ngIf="orderPlaced()" class="bg-white/80 border border-emerald-200 p-8 rounded-2xl text-center space-y-6">
          <div class="h-16 w-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
          <h3 class="text-xl uppercase tracking-wider text-[#2A2522]">Order Submitted Successfully!</h3>
          <p class="text-xs text-[#8A817C] max-w-md mx-auto leading-relaxed">
            Your order has been recorded. Reference Number: <strong class="text-[#2A2522]">{{ lastOrderNumber() }}</strong>.<br/>
            Order ID: <span class="font-mono text-[10px] text-[#8A817C] bg-[#2A2522]/5 px-2 py-1 rounded select-all">{{ orderId() }}</span>.<br/><br/>
            If you chose digital payment, a logistics agent will verify your transaction shortly.
          </p>
          <button [routerLink]="['/products']" class="px-6 py-2.5 bg-[#2A2522] hover:bg-[#E07A5F] text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all">
            Continue Shopping
          </button>
        </div>

        <div *ngIf="!orderPlaced()" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Cart Items Summary (7 cols) -->
          <div class="lg:col-span-7 space-y-6">
            <div class="bg-white/50 backdrop-blur-md border border-[#2A2522]/5 p-6 rounded-2xl">
              <h3 class="text-xs font-mono uppercase tracking-widest font-bold text-[#2A2522] border-b border-[#2A2522]/5 pb-3 mb-4">Cart Items</h3>
              
              <div *ngIf="cartItems().length === 0" class="text-center py-12">
                <p class="text-xs text-[#8A817C] font-light">Your shopping bag is empty.</p>
                <button (click)="seedCart()" class="mt-4 text-[10px] uppercase font-bold tracking-widest text-[#E07A5F] hover:underline">
                  Seed Test Items
                </button>
              </div>

              <div *ngIf="cartItems().length > 0" class="space-y-4">
                <div *ngFor="let item of cartItems(); let idx = index" class="flex items-center gap-4 pb-4 border-b border-[#2A2522]/5 last:border-b-0 last:pb-0">
                  <div class="w-16 h-16 rounded-lg bg-[#2A2522]/5 overflow-hidden flex-shrink-0">
                    <img *ngIf="item.imageUrl" [src]="resolveImageUrl(item.imageUrl)" [alt]="item.productName" class="w-full h-full object-cover"/>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-light text-[#2A2522] uppercase tracking-wide truncate">{{ item.productName }}</h4>
                    <div class="flex gap-2 text-[9px] uppercase tracking-widest text-[#8A817C] font-mono mt-0.5" *ngIf="item.size || item.color">
                      <span *ngIf="item.size">Size: {{ item.size }}</span>
                      <span *ngIf="item.color">Color: {{ item.color }}</span>
                    </div>
                    <span class="text-xs font-mono text-[#8A817C] font-medium">{{ item.unitPrice | currency:'EGP ' }}</span>
                  </div>
                  <!-- Quantity Control -->
                  <div class="flex items-center gap-2">
                    <button (click)="changeQty(idx, -1)" class="w-6 h-6 rounded-lg border border-[#2A2522]/10 flex items-center justify-center text-xs hover:bg-[#2A2522]/5">-</button>
                    <span class="text-xs font-mono w-4 text-center">{{ item.quantity }}</span>
                    <button (click)="changeQty(idx, 1)" class="w-6 h-6 rounded-lg border border-[#2A2522]/10 flex items-center justify-center text-xs hover:bg-[#2A2522]/5">+</button>
                  </div>
                  <!-- Delete -->
                  <button (click)="removeItem(idx)" class="text-[#8A817C] hover:text-red-600 transition-colors p-1" aria-label="Remove item">
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- Financial Summary -->
            <div *ngIf="cartItems().length > 0" class="bg-white/30 border border-[#2A2522]/5 p-6 rounded-2xl space-y-3">
              <div class="flex justify-between text-xs text-[#8A817C]">
                <span>Items Subtotal</span>
                <span class="font-mono">{{ subtotal() | currency:'EGP ' }}</span>
              </div>
              <div class="flex justify-between text-xs text-[#8A817C]">
              <!-- Financial Summary -->
            <div *ngIf="cartItems().length > 0" class="bg-white/30 border border-[#2A2522]/5 p-6 rounded-2xl space-y-3">
              <div class="flex justify-between text-xs text-[#8A817C]">
                <span>Items Subtotal</span>
                <span class="font-mono">{{ subtotal() | currency:'EGP ' }}</span>
              </div>
              <div *ngIf="discountAmount() > 0" class="flex justify-between text-xs text-emerald-600 font-semibold">
                <span>Promo Discount</span>
                <span class="font-mono">-{{ discountAmount() | currency:'EGP ' }}</span>
              </div>
              <div class="flex justify-between text-xs text-[#8A817C] items-center">
                <span>Estimated Shipping</span>
                <div class="flex items-center gap-1.5 font-mono">
                  <span *ngIf="isFreeShippingActive() && subtotal() >= freeShippingThreshold()" class="bg-[#E07A5F]/15 text-[#E07A5F] px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase">FREE OVER {{ freeShippingThreshold() }} EGP</span>
                  <span *ngIf="(!isFreeShippingActive() || subtotal() < freeShippingThreshold()) && shippingCost() === 0" class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase">FREE SHIPPING PROMO</span>
                  <span>{{ shippingCost() === 0 ? 'FREE' : (shippingCost() | currency:'EGP ') }}</span>
                </div>
              </div>
              <div class="flex justify-between text-xs font-bold text-[#2A2522] pt-2 border-t border-[#2A2522]/5">
                <span>Total Due</span>
                <span class="font-mono text-sm">{{ totalDue() | currency:'EGP ' }}</span>
              </div>
            </div>
          </div>

          <!-- Checkout Form (5 cols) -->
          <div *ngIf="cartItems().length > 0" class="lg:col-span-5">
            <div class="bg-white/50 backdrop-blur-md border border-[#2A2522]/5 p-6 rounded-2xl space-y-5">
              <h3 class="text-xs font-mono uppercase tracking-widest font-bold text-[#2A2522] border-b border-[#2A2522]/5 pb-3">Checkout Form</h3>
              
              <div *ngIf="errorMessage()" class="p-3 bg-red-50 border border-red-200 text-[11px] text-red-800 rounded-lg">
                {{ errorMessage() }}
              </div>

              <form (submit)="onSubmit($event)" class="space-y-4">
                <!-- Customer Name -->
                <div class="space-y-1">
                  <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">FullName</label>
                  <input type="text" [(ngModel)]="form.customerName" name="customerName" required placeholder="E.g. Yasmin Ali" class="w-full px-3 py-2 bg-[#FBF9F6] border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none"/>
                </div>

                <!-- Phone 1 -->
                <div class="space-y-1">
                  <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Primary Phone</label>
                  <input type="text" [(ngModel)]="form.primaryPhone" name="primaryPhone" required placeholder="01xxxxxxxxx" class="w-full px-3 py-2 bg-[#FBF9F6] border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none"/>
                </div>

                <!-- Phone 2 -->
                <div class="space-y-1">
                  <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Secondary Phone (Optional)</label>
                  <input type="text" [(ngModel)]="form.secondaryPhone" name="secondaryPhone" placeholder="01xxxxxxxxx" class="w-full px-3 py-2 bg-[#FBF9F6] border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none"/>
                </div>

                <!-- Governorate -->
                <div class="space-y-1">
                  <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Governorate</label>
                  <select [(ngModel)]="form.governorate" name="governorate" required class="w-full px-3 py-2 bg-[#FBF9F6] border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none">
                    <option value="" disabled>Select Governorate</option>
                    <option value="Cairo">Cairo</option>
                    <option value="Giza">Giza</option>
                    <option value="Alexandria">Alexandria</option>
                    <option value="Qalyubia">Qalyubia</option>
                    <option value="Sharqia">Sharqia</option>
                    <option value="Gharbia">Gharbia</option>
                    <option value="Dakahlia">Dakahlia</option>
                    <option value="Beheira">Beheira</option>
                    <option value="Menofia">Menofia</option>
                    <option value="Kafr El Sheikh">Kafr El Sheikh</option>
                    <option value="Damietta">Damietta</option>
                    <option value="Port Said">Port Said</option>
                    <option value="Ismailia">Ismailia</option>
                    <option value="Suez">Suez</option>
                    <option value="Fayoum">Fayoum</option>
                    <option value="Beni Suef">Beni Suef</option>
                    <option value="Minya">Minya</option>
                    <option value="Assiut">Assiut</option>
                    <option value="Sohag">Sohag</option>
                    <option value="Qena">Qena</option>
                    <option value="Luxor">Luxor</option>
                    <option value="Aswan">Aswan</option>
                    <option value="Red Sea">Red Sea</option>
                    <option value="New Valley">New Valley</option>
                    <option value="Matrouh">Matrouh</option>
                    <option value="North Sinai">North Sinai</option>
                    <option value="South Sinai">South Sinai</option>
                  </select>
                </div>

                <!-- Address -->
                <div class="space-y-1">
                  <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Detailed Address</label>
                  <textarea [(ngModel)]="form.detailedAddress" name="detailedAddress" required rows="2" placeholder="Street name, building, apartment..." class="w-full px-3 py-2 bg-[#FBF9F6] border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none"></textarea>
                </div>

                <!-- Promo Code -->
                <div class="space-y-1">
                  <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Promo Code</label>
                  <div class="flex gap-2">
                    <input 
                      type="text" 
                      [(ngModel)]="form.promoCode" 
                      name="promoCode" 
                      [disabled]="appliedPromo() !== null"
                      placeholder="E.g. SAVE10" 
                      class="flex-1 px-3 py-2 bg-[#FBF9F6] border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none uppercase"
                    />
                    <button 
                      type="button" 
                      *ngIf="appliedPromo() === null"
                      (click)="applyPromo()"
                      [disabled]="validatingPromo() || !form.promoCode"
                      class="px-4 py-2 bg-[#2A2522] hover:bg-[#E07A5F] text-[#FBF9F6] text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                    >
                      {{ validatingPromo() ? 'Validating...' : 'Apply' }}
                    </button>
                    <button 
                      type="button" 
                      *ngIf="appliedPromo() !== null"
                      (click)="removePromo()"
                      class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                      Remove
                    </button>
                  </div>
                  <!-- Promo status message -->
                  <span *ngIf="promoMessage()" class="text-[9px] font-semibold block mt-1" [ngClass]="promoError() ? 'text-red-600' : 'text-emerald-600'">
                    {{ promoMessage() }}
                  </span>
                </div>

                <!-- Payment Method -->
                <div class="space-y-1.5 pt-2">
                  <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C] block">Payment Method</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button 
                      type="button" 
                      (click)="form.paymentMethod = 'COD'"
                      [ngClass]="{
                        'bg-[#2A2522] text-[#FBF9F6]': form.paymentMethod === 'COD',
                        'bg-[#FBF9F6] text-[#4A4340] border border-[#2A2522]/5': form.paymentMethod !== 'COD'
                      }"
                      class="py-2 text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                      COD
                    </button>
                    <button 
                      type="button" 
                      (click)="form.paymentMethod = 'InstaPay'"
                      [ngClass]="{
                        'bg-[#2A2522] text-[#FBF9F6]': form.paymentMethod === 'InstaPay',
                        'bg-[#FBF9F6] text-[#4A4340] border border-[#2A2522]/5': form.paymentMethod !== 'InstaPay'
                      }"
                      class="py-2 text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                      InstaPay
                    </button>
                    <button 
                      type="button" 
                      (click)="form.paymentMethod = 'VodafoneCash'"
                      [ngClass]="{
                        'bg-[#2A2522] text-[#FBF9F6]': form.paymentMethod === 'VodafoneCash',
                        'bg-[#FBF9F6] text-[#4A4340] border border-[#2A2522]/5': form.paymentMethod !== 'VodafoneCash'
                      }"
                      class="py-2 text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                      Vodafone Cash
                    </button>
                  </div>
                </div>

                <!-- Digital Wallet Verification Fields -->
                <div *ngIf="form.paymentMethod === 'DigitalWallet' || form.paymentMethod === 'InstaPay' || form.paymentMethod === 'VodafoneCash'" class="p-4 bg-[#E07A5F]/5 border border-[#E07A5F]/10 rounded-xl space-y-3">
                  <span class="text-[8px] uppercase tracking-widest font-black text-[#E07A5F] block">Verification Portal</span>
                  <p class="text-[10px] text-[#8A817C] leading-normal font-light">
                    <span *ngIf="form.paymentMethod === 'InstaPay'">
                      Please transfer the total amount to InstaPay address <strong>{{ paymentSettings().instaPayAddress }}</strong><span *ngIf="paymentSettings().instaPayPhone"> or mobile number <strong>{{ paymentSettings().instaPayPhone }}</strong></span>, then attach details below:
                    </span>
                    <span *ngIf="form.paymentMethod === 'VodafoneCash'">
                      Please transfer the total amount to Vodafone Cash number <strong>{{ paymentSettings().vodafoneCashNumber }}</strong>, then attach details below:
                    </span>
                    <span *ngIf="form.paymentMethod === 'DigitalWallet'">
                      Please transfer the total amount to InstaPay address <strong>{{ paymentSettings().instaPayAddress }}</strong><span *ngIf="paymentSettings().instaPayPhone"> / mobile <strong>{{ paymentSettings().instaPayPhone }}</strong></span> or Vodafone Cash number <strong>{{ paymentSettings().vodafoneCashNumber }}</strong>, then attach details below:
                    </span>
                  </p>
                  
                  <div class="space-y-1">
                    <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Transfer Screenshot URL</label>
                    <input type="text" [(ngModel)]="form.walletScreenshotUrl" name="walletScreenshotUrl" required placeholder="https://imagehost.com/receipt.jpg" class="w-full px-3 py-2 bg-[#FBF9F6] border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none"/>
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Sender Phone / Account Name</label>
                    <input type="text" [(ngModel)]="form.walletSenderPhoneNumberOrName" name="walletSenderPhoneNumberOrName" required placeholder="01xxxxxxxxx or Name" class="w-full px-3 py-2 bg-[#FBF9F6] border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none"/>
                  </div>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  [disabled]="submitting()"
                  class="w-full py-3 bg-[#E07A5F] hover:bg-[#2A2522] text-[#FBF9F6] text-xs font-bold uppercase tracking-[0.2em] rounded-xl shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  <span *ngIf="submitting()" class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                  {{ submitting() ? 'Submitting Order...' : 'Place Order' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutCartComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);
  resolveImageUrl = resolveImageUrl;

  // Cart Data Signals pointing directly to the unified CartService
  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;

  // Checkout Form
  form = {
    customerName: '',
    primaryPhone: '',
    secondaryPhone: '',
    detailedAddress: '',
    governorate: '',
    paymentMethod: 'COD', // Default payment method
    walletScreenshotUrl: '',
    walletSenderPhoneNumberOrName: '',
    promoCode: ''
  };

  // State
  submitting = signal<boolean>(false);
  orderPlaced = signal<boolean>(false);
  lastOrderNumber = signal<string>('');
  orderId = signal<string>('');
  errorMessage = signal<string>('');

  // Promo Code State
  appliedPromo = signal<any | null>(null);
  validatingPromo = signal<boolean>(false);
  promoError = signal<boolean>(false);
  promoMessage = signal<string>('');

  // Dynamic free shipping threshold from admin configurations
  freeShippingThreshold = signal<number>(2000);
  isFreeShippingActive = signal<boolean>(true);

  // Dynamic payment settings config
  paymentSettings = signal<{ instaPayAddress: string; instaPayPhone?: string; vodafoneCashNumber: string }>({
    instaPayAddress: 'picksandmore@instapay',
    instaPayPhone: '',
    vodafoneCashNumber: '01001234567'
  });

  // Computed financial figures
  shippingCost = computed(() => {
    const threshold = this.freeShippingThreshold();
    const isActive = this.isFreeShippingActive();
    const isFree = (isActive && this.subtotal() >= threshold) || (this.appliedPromo() && this.appliedPromo().isFreeShipping);
    return isFree ? 0 : 50;
  });

  discountAmount = computed(() => {
    return this.appliedPromo() ? this.appliedPromo().discountAmount : 0;
  });

  totalDue = computed(() => {
    const total = this.subtotal() - this.discountAmount() + this.shippingCost();
    return Math.max(0, total);
  });

  ngOnInit(): void {
    this.populateFormFromContext();
    this.loadShippingSettings();
    this.loadPaymentSettings();
  }

  loadPaymentSettings(): void {
    this.http.get<any>('http://localhost:5153/api/Admin/payment-settings').subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.paymentSettings.set({
            instaPayAddress: res.data.instaPayAddress,
            instaPayPhone: res.data.instaPayPhone || '',
            vodafoneCashNumber: res.data.vodafoneCashNumber
          });
        }
      },
      error: () => {
        // Fallback to default signal settings
      }
    });
  }

  loadShippingSettings(): void {
    this.http.get<any>('http://localhost:5153/api/Admin/shipping-settings').subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.freeShippingThreshold.set(res.data.freeShippingThreshold);
          this.isFreeShippingActive.set(res.data.isFreeShippingActive);
        }
      },
      error: () => {
        // Fallback to initial signal values
      }
    });
  }

  applyPromo(): void {
    if (!this.form.promoCode) return;
    this.validatingPromo.set(true);
    this.promoError.set(false);
    this.promoMessage.set('');

    this.http.post<any>('http://localhost:5153/api/orders/validate-promo', {
      code: this.form.promoCode,
      subtotal: this.subtotal()
    }).subscribe({
      next: (res) => {
        this.validatingPromo.set(false);
        if (res.isSuccess && res.data) {
          this.appliedPromo.set(res.data);
          this.promoMessage.set(res.message || 'Promo code applied successfully!');
          this.promoError.set(false);
        } else {
          this.promoMessage.set(res.message || 'Failed to validate promo code.');
          this.promoError.set(true);
        }
      },
      error: (err) => {
        this.validatingPromo.set(false);
        this.promoMessage.set(err?.error?.message || 'Invalid promo code or requirements not met.');
        this.promoError.set(true);
      }
    });
  }

  removePromo(): void {
    this.appliedPromo.set(null);
    this.form.promoCode = '';
    this.promoMessage.set('');
    this.promoError.set(false);
  }

  seedCart(): void {
    // Seed some test products for checkout testing via unified CartService
    const testItems: CartItem[] = [
      {
        productId: 'd3b07384-d113-40e1-a3f2-861f2113d077',
        productName: 'Sculpted Leather Handbag',
        unitPrice: 850.00,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300'
      },
      {
        productId: 'c12d7b56-ea12-40e1-b85f-861f2113d099',
        productName: 'Flowing Satin Slip',
        unitPrice: 340.00,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300'
      }
    ];
    this.cartService.saveCart(testItems);
  }

  changeQty(index: number, change: number): void {
    this.cartService.changeQty(index, change);
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  populateFormFromContext(): void {
    // 1. Check if user is authenticated and pre-fill details
    const user = this.authService.currentUser();
    if (user) {
      this.form.customerName = user.username; // Or map to full name
    }

    // 2. Load guest checkout details if saved locally
    const guestCtx = this.authService.getGuestCheckoutContext();
    if (guestCtx) {
      this.form.customerName = this.form.customerName || guestCtx.customerName;
      this.form.primaryPhone = guestCtx.primaryPhone;
      this.form.secondaryPhone = guestCtx.secondaryPhone || '';
      this.form.detailedAddress = guestCtx.detailedAddress;
      this.form.governorate = guestCtx.governorate;
    }
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    this.errorMessage.set('');
    
    if (this.cartItems().length === 0) {
      this.errorMessage.set('Your shopping bag is empty.');
      return;
    }

    this.submitting.set(true);

    const itemsPayload = this.cartItems().map(item => ({
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice,
      quantity: item.quantity
    }));

    const isAuthenticated = this.authService.currentUser() !== null;
    const url = isAuthenticated 
      ? 'http://localhost:5153/api/orders/submit' 
      : 'http://localhost:5153/api/orders/guest-submit';

    const isDigitalPayment = this.form.paymentMethod === 'DigitalWallet' || this.form.paymentMethod === 'InstaPay' || this.form.paymentMethod === 'VodafoneCash';

    // Build payload
    const payload: any = {
      customerName: this.form.customerName,
      paymentMethod: this.form.paymentMethod,
      walletScreenshotUrl: isDigitalPayment ? this.form.walletScreenshotUrl : null,
      walletSenderPhoneNumberOrName: isDigitalPayment ? this.form.walletSenderPhoneNumberOrName : null,
      promoCode: this.form.promoCode || null,
      items: itemsPayload
    };

    if (isAuthenticated) {
      payload.shippingGovernorate = this.form.governorate;
      payload.shippingDetailedAddress = this.form.detailedAddress;
      payload.shippingPrimaryPhone = this.form.primaryPhone;
      payload.shippingSecondaryPhone = this.form.secondaryPhone || null;
    } else {
      payload.primaryPhone = this.form.primaryPhone;
      payload.secondaryPhone = this.form.secondaryPhone || null;
      payload.detailedAddress = this.form.detailedAddress;
      payload.governorate = this.form.governorate;
    }

    this.http.post<any>(url, payload).subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (res.isSuccess && res.data) {
          this.orderPlaced.set(true);
          this.lastOrderNumber.set(res.data.orderNumber);
          this.orderId.set(res.data.id);
          
          // Clear Local Storage Cart via CartService
          this.cartService.clearCart();

          // Save Guest Context locally for convenience next time
          if (!isAuthenticated) {
            const guestCtx: GuestCheckoutContext = {
              customerName: this.form.customerName,
              primaryPhone: this.form.primaryPhone,
              secondaryPhone: this.form.secondaryPhone,
              detailedAddress: this.form.detailedAddress,
              governorate: this.form.governorate
            };
            this.authService.saveGuestCheckoutContext(guestCtx);
          }
        } else {
          this.errorMessage.set(res.message || 'Order submission failed.');
        }
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message || 'Server error. Please verify your details.');
      }
    });
  }
}
