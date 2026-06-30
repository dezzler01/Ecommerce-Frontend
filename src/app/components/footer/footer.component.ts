import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../core/services/catalog.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <footer class="relative z-20 w-full pt-16 pb-10 px-6 md:px-12 border-t border-[#64C9F5]/20 bg-[#F0FAFE] text-[var(--text-charcoal)] pointer-events-auto overflow-hidden">
      <!-- Top Rainbow Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F67B63] via-[#FFD75A] to-[#64C9F5] opacity-50"></div>
      
      <!-- Tiny Decorative Clouds & Stars in Background -->
      <div class="absolute top-[10%] left-[2%] opacity-15 pointer-events-none hidden md:block">
        <svg class="w-8 h-8 text-[#FFD75A]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/></svg>
      </div>
      <div class="absolute bottom-[20%] right-[3%] opacity-20 pointer-events-none hidden md:block">
        <svg class="w-6 h-6 text-[#64C9F5]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/></svg>
      </div>

      <div class="w-full flex flex-col gap-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-[11px] tracking-[0.15em] uppercase font-bold text-left">
          
          <!-- Column 1: Brand Info -->
          <div class="lg:col-span-2 pr-0 lg:pr-8 flex flex-col justify-start space-y-4">
            <!-- Watercolor Logo -->
            <div class="relative h-12 w-40 flex items-center justify-start cursor-pointer select-none">
              <img src="/logo.png" alt="Picks &amp; More Logo" class="h-full w-auto object-contain" />
            </div>
            <p class="text-[12px] tracking-wide leading-relaxed lowercase text-[#77685D] normal-case font-nunito pr-4">
              Curating timeless apparel, premium footwear, and cheerful accessories for parents and children. Designed for modern family living with premium care.
            </p>
          </div>

          <!-- Column 2: Collections Links -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-bold text-[var(--text-charcoal)] tracking-[0.2em] text-[12px] font-fredoka">Collections</h4>
            <ul class="flex flex-col gap-3 font-nunito text-[11px] text-[#77685D] tracking-wide normal-case font-semibold">
              <li><a [routerLink]="['/products']" [queryParams]="{ target: 'Women' }" class="hover:text-[#F67B63] transition-colors">Women's Fashion</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{ target: 'Kids' }" class="hover:text-[#F67B63] transition-colors">Little One Collection</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{ target: 'Men' }" class="hover:text-[#F67B63] transition-colors">Men's Tailored</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{ target: 'All' }" class="hover:text-[#F67B63] transition-colors">All Products</a></li>
            </ul>
          </div>

          <!-- Column 3: Trust & Payments -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-bold text-[var(--text-charcoal)] tracking-[0.2em] text-[12px] font-fredoka">Payments &amp; Shipping</h4>
            <div class="flex flex-wrap gap-2 mb-2">
              <span class="text-[9px] uppercase tracking-wider bg-white border border-[#EBF1F5] px-2 py-0.5 rounded text-[var(--text-charcoal)] font-bold">Bosta</span>
              <span class="text-[9px] uppercase tracking-wider bg-white border border-[#EBF1F5] px-2 py-0.5 rounded text-[var(--text-charcoal)] font-bold">Aramex</span>
            </div>
            <div class="flex items-center gap-2">
              <!-- Visa Card Icon -->
              <span class="text-[8px] bg-white border border-[#EBF1F5] px-1.5 py-0.5 rounded font-bold text-[#64C9F5] font-nunito">VISA</span>
              <!-- Mastercard Icon -->
              <span class="text-[8px] bg-white border border-[#EBF1F5] px-1.5 py-0.5 rounded font-bold text-[#F67B63] font-nunito">MC</span>
              <!-- COD Icon -->
              <span class="text-[8px] bg-white border border-[#EBF1F5] px-1.5 py-0.5 rounded font-bold text-[#77DCC5] font-nunito">CASH</span>
            </div>
          </div>

          <!-- Column 4: WhatsApp & Support -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-bold text-[var(--text-charcoal)] tracking-[0.2em] text-[12px] font-fredoka">Support</h4>
            <ul class="flex flex-col gap-3 font-nunito text-[11px] text-[#77685D] tracking-wide normal-case font-semibold">
              <li><button (click)="openTrackOrderModal($event)" class="hover:text-[#F67B63] text-left bg-transparent border-none p-0 outline-none uppercase tracking-[0.15em] font-bold text-[10px] cursor-pointer">Track My Order</button></li>
              <li><a href="#" (click)="openStatic($event,'Shipping & Returns')" class="hover:text-[#F67B63] transition-colors">Shipping &amp; Returns</a></li>
              <li><a href="#" (click)="openStatic($event,'Size Guide')" class="hover:text-[#F67B63] transition-colors">Size Guide</a></li>
            </ul>
            <!-- Chat on WhatsApp CTA -->
            <a href="https://wa.me/201001234567" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#77DCC5] hover:bg-[#64C9F5] text-white text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm hover:shadow-md transition-all duration-300 font-fredoka w-fit select-none">
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center gap-6 text-[12px] tracking-[0.15em] text-[#77685D]/80 font-semibold border-t border-[#64C9F5]/10 pt-8 w-full text-center">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div>© {{ currentYear }} Picks&amp;More. All Rights Reserved.</div>
            <ul class="flex items-center justify-center gap-4 lowercase tracking-wider text-[12px] font-nunito normal-case">
              <li>
                <a href="https://instagram.com" target="_blank" class="hover:text-[#F67B63] transition-all flex items-center gap-1.5 group font-bold">
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" class="hover:text-[#F67B63] transition-all flex items-center gap-1.5 group font-bold">
                  <span>Facebook</span>
                </a>
              </li>
            </ul>
          </div>
          <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 uppercase text-[9px] tracking-widest font-mono">
            <a href="#" (click)="openStatic($event,'Privacy Policy')" class="hover:text-[#F67B63] transition-colors">Privacy Policy</a>
            <a href="#" (click)="openStatic($event,'Terms of Service')" class="hover:text-[#F67B63] transition-colors">Terms of Service</a>
            <a href="#" (click)="openStatic($event,'Cookie Policy')" class="hover:text-[#F67B63] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Order Tracking Modal -->
    <div *ngIf="isTrackOrderModalOpen()" class="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-auto">
      <div (click)="closeTrackOrderModal()" class="fixed inset-0 bg-[var(--text-charcoal)]/15 backdrop-blur-[4px] cursor-pointer"></div>
      <div class="relative w-full max-w-lg bg-[#FAF5F2]/95 backdrop-blur-xl border border-[#EBF1F5] p-6 md:p-8 rounded-[24px] flex flex-col space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl z-10 text-left">
        <button (click)="closeTrackOrderModal()" class="absolute top-4 right-4 text-[var(--text-charcoal)]/40 hover:text-[#F67B63] text-sm p-1.5 transition-colors cursor-pointer">&#x2715;</button>

        <!-- Header -->
        <div class="border-b border-[var(--text-charcoal)]/10 pb-3">
          <span class="tracking-widest font-mono text-[9px] uppercase font-bold text-[var(--color-coral)] block mb-1">Active Logistics Pipeline</span>
          <h3 class="text-base font-serif font-light text-[var(--text-charcoal)] tracking-wider uppercase">Track Your Order</h3>
          <p class="text-[9px] text-[#6B5E57] mt-1 normal-case tracking-normal">Enter your order number and the last 4 digits of your phone to view your shipment status.</p>
        </div>

        <!-- Two-field verification form -->
        <div class="space-y-3">
          <div>
            <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block mb-1">Order Number *</label>
            <input type="text" [(ngModel)]="trackOrderId" (ngModelChange)="trackingError.set('')"
              placeholder="e.g. ORD-7E417AB5"
              class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all uppercase"/>
          </div>
          <div>
            <label class="text-[8px] uppercase tracking-widest font-bold text-[#6B5E57] block mb-1">Last 4 Digits of Phone *</label>
            <input type="text" [(ngModel)]="trackPhone" (ngModelChange)="trackingError.set('')"
              placeholder="e.g. 4528" maxlength="4" inputmode="numeric"
              class="w-full px-3 py-2 bg-white/70 border border-[var(--text-charcoal)]/10 rounded-lg text-xs text-[var(--text-charcoal)] focus:outline-none focus:border-[var(--color-coral)] transition-all"/>
          </div>
          <button (click)="trackOrder()" [disabled]="trackingLoading()"
            class="w-full py-2.5 bg-[var(--text-charcoal)] hover:bg-[var(--color-coral)] text-[#FAF5F2] text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-50 cursor-pointer">
            {{ trackingLoading() ? 'Querying...' : 'Track Order' }}
          </button>
          <p *ngIf="trackingError()" class="text-[9px] text-red-500 font-semibold tracking-wide uppercase">{{ trackingError() }}</p>
        </div>

        <!-- Spinner -->
        <div *ngIf="trackingLoading()" class="flex flex-col items-center py-6 justify-center space-y-2">
          <div class="w-6 h-6 border-2 border-[var(--color-coral)]/20 border-t-[var(--color-coral)] rounded-full animate-spin"></div>
          <span class="text-[9px] uppercase tracking-wider text-[#6B5E57] font-light">Querying Live Hub...</span>
        </div>

        <!-- Result -->
        <div *ngIf="!trackingLoading() && trackedOrder()" class="space-y-5 pt-2">

          <!-- Order number badge -->
          <div class="flex items-center justify-between">
            <span class="text-[9px] font-mono font-bold text-[var(--color-coral)] uppercase tracking-widest">{{ trackedOrder().orderNumber }}</span>
            <span class="text-[8px] uppercase tracking-widest text-[#6B5E57]">{{ trackedOrder().orderStatus }}</span>
          </div>

          <!-- Stepper -->
          <div class="space-y-3">
            <h4 class="text-[8px] uppercase tracking-widest font-bold text-[var(--color-coral)]">Logistics Status</h4>
            <div class="flex justify-between items-center relative py-2">
              <div class="absolute left-0 right-0 top-1/2 h-[2px] bg-[var(--text-charcoal)]/10 -translate-y-1/2 z-0"></div>
              <div [ngStyle]="{ width: getStepPercentage(trackedOrder().orderStatus) }" class="absolute left-0 top-1/2 h-[2px] bg-[var(--color-coral)] -translate-y-1/2 z-0 transition-all duration-700"></div>
              <div *ngFor="let step of steps; let i = index" class="flex flex-col items-center z-10">
                <div [ngClass]="isStepActive(trackedOrder().orderStatus, i) ? 'bg-[var(--color-coral)] text-white border-[var(--color-coral)]' : 'bg-white text-[#6B5E57] border-[var(--text-charcoal)]/10'" class="w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-bold transition-colors duration-300">{{ i + 1 }}</div>
                <span class="text-[7px] uppercase tracking-wider mt-1 text-center font-medium max-w-[60px] text-[var(--text-charcoal)]">{{ step }}</span>
              </div>
            </div>
          </div>

          <!-- Rejected banner -->
          <div *ngIf="trackedOrder().orderStatus === 'ReturnedRejected'" class="p-3 bg-red-50 border border-red-200 text-red-500 rounded-xl text-[10px] uppercase font-bold tracking-widest text-center">Order Rejected or Returned</div>

          <!-- Masked meta details -->
          <div class="grid grid-cols-2 gap-4 bg-white/45 p-4 rounded-xl border border-[var(--text-charcoal)]/5 text-[9px] tracking-widest uppercase text-[#6B5E57]">
            <div><span class="opacity-60 block mb-0.5">Order Date</span><span class="font-bold text-[var(--text-charcoal)]">{{ trackedOrder().orderDate | date:'mediumDate' }}</span></div>
            <div><span class="opacity-60 block mb-0.5">Payment</span><span class="font-bold text-[var(--text-charcoal)]">{{ trackedOrder().paymentMethod }}</span></div>
            <div><span class="opacity-60 block mb-0.5">Recipient</span><span class="font-bold text-[var(--text-charcoal)]">{{ trackedOrder().maskedName }}</span></div>
            <div><span class="opacity-60 block mb-0.5">Phone</span><span class="font-bold text-[var(--text-charcoal)]">{{ trackedOrder().maskedPhone }}</span></div>
            <div class="col-span-2"><span class="opacity-60 block mb-0.5">Governorate</span><span class="font-bold text-[var(--text-charcoal)]">{{ trackedOrder().city }}</span></div>
          </div>

          <!-- Items -->
          <div class="space-y-2">
            <h4 class="text-[8px] uppercase tracking-widest font-bold text-[var(--color-coral)]">Items Secured</h4>
            <div class="max-h-[150px] overflow-y-auto border border-[var(--text-charcoal)]/5 rounded-xl divide-y divide-[var(--text-charcoal)]/5 bg-white/45">
              <div *ngFor="let item of trackedOrder().items" class="p-3 flex justify-between items-center text-[9px] uppercase tracking-widest text-[var(--text-charcoal)]">
                <div class="flex flex-col gap-0.5">
                  <span class="font-bold">{{ item.productTitle }}</span>
                  <span class="text-[7px] text-[#6B5E57] font-normal">Qty: {{ item.quantity }} x LE {{ item.unitPrice | number:'1.2-2' }}</span>
                </div>
                <span class="font-mono font-bold">LE {{ (item.quantity * item.unitPrice) | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Totals -->
          <div class="flex justify-between items-center border-t border-[var(--text-charcoal)]/10 pt-3 text-[10px] uppercase tracking-widest text-[var(--text-charcoal)]">
            <div class="flex flex-col gap-0.5">
              <span class="opacity-70 text-[8px]">Including LE {{ trackedOrder().shippingCost | number:'1.2-2' }} shipping</span>
              <span class="font-bold">Total Valuation</span>
            </div>
            <span class="font-mono text-base font-bold text-[var(--color-coral)]">LE {{ trackedOrder().totalPrice | number:'1.2-2' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FooterComponent {
  private catalogService = inject(CatalogService);
  private alertService = inject(AlertService);

  currentYear = new Date().getFullYear();
  steps = ['Pending Verification', 'Preparing Order', 'Out For Delivery', 'Delivered'];

  isTrackOrderModalOpen = signal<boolean>(false);
  trackOrderId = '';
  trackPhone = '';
  trackedOrder = signal<any>(null);
  trackingError = signal<string>('');
  trackingLoading = signal<boolean>(false);

  openStatic(event: Event, pageName: string) {
    event.preventDefault();
    
    const pageData: Record<string, { title: string, message: string }> = {
      'Our Story': {
        title: 'Our Story',
        message: 'At Picks & More, we curate timeless luxury apparel, premium footwear, and elegant accessories for women, infants, and children. Born with a passion for heritage craftsmanship and modern comfort, we bridge the gap between classic elegance and everyday wearability. Every piece in our boutique is meticulously selected for its quality, safety, and aesthetic appeal to ensure a premium lifestyle experience.'
      },
      'Shipping & Returns': {
        title: 'Shipping & Returns Policy',
        message: 'We provide fast, tracked shipping across all governorates of Egypt (including Cairo, Giza, Alexandria, Delta, and Upper Egypt) within 2 to 5 business days. We offer a hassle-free 14-day return and exchange policy for all items in their original, unworn condition with tags attached. Simply contact our support team to schedule a courier pickup for your exchange or refund.'
      },
      'Size Guide': {
        title: 'Luxury Size Guide',
        message: 'Our boutique collections fit true to standard European and international sizes. Women\'s apparel is detailed in standard sizes (S, M, L, XL), while our infant and kids\' ranges are organized by age category (Newborn, 3M, 6M, 12M, 2T, 4T, 6T, 8T, 10T). For footwear, please refer to the EU sizing chart on individual product pages.'
      },
      'Sustainability': {
        title: 'Conscious Luxury',
        message: 'We are deeply committed to conscious fashion. Our garments are sourced from sustainable partners who utilize 100% organic cotton, non-toxic organic dyes, and recycled fibers that are gentle on baby skin and kind to our planet. We also package our products in fully recyclable and biodegradable materials.'
      },
      'Careers': {
        title: 'Join Our Team',
        message: 'Grow your career with Picks & More. We are always looking for passionate talent, fashion buyers, digital marketing leaders, and logistics enthusiasts who value perfection and luxury service. Join us in shaping the future of premium curated fashion in Egypt. Send your CV and portfolio to careers@picksandmore.com.'
      },
      'Privacy Policy': {
        title: 'Privacy Policy',
        message: 'Your privacy is our utmost priority. We secure all personal credentials, transaction records, and shipping addresses with industry-grade SSL encryption. We do not sell, trade, or distribute your private information to third parties. We use cookies solely to personalize your catalog browsing experience and protect checkout security.'
      },
      'Terms of Service': {
        title: 'Terms of Service',
        message: 'By using the Picks & More storefront, you agree to our terms of commerce. All prices are listed in Egyptian Pounds (EGP). We reserve the right to modify collections, update valuations, and cancel orders in cases of unexpected inventory discrepancies. Cash on delivery and secure online payments are fully supported.'
      },
      'Cookie Policy': {
        title: 'Cookie Policy',
        message: 'Our website uses essential cookies to track your luxury shopping bag, save your authenticated profile state, and analyze anonymous traffic metrics for storefront speed optimization. By continuing to browse our collections, you agree to our clean cookie policy.'
      }
    };

    const selectedPage = pageData[pageName] || {
      title: pageName,
      message: `The ${pageName} page is currently being updated. Please check back shortly.`
    };

    this.alertService.showAlert({
      title: selectedPage.title,
      message: selectedPage.message,
      type: 'info',
      confirmText: 'Close'
    });
  }

  openTrackOrderModal(event: Event) {
    event.preventDefault();
    this.trackOrderId = '';
    this.trackPhone = '';
    this.trackedOrder.set(null);
    this.trackingError.set('');
    this.trackingLoading.set(false);
    this.isTrackOrderModalOpen.set(true);
  }

  closeTrackOrderModal() { this.isTrackOrderModalOpen.set(false); }

  trackOrder() {
    const id = this.trackOrderId.trim();
    const phone = this.trackPhone.trim();

    if (!id) { this.trackingError.set('Please enter your Order Number.'); return; }

    // Accept either full GUID or the ORD-XXXXXXXX short form
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
    const shortRegex = /^ORD-[0-9a-fA-F]{8}$/i;
    if (!guidRegex.test(id) && !shortRegex.test(id)) {
      this.trackingError.set('Please enter a valid Order Number (e.g. ORD-7E417AB5 or the full order ID).');
      return;
    }

    if (!phone || phone.length !== 4 || !/^\d{4}$/.test(phone)) {
      this.trackingError.set('Please enter the last 4 digits of your phone number.');
      return;
    }

    // If user entered short form, we need the full GUID — prompt them
    if (shortRegex.test(id)) {
      this.trackingError.set('Please use the full Order ID from your confirmation SMS/email.');
      return;
    }

    this.trackingError.set('');
    this.trackingLoading.set(true);
    this.trackedOrder.set(null);
    this.catalogService.trackOrder(id, phone).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) { this.trackedOrder.set(res.data); }
        else { this.trackingError.set(res.message || 'Unable to find order.'); }
        this.trackingLoading.set(false);
      },
      error: (err) => {
        this.trackingError.set(err.error?.message || 'Order not found.');
        this.trackingLoading.set(false);
      }
    });
  }

  isStepActive(status: string, stepIndex: number): boolean {
    const statusMap: Record<string, number> = { PendingVerification: 0, ConfirmedPreparing: 1, OutForDelivery: 2, Delivered: 3 };
    if (status === 'ReturnedRejected') return false;
    return (statusMap[status] ?? 0) >= stepIndex;
  }

  getStepPercentage(status: string): string {
    const map: Record<string, string> = { PendingVerification: '0%', ConfirmedPreparing: '33%', OutForDelivery: '66%', Delivered: '100%' };
    return map[status] ?? '0%';
  }
}
