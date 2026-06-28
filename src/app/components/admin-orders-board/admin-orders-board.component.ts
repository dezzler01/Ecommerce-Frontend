import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { NotificationService } from '../../services/notification.service';
import { CatalogService } from '../../core/services/catalog.service';
import { Subscription } from 'rxjs';
import { resolveImageUrl } from '../../core/utils/image-resolver';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  isReturnedPartially: boolean;
  originalQuantity: number;
  returnQty?: number;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  shippingGovernorate: string;
  shippingDetailedAddress: string;
  shippingPrimaryPhone: string;
  shippingSecondaryPhone?: string;
  status: string;
  paymentMethod: string;
  shippingCost: number;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
  walletVerification?: {
    id: string;
    screenshotUrl: string;
    senderPhoneNumberOrName: string;
    isVerified: boolean;
    verifiedByUserId?: string;
  };
}

interface PromoCode {
  id: string;
  code: string;
  discountType: string; // "FixedAmount", "Percentage", "FreeShipping"
  value: number;
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
  usageLimit: number;
  currentUsage: number;
}

interface ShippingGovernorate {
  id: string;
  governorate: string;
  basePriceSmall: number;
  basePriceMedium: number;
  basePriceLarge: number;
  isEditing?: boolean;
}

interface ShippingComboRule {
  id: string;
  inputSmallCount: number;
  inputMediumCount: number;
  resultingSize: string;
}

interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  showInCards: boolean;
  isVisible: boolean;
}

interface BulkProductRow {
  selected?: boolean;
  title: string;
  mainCategory: string; // 'Women' | 'Kids'
  subCategory: string; // e.g. 'fashion', 'shoes', etc.
  price: number | null;
  costPrice: number | null;
  stockQuantity: number | null;
  shippingSize: string; // 'Small' | 'Medium' | 'Large'
  sizes: string;
  colors: string;
  age: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[];
}

import { AppImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-admin-orders-board',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AppImageUploaderComponent],
  template: `
    <div class="admin-canvas min-h-screen text-left animate-fade-in">
      <!-- Left Sidebar Navigation Index -->
      <aside class="admin-sidebar">
        <span class="sidebar-title">Console Sections</span>
        
        <!-- Orders Tab Button -->
        <button 
          *ngIf="authService.hasPermission('Orders:Read')"
          (click)="currentTab.set('orders')"
          [class.active]="currentTab() === 'orders'"
          class="sidebar-btn"
        >
          <span class="indicator-line"></span>
          📦 Orders Super Board
        </button>

        <!-- Promo Codes Tab Button -->
        <button 
          *ngIf="authService.hasPermission('PromoCodes:Read')"
          (click)="currentTab.set('promocodes'); loadPromoCodes()"
          [class.active]="currentTab() === 'promocodes'"
          class="sidebar-btn"
        >
          <span class="indicator-line"></span>
          🏷 Promo Codes Engine
        </button>

        <!-- Bulk Product Add Tab Button -->
        <button 
          *ngIf="authService.hasPermission('Products:Create')"
          (click)="currentTab.set('bulkadd')"
          [class.active]="currentTab() === 'bulkadd'"
          class="sidebar-btn"
        >
          <span class="indicator-line"></span>
          📊 Bulk Product Import
        </button>

        <!-- Shipping Console Ledger Tab Button -->
        <button 
          *ngIf="authService.hasPermission('Shipping:Read')"
          (click)="currentTab.set('shipping'); loadShippingData()"
          [class.active]="currentTab() === 'shipping'"
          class="sidebar-btn"
        >
          <span class="indicator-line"></span>
          🚚 Shipping Console Ledger
        </button>

        <!-- Brands Directory Tab Button -->
        <button 
          *ngIf="authService.hasPermission('Products:Read')"
          (click)="currentTab.set('brands'); loadBrands()"
          [class.active]="currentTab() === 'brands'"
          class="sidebar-btn"
        >
          <span class="indicator-line"></span>
          🎨 Brands House
        </button>

        <!-- Attributes Ledger Tab Button -->
        <button 
          *ngIf="authService.hasPermission('Products:Update')"
          (click)="currentTab.set('attributes'); loadColors(); loadSizes()"
          [class.active]="currentTab() === 'attributes'"
          class="sidebar-btn"
        >
          <span class="indicator-line"></span>
          🎨 Colors & Sizes
        </button>

        <!-- Analytics Ledger Tab Button -->
        <button 
          *ngIf="authService.hasPermission('Analytics:Read')"
          (click)="currentTab.set('analytics'); loadAnalyticsSummary()"
          [class.active]="currentTab() === 'analytics'"
          class="sidebar-btn"
        >
          <span class="indicator-line"></span>
          📈 Analytics Ledger
        </button>

        <!-- Access Control Ledger Tab Button -->
        <button 
          *ngIf="authService.hasPermission('Roles:Read')"
          (click)="currentTab.set('roles'); loadRoles()"
          [class.active]="currentTab() === 'roles'"
          class="sidebar-btn"
        >
          <span class="indicator-line"></span>
          🔑 Access Control Ledger
        </button>

        <!-- Notifications Console Tab Button -->
        <button 
          *ngIf="authService.hasPermission('Orders:Read')"
          (click)="currentTab.set('notifications'); loadSubscriptions()"
          [class.active]="currentTab() === 'notifications'"
          class="sidebar-btn"
        >
          <span class="indicator-line"></span>
          🔔 Notifications Console
        </button>
      </aside>

      <!-- Main right viewport -->
      <main class="admin-main">
        <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span class="font-lexend tracking-widest text-[10px] uppercase font-semibold text-[#B84F7D] block mb-2">Management Console</span>
            <div class="flex items-center gap-3">
              <h2 class="title-header text-3xl font-light text-[#2A2522] tracking-[0.05em] uppercase">Store Admin Console</h2>
              <button 
                *ngIf="authService.hasPermission('Orders:Read')"
                (click)="handleBellClick()"
                class="relative p-2 rounded-full hover:bg-[#2A2522]/5 transition-all focus:outline-none"
                [title]="notificationService.hasNewOrders() ? 'New orders submitted! Click to refresh ledger.' : 'No new order notifications'"
              >
                <span 
                  *ngIf="notificationService.hasNewOrders()" 
                  class="absolute top-1 right-1 w-2.5 h-2.5 bg-[#B84F7D] rounded-full animate-ping"
                ></span>
                <span 
                  *ngIf="notificationService.hasNewOrders()" 
                  class="absolute top-1 right-1 w-2.5 h-2.5 bg-[#B84F7D] rounded-full"
                ></span>
                <svg 
                  [class.animate-soft-bell]="notificationService.hasNewOrders()"
                  class="w-6 h-6 text-[#2A2522] transition-colors"
                  [class.text-[#B84F7D]]="notificationService.hasNewOrders()"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Shared Header Actions (contextual by tab) -->
          <div class="flex flex-wrap gap-2.5">
            <button 
              *ngIf="authService.hasPermission('Shipping:Update')" 
              (click)="toggleSettingsPanel()" 
              class="px-4 py-2 border border-[#B84F7D]/25 hover:bg-[#B84F7D]/5 text-[#B84F7D] text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              ⚙ Settings & Payments
            </button>
            <button 
              *ngIf="currentTab() === 'orders'" 
              (click)="clearFilters()" 
              class="px-4 py-2 border border-[#2A2522]/10 hover:bg-[#2A2522]/5 text-[#2A2522] text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Clear Filters
            </button>
            <button 
              *ngIf="currentTab() === 'orders'" 
              (click)="loadOrders()" 
              class="px-4 py-2 bg-[#2A2522] hover:bg-[#B84F7D] text-[#FBF9F6] text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Refresh Orders
            </button>

            <button 
              *ngIf="currentTab() === 'promocodes'" 
              (click)="showCreatePromoModal.set(true)" 
              class="px-4 py-2 bg-[#B84F7D] hover:bg-[#B84F7D]/90 text-[#FBF9F6] text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              + Create Promo Code
            </button>
            <button 
              *ngIf="currentTab() === 'promocodes'" 
              (click)="loadPromoCodes()" 
              class="px-4 py-2 border border-[#2A2522]/10 hover:bg-[#2A2522]/5 text-[#2A2522] text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Refresh Codes
            </button>
          </div>
        </div>

        <!-- Active Tab Data Panel -->

        <!-- TAB 1: ORDERS SUPER BOARD -->
        <div *ngIf="currentTab() === 'orders'" class="space-y-6 animate-fade-in">
          <!-- Shipping Settings Panel -->
          <div *ngIf="showSettingsPanel()" class="frosted-card p-6 rounded-2xl space-y-4">
            <div class="flex justify-between items-center border-b border-[#2A2522]/5 pb-3">
              <h3 class="title-header text-xs font-bold text-[#B84F7D]">Free Shipping Configurations</h3>
              <button (click)="showSettingsPanel.set(false)" class="text-[#8A817C] hover:text-[#2A2522] text-xs">✕</button>
            </div>
            
            <div *ngIf="settingsMessage()" class="p-2.5 text-[10px] uppercase font-bold tracking-wider rounded-xl text-center" 
                 [ngClass]="settingsIsError() ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'">
              {{ settingsMessage() }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Free Shipping Threshold (EGP)</label>
                <input 
                  type="number" 
                  [(ngModel)]="settingsThreshold" 
                  class="px-3 py-2 bg-[#FBF9F6]/80 border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]/50 transition-colors"
                  placeholder="E.g. 2000"
                />
              </div>

              <div class="flex items-center gap-3 py-2.5">
                <input 
                  type="checkbox" 
                  id="free-shipping-active"
                  [(ngModel)]="settingsIsActive" 
                  class="w-4 h-4 rounded border-[#2A2522]/10 text-[#B84F7D] focus:ring-[#B84F7D]"
                />
                <label for="free-shipping-active" class="text-[10px] uppercase tracking-widest font-semibold text-[#2A2522] cursor-pointer select-none">
                  Enable Free Shipping Rule
                </label>
              </div>

              <div class="flex gap-2">
                <button 
                  (click)="saveShippingSettings()" 
                  [disabled]="savingSettings()"
                  class="flex-1 px-4 py-2.5 bg-[#B84F7D] hover:bg-[#2A2522] text-[#FBF9F6] text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                >
                  {{ savingSettings() ? 'Saving...' : 'Save Settings' }}
                </button>
              </div>
            </div>

            <!-- Payment Gateways Settings -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end border-t border-[#2A2522]/5 pt-4 mt-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">InstaPay Address</label>
                <input 
                  type="text" 
                  [(ngModel)]="paymentInstaPayAddress" 
                  class="px-3 py-2 bg-[#FBF9F6]/80 border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]/50 transition-colors"
                  placeholder="name@instapay"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Vodafone Cash Number</label>
                <input 
                  type="text" 
                  [(ngModel)]="paymentVodafoneCashNumber" 
                  class="px-3 py-2 bg-[#FBF9F6]/80 border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]/50 transition-colors"
                  placeholder="01xxxxxxxxx"
                />
              </div>

              <div class="flex gap-2">
                <button 
                  (click)="savePaymentSettings()" 
                  [disabled]="savingPaymentSettings()"
                  class="flex-1 px-4 py-2.5 bg-[#2A2522] hover:bg-[#B84F7D] text-[#FBF9F6] text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                >
                  {{ savingPaymentSettings() ? 'Saving...' : 'Save Payment Config' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Filters Bar -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 frosted-card p-4 rounded-2xl">
            <div class="flex flex-col gap-1">
              <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Search Order / Customer</label>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (ngModelChange)="onFilterChange()"
                placeholder="Search by name, phone, order number..." 
                class="px-3 py-2 bg-[#FBF9F6]/80 border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]/50 transition-colors"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Status Filter</label>
              <select 
                [(ngModel)]="statusFilter" 
                (ngModelChange)="onFilterChange()"
                class="px-3 py-2 bg-[#FBF9F6]/80 border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]/50 transition-colors"
              >
                <option value="">All Statuses</option>
                <option value="PendingVerification">Pending Verification</option>
                <option value="ConfirmedPreparing">Confirmed / Preparing</option>
                <option value="OutForDelivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="ReturnedRejected">Returned / Rejected</option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-[9px] uppercase tracking-widest font-semibold text-[#8A817C]">Governorate</label>
              <select 
                [(ngModel)]="governorateFilter" 
                (ngModelChange)="onFilterChange()"
                class="px-3 py-2 bg-[#FBF9F6]/80 border border-[#2A2522]/5 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]/50 transition-colors"
              >
                <option value="">All Governorates</option>
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
          </div>

          <!-- Orders Table Grid -->
          <div class="frosted-card rounded-2xl overflow-hidden">
            <div *ngIf="loading()" class="luxury-experience-loader py-16 bg-transparent">
              <div class="loader-logo-container">
                <div class="loader-logo-text">Picks&amp;More</div>
              </div>
              <div class="loader-subtitle">Loading Ledger...</div>
              <div class="loader-bar-container">
                <div class="loader-bar-fill-indeterminate"></div>
              </div>
            </div>

            <div *ngIf="!loading() && orders().length === 0" class="text-center py-20 text-[#8A817C] font-light text-xs">
              No system orders recorded.
            </div>

            <table *ngIf="!loading() && orders().length > 0" class="w-full text-left border-collapse animate-rows">
              <thead>
                <tr class="border-b border-[#2A2522]/5 bg-[#2A2522]/5 text-[9px] uppercase tracking-widest font-bold text-[#4A4340]">
                  <th class="py-4 px-6">Order ID</th>
                  <th class="py-4 px-6">Customer</th>
                  <th class="py-4 px-6">Date</th>
                  <th class="py-4 px-6">Total Due</th>
                  <th class="py-4 px-6">Payment</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="text-xs text-[#2A2522] font-light">
                <tr 
                  *ngFor="let order of orders()" 
                  (click)="openOrder(order)"
                  class="border-b border-[#2A2522]/5 hover:bg-white/30 cursor-pointer transition-colors"
                >
                  <td class="py-4 px-6 font-lexend font-semibold">{{ order.orderNumber }}</td>
                  <td class="py-4 px-6">{{ order.customerName }}</td>
                  <td class="py-4 px-6">{{ order.createdAt | date:'yyyy-MM-dd HH:mm' }}</td>
                  <td class="py-4 px-6 font-lexend font-medium">{{ order.totalPrice | currency:'EGP ' }}</td>
                  <td class="py-4 px-6">
                    <span 
                      [ngClass]="{
                        'px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold': true,
                        'bg-amber-100 text-amber-800': order.paymentMethod === 'DigitalWallet',
                        'bg-blue-100 text-blue-800': order.paymentMethod === 'COD'
                      }"
                    >
                      {{ order.paymentMethod === 'DigitalWallet' ? 'InstaPay' : 'COD' }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <span 
                      [ngClass]="{
                        'px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold': true,
                        'bg-yellow-100 text-yellow-800': order.status === 'PendingVerification',
                        'bg-emerald-100 text-emerald-800': order.status === 'ConfirmedPreparing',
                        'bg-purple-100 text-purple-800': order.status === 'OutForDelivery',
                        'bg-gray-100 text-gray-800': order.status === 'Delivered',
                        'bg-red-100 text-red-800': order.status === 'ReturnedRejected'
                      }"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right" (click)="$event.stopPropagation()">
                    <button
                      type="button"
                      (click)="printShippingLabel(order.id)"
                      class="text-[10px] uppercase font-bold tracking-widest text-[#1F85A0] hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      Label
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: PROMO CODES ENGINE -->
        <div *ngIf="currentTab() === 'promocodes'" class="space-y-6 animate-fade-in">
          <!-- Promo Codes Table -->
          <div class="frosted-card rounded-2xl overflow-hidden">
            <div *ngIf="loadingPromoCodes()" class="luxury-experience-loader py-16 bg-transparent">
              <div class="loader-logo-text text-center text-[#B84F7D] font-lexend text-[10px] uppercase tracking-widest">Loading Promo Ledger...</div>
            </div>

            <div *ngIf="!loadingPromoCodes() && promoCodes().length === 0" class="text-center py-20 text-[#8A817C] font-light text-xs">
              No active promo codes found. Click "+ Create Promo Code" to add one.
            </div>

            <table *ngIf="!loadingPromoCodes() && promoCodes().length > 0" class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-[#2A2522]/5 bg-[#2A2522]/5 text-[9px] uppercase tracking-widest font-bold text-[#4A4340]">
                  <th class="py-4 px-6">Promo Code</th>
                  <th class="py-4 px-6">Discount Type</th>
                  <th class="py-4 px-6">Value</th>
                  <th class="py-4 px-6">Min Order</th>
                  <th class="py-4 px-6">Usage Count</th>
                  <th class="py-4 px-6">Expiry Date</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="text-xs text-[#2A2522] font-light">
                <tr *ngFor="let promo of promoCodes()" class="border-b border-[#2A2522]/5 hover:bg-white/30 transition-colors">
                  <td class="py-4 px-6 font-lexend font-bold text-[#B84F7D]">{{ promo.code }}</td>
                  <td class="py-4 px-6 uppercase tracking-wider text-[10px]">{{ promo.discountType }}</td>
                  <td class="py-4 px-6 font-lexend">
                    <span *ngIf="promo.discountType === 'Percentage'">{{ promo.value }}%</span>
                    <span *ngIf="promo.discountType === 'FixedAmount'">{{ promo.value | currency:'EGP ' }}</span>
                    <span *ngIf="promo.discountType === 'FreeShipping'">—</span>
                  </td>
                  <td class="py-4 px-6 font-lexend">{{ promo.minOrderAmount | currency:'EGP ' }}</td>
                  <td class="py-4 px-6 font-lexend">{{ promo.currentUsage }} / {{ promo.usageLimit }}</td>
                  <td class="py-4 px-6">{{ promo.expiryDate | date:'yyyy-MM-dd' }}</td>
                  <td class="py-4 px-6">
                    <span 
                      class="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold"
                      [ngClass]="promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ promo.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right space-x-2">
                    <button 
                      (click)="togglePromoCodeActive(promo.id)"
                      class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-[1px] rounded bg-[#2A2522] text-white hover:bg-[#B84F7D] transition-all"
                    >
                      {{ promo.isActive ? 'Disable' : 'Enable' }}
                    </button>
                    <button 
                      (click)="deletePromoCode(promo.id)"
                      class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-[1px] rounded border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 3: BULK PRODUCT IMPORT -->
        <div *ngIf="currentTab() === 'bulkadd'" class="space-y-6 animate-fade-in">
          <!-- Overview -->
          <div class="frosted-card p-5 rounded-2xl text-xs space-y-2">
            <h3 class="title-header text-xs font-bold text-[#B84F7D]">Excel-Like Bulk Product Panel</h3>
            <p class="text-[#8A817C] font-light">Type or paste multiple products in rows below. Enter comma-separated values for Colors and Sizes. Click "Publish Batch" to save them all to the store database at once.</p>
            
            <div *ngIf="bulkMessage()" class="p-3 uppercase font-bold tracking-wider text-[10px] rounded-xl text-center"
                 [ngClass]="bulkIsError() ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'">
              {{ bulkMessage() }}
            </div>
          </div>

          <!-- Bulk Fill Tools Belt -->
          <div class="frosted-card p-4 rounded-2xl flex flex-wrap gap-4 items-end text-xs">
            <div class="w-full border-b border-[#2A2522]/5 pb-1">
              <span class="text-[9px] uppercase tracking-widest font-bold text-[#B84F7D]">⚡ Row Auto-Fill Belt (Applies to <span class="font-black underline">{{ selectedRowsCount() }}</span> selected rows)</span>
            </div>

            <!-- Category Fill -->
            <div class="flex flex-col gap-1">
              <label class="text-[9px] uppercase text-[#8A817C]">Collection</label>
              <select [(ngModel)]="bulkFillMainCategory" class="px-2.5 py-1.5 bg-[#FBF9F6] border border-[#2A2522]/10 rounded-lg text-xs w-28">
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-[9px] uppercase text-[#8A817C]">Subcategory</label>
              <select [(ngModel)]="bulkFillSubCategory" class="px-2.5 py-1.5 bg-[#FBF9F6] border border-[#2A2522]/10 rounded-lg text-xs w-28">
                <option *ngFor="let cat of getSubcategories(bulkFillMainCategory)" [value]="cat">{{ cat }}</option>
              </select>
            </div>
            
            <button (click)="applyBulkFill('mainCategory', bulkFillMainCategory); applyBulkFill('subCategory', bulkFillSubCategory)" class="px-3 py-1.5 bg-[#2A2522] hover:bg-[#B84F7D] text-white text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all">
              Apply Cats
            </button>

            <!-- Stock Fill -->
            <div class="flex flex-col gap-1">
              <label class="text-[9px] uppercase text-[#8A817C]">Stock Qty</label>
              <input type="number" [(ngModel)]="bulkFillStockQuantity" class="px-2 py-1 bg-[#FBF9F6] border border-[#2A2522]/10 rounded-lg text-xs w-16 text-center" />
            </div>
            <button (click)="applyBulkFill('stockQuantity', bulkFillStockQuantity)" class="px-3 py-1.5 bg-[#2A2522] hover:bg-[#B84F7D] text-white text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all">
              Apply Stock
            </button>

            <!-- Colors Fill -->
            <div class="flex flex-col gap-1">
              <label class="text-[9px] uppercase text-[#8A817C]">Colors</label>
              <input type="text" [(ngModel)]="bulkFillColors" placeholder="Tan, Black, Sage" class="px-2 py-1 bg-[#FBF9F6] border border-[#2A2522]/10 rounded-lg text-xs w-28" />
            </div>
            <button (click)="applyBulkFill('colors', bulkFillColors)" class="px-3 py-1.5 bg-[#2A2522] hover:bg-[#B84F7D] text-white text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all">
              Apply Colors
            </button>

            <!-- Sizes Fill -->
            <div class="flex flex-col gap-1">
              <label class="text-[9px] uppercase text-[#8A817C]">Sizes</label>
              <input type="text" [(ngModel)]="bulkFillSizes" placeholder="S, M, L" class="px-2 py-1 bg-[#FBF9F6] border border-[#2A2522]/10 rounded-lg text-xs w-28" />
            </div>
            <button (click)="applyBulkFill('sizes', bulkFillSizes)" class="px-3 py-1.5 bg-[#2A2522] hover:bg-[#B84F7D] text-white text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all">
              Apply Sizes
            </button>

            <!-- Shipping Size Fill -->
            <div class="flex flex-col gap-1">
              <label class="text-[9px] uppercase text-[#8A817C]">Ship Size</label>
              <select [(ngModel)]="bulkFillShippingSize" class="px-2.5 py-1.5 bg-[#FBF9F6] border border-[#2A2522]/10 rounded-lg text-xs w-24">
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <button (click)="applyBulkFill('shippingSize', bulkFillShippingSize)" class="px-3 py-1.5 bg-[#2A2522] hover:bg-[#B84F7D] text-white text-[9px] uppercase tracking-widest font-bold rounded-lg transition-all">
              Apply Ship Size
            </button>
          </div>

          <!-- Excel Grid Container -->
          <div class="overflow-x-auto w-full rounded-xl frosted-card">
            <table class="w-full text-left border-collapse table-auto min-w-[1500px]">
              <thead>
                <tr class="border-b border-[#2A2522]/10 bg-[#2A2522]/5 text-[9px] uppercase tracking-widest font-bold text-[#4A4340] select-none">
                  <th class="py-3 px-3 text-center w-10">
                    <input type="checkbox" [checked]="isAllSelected()" (change)="toggleAllSelected($event)" class="rounded border-[#2A2522]/15 text-[#B84F7D] focus:ring-[#B84F7D] cursor-pointer" />
                  </th>
                  <th class="py-3 px-3 text-center w-12">Row</th>
                  <th class="py-3 px-3">Title *</th>
                  <th class="py-3 px-3 w-28">Collection</th>
                  <th class="py-3 px-3 w-32">Subcategory</th>
                  <th class="py-3 px-3 w-24">Price (LE) *</th>
                  <th class="py-3 px-3 w-24">Cost (LE) *</th>
                  <th class="py-3 px-3 w-20">Stock *</th>
                  <th class="py-3 px-3 w-28">Ship Size</th>
                  <th class="py-3 px-3">Sizes (Comma Separated)</th>
                  <th class="py-3 px-3">Colors (Comma Separated)</th>
                  <th class="py-3 px-3 w-24">Age (Kids)</th>
                  <th class="py-3 px-3">Description *</th>
                  <th class="py-3 px-3">Image URL</th>
                  <th class="py-3 px-3 text-center w-12">✕</th>
                </tr>
              </thead>
              <tbody class="text-xs font-light text-[#2A2522]">
                <tr *ngFor="let row of bulkRows(); let idx = index" class="border-b border-[#2A2522]/5 hover:bg-[#2A2522]/2 transition-colors" [class.selected-row]="row.selected">
                  <!-- Checkbox -->
                  <td class="py-2.5 px-3 text-center">
                    <input type="checkbox" [(ngModel)]="row.selected" class="rounded border-[#2A2522]/15 text-[#B84F7D] focus:ring-[#B84F7D] cursor-pointer" />
                  </td>
                  <!-- Index -->
                  <td class="py-2.5 px-3 text-center font-lexend text-[10px] text-[#8A817C]">{{ idx + 1 }}</td>
                  
                  <!-- Title -->
                  <td class="py-2 px-3">
                    <input type="text" [(ngModel)]="row.title" placeholder="Linen Blazer" class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full focus:outline-none" />
                  </td>

                  <!-- MainCategory -->
                  <td class="py-2 px-3">
                    <select [(ngModel)]="row.mainCategory" (ngModelChange)="row.subCategory = getSubcategories(row.mainCategory)[0]" class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full focus:outline-none">
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </td>

                  <!-- SubCategory -->
                  <td class="py-2 px-3">
                    <select [(ngModel)]="row.subCategory" class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full focus:outline-none">
                      <option *ngFor="let cat of getSubcategories(row.mainCategory)" [value]="cat">{{ cat }}</option>
                    </select>
                  </td>

                  <!-- Price -->
                  <td class="py-2 px-3">
                    <input type="number" [(ngModel)]="row.price" placeholder="1400" class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full text-center focus:outline-none font-lexend" />
                  </td>

                  <!-- Cost Price -->
                  <td class="py-2 px-3">
                    <input type="number" [(ngModel)]="row.costPrice" placeholder="800" class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full text-center focus:outline-none font-lexend" />
                  </td>

                  <!-- Stock Quantity -->
                  <td class="py-2 px-3">
                    <input type="number" [(ngModel)]="row.stockQuantity" placeholder="15" class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full text-center focus:outline-none font-lexend" />
                  </td>

                  <!-- Shipping Size -->
                  <td class="py-2 px-3">
                    <select [(ngModel)]="row.shippingSize" class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full focus:outline-none">
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
                  </td>

                  <!-- Sizes -->
                  <td class="py-2 px-3">
                    <input type="text" [(ngModel)]="row.sizes" placeholder="S, M, L" class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full focus:outline-none" />
                  </td>

                  <!-- Colors -->
                  <td class="py-2 px-3">
                    <input type="text" [(ngModel)]="row.colors" placeholder="Tan, Blush" class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full focus:outline-none" />
                  </td>

                  <!-- Age -->
                  <td class="py-2 px-3">
                    <input type="text" [disabled]="row.mainCategory === 'Women'" [(ngModel)]="row.age" placeholder="1-3 Years" class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full disabled:opacity-40 focus:outline-none" />
                  </td>

                  <!-- Description -->
                  <td class="py-2 px-3">
                    <input type="text" [(ngModel)]="row.description" placeholder="Premium linen fabric..." class="px-2 py-1 bg-transparent focus:bg-white border-b border-[#2A2522]/10 text-xs w-full focus:outline-none" />
                  </td>

                  <!-- ImageUrl Upload (Multiple) -->
                  <td class="py-2 px-3 min-w-[140px]">
                    <div class="flex items-center gap-1.5">
                      <button 
                        type="button"
                        (click)="openBulkRowImagesModal(row)"
                        class="px-2 py-1.5 border border-[#2A2522]/15 hover:bg-[#2A2522]/5 text-[#2A2522] rounded-lg text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 min-w-[90px]"
                      >
                        📷 Images ({{ row.imageUrls?.length || 0 }})
                      </button>
                      <img *ngIf="row.imageUrls && row.imageUrls.length > 0" [src]="resolveImageUrl(row.imageUrls[0] || '')" class="w-6 h-6 rounded object-cover border border-[#2A2522]/10" />
                    </div>
                  </td>

                  <!-- Delete Row -->
                  <td class="py-2 px-3 text-center">
                    <button (click)="removeBulkRow(idx)" class="text-red-500 hover:text-red-700 text-sm font-semibold select-none">✕</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Bottom Grid Controls -->
          <div class="flex justify-between items-center pt-2">
            <div class="flex gap-3">
              <button (click)="addBulkRow()" class="px-4 py-2 border border-[#2A2522]/15 hover:bg-[#2A2522]/5 text-[#2A2522] text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
                + Add Empty Row
              </button>
              <button (click)="clearBulkRows()" class="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
                Clear Console
              </button>
            </div>
            
            <button 
              (click)="publishBulkProducts()" 
              [disabled]="publishingBulk()"
              class="px-6 py-3 bg-[#B84F7D] hover:bg-[#2A2522] text-[#FBF9F6] text-xs font-bold uppercase tracking-[0.15em] rounded-xl transition-all disabled:opacity-50"
            >
              {{ publishingBulk() ? 'Publishing Batch...' : 'Publish Product Batch' }}
            </button>
          </div>

          <!-- Row Images Modal Overlay -->
          <div *ngIf="activeBulkImageRow() !== null" class="fixed inset-0 bg-[#2A2522]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="closeBulkRowImagesModal()">
            <div class="frosted-card w-full max-w-md p-6 rounded-2xl space-y-6 text-[#2A2522] animate-fade-in shadow-2xl" (click)="$event.stopPropagation()">
              <div class="flex justify-between items-center border-b border-[#2A2522]/10 pb-3">
                <div>
                  <h4 class="title-header text-sm font-bold text-[#B84F7D]">Manage Row Images</h4>
                  <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Upload up to 10 images for: {{ activeBulkImageRow()?.title || 'this row' }}</span>
                </div>
                <button (click)="closeBulkRowImagesModal()" class="text-xs text-[#8A817C] hover:text-[#B84F7D] font-bold">✕</button>
              </div>

              <div class="flex flex-wrap gap-3">
                <div 
                  *ngFor="let imgUrl of activeBulkImageRow()?.imageUrls || []; let i = index" 
                  class="relative w-20 h-20 rounded-xl border border-[#2A2522]/10 bg-white overflow-hidden flex items-center justify-center group/bulk-img shadow-sm animate-fade-in"
                >
                  <img [src]="resolveImageUrl(imgUrl)" class="w-full h-full object-cover" />
                  <div *ngIf="i === 0" class="absolute bottom-0 left-0 right-0 bg-[#2A2522]/80 text-[7px] text-white text-center py-0.5 font-bold uppercase tracking-wider">
                    Primary
                  </div>
                  <!-- Delete Swatch Button -->
                  <button 
                    type="button"
                    (click)="removeBulkRowImage(i)" 
                    class="absolute top-1 right-1 w-4 h-4 bg-red-655 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-[8px] font-bold shadow-md opacity-0 group-hover/bulk-img:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>

                <!-- Upload Box -->
                <label 
                  *ngIf="(activeBulkImageRow()?.imageUrls?.length || 0) < 10"
                  class="w-20 h-20 rounded-xl border-2 border-dashed border-[#2A2522]/15 hover:border-[#E07A5F] bg-[#FBF9F6] flex flex-col items-center justify-center text-[#8A817C] hover:text-[#E07A5F] cursor-pointer select-none transition-all"
                >
                  <span class="text-base font-bold leading-none">+</span>
                  <span class="text-[8px] font-bold uppercase tracking-widest mt-0.5 animate-pulse">Upload</span>
                  <input type="file" accept="image/*" class="hidden" (change)="uploadBulkRowImage($event)" />
                </label>
              </div>

              <div class="pt-4 border-t border-[#2A2522]/10 flex justify-end">
                <button (click)="closeBulkRowImagesModal()" class="px-5 py-2 bg-[#2A2522] hover:bg-[#B84F7D] text-[#FBF9F6] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 4: SHIPPING CONSOLE LEDGER -->
        <div *ngIf="currentTab() === 'shipping'" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-[#2A2522]">
          
          <!-- Left 2 Columns: Governorate rates ledger -->
          <div class="lg:col-span-2 space-y-6">
            <div class="frosted-card p-6 rounded-2xl space-y-4">
              <div class="border-b border-[#2A2522]/10 pb-4 flex justify-between items-center">
                <div>
                  <h3 class="title-header text-base font-light text-[#2A2522]">Egyptian Governorates Rate Ledger</h3>
                  <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Baseline delivery costs per packaging sizing category</span>
                </div>
                <div class="flex gap-2">
                  <button (click)="loadShippingData()" class="px-3.5 py-1.5 border border-[#2A2522]/10 hover:bg-[#2A2522]/5 text-[#2A2522] text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all">
                    ↻ Refresh Console
                  </button>
                </div>
              </div>

              <!-- Message Banner -->
              <div *ngIf="shippingMessage()" class="p-3 text-[10px] uppercase font-bold tracking-wider rounded-xl text-center" 
                   [ngClass]="shippingIsError() ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-[#2A2522]/5 border border-[#2A2522]/10 text-[#2A2522]'">
                {{ shippingMessage() }}
              </div>

              <div class="overflow-x-auto w-full rounded-xl frosted-card">
                <table class="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr class="border-b border-[#2A2522]/10 bg-[#2A2522]/5 text-[9px] uppercase tracking-widest font-bold text-[#4A4340] select-none">
                      <th class="py-3 px-4">Governorate</th>
                      <th class="py-3 px-4 w-28 text-center">Small (LE)</th>
                      <th class="py-3 px-4 w-28 text-center">Medium (LE)</th>
                      <th class="py-3 px-4 w-28 text-center">Large (LE)</th>
                      <th class="py-3 px-4 w-24 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody class="text-xs font-light divide-y divide-[#2A2522]/5">
                    <tr *ngFor="let gov of governorates()" class="hover:bg-[#2A2522]/2 transition-colors">
                      <td class="py-3 px-4 font-lexend font-medium tracking-wide text-sm">{{ gov.governorate }}</td>
                      
                      <!-- Small Price -->
                      <td class="py-2 px-4 text-center">
                        <span *ngIf="!gov.isEditing" class="font-lexend">{{ gov.basePriceSmall | number:'1.2-2' }}</span>
                        <input *ngIf="gov.isEditing" type="number" [(ngModel)]="gov.basePriceSmall" class="px-2 py-1 w-20 bg-white border border-[#2A2522]/15 rounded text-center text-xs font-lexend focus:outline-none" />
                      </td>

                      <!-- Medium Price -->
                      <td class="py-2 px-4 text-center">
                        <span *ngIf="!gov.isEditing" class="font-lexend">{{ gov.basePriceMedium | number:'1.2-2' }}</span>
                        <input *ngIf="gov.isEditing" type="number" [(ngModel)]="gov.basePriceMedium" class="px-2 py-1 w-20 bg-white border border-[#2A2522]/15 rounded text-center text-xs font-lexend focus:outline-none" />
                      </td>

                      <!-- Large Price -->
                      <td class="py-2 px-4 text-center">
                        <span *ngIf="!gov.isEditing" class="font-lexend">{{ gov.basePriceLarge | number:'1.2-2' }}</span>
                        <input *ngIf="gov.isEditing" type="number" [(ngModel)]="gov.basePriceLarge" class="px-2 py-1 w-20 bg-white border border-[#2A2522]/15 rounded text-center text-xs font-lexend focus:outline-none" />
                      </td>

                      <!-- Action Button -->
                      <td class="py-2 px-4 text-center font-lexend">
                        <button *ngIf="!gov.isEditing" (click)="startEditGovernorate(gov)" class="text-[#B84F7D] hover:text-[#B84F7D]/80 text-[10px] font-bold uppercase tracking-widest transition-colors">
                          Edit
                        </button>
                        <div *ngIf="gov.isEditing" class="flex gap-2 justify-center">
                          <button (click)="saveGovernorate(gov)" class="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold uppercase tracking-widest">
                            Save
                          </button>
                          <button (click)="cancelEditGovernorate(gov)" class="text-[#8A817C] hover:text-[#2A2522] text-[10px] font-bold uppercase tracking-widest">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Right Column: Package Combination Rules -->
          <div class="space-y-6">
            <!-- Sizing Combination Rules -->
            <div class="frosted-card p-6 rounded-2xl space-y-4">
              <div class="border-b border-[#2A2522]/10 pb-4">
                <h3 class="title-header text-base font-light text-[#2A2522]">Sizing Combo Rules</h3>
                <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Consolidate multiple items into single package size</span>
              </div>

              <!-- Rules list -->
              <div class="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                <div *ngFor="let rule of comboRules()" class="p-3 bg-white border border-[#2A2522]/5 rounded-xl text-xs flex justify-between items-center hover:shadow-xs transition-shadow">
                  <div class="space-y-0.5">
                    <div class="font-semibold text-[#2A2522] font-lexend">
                      {{ rule.inputSmallCount }} Small + {{ rule.inputMediumCount }} Medium
                    </div>
                    <div class="text-[10px] text-[#8A817C] font-light flex items-center gap-1">
                      Result: <span class="bg-[#B84F7D]/10 text-[#B84F7D] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-[8px] font-lexend">{{ getShippingSizeName(rule.resultingSize) }}</span>
                    </div>
                  </div>
                  <button (click)="deleteComboRule(rule.id)" class="text-red-500 hover:text-red-700 text-xs p-1">
                    ✕
                  </button>
                </div>
                <div *ngIf="comboRules().length === 0" class="text-center py-6 text-xs text-[#8A817C] font-light italic">
                  No combination rules configured.
                </div>
              </div>

              <!-- New rule creator form -->
              <div class="border-t border-[#2A2522]/10 pt-4 space-y-3">
                <h4 class="title-header text-[10px] font-bold text-[#2A2522]">Create Combination Rule</h4>
                
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[8px] uppercase tracking-widest font-semibold text-[#8A817C] block">Small Qty *</label>
                    <input type="number" [(ngModel)]="ruleInputSmallCount" class="w-full px-2.5 py-1.5 bg-white border border-[#2A2522]/10 rounded-lg text-xs font-lexend text-center focus:outline-none" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[8px] uppercase tracking-widest font-semibold text-[#8A817C] block">Medium Qty *</label>
                    <input type="number" [(ngModel)]="ruleInputMediumCount" class="w-full px-2.5 py-1.5 bg-white border border-[#2A2522]/10 rounded-lg text-xs font-lexend text-center focus:outline-none" />
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[8px] uppercase tracking-widest font-semibold text-[#8A817C] block">Resulting Size *</label>
                  <select [(ngModel)]="ruleResultingSize" class="w-full px-3 py-1.5 bg-white border border-[#2A2522]/10 rounded-lg text-xs focus:outline-none">
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                <button (click)="createComboRule()" class="w-full py-2.5 bg-[#2A2522] hover:bg-[#B84F7D] text-[#FBF9F6] text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
                  + Add Combo Rule
                </button>
            </div>
          </div>
        </div>

      </div>

        <!-- TAB 5: BRANDS DIRECTORY -->
        <div *ngIf="currentTab() === 'brands'" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-[#2A2522]">
          <!-- Left 2 Columns: Brand Grid List -->
          <div class="lg:col-span-2 space-y-6">
            <div class="frosted-card p-6 rounded-2xl space-y-4">
              <div class="border-b border-[#2A2522]/10 pb-4 flex justify-between items-center">
                <div>
                  <h3 class="title-header text-base font-light text-[#2A2522]">Design Houses &amp; Brands</h3>
                  <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Catalog brands, logos, and storefront cards promotion settings</span>
                </div>
                <button (click)="loadBrands()" class="px-3.5 py-1.5 border border-[#2A2522]/10 hover:bg-[#2A2522]/5 text-[#2A2522] text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all">
                  ↻ Refresh Brands
                </button>
              </div>

              <!-- Message Banner -->
              <div *ngIf="brandMessage()" class="p-3 text-[10px] uppercase font-bold tracking-wider rounded-xl text-center" 
                   [ngClass]="brandIsError() ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-850'">
                {{ brandMessage() }}
              </div>

              <div *ngIf="loadingBrands()" class="text-center py-12">
                <span class="text-xs text-[#8A817C] uppercase tracking-widest animate-pulse font-lexend">Loading brand registry...</span>
              </div>

              <!-- Brand Cards Grid -->
              <div *ngIf="!loadingBrands()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngFor="let brand of brands()" class="p-4 bg-white/40 border border-[#2A2522]/5 rounded-xl hover:shadow-sm transition-all duration-300 flex items-center justify-between">
                  <div class="flex items-center gap-3.5">
                    <!-- Brand Logo Wrapper -->
                    <div class="w-12 h-12 rounded-full overflow-hidden border border-[#2A2522]/10 bg-white p-1 flex items-center justify-center flex-shrink-0">
                      <img [src]="resolveImageUrl(brand.logoUrl)" [alt]="brand.name" class="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 class="font-lexend text-sm font-semibold text-[#2A2522] tracking-wide">{{ brand.name }}</h4>
                      <div class="flex flex-wrap gap-1.5 mt-1">
                        <span class="text-[8px] uppercase tracking-widest font-lexend font-bold px-1.5 py-0.5 rounded"
                              [ngClass]="brand.showInCards ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-[#2A2522]/5 text-[#8A817C]'">
                          {{ brand.showInCards ? '⭐ Homepage Card' : 'Hidden from Homepage' }}
                        </span>
                        <span class="text-[8px] uppercase tracking-widest font-lexend font-bold px-1.5 py-0.5 rounded"
                              [ngClass]="brand.isVisible ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'">
                          {{ brand.isVisible ? 'Visible' : 'Hidden' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button (click)="startEditBrand(brand)" class="text-[#B84F7D] hover:text-[#B84F7D]/80 text-[10px] font-bold uppercase tracking-widest transition-colors px-2 py-1">
                      Edit
                    </button>
                    <button (click)="deleteBrand(brand.id)" class="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase tracking-widest transition-colors px-2 py-1">
                      Delete
                    </button>
                  </div>
                </div>
                <div *ngIf="brands().length === 0" class="col-span-full text-center py-12 text-xs text-[#8A817C] font-light italic">
                  No brands configured. Register one using the form on the right.
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Brand Creator Form -->
          <div class="space-y-6">
            <div class="frosted-card p-6 rounded-2xl space-y-4">
              <div class="border-b border-[#2A2522]/10 pb-4">
                <h3 class="title-header text-base font-light text-[#2A2522]">{{ editingBrandId() ? 'Modify Brand' : 'Register Brand' }}</h3>
                <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">
                  {{ editingBrandId() ? 'Save edits to database' : 'Add new design house to catalog' }}
                </span>
              </div>

              <div class="space-y-4">
                <!-- Name input -->
                <div class="space-y-1">
                  <label class="text-[8px] uppercase tracking-widest font-semibold text-[#8A817C] block">Brand Name *</label>
                  <input type="text" [(ngModel)]="brandFormName" placeholder="E.g. Gucci, Chanel" class="w-full px-3 py-2 bg-white border border-[#2A2522]/10 rounded-lg text-xs focus:outline-none" />
                </div>

                <!-- Logo Upload instead of URL input -->
                <div class="space-y-2">
                   <label class="text-[8px] uppercase tracking-widest font-semibold text-[#8A817C] block">Logo Image *</label>
                   <app-image-uploader 
                     [imageUrl]="brandFormLogoUrl" 
                     (uploaded)="brandFormLogoUrl = $event"
                     label="Choose Logo File"
                   ></app-image-uploader>
                 </div>

                <!-- Show in Cards checkbox -->
                <div class="flex items-center gap-2.5 py-1">
                  <input type="checkbox" id="brandFormShowInCards" [(ngModel)]="brandFormShowInCards" class="w-4 h-4 rounded border-[#2A2522]/10 text-[#B84F7D] focus:ring-[#B84F7D]" />
                  <label for="brandFormShowInCards" class="text-[10px] uppercase tracking-widest font-semibold text-[#2A2522] cursor-pointer select-none">
                    Show in Homepage Cards
                  </label>
                </div>

                <!-- Is Visible checkbox -->
                <div class="flex items-center gap-2.5 py-1">
                  <input type="checkbox" id="brandFormIsVisible" [(ngModel)]="brandFormIsVisible" class="w-4 h-4 rounded border-[#2A2522]/10 text-[#B84F7D] focus:ring-[#B84F7D]" />
                  <label for="brandFormIsVisible" class="text-[10px] uppercase tracking-widest font-semibold text-[#2A2522] cursor-pointer select-none">
                    Visible to Customers
                  </label>
                </div>

                <div class="flex gap-2.5 pt-2">
                  <button (click)="editingBrandId() ? updateBrand() : createBrand()" [disabled]="submittingBrand()" class="flex-1 py-2.5 bg-[#2A2522] hover:bg-[#B84F7D] text-[#FBF9F6] text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50">
                    {{ submittingBrand() ? 'Saving...' : (editingBrandId() ? 'Save Brand' : 'Create Brand') }}
                  </button>
                  <button *ngIf="editingBrandId()" (click)="cancelEditBrand()" class="py-2.5 px-4 border border-[#2A2522]/15 hover:bg-[#2A2522]/5 text-[#2A2522] text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
                    Cancel
                  </button>
                </div>
              </div>
                </div>
              </div>
            </div>

        <!-- TAB 6: ENTERPRISE ANALYTICS LEDGER -->
        <div *ngIf="currentTab() === 'analytics'" class="space-y-8 animate-fade-in text-[#2A2522]">
          <!-- Top Block: Financial Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Total Sales Card -->
            <div class="frosted-card p-6 rounded-2xl flex flex-col justify-between h-36">
              <span class="tracking-widest font-lexend text-[9px] uppercase font-semibold text-[#8A817C]">Total Gross Sales</span>
              <div class="text-3xl font-light font-lexend tracking-wide text-[#2A2522]">
                {{ (analyticsSummary()?.totalSales || 0) | currency:'EGP ' }}
              </div>
              <span class="text-[9px] font-lexend text-[#8A817C] uppercase tracking-wider">Active delivered & shipped orders</span>
            </div>

            <!-- Net Profit Card -->
            <div class="frosted-card p-6 rounded-2xl flex flex-col justify-between h-36">
              <span class="tracking-widest font-lexend text-[9px] uppercase font-semibold text-[#8A817C]">Net Operation Profit</span>
              <div class="text-3xl font-light font-lexend tracking-wide text-[#2A2522]">
                {{ (analyticsSummary()?.netProfit || 0) | currency:'EGP ' }}
              </div>
              <span class="text-[9px] font-lexend text-[#8A817C] uppercase tracking-wider">Gross sales minus wholesale costs</span>
            </div>

            <!-- Shipping Revenue Card -->
            <div class="frosted-card p-6 rounded-2xl flex flex-col justify-between h-36">
              <span class="tracking-widest font-lexend text-[9px] uppercase font-semibold text-[#8A817C]">Shipping Fees Collected</span>
              <div class="text-3xl font-light font-lexend tracking-wide text-[#2A2522]">
                {{ (analyticsSummary()?.totalShippingCollected || 0) | currency:'EGP ' }}
              </div>
              <span class="text-[9px] font-lexend text-[#8A817C] uppercase tracking-wider">Logistics delivery revenues</span>
            </div>
          </div>

          <!-- Base Layout: Dual Columns -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Left Column: Geographic Traffic Console -->
            <div class="frosted-card p-6 rounded-2xl space-y-6">
              <div>
                <h3 class="title-header text-base font-light text-[#2A2522]">Geographic Traffic Radar</h3>
                <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Real-time visitor locations and order shipping hubs</span>
              </div>

              <!-- Top Countries -->
              <div class="space-y-3">
                <span class="text-[10px] uppercase tracking-widest font-bold text-[#8A817C] block border-b border-[#2A2522]/5 pb-1">Top Countries</span>
                <div class="space-y-2">
                  <div *ngFor="let item of countryList()" class="flex justify-between items-center text-xs font-light py-1">
                    <span class="font-lexend tracking-wide flex items-center gap-2 text-[13px]">
                      🌍 {{ item.name }}
                    </span>
                    <span class="font-lexend font-medium bg-[#2A2522]/5 px-2 py-0.5 rounded">{{ item.count }} visits</span>
                  </div>
                  <div *ngIf="countryList().length === 0" class="text-center py-4 text-xs text-[#8A817C] font-light italic">
                    No country traffic recorded.
                  </div>
                </div>
              </div>

              <!-- Top Egypt Governorates -->
              <div class="space-y-3 pt-2">
                <span class="text-[10px] uppercase tracking-widest font-bold text-[#8A817C] block border-b border-[#2A2522]/5 pb-1">Top Egyptian Governorates</span>
                <div class="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                  <div *ngFor="let item of governorateList()" class="flex justify-between items-center text-xs font-light py-1">
                    <span class="font-lexend tracking-wide text-[13px]">
                      📍 {{ item.name }}
                    </span>
                    <span class="font-lexend font-medium bg-[#2A2522]/5 px-2 py-0.5 rounded">{{ item.count }} hits</span>
                  </div>
                  <div *ngIf="governorateList().length === 0" class="text-center py-4 text-xs text-[#8A817C] font-light italic">
                    No governorate traffic recorded.
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Transaction Auditing -->
            <div class="frosted-card p-6 rounded-2xl space-y-6">
              <div>
                <h3 class="title-header text-base font-light text-[#2A2522]">Transaction Auditing</h3>
                <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Digital wallet verification logs and failure codes</span>
              </div>

              <!-- Verification Success / Rejection Rate Graph -->
              <div class="space-y-4 bg-white/40 p-5 rounded-xl border border-[#2A2522]/5">
                <span class="text-[9px] uppercase tracking-widest font-bold text-[#8A817C] block mb-2">InstaPay verification rate</span>
                
                <div class="space-y-3">
                  <!-- Approved Wallet checks -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs font-light">
                      <span>Approved Wallet Payments</span>
                      <span class="font-lexend">{{ walletApprovedCount() }}</span>
                    </div>
                    <div class="w-full bg-[#2A2522]/5 h-1.5 rounded-full overflow-hidden">
                      <div class="bg-emerald-700 h-full rounded-full" [style.width.%]="walletApprovedPercent()"></div>
                    </div>
                  </div>

                  <!-- Rejected Wallet checks -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs font-light">
                      <span>Rejected Wallet Payments</span>
                      <span class="font-lexend">{{ walletRejectedCount() }}</span>
                    </div>
                    <div class="w-full bg-[#2A2522]/5 h-1.5 rounded-full overflow-hidden">
                      <div class="bg-red-700 h-full rounded-full" [style.width.%]="walletRejectedPercent()"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Rejection Reasons Summary List -->
              <div class="space-y-3">
                <span class="text-[10px] uppercase tracking-widest font-bold text-[#8A817C] block border-b border-[#2A2522]/5 pb-1">Audit Failure Reason Codes</span>
                <div class="space-y-2">
                  <div *ngFor="let reason of failureReasonList()" class="flex justify-between items-start text-xs font-light py-1">
                    <span class="text-[#8A817C] font-lexend text-[11px] block pr-4">
                      ⚠ {{ reason.text }}
                    </span>
                    <span class="font-lexend font-medium bg-red-50 text-red-700 border border-red-150 px-2 py-0.5 rounded flex-shrink-0">{{ reason.count }} matches</span>
                  </div>
                  <div *ngIf="failureReasonList().length === 0" class="text-center py-6 text-xs text-[#8A817C] font-light italic">
                    0 rejection codes recorded.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 7: ACCESS CONTROL LEDGER -->
        <div *ngIf="currentTab() === 'roles'" class="space-y-8 animate-fade-in text-[#2A2522]">
          <div class="border-b border-[#2A2522]/10 pb-4">
            <h3 class="title-header text-lg font-light text-[#2A2522]">Access Control Ledger</h3>
            <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Configure permission mapping across system roles & administrative authorities</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column: Role List & Creation -->
            <div class="lg:col-span-1 space-y-6">
              <div class="frosted-card p-6 rounded-2xl space-y-4">
                <h4 class="title-header text-[10px] font-bold text-[#2A2522] border-b border-[#2A2522]/5 pb-2">System Roles</h4>
                
                <!-- Roles List -->
                <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  <div 
                    *ngFor="let role of roles()" 
                    (click)="selectRole(role)"
                    [ngClass]="selectedRoleId() === role.id ? 'bg-[#2A2522]/5 border-[#B84F7D]' : 'bg-white/40 border-transparent'"
                    class="p-4 border-l-2 rounded-r-xl cursor-pointer hover:bg-[#2A2522]/5 transition-all duration-300 flex flex-col gap-1"
                  >
                    <div class="flex justify-between items-center">
                      <span class="text-xs uppercase tracking-wider font-bold" [ngClass]="selectedRoleId() === role.id ? 'text-[#B84F7D]' : 'text-[#2A2522]'">
                        {{ role.name }}
                      </span>
                      <span class="text-[9px] font-lexend bg-[#2A2522]/5 px-1.5 py-0.5 rounded text-[#8A817C]">{{ role.permissions.length }} perms</span>
                    </div>
                    <span class="text-[10px] text-[#8A817C] font-light leading-relaxed">{{ role.description }}</span>
                  </div>
                </div>

                <!-- Create New Role Inline Input -->
                <div class="border-t border-[#2A2522]/10 pt-4 space-y-3">
                  <h5 class="text-[9px] uppercase tracking-widest font-bold text-[#8A817C] block">Propose New Role</h5>
                  <div class="space-y-2">
                    <input 
                      type="text" 
                      [(ngModel)]="newRoleName" 
                      placeholder="Role Tag (e.g. Sales)" 
                      class="w-full px-3 py-2 bg-white border border-[#2A2522]/10 rounded-xl text-xs focus:outline-none focus:border-[#B84F7D] transition-colors placeholder:text-[#8A817C]/50" 
                    />
                    <input 
                      type="text" 
                      [(ngModel)]="newRoleDescription" 
                      placeholder="Role description..." 
                      class="w-full px-3 py-2 bg-white border border-[#2A2522]/10 rounded-xl text-xs focus:outline-none focus:border-[#B84F7D] transition-colors placeholder:text-[#8A817C]/50" 
                    />
                    <button 
                      (click)="createRole()" 
                      class="w-full py-2 bg-[#2A2522] hover:bg-[#B84F7D] text-[#FBF9F6] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                      + Register Role
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Permissions Console Checklist -->
            <div class="lg:col-span-2 space-y-6">
              <div class="frosted-card p-6 rounded-2xl space-y-6">
                <div class="border-b border-[#2A2522]/5 pb-3 flex justify-between items-center">
                  <div>
                    <h4 class="title-header text-[10px] font-bold text-[#2A2522]">Permission Token Grid</h4>
                    <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Assign capabilities directly to selected user authority</span>
                  </div>
                  
                  <button 
                    *ngIf="selectedRoleId()" 
                    [disabled]="savingPermissions()"
                    (click)="savePermissions()" 
                    class="px-5 py-2.5 bg-[#B84F7D] hover:bg-[#2A2522] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm disabled:opacity-50"
                  >
                    {{ savingPermissions() ? 'Saving Changes...' : 'Save Console Changes' }}
                  </button>
                </div>

                <div *ngIf="selectedRoleId(); else noRoleSelected" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    *ngFor="let feat of featuresList" 
                    class="p-5 frosted-card rounded-2xl hover:border-[#B84F7D]/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h5 class="title-header text-xs font-bold text-[#2A2522] mb-1">{{ feat.label }}</h5>
                      <span class="text-[9px] uppercase tracking-wider text-[#8A817C] font-lexend block">Feature: {{ feat.key }}</span>
                    </div>

                    <!-- Inline Horizontal Flex Layout with 4 explicit checkboxes -->
                    <div class="flex flex-wrap gap-4 items-center border-t border-[#2A2522]/5 pt-3">
                      <div 
                        *ngFor="let act of actionsList" 
                        (click)="toggleGranularPermission(feat.key, act)"
                        class="flex items-center gap-2 cursor-pointer select-none group/item"
                      >
                        <!-- Custom Luxury Checkbox -->
                        <div 
                          [ngClass]="hasGranularPermission(feat.key, act) ? 'border-[#B84F7D] bg-[#B84F7D]' : 'border-[#2A2522]/20 bg-transparent group-hover/item:border-[#B84F7D]/50'" 
                          class="w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0"
                        >
                          <svg *ngIf="hasGranularPermission(feat.key, act)" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span 
                          [ngClass]="hasGranularPermission(feat.key, act) ? 'text-[#B84F7D] font-bold' : 'text-[#2A2522]'"
                          class="text-[10px] uppercase tracking-widest font-lexend transition-colors"
                        >
                          {{ act }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <ng-template #noRoleSelected>
                  <div class="text-center py-16 text-xs text-[#8A817C] italic">
                    Select a system role from the left panel to modify its capabilities.
                  </div>
                </ng-template>
              </div>
            </div>
          </div>

          <!-- User Directory / Authority Delegation -->
          <div class="frosted-card p-6 rounded-2xl space-y-6 mt-8">
            <div class="border-b border-[#2A2522]/5 pb-3 flex justify-between items-center">
              <div>
                <h4 class="title-header text-sm font-semibold text-[#2A2522] uppercase">User Directory &amp; Authority Delegation</h4>
                <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Assign system roles directly to registered personnel</span>
              </div>
              <button 
                (click)="loadUsers()"
                class="px-4 py-2 border border-[#2A2522]/10 hover:bg-[#2A2522]/5 text-[#2A2522] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                Refresh Users
              </button>
            </div>

            <!-- Loader or Users Table -->
            <div *ngIf="loadingUsers()" class="py-8 text-center">
              <span class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B84F7D] inline-block"></span>
            </div>

            <div *ngIf="!loadingUsers() && systemUsers().length === 0" class="text-center py-10 text-[#8A817C] text-xs font-light">
              No registered administrative personnel found.
            </div>

            <div *ngIf="!loadingUsers() && systemUsers().length > 0" class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-[#2A2522]/5 text-[9px] uppercase tracking-widest font-bold text-[#8A817C]">
                    <th class="py-3 px-4">Full Name</th>
                    <th class="py-3 px-4">Email</th>
                    <th class="py-3 px-4">Phone</th>
                    <th class="py-3 px-4">Assigned Role</th>
                    <th class="py-3 px-4 text-right">Delegate Position</th>
                  </tr>
                </thead>
                <tbody class="text-xs font-light text-[#4A4340] divide-y divide-[#2A2522]/5">
                  <tr *ngFor="let user of systemUsers()" class="hover:bg-[#2A2522]/5 transition-colors">
                    <td class="py-3.5 px-4 font-semibold text-[#2A2522]">{{ user.fullName }}</td>
                    <td class="py-3.5 px-4 font-lexend">{{ user.email }}</td>
                    <td class="py-3.5 px-4 font-lexend">{{ user.phoneNumber || 'N/A' }}</td>
                    <td class="py-3.5 px-4">
                      <span class="text-[9px] uppercase tracking-wider font-bold bg-[#B84F7D]/10 text-[#B84F7D] px-2 py-0.5 rounded">
                        {{ user.roleName }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <select 
                        [ngModel]="user.roleId" 
                        (ngModelChange)="assignUserRole(user.id, $event)"
                        class="px-2 py-1 bg-white border border-[#2A2522]/10 rounded-lg text-[10px] focus:outline-none focus:border-[#B84F7D]"
                      >
                        <option *ngFor="let r of roles()" [value]="r.id">{{ r.name }}</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Notifications Console Tab Content -->
        <div *ngIf="currentTab() === 'notifications'" class="space-y-6 animate-fade-in text-[#2A2522]">
          <div class="border-b border-[#2A2522]/10 pb-4">
            <h3 class="title-header text-lg font-light text-[#2A2522] tracking-[0.05em] uppercase">Notification Routing Console</h3>
            <p class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend mt-2 leading-relaxed">
              Designate which personnel and staff members receive real-time alerts when new orders are placed.
            </p>
          </div>

          <div class="frosted-card p-6 rounded-2xl space-y-6">
            <div class="flex justify-between items-center border-b border-[#2A2522]/5 pb-3">
              <div>
                <h4 class="title-header text-sm font-semibold text-[#2A2522] uppercase">Staff Alerts Subscriptions</h4>
                <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Check/uncheck users to configure new order notification dispatch</span>
              </div>
              <button 
                (click)="loadSubscriptions()"
                class="px-4 py-2 border border-[#2A2522]/10 hover:bg-[#2A2522]/5 text-[#2A2522] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                Refresh Console
              </button>
            </div>

            <!-- Loader or subscriptions table -->
            <div *ngIf="loadingSubscriptions()" class="py-8 text-center">
              <span class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B84F7D] inline-block"></span>
            </div>

            <div *ngIf="!loadingSubscriptions() && subscriptions().length === 0" class="text-center py-10 text-[#8A817C] text-xs font-light">
              No personnel found to configure alert subscriptions.
            </div>

            <div *ngIf="!loadingSubscriptions() && subscriptions().length > 0" class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-[#2A2522]/5 text-[9px] uppercase tracking-widest font-bold text-[#8A817C]">
                    <th class="py-3 px-4">Full Name</th>
                    <th class="py-3 px-4">Email</th>
                    <th class="py-3 px-4">Assigned Role</th>
                    <th class="py-3 px-4 text-center">Receive New Order Alerts</th>
                  </tr>
                </thead>
                <tbody class="text-xs font-light text-[#4A4340] divide-y divide-[#2A2522]/5">
                  <tr *ngFor="let sub of subscriptions()" class="hover:bg-[#2A2522]/5 transition-colors">
                    <td class="py-3.5 px-4 font-semibold text-[#2A2522]">{{ sub.fullName }}</td>
                    <td class="py-3.5 px-4 font-lexend">{{ sub.email }}</td>
                    <td class="py-3.5 px-4">
                      <span class="text-[9px] uppercase tracking-wider font-bold bg-[#B84F7D]/10 text-[#B84F7D] px-2 py-0.5 rounded">
                        {{ sub.roleName }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-center flex justify-center">
                      <!-- Toggle Checkbox -->
                      <div 
                        (click)="toggleSubscription(sub)"
                        class="flex items-center gap-2 cursor-pointer select-none group/toggle"
                      >
                        <!-- Custom Checkbox -->
                        <div 
                          [ngClass]="sub.isSubscribed ? 'border-[#B84F7D] bg-[#B84F7D]' : 'border-[#2A2522]/20 bg-transparent group-hover/toggle:border-[#B84F7D]/50'" 
                          class="w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0"
                        >
                          <svg *ngIf="sub.isSubscribed" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 9: INVENTORY ATTRIBUTES LEDGER (Colors & Sizes) -->
        <div *ngIf="currentTab() === 'attributes'" class="space-y-8 animate-fade-in text-[#2A2522]">
          <div class="border-b border-[#2A2522]/10 pb-4">
            <h3 class="title-header text-lg font-light text-[#2A2522]">Inventory Attributes Console</h3>
            <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Manage dynamic product colors and size choices across all categories</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Panel: Colors Swatches & Palette Builder -->
            <div class="space-y-6">
              <div class="frosted-card p-6 rounded-2xl space-y-6">
                <div class="flex justify-between items-center border-b border-[#2A2522]/5 pb-3">
                  <div>
                    <h4 class="title-header text-sm font-semibold text-[#2A2522] uppercase">🎨 Colors Registry</h4>
                    <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Predefined color palette with visual previews</span>
                  </div>
                  <button (click)="loadColors()" class="text-[9px] font-lexend text-[#B84F7D] hover:underline uppercase tracking-wider font-bold">Refresh</button>
                </div>

                <!-- Colors List -->
                <div class="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  <div *ngFor="let col of availableColors()" class="p-3 bg-white/40 border border-[#2A2522]/5 rounded-xl flex items-center justify-between hover:bg-white/60 transition-all">
                    <div class="flex items-center gap-3">
                      <span class="w-6 h-6 rounded-full border border-black/10 flex-shrink-0" [style.background-color]="col.hexCode"></span>
                      <div class="flex flex-col">
                        <span class="text-xs font-bold text-[#2A2522]">{{ col.name }}</span>
                        <span class="text-[9px] font-mono text-[#8A817C] uppercase">{{ col.hexCode }}</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button (click)="startEditColor(col)" class="text-[#B84F7D] hover:text-[#B84F7D]/85 text-[10px] uppercase font-bold tracking-widest">Edit</button>
                      <span class="text-[#2A2522]/10 text-xs">|</span>
                      <button (click)="deleteColor(col.id)" class="text-red-500 hover:text-red-700 text-[10px] uppercase font-bold tracking-widest">Delete</button>
                    </div>
                  </div>
                  <div *ngIf="availableColors().length === 0" class="text-center py-6 text-xs text-[#8A817C] italic">No colors defined.</div>
                </div>

                <!-- Add/Edit Color Form -->
                <div class="border-t border-[#2A2522]/10 pt-4 space-y-3">
                  <h5 class="text-[9px] uppercase tracking-widest font-bold text-[#B84F7D]">
                    {{ editingColorId() ? 'Modify Color Option' : 'Register New Color Swatch' }}
                  </h5>
                  <div class="grid grid-cols-3 gap-2 items-end">
                    <div class="col-span-2 space-y-1">
                      <label class="text-[8px] uppercase tracking-widest text-[#8A817C] font-bold">Color Name</label>
                      <input 
                        type="text" 
                        [(ngModel)]="newColorName" 
                        placeholder="E.g. Sage, Blush" 
                        class="w-full px-3 py-2 bg-white border border-[#2A2522]/10 rounded-xl text-xs focus:outline-none focus:border-[#B84F7D] transition-colors" 
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-[8px] uppercase tracking-widest text-[#8A817C] font-bold block">Hex / Color</label>
                      <div class="flex items-center gap-2">
                        <input 
                          type="color" 
                          [ngModel]="newColorHex()" 
                          (ngModelChange)="onColorHexChange($event)"
                          class="w-8 h-8 rounded-lg cursor-pointer border border-[#2A2522]/10 p-0 flex-shrink-0"
                        />
                        <input 
                          type="text" 
                          [ngModel]="newColorHex()" 
                          (ngModelChange)="onColorHexChange($event)"
                          placeholder="#FFFFFF" 
                          class="w-full px-2 py-1.5 bg-white border border-[#2A2522]/10 rounded-lg text-[10px] font-mono uppercase text-center focus:outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2 pt-1">
                    <button 
                      (click)="saveColor()" 
                      class="flex-1 py-2 bg-[#2A2522] hover:bg-[#B84F7D] text-[#FBF9F6] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                      {{ editingColorId() ? 'Save Color' : '+ Register Swatch' }}
                    </button>
                    <button 
                      *ngIf="editingColorId()"
                      (click)="cancelEditColor()" 
                      class="px-4 py-2 border border-[#2A2522]/15 text-[#8A817C] hover:bg-[#2A2522]/5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Panel: Sizes Console -->
            <div class="space-y-6">
              <div class="frosted-card p-6 rounded-2xl space-y-6">
                <div class="flex justify-between items-center border-b border-[#2A2522]/5 pb-3">
                  <div>
                    <h4 class="title-header text-sm font-semibold text-[#2A2522] uppercase">📏 Sizes Registry</h4>
                    <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend">Configured size lists filtered by target collection</span>
                  </div>
                  <button (click)="loadSizes()" class="text-[9px] font-lexend text-[#B84F7D] hover:underline uppercase tracking-wider font-bold">Refresh</button>
                </div>

                <!-- Sizes List -->
                <div class="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  <div *ngFor="let sz of availableSizes()" class="p-3 bg-white/40 border border-[#2A2522]/5 rounded-xl flex items-center justify-between hover:bg-white/60 transition-all">
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-[#2A2522]">{{ sz.name }}</span>
                      <span class="text-[9px] uppercase tracking-widest text-[#8A817C] font-lexend font-semibold">Category: {{ sz.categoryType }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-[9px] font-mono text-[#8A817C] bg-[#2A2522]/5 px-2 py-0.5 rounded">Order: {{ sz.sortOrder }}</span>
                      <div class="flex items-center gap-2">
                        <button (click)="startEditSize(sz)" class="text-[#B84F7D] hover:text-[#B84F7D]/85 text-[10px] uppercase font-bold tracking-widest">Edit</button>
                        <span class="text-[#2A2522]/10 text-xs">|</span>
                        <button (click)="deleteSize(sz.id)" class="text-red-500 hover:text-red-700 text-[10px] uppercase font-bold tracking-widest">Delete</button>
                      </div>
                    </div>
                  </div>
                  <div *ngIf="availableSizes().length === 0" class="text-center py-6 text-xs text-[#8A817C] italic">No sizes defined.</div>
                </div>

                <!-- Add/Edit Size Form -->
                <div class="border-t border-[#2A2522]/10 pt-4 space-y-3">
                  <h5 class="text-[9px] uppercase tracking-widest font-bold text-[#B84F7D]">
                    {{ editingSizeId() ? 'Modify Size Option' : 'Register New Size Option' }}
                  </h5>
                  <div class="grid grid-cols-3 gap-2 items-end">
                    <div class="space-y-1">
                      <label class="text-[8px] uppercase tracking-widest text-[#8A817C] font-bold">Size Name</label>
                      <input 
                        type="text" 
                        [(ngModel)]="newSizeName" 
                        placeholder="E.g. S, M, EU 37" 
                        class="w-full px-3 py-2 bg-white border border-[#2A2522]/10 rounded-xl text-xs focus:outline-none focus:border-[#B84F7D] transition-colors" 
                      />
                    </div>
                    <div class="space-y-1 col-span-2">
                      <label class="text-[8px] uppercase tracking-widest text-[#8A817C] font-bold">Category / Size Type</label>
                      <select 
                        [ngModel]="newSizeCategoryType()" 
                        (ngModelChange)="onSizeCategoryTypeChange($event)"
                        class="w-full px-3 py-2 bg-white border border-[#2A2522]/10 rounded-xl text-xs focus:outline-none focus:border-[#B84F7D] transition-colors"
                      >
                        <option value="Women Clothing">Women Clothing</option>
                        <option value="Women Shoes">Women Shoes</option>
                        <option value="Kids Clothing">Kids Clothing</option>
                        <option value="Kids Shoes">Kids Shoes</option>
                        <option value="Universal">Universal</option>
                      </select>
                    </div>
                  </div>
                  <div class="flex gap-2 pt-1">
                    <button 
                      (click)="saveSize()" 
                      class="flex-1 py-2 bg-[#2A2522] hover:bg-[#B84F7D] text-[#FBF9F6] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                      {{ editingSizeId() ? 'Save Size' : '+ Register Size' }}
                    </button>
                    <button 
                      *ngIf="editingSizeId()"
                      (click)="cancelEditSize()" 
                      class="px-4 py-2 border border-[#2A2522]/15 text-[#8A817C] hover:bg-[#2A2522]/5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main> <!-- Closes admin-main -->
    </div> <!-- Closes admin-canvas -->

    <!-- Side Drawer Overlay for Order Details -->
    <div 
      *ngIf="selectedOrder()" 
      class="fixed inset-0 z-50 flex justify-end bg-[#2A2522]/30 backdrop-blur-sm transition-all duration-300"
      (click)="closeOrder()"
    >
      <div 
        class="w-full max-w-lg frosted-card h-full p-8 overflow-y-auto space-y-6 text-left border-l"
        (click)="$event.stopPropagation()"
      >
        <!-- Drawer Header -->
        <div class="flex justify-between items-center border-b border-[#2A2522]/5 pb-4">
          <div>
            <span class="text-[9px] font-lexend tracking-widest text-[#B84F7D] uppercase font-semibold">Fulfillment Sheet</span>
            <h3 class="title-header text-lg font-light text-[#2A2522]">{{ selectedOrder()?.orderNumber }}</h3>
          </div>
          <button (click)="closeOrder()" class="text-[#8A817C] hover:text-[#2A2522] text-lg">✕</button>
        </div>

        <div *ngIf="drawerMessage()" class="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg">
          {{ drawerMessage() }}
        </div>

        <!-- Customer & Shipping Block -->
        <div class="space-y-2.5">
          <h4 class="title-header text-[10px] font-bold text-[#2A2522]">Customer Details</h4>
          <div class="text-xs text-[#5A504B] space-y-1.5 bg-white/40 p-4 rounded-xl border border-[#2A2522]/5 font-light">
            <p><strong>Customer:</strong> {{ selectedOrder()?.customerName }}</p>
            <p><strong>Governorate:</strong> {{ selectedOrder()?.shippingGovernorate }}</p>
            <p><strong>Detailed Address:</strong> {{ selectedOrder()?.shippingDetailedAddress }}</p>
            <p><strong>Phone Details:</strong> {{ selectedOrder()?.shippingPrimaryPhone }} <span *ngIf="selectedOrder()?.shippingSecondaryPhone">/ {{ selectedOrder()?.shippingSecondaryPhone }}</span></p>
            <p><strong>Fulfillment Date:</strong> {{ selectedOrder()?.createdAt | date:'yyyy-MM-dd HH:mm' }}</p>
          </div>
        </div>

        <!-- Digital Wallet Verification Drawer Section -->
        <div *ngIf="selectedOrder()?.paymentMethod === 'DigitalWallet'" class="space-y-3">
          <h4 class="title-header text-[10px] font-bold text-[#2A2522]">Digital Wallet Audit</h4>
          <div class="bg-white/40 p-4 rounded-xl border border-[#2A2522]/5 space-y-3 text-xs">
            <div class="flex justify-between items-center">
              <span class="font-light text-[#8A817C]">Sender Identity:</span>
              <strong class="font-semibold">{{ selectedOrder()?.walletVerification?.senderPhoneNumberOrName }}</strong>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-light text-[#8A817C]">Audit Status:</span>
              <span class="font-bold text-[#B84F7D] uppercase tracking-wider text-[9px] bg-[#B84F7D]/10 px-2 py-0.5 rounded">
                {{ selectedOrder()?.walletVerification?.isVerified ? 'VERIFIED' : 'PENDING AUDIT' }}
              </span>
            </div>

            <!-- Image Screenshot -->
            <div class="w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#2A2522]/10 bg-[#2A2522]/5 relative group">
              <img [src]="resolveImageUrl(selectedOrder()?.walletVerification?.screenshotUrl)" alt="Payment Screenshot" class="w-full h-full object-contain cursor-zoom-in"/>
              <a [href]="resolveImageUrl(selectedOrder()?.walletVerification?.screenshotUrl)" target="_blank" class="absolute bottom-2 right-2 bg-[#2A2522]/80 text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded transition-all opacity-0 group-hover:opacity-100 font-lexend">View Fullscreen</a>
            </div>

            <!-- Audit Approve / Reject Controls -->
            <div *ngIf="!selectedOrder()?.walletVerification?.isVerified" class="grid grid-cols-2 gap-3 pt-2">
              <button 
                (click)="verifyWallet(true)" 
                class="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm"
              >
                Approve Payment
              </button>
              <button 
                (click)="verifyWallet(false)" 
                class="py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm"
              >
                Reject / Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- State Machine Transition Trigger -->
        <div class="space-y-3">
          <h4 class="title-header text-[10px] font-bold text-[#2A2522]">Order Actions</h4>
          <div class="grid grid-cols-2 gap-3">
            <button 
              *ngIf="selectedOrder()?.status === 'ConfirmedPreparing'" 
              (click)="updateStatus('OutForDelivery')"
              class="py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Ship Order (Out)
            </button>
            <button 
              *ngIf="selectedOrder()?.status === 'OutForDelivery'" 
              (click)="updateStatus('Delivered')"
              class="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Mark Delivered
            </button>
            <button 
              *ngIf="selectedOrder()?.status === 'OutForDelivery'" 
              (click)="updateStatus('ReturnedRejected')"
              class="py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Mark Returned (Failed)
            </button>
            <button
              type="button"
              (click)="printShippingLabel(selectedOrder()?.id)"
              class="py-2.5 bg-[#1F85A0] hover:bg-[#1F85A0]/80 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all text-center block w-full cursor-pointer"
            >
              Print Shipping Label
            </button>
          </div>
        </div>

        <!-- Packing List & Partial Return Section -->
        <div class="space-y-3 border-t border-[#2A2522]/5 pt-4">
          <div class="flex justify-between items-center">
            <h4 class="title-header text-[10px] font-bold text-[#2A2522]">Itemized Packing Checklist</h4>
            <span class="text-[9px] text-[#8A817C] font-lexend">Invoice Recalculations</span>
          </div>

          <div class="space-y-3">
            <div 
              *ngFor="let item of selectedOrder()?.items; let i = index" 
              class="flex flex-col gap-2 p-3 bg-white/40 border border-[#2A2522]/5 rounded-xl text-xs"
            >
              <div class="flex justify-between items-start">
                <div>
                  <strong class="font-semibold">{{ item.productName }}</strong>
                  <div class="text-[10px] text-[#8A817C] font-light">Price: {{ item.unitPrice | currency:'EGP ' }}</div>
                </div>
                <div class="text-right">
                  <div>Qty: <strong class="font-bold text-[#2A2522]">{{ item.quantity }}</strong></div>
                  <div *ngIf="item.isReturnedPartially" class="text-[9px] text-red-600 font-bold uppercase">Returned Partially</div>
                </div>
              </div>

              <div *ngIf="selectedOrder()?.status === 'Delivered' && !item.isReturnedPartially" class="flex gap-2 items-center justify-end border-t border-[#2A2522]/5 pt-2 mt-1">
                <span class="text-[9px] text-[#8A817C]">Return Qty:</span>
                <input 
                  type="number" 
                  [(ngModel)]="item.returnQty" 
                  min="0" 
                  [max]="item.quantity"
                  class="w-16 px-2 py-1 bg-[#FBF9F6] border border-[#2A2522]/5 rounded text-xs text-center focus:outline-none font-lexend"
                />
              </div>
            </div>
          </div>

          <!-- Submit Partial Return Button -->
          <div *ngIf="selectedOrder()?.status === 'Delivered' && hasReturnableItems()" class="pt-4 border-t border-[#2A2522]/5">
            <button 
              (click)="submitBulkReturn()"
              class="w-full py-2.5 bg-[#B84F7D] hover:bg-[#B84F7D]/95 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm"
            >
              Submit Partial Return
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Centered Create Promo Code Modal -->
    <div *ngIf="showCreatePromoModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <!-- Backdrop -->
      <div 
        (click)="showCreatePromoModal.set(false); resetPromoForm()" 
        class="fixed inset-0 bg-[#2A2522]/10 backdrop-blur-[3px] pointer-events-auto cursor-pointer"
      ></div>

      <!-- Modal Card -->
      <div class="quick-buy-sheet frosted-card pointer-events-auto max-w-[420px] w-full p-6 rounded-2xl shadow-xl flex flex-col justify-between" style="opacity:1; transform:translateY(0);">
        <!-- Header -->
        <div class="flex justify-between items-center border-b border-[#2A2522]/10 pb-4 mb-4 flex-shrink-0">
          <div>
            <span class="tracking-widest font-lexend text-[9px] uppercase font-bold text-[#B84F7D] block mb-1">Discounts Engine</span>
            <h3 class="title-header text-sm font-light text-[#2A2522]">Create Promo Code</h3>
          </div>
          <button (click)="showCreatePromoModal.set(false); resetPromoForm()" class="text-[#2A2522]/40 hover:text-[#B84F7D] text-sm p-1">✕</button>
        </div>

        <!-- Scrollable content -->
        <div class="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar my-2 max-h-[60vh]">
          <!-- Alert Message -->
          <div *ngIf="promoMessage()" class="p-3 uppercase font-bold tracking-wider text-[9px] rounded-lg text-center"
               [ngClass]="promoIsError() ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'">
            {{ promoMessage() }}
          </div>

          <!-- Code -->
          <div class="space-y-1">
            <label class="text-[8px] uppercase tracking-widest font-bold text-[#8A817C] block">Promo Code String *</label>
            <input 
              type="text" 
              [(ngModel)]="formCode" 
              placeholder="E.g. EID2026, SAVE10"
              class="w-full px-3 py-2 bg-white border border-[#2A2522]/15 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]"
            />
          </div>

          <!-- Discount Type -->
          <div class="space-y-1">
            <label class="text-[8px] uppercase tracking-widest font-bold text-[#8A817C] block">Discount Classification *</label>
            <select 
              [(ngModel)]="formDiscountType" 
              class="w-full px-3 py-2 bg-white border border-[#2A2522]/15 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]"
            >
              <option value="FixedAmount">Fixed Cash Discount (EGP)</option>
              <option value="Percentage">Percentage Off (%)</option>
              <option value="FreeShipping">Free Shipping Coupon</option>
            </select>
          </div>

          <!-- Value (only if not free shipping) -->
          <div class="space-y-1" *ngIf="formDiscountType !== 'FreeShipping'">
            <label class="text-[8px] uppercase tracking-widest font-bold text-[#8A817C] block">
              {{ formDiscountType === 'Percentage' ? 'Discount Percentage (%) *' : 'Discount Cash Value (EGP) *' }}
            </label>
            <input 
              type="number" 
              [(ngModel)]="formValue" 
              placeholder="E.g. 15 or 100"
              class="w-full px-3 py-2 bg-white border border-[#2A2522]/15 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]"
            />
          </div>

          <!-- Min Order Amount -->
          <div class="space-y-1">
            <label class="text-[8px] uppercase tracking-widest font-bold text-[#8A817C] block">Minimum Order Amount Required (EGP)</label>
            <input 
              type="number" 
              [(ngModel)]="formMinOrderAmount" 
              placeholder="E.g. 2000"
              class="w-full px-3 py-2 bg-white border border-[#2A2522]/15 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]"
            />
          </div>

          <!-- Expiry Date -->
          <div class="space-y-1">
            <label class="text-[8px] uppercase tracking-widest font-bold text-[#8A817C] block">Expiry Date *</label>
            <input 
              type="date" 
              [(ngModel)]="formExpiryDate" 
              class="w-full px-3 py-2 bg-white border border-[#2A2522]/15 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]"
            />
          </div>

          <!-- Usage Limit -->
          <div class="space-y-1">
            <label class="text-[8px] uppercase tracking-widest font-bold text-[#8A817C] block">Global Usage Limit</label>
            <input 
              type="number" 
              [(ngModel)]="formUsageLimit" 
              placeholder="E.g. 500"
              class="w-full px-3 py-2 bg-white border border-[#2A2522]/15 rounded-xl text-xs text-[#2A2522] focus:outline-none focus:border-[#B84F7D]"
            />
          </div>

          <!-- Active checkbox -->
          <div class="flex items-center gap-2 pt-1.5">
            <input 
              type="checkbox" 
              [(ngModel)]="formIsActive" 
              id="promo-form-active" 
              class="rounded border-[#2A2522]/15 text-[#B84F7D] focus:ring-[#B84F7D]"
            />
            <label for="promo-form-active" class="text-[9px] uppercase tracking-widest font-bold text-[#8A817C] cursor-pointer select-none">Active Immediately</label>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-4 border-t border-[#2A2522]/10 mt-4 flex-shrink-0">
          <button 
            [disabled]="submittingPromo()"
            (click)="createPromoCode()"
            class="w-full py-3 bg-[#B84F7D] hover:bg-[#2A2522] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
          >
            {{ submittingPromo() ? 'Creating Code...' : 'Create Coupon' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep body, 
    ::ng-deep app-navbar header, 
    ::ng-deep .admin-canvas {
      background-image: none !important;
      background-color: #FBF9F6 !important;
    }
    :host {
      display: block;
      position: relative;
      width: 100vw;
      min-height: 100vh;
      background: radial-gradient(circle at 80% 20%, rgba(231, 111, 81, 0.025) 0%, transparent 50%),
                  radial-gradient(circle at 10% 80%, rgba(42, 37, 34, 0.015) 0%, transparent 60%),
                  #FBF9F6 !important;
      background-image: none !important;
    }
    .admin-canvas {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 32px;
      width: 100vw;
      padding: 40px;
      box-sizing: border-box;
      min-height: 100vh;
      margin-top: 90px;
    }
    .admin-sidebar {
      position: sticky;
      top: 120px;
      height: fit-content;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-right: 24px;
      border-right: 1px solid rgba(42, 37, 34, 0.08);
    }
    .sidebar-title {
      font-family: 'Lexend', sans-serif;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-weight: 700;
      color: #8A817C;
      margin-bottom: 12px;
      padding-left: 20px;
    }
    .sidebar-btn {
      background: transparent;
      border: none;
      font-family: 'Lexend', sans-serif;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #8A817C;
      padding: 12px 20px;
      text-align: left;
      display: flex;
      align-items: center;
      position: relative;
      transition: all 0.3s ease;
      font-weight: 300;
      border-radius: 0 12px 12px 0;
    }
    .sidebar-btn:hover {
      color: #2A2522;
      background: rgba(42, 37, 34, 0.02);
    }
    .sidebar-btn.active {
      color: #E76F51;
      font-weight: 500;
      background: rgba(231, 111, 81, 0.02);
    }
    .sidebar-btn .indicator-line {
      position: absolute;
      left: 0;
      width: 2px;
      height: 0%;
      background: #E76F51;
      transition: height 0.3s ease;
    }
    .sidebar-btn.active .indicator-line {
      height: 60%;
    }
    .admin-main {
      width: 100%;
      min-width: 0;
    }
    .frosted-card {
      background: rgba(255, 255, 255, 0.85) !important;
      backdrop-filter: blur(16px) !important;
      border: 1px solid rgba(42, 37, 34, 0.05) !important;
      box-shadow: 0 20px 50px rgba(42, 37, 34, 0.02) !important;
    }
    .title-header {
      font-family: 'Cormorant Garamond', serif !important;
      text-transform: uppercase !important;
      letter-spacing: 0.1em !important;
    }
    .font-lexend {
      font-family: 'Lexend', sans-serif !important;
    }
    .luxury-experience-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .loader-logo-text {
      font-family: 'Cormorant Garamond', serif;
      font-size: 24px;
      font-weight: 300;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #2A2522;
    }
    .loader-subtitle {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #8A817C;
      margin-top: 4px;
    }
    .loader-bar-container {
      width: 120px;
      height: 2px;
      background: rgba(42, 37, 34, 0.08);
      border-radius: 9999px;
      margin-top: 12px;
      overflow: hidden;
      position: relative;
    }
    .loader-bar-fill-indeterminate {
      position: absolute;
      top: 0;
      bottom: 0;
      background: #B84F7D;
      width: 40%;
      border-radius: 9999px;
      animation: indeterminateLoad 1.5s infinite ease-in-out;
    }
    @keyframes indeterminateLoad {
      0% { left: -40%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
    .selected-row {
      background-color: rgba(184, 79, 125, 0.05) !important;
    }
    @keyframes softBellPulse {
      0%, 100% { transform: rotate(0); }
      10% { transform: rotate(15deg); }
      20% { transform: rotate(-10deg); }
      30% { transform: rotate(10deg); }
      40% { transform: rotate(-5deg); }
      50% { transform: rotate(5deg); }
      60% { transform: rotate(0); }
    }
    .animate-soft-bell {
      animation: softBellPulse 2s infinite ease-in-out;
    }
  `]
})
export class AdminOrdersBoardComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  public authService = inject(AuthService);
  private alertService = inject(AlertService);
  public notificationService = inject(NotificationService);
  private mediaService = inject(MediaService);
  private catalogService = inject(CatalogService);
  private permissionsSubscription?: Subscription;
  resolveImageUrl = resolveImageUrl;

  subscriptions = signal<any[]>([]);
  loadingSubscriptions = signal<boolean>(false);

  loadSubscriptions() {
    this.loadingSubscriptions.set(true);
    this.notificationService.getSubscriptions().subscribe({
      next: (res) => {
        this.loadingSubscriptions.set(false);
        if (res.isSuccess && res.data) {
          this.subscriptions.set(res.data);
        }
      },
      error: (err) => {
        this.loadingSubscriptions.set(false);
        this.alertService.showAlert({
          title: 'Retrieval Error',
          message: 'Could not load staff notification subscriptions.',
          type: 'error',
          confirmText: 'OK'
        });
      }
    });
  }

  toggleSubscription(sub: any) {
    const targetState = !sub.isSubscribed;
    this.notificationService.updateSubscription(sub.userId, targetState).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Sync local signal
          this.subscriptions.update(list =>
            list.map(s => s.userId === sub.userId ? { ...s, isSubscribed: targetState } : s)
          );
        } else {
          this.alertService.showAlert({
            title: 'Update Error',
            message: res.message || 'Failed to update subscription.',
            type: 'error',
            confirmText: 'OK'
          });
        }
      },
      error: (err) => {
        this.alertService.showAlert({
          title: 'Update Error',
          message: err?.error?.message || 'Server error updating subscription.',
          type: 'error',
          confirmText: 'OK'
        });
      }
    });
  }

  printShippingLabel(orderId: string | undefined): void {
    if (!orderId) return;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.alertService.showAlert({ title: 'Auth Error', message: 'You must be logged in to print shipping labels.', type: 'error', confirmText: 'OK' });
      return;
    }
    this.http.get(`http://localhost:5153/api/admin/orders/${orderId}/shipping-label`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'text'
    }).subscribe({
      next: (html) => {
        const blob = new Blob([html], { type: 'text/html' });
        const url  = URL.createObjectURL(blob);
        const win  = window.open(url, '_blank');
        // Auto-revoke the blob URL after the window loads
        if (win) {
          win.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
        }
      },
      error: (err) => {
        this.alertService.showAlert({
          title: 'Label Error',
          message: err.status === 401 ? 'Session expired. Please log in again.' : 'Could not load shipping label. Please try again.',
          type: 'error',
          confirmText: 'OK'
        });
      }
    });
  }

  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);
  selectedOrder = signal<Order | null>(null);
  drawerMessage = signal<string>('');

  // Tab State
  currentTab = signal<string>('orders'); // 'orders', 'promocodes', 'bulkadd'

  // Shipping Settings Panel State
  showSettingsPanel = signal<boolean>(false);
  settingsThreshold = 2000;
  settingsIsActive = true;
  savingSettings = signal<boolean>(false);
  settingsMessage = signal<string>('');
  settingsIsError = signal<boolean>(false);

  // Payment Settings State
  paymentInstaPayAddress = 'picksandmore@instapay';
  paymentVodafoneCashNumber = '01001234567';
  savingPaymentSettings = signal<boolean>(false);

  // Filters State
  statusFilter = '';
  governorateFilter = '';
  searchQuery = '';

  // Promo Code States
  promoCodes = signal<PromoCode[]>([]);
  loadingPromoCodes = signal<boolean>(false);
  showCreatePromoModal = signal<boolean>(false);
  promoMessage = signal<string>('');
  promoIsError = signal<boolean>(false);

  // Promo Code Form fields
  formCode = '';
  formDiscountType = 'FixedAmount';
  formValue = 0;
  formMinOrderAmount = 0;
  formExpiryDate = '';
  formUsageLimit = 100;
  formIsActive = true;
  submittingPromo = signal<boolean>(false);

  // Bulk Add States
  bulkRows = signal<BulkProductRow[]>([]);
  bulkMessage = signal<string>('');
  bulkIsError = signal<boolean>(false);
  publishingBulk = signal<boolean>(false);

  selectedRowsCount = computed(() => this.bulkRows().filter(r => r.selected).length);
  isAllSelected = computed(() => this.bulkRows().length > 0 && this.bulkRows().every(r => r.selected));

  // Bulk fill fields (Apply to all rows)
  bulkFillMainCategory = 'Women';
  bulkFillSubCategory = 'fashion';
  bulkFillStockQuantity = 10;
  bulkFillShippingSize = 'Small';
  bulkFillAge = '';
  bulkFillColors = '';
  bulkFillSizes = '';

  // Dynamic Attributes & Multi-Image Bulk States
  activeBulkImageRow = signal<BulkProductRow | null>(null);
  availableColors = signal<any[]>([]);
  availableSizes = signal<any[]>([]);

  // Colors Attribute Form State
  newColorName = signal<string>('');
  newColorHex = signal<string>('#FFFFFF');
  editingColorId = signal<string | null>(null);

  // Sizes Attribute Form State
  newSizeName = signal<string>('');
  newSizeAudience = signal<string>('Both');
  newSizeSortOrder = signal<number>(0);
  newSizeCategoryType = signal<string>('Women Clothing');
  editingSizeId = signal<string | null>(null);

  // Shipping Console Ledger States
  governorates = signal<ShippingGovernorate[]>([]);
  comboRules = signal<ShippingComboRule[]>([]);
  loadingShipping = signal<boolean>(false);
  shippingMessage = signal<string>('');
  shippingIsError = signal<boolean>(false);

  // New Combo Rule form fields
  ruleInputSmallCount = 0;
  ruleInputMediumCount = 0;
  ruleResultingSize = 'Large';

  // Brand States
  brands = signal<Brand[]>([]);
  loadingBrands = signal<boolean>(false);
  brandMessage = signal<string>('');
  brandIsError = signal<boolean>(false);

  // Brand Form Fields
  brandFormName = '';
  brandFormLogoUrl = '';
  brandFormShowInCards = true;
  brandFormIsVisible = true;
  editingBrandId = signal<string | null>(null);
  submittingBrand = signal<boolean>(false);

  // Analytics States
  analyticsSummary = signal<any>(null);
  loadingAnalytics = signal<boolean>(false);
  analyticsError = signal<string>('');

  countryList = computed(() => {
    const data = this.analyticsSummary();
    if (!data || !data.countryMetrics) return [];
    return Object.keys(data.countryMetrics).map(key => ({
      name: key,
      count: data.countryMetrics[key]
    }));
  });

  governorateList = computed(() => {
    const data = this.analyticsSummary();
    if (!data || !data.governorateMetrics) return [];
    return Object.keys(data.governorateMetrics).map(key => ({
      name: key,
      count: data.governorateMetrics[key]
    }));
  });

  walletApprovedCount = computed(() => {
    return this.analyticsSummary()?.transactionMetrics?.successfulWalletCount || 0;
  });

  walletRejectedCount = computed(() => {
    return this.analyticsSummary()?.transactionMetrics?.rejectedWalletCount || 0;
  });

  walletApprovedPercent = computed(() => {
    const app = this.walletApprovedCount();
    const rej = this.walletRejectedCount();
    const total = app + rej;
    if (total === 0) return 0;
    return Math.round((app / total) * 100);
  });

  walletRejectedPercent = computed(() => {
    const app = this.walletApprovedCount();
    const rej = this.walletRejectedCount();
    const total = app + rej;
    if (total === 0) return 0;
    return Math.round((rej / total) * 100);
  });

  failureReasonList = computed(() => {
    const data = this.analyticsSummary();
    if (!data || !data.transactionMetrics || !data.transactionMetrics.failureReasonSummary) return [];
    const summary = data.transactionMetrics.failureReasonSummary;
    return Object.keys(summary).map(key => ({
      text: key,
      count: summary[key]
    }));
  });

  // Role & Permission Management States
  roles = signal<any[]>([]);
  selectedRoleId = signal<string | null>(null);
  selectedRolePermissions = signal<string[]>([]);
  loadingRoles = signal<boolean>(false);
  savingPermissions = signal<boolean>(false);
  newRoleName = '';
  newRoleDescription = '';
  systemUsers = signal<any[]>([]);
  loadingUsers = signal<boolean>(false);
  featuresList = [
    { key: 'Products', label: 'Products Management' },
    { key: 'Orders', label: 'Orders Management' },
    { key: 'Shipping', label: 'Shipping Console & Rates' },
    { key: 'Analytics', label: 'Analytics & Traffic Ledger' },
    { key: 'PromoCodes', label: 'Promo Codes Engine' },
    { key: 'Roles', label: 'Access Control Ledger (Roles)' }
  ];

  actionsList = ['Read', 'Create', 'Update', 'Delete'];

  hasGranularPermission(feature: string, action: string): boolean {
    return this.selectedRolePermissions().includes(`${feature}:${action}`);
  }

  toggleGranularPermission(feature: string, action: string): void {
    const perm = `${feature}:${action}`;
    const current = this.selectedRolePermissions();
    if (current.includes(perm)) {
      this.selectedRolePermissions.set(current.filter(p => p !== perm));
    } else {
      this.selectedRolePermissions.set([...current, perm]);
    }
  }

  // Helper dictionary to store original rates during edit cancels
  private originalRates: Record<string, any> = {};

  getShippingSizeName(size: any): string {
    if (size === 0 || size === '0' || size === 'Small') return 'Small';
    if (size === 1 || size === '1' || size === 'Medium') return 'Medium';
    if (size === 2 || size === '2' || size === 'Large') return 'Large';
    return String(size);
  }

  loadShippingData(): void {
    this.loadingShipping.set(true);
    this.shippingMessage.set('');
    this.shippingIsError.set(false);

    this.http.get<any>('http://localhost:5153/api/admin/shipping/governorates').subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.governorates.set(res.data.map((g: any) => ({ ...g, isEditing: false })));
        } else {
          this.shippingMessage.set('Failed to load governorate matrices.');
          this.shippingIsError.set(true);
        }
      },
      error: (err) => {
        this.shippingMessage.set(err?.error?.message || 'Error loading governorate rates.');
        this.shippingIsError.set(true);
      }
    });

    this.http.get<any>('http://localhost:5153/api/admin/shipping/combo-rules').subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.comboRules.set(res.data);
        }
      },
      error: () => {
        // fail silently for combo rules, console is primary
      },
      complete: () => {
        this.loadingShipping.set(false);
      }
    });
  }

  startEditGovernorate(gov: ShippingGovernorate): void {
    // Save original rates for restoring on cancel
    this.originalRates[gov.id] = {
      basePriceSmall: gov.basePriceSmall,
      basePriceMedium: gov.basePriceMedium,
      basePriceLarge: gov.basePriceLarge
    };
    gov.isEditing = true;
  }

  saveGovernorate(gov: ShippingGovernorate): void {
    this.shippingMessage.set('');
    this.shippingIsError.set(false);

    this.http.put<any>(`http://localhost:5153/api/admin/shipping/governorates/${gov.id}`, {
      basePriceSmall: gov.basePriceSmall,
      basePriceMedium: gov.basePriceMedium,
      basePriceLarge: gov.basePriceLarge
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          gov.isEditing = false;
          delete this.originalRates[gov.id];
          this.shippingMessage.set(`Successfully updated rates for ${gov.governorate}.`);
        } else {
          this.shippingMessage.set(res.message || 'Failed to update rates.');
          this.shippingIsError.set(true);
        }
      },
      error: (err) => {
        this.shippingMessage.set(err?.error?.message || 'Error updating rates.');
        this.shippingIsError.set(true);
      }
    });
  }

  cancelEditGovernorate(gov: ShippingGovernorate): void {
    const orig = this.originalRates[gov.id];
    if (orig) {
      gov.basePriceSmall = orig.basePriceSmall;
      gov.basePriceMedium = orig.basePriceMedium;
      gov.basePriceLarge = orig.basePriceLarge;
      delete this.originalRates[gov.id];
    }
    gov.isEditing = false;
  }

  createComboRule(): void {
    this.shippingMessage.set('');
    this.shippingIsError.set(false);

    if (this.ruleInputSmallCount < 0 || this.ruleInputMediumCount < 0) {
      this.shippingMessage.set('Counts cannot be negative.');
      this.shippingIsError.set(true);
      return;
    }

    this.http.post<any>('http://localhost:5153/api/admin/shipping/combo-rules', {
      inputSmallCount: this.ruleInputSmallCount,
      inputMediumCount: this.ruleInputMediumCount,
      resultingSize: this.ruleResultingSize
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.shippingMessage.set('Successfully added combination rule.');
          this.loadShippingData();
          this.ruleInputSmallCount = 0;
          this.ruleInputMediumCount = 0;
          this.ruleResultingSize = 'Large';
        } else {
          this.shippingMessage.set(res.message || 'Failed to create combo rule.');
          this.shippingIsError.set(true);
        }
      },
      error: (err) => {
        this.shippingMessage.set(err?.error?.message || 'Error creating combo rule.');
        this.shippingIsError.set(true);
      }
    });
  }

  deleteComboRule(ruleId: string): void {
    this.shippingMessage.set('');
    this.shippingIsError.set(false);

    this.http.delete<any>(`http://localhost:5153/api/admin/shipping/combo-rules/${ruleId}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.shippingMessage.set('Successfully deleted combination rule.');
          this.loadShippingData();
        } else {
          this.shippingMessage.set(res.message || 'Failed to delete combo rule.');
          this.shippingIsError.set(true);
        }
      },
      error: (err) => {
        this.shippingMessage.set(err?.error?.message || 'Error deleting combo rule.');
        this.shippingIsError.set(true);
      }
    });
  }

  handleBellClick(): void {
    this.loadOrders();
    this.notificationService.hasNewOrders.set(false);
  }

  ngOnInit(): void {
    this.initBulkRows();
    this.loadColors();
    this.loadSizes();

    this.permissionsSubscription = this.authService.userPermissions$.subscribe(perms => {
      if (perms && perms.length > 0) {
        if (perms.includes('Orders:Read')) {
          this.currentTab.set('orders');
          this.loadOrders();
        } else if (perms.includes('PromoCodes:Read')) {
          this.currentTab.set('promocodes');
          this.loadPromoCodes();
        } else if (perms.includes('Analytics:Read')) {
          this.currentTab.set('analytics');
          this.loadAnalyticsSummary();
        } else if (perms.includes('Products:Create')) {
          this.currentTab.set('bulkadd');
        } else if (perms.includes('Shipping:Read')) {
          this.currentTab.set('shipping');
          this.loadShippingData();
        } else if (perms.includes('Products:Read')) {
          this.currentTab.set('brands');
          this.loadBrands();
        } else if (perms.includes('Roles:Read')) {
          this.currentTab.set('roles');
          this.loadRoles();
        } else {
          this.orders.set([]);
          this.loading.set(false);
        }
      } else {
        this.orders.set([]);
        this.loading.set(true);
        this.authService.showLoginModal.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.permissionsSubscription) {
      this.permissionsSubscription.unsubscribe();
    }
  }

  toggleSettingsPanel(): void {
    const show = !this.showSettingsPanel();
    this.showSettingsPanel.set(show);
    this.settingsMessage.set('');
    this.settingsIsError.set(false);
    if (show) {
      this.loadShippingSettings();
      this.loadPaymentSettings();
    }
  }

  loadShippingSettings(): void {
    this.http.get<any>('http://localhost:5153/api/admin/shipping-settings').subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.settingsThreshold = res.data.freeShippingThreshold;
          this.settingsIsActive = res.data.isFreeShippingActive;
        }
      }
    });
  }

  loadPaymentSettings(): void {
    this.http.get<any>('http://localhost:5153/api/admin/payment-settings').subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.paymentInstaPayAddress = res.data.instaPayAddress;
          this.paymentVodafoneCashNumber = res.data.vodafoneCashNumber;
        }
      }
    });
  }

  savePaymentSettings(): void {
    this.savingPaymentSettings.set(true);
    this.settingsMessage.set('');
    this.settingsIsError.set(false);
    const token = localStorage.getItem('auth_token');

    this.http.post<any>('http://localhost:5153/api/admin/payment-settings', {
      instaPayAddress: this.paymentInstaPayAddress,
      vodafoneCashNumber: this.paymentVodafoneCashNumber
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.savingPaymentSettings.set(false);
        if (res.isSuccess) {
          this.settingsMessage.set('Payment settings updated successfully!');
          setTimeout(() => this.showSettingsPanel.set(false), 1200);
        } else {
          this.settingsMessage.set(res.message || 'Failed to update payment settings.');
          this.settingsIsError.set(true);
        }
      },
      error: (err) => {
        this.savingPaymentSettings.set(false);
        this.settingsMessage.set(err?.error?.message || 'Error updating payment settings.');
        this.settingsIsError.set(true);
      }
    });
  }

  saveShippingSettings(): void {
    this.savingSettings.set(true);
    this.settingsMessage.set('');
    this.settingsIsError.set(false);

    this.http.post<any>('http://localhost:5153/api/admin/shipping-settings', {
      freeShippingThreshold: this.settingsThreshold,
      isFreeShippingActive: this.settingsIsActive
    }).subscribe({
      next: (res) => {
        this.savingSettings.set(false);
        if (res.isSuccess) {
          this.settingsMessage.set('Settings updated successfully!');
          setTimeout(() => this.showSettingsPanel.set(false), 1200);
        } else {
          this.settingsMessage.set(res.message || 'Failed to update settings.');
          this.settingsIsError.set(true);
        }
      },
      error: (err) => {
        this.savingSettings.set(false);
        this.settingsMessage.set(err?.error?.message || 'Error updating settings.');
        this.settingsIsError.set(true);
      }
    });
  }

  onFilterChange(): void {
    this.loadOrders();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.governorateFilter = '';
    this.searchQuery = '';
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    let params = `pageSize=100`;
    if (this.statusFilter) {
      params += `&status=${this.statusFilter}`;
    }
    if (this.governorateFilter) {
      params += `&governorate=${encodeURIComponent(this.governorateFilter)}`;
    }
    if (this.searchQuery) {
      params += `&searchText=${encodeURIComponent(this.searchQuery)}`;
    }

    this.http.get<any>(`http://localhost:5153/api/admin/orders?${params}`).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data && res.data.items) {
          this.orders.set(res.data.items);
        } else {
          this.orders.set([]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.orders.set([]);
        this.loading.set(false);
      }
    });
  }

  openOrder(order: Order): void {
    this.drawerMessage.set('');
    order.items.forEach(item => {
      item.returnQty = 0;
    });
    this.selectedOrder.set(order);
  }

  closeOrder(): void {
    this.selectedOrder.set(null);
  }

  hasReturnableItems(): boolean {
    const order = this.selectedOrder();
    if (!order) return false;
    return order.items.some(item => !item.isReturnedPartially);
  }

  verifyWallet(approve: boolean): void {
    if (!this.selectedOrder()) return;
    const order = this.selectedOrder()!;
    
    let rejectReason: string | null = null;
    if (!approve) {
      const reason = prompt('Please enter the reason for rejecting this payment:', 'Image screenshot unverified or duplicate.');
      if (reason === null) return; // user cancelled prompt
      rejectReason = reason.trim() || 'Image screenshot unverified or duplicate.';
    }

    this.http.post<any>(`http://localhost:5153/api/admin/orders/${order.id}/verify-wallet`, {
      approve,
      rejectReason
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.drawerMessage.set(approve ? 'Wallet payment verified and order confirmed!' : 'Payment rejected, order canceled.');
          this.loadOrders();
          setTimeout(() => {
            this.closeOrder();
          }, 1500);
        }
      }
    });
  }

  updateStatus(status: string): void {
    if (!this.selectedOrder()) return;
    const order = this.selectedOrder()!;
    
    this.http.put<any>(`http://localhost:5153/api/admin/orders/${order.id}/status`, {
      status
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.drawerMessage.set(`Order status updated to ${status} successfully!`);
          this.loadOrders();
          setTimeout(() => {
            this.closeOrder();
          }, 1500);
        }
      }
    });
  }

  submitBulkReturn(): void {
    if (!this.selectedOrder()) return;
    const order = this.selectedOrder()!;
    
    const returns = order.items
      .filter(item => !item.isReturnedPartially && item.returnQty && item.returnQty > 0)
      .map(item => ({
        productId: item.productId,
        returnedQuantity: item.returnQty || 0
      }));

    if (returns.length === 0) {
      this.drawerMessage.set('Please specify a return quantity > 0 for at least one item.');
      return;
    }

    for (const ret of returns) {
      const item = order.items.find(i => i.productId === ret.productId);
      if (item && (ret.returnedQuantity < 0 || ret.returnedQuantity > item.quantity)) {
        this.drawerMessage.set(`Invalid return quantity for ${item?.productName || 'product'}.`);
        return;
      }
    }

    this.http.post<any>(`http://localhost:5153/api/admin/orders/${order.id}/partial-return`, returns).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.drawerMessage.set('Partial return submitted successfully!');
          this.loadOrders();
          setTimeout(() => {
            this.closeOrder();
          }, 1500);
        } else {
          this.drawerMessage.set(res.message || 'Partial return processing failed.');
        }
      },
      error: (err) => {
        this.drawerMessage.set(err?.error?.message || 'Error processing partial return.');
      }
    });
  }

  // --- Promo Codes Functions ---
  loadPromoCodes(): void {
    if (!this.authService.hasPermission('PromoCodes:Read')) return;
    this.loadingPromoCodes.set(true);
    this.http.get<any>('http://localhost:5153/api/admin/promocodes').subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.promoCodes.set(res.data);
        } else {
          this.promoCodes.set([]);
        }
        this.loadingPromoCodes.set(false);
      },
      error: () => {
        this.promoCodes.set([]);
        this.loadingPromoCodes.set(false);
      }
    });
  }

  createPromoCode(): void {
    if (!this.formCode.trim()) {
      this.promoMessage.set('Promo code string is required.');
      this.promoIsError.set(true);
      return;
    }
    if (this.formDiscountType !== 'FreeShipping' && this.formValue <= 0) {
      this.promoMessage.set('Discount value must be greater than 0.');
      this.promoIsError.set(true);
      return;
    }
    if (!this.formExpiryDate) {
      this.promoMessage.set('Expiry date is required.');
      this.promoIsError.set(true);
      return;
    }

    this.submittingPromo.set(true);
    this.promoMessage.set('');
    this.promoIsError.set(false);

    const payload = {
      code: this.formCode.trim().toUpperCase(),
      discountType: this.formDiscountType,
      value: this.formDiscountType === 'FreeShipping' ? 0 : this.formValue,
      minOrderAmount: this.formMinOrderAmount,
      expiryDate: new Date(this.formExpiryDate).toISOString(),
      isActive: this.formIsActive,
      usageLimit: this.formUsageLimit
    };

    this.http.post<any>('http://localhost:5153/api/admin/promocodes', payload).subscribe({
      next: (res) => {
        this.submittingPromo.set(false);
        if (res.isSuccess) {
          this.promoMessage.set('Promo code created successfully!');
          this.loadPromoCodes();
          setTimeout(() => {
            this.showCreatePromoModal.set(false);
            this.resetPromoForm();
          }, 1200);
        } else {
          this.promoMessage.set(res.message || 'Failed to create promo code.');
          this.promoIsError.set(true);
        }
      },
      error: (err) => {
        this.submittingPromo.set(false);
        this.promoMessage.set(err?.error?.message || 'Error occurred during creation.');
        this.promoIsError.set(true);
      }
    });
  }

  deletePromoCode(id: string): void {
    this.alertService.showAlert({
      title: 'Delete Promo Code',
      message: 'Are you sure you want to delete this promo code?',
      type: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.http.delete<any>(`http://localhost:5153/api/admin/promocodes/${id}`).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.loadPromoCodes();
            }
          }
        });
      }
    });
  }

  togglePromoCodeActive(id: string): void {
    this.http.patch<any>(`http://localhost:5153/api/admin/promocodes/${id}/toggle-active`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadPromoCodes();
        }
      }
    });
  }

  resetPromoForm(): void {
    this.formCode = '';
    this.formDiscountType = 'FixedAmount';
    this.formValue = 0;
    this.formMinOrderAmount = 0;
    this.formExpiryDate = '';
    this.formUsageLimit = 100;
    this.formIsActive = true;
    this.promoMessage.set('');
    this.promoIsError.set(false);
  }

  // --- Bulk Add Functions ---
  initBulkRows(): void {
    const rows: BulkProductRow[] = [];
    for (let i = 0; i < 5; i++) {
      rows.push(this.createEmptyRow());
    }
    this.bulkRows.set(rows);
  }

  createEmptyRow(): BulkProductRow {
    return {
      selected: false,
      title: '',
      mainCategory: 'Women',
      subCategory: 'fashion',
      price: null,
      costPrice: null,
      stockQuantity: 10,
      shippingSize: 'Small',
      sizes: '',
      colors: '',
      age: '',
      description: '',
      imageUrl: '',
      imageUrls: []
    };
  }

  addBulkRow(): void {
    this.bulkRows.update(rows => [...rows, this.createEmptyRow()]);
  }

  removeBulkRow(index: number): void {
    this.bulkRows.update(rows => rows.filter((_, i) => i !== index));
    if (this.bulkRows().length === 0) {
      this.initBulkRows();
    }
  }

  openBulkRowImagesModal(row: BulkProductRow): void {
    this.activeBulkImageRow.set(row);
  }

  closeBulkRowImagesModal(): void {
    this.activeBulkImageRow.set(null);
  }

  uploadBulkRowImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const row = this.activeBulkImageRow();
    if (file && row) {
      if (!row.imageUrls) {
        row.imageUrls = [];
      }
      if (row.imageUrls.length >= 10) return;

      this.mediaService.upload(file).subscribe({
        next: (res) => {
          if (res.isSuccess && res.url) {
            row.imageUrls!.push(res.url);
            if (!row.imageUrl) {
              row.imageUrl = res.url;
            }
            // Trigger reactivity
            this.activeBulkImageRow.set({ ...row });
          }
        }
      });
    }
  }

  removeBulkRowImage(index: number): void {
    const row = this.activeBulkImageRow();
    if (row && row.imageUrls) {
      row.imageUrls.splice(index, 1);
      if (row.imageUrls.length > 0) {
        row.imageUrl = row.imageUrls[0];
      } else {
        row.imageUrl = '';
      }
      // Trigger reactivity
      this.activeBulkImageRow.set({ ...row });
    }
  }

  clearBulkRows(): void {
    this.initBulkRows();
    this.bulkMessage.set('');
    this.bulkIsError.set(false);
  }

  getSubcategories(mainCategory: string): string[] {
    if (mainCategory === 'Women') {
      return ['fashion', 'pajama', 'bags', 'shoes', 'accessors'];
    }
    return ['kids boys', 'girls', 'unisex collection', 'baby needs', 'accessors'];
  }

  toggleAllSelected(event: any): void {
    const checked = event.target.checked;
    this.bulkRows.update(rows => rows.map(r => ({ ...r, selected: checked })));
  }

  applyBulkFill(field: keyof BulkProductRow, value: any): void {
    const hasSelection = this.bulkRows().some(r => r.selected);
    if (!hasSelection) {
      this.bulkMessage.set('Please select one or more rows using the checkboxes first.');
      this.bulkIsError.set(true);
      return;
    }

    this.bulkRows.update(rows => {
      return rows.map(row => {
        if (row.selected) {
          return {
            ...row,
            [field]: value
          };
        }
        return row;
      });
    });
    this.bulkMessage.set(`Applied fill to ${this.selectedRowsCount()} selected rows.`);
    this.bulkIsError.set(false);
  }

  publishBulkProducts(): void {
    this.bulkMessage.set('');
    this.bulkIsError.set(false);

    const activeRows = this.bulkRows().filter(r => r.title.trim().length > 0);
    if (activeRows.length === 0) {
      this.bulkMessage.set('Please fill out at least one product with a Title.');
      this.bulkIsError.set(true);
      return;
    }

    for (let i = 0; i < activeRows.length; i++) {
      const row = activeRows[i];
      const rowNum = i + 1;
      if (!row.description.trim()) {
        this.bulkMessage.set(`Row #${rowNum} ("${row.title}") is missing Description.`);
        this.bulkIsError.set(true);
        return;
      }
      if (row.price === null || row.price <= 0) {
        this.bulkMessage.set(`Row #${rowNum} ("${row.title}") has an invalid Price (must be > 0).`);
        this.bulkIsError.set(true);
        return;
      }
      if (row.costPrice === null || row.costPrice < 0) {
        this.bulkMessage.set(`Row #${rowNum} ("${row.title}") has an invalid Cost Price (must be >= 0).`);
        this.bulkIsError.set(true);
        return;
      }
      if (row.stockQuantity === null || row.stockQuantity < 0) {
        this.bulkMessage.set(`Row #${rowNum} ("${row.title}") has an invalid Stock Quantity (must be >= 0).`);
        this.bulkIsError.set(true);
        return;
      }
    }

    this.publishingBulk.set(true);

    const dtos = activeRows.map(row => {
      const colorsArr = row.colors ? row.colors.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
      const sizesArr = row.sizes ? row.sizes.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
      const subCatsArr = row.subCategory ? [row.subCategory] : [];

      return {
        title: row.title.trim(),
        description: row.description.trim(),
        price: row.price,
        costPrice: row.costPrice,
        stockQuantity: row.stockQuantity,
        mainCategory: row.mainCategory,
        subCategory: row.subCategory,
        colors: colorsArr,
        sizes: sizesArr,
        shippingSize: row.shippingSize,
        isVisible: true,
        imageUrl: row.imageUrls && row.imageUrls.length > 0 ? row.imageUrls[0] : (row.imageUrl ? row.imageUrl.trim() : null),
        imageUrls: row.imageUrls && row.imageUrls.length > 0 ? row.imageUrls : (row.imageUrl && row.imageUrl.trim() ? [row.imageUrl.trim()] : []),
        age: row.mainCategory === 'Women' ? null : (row.age.trim() || null),
        subCategories: subCatsArr
      };
    });

    this.http.post<any>('http://localhost:5153/api/products/bulk', dtos).subscribe({
      next: (res) => {
        this.publishingBulk.set(false);
        if (res.isSuccess) {
          this.bulkMessage.set(`Successfully published ${dtos.length} products to the store database!`);
          this.clearBulkRows();
        } else {
          this.bulkMessage.set(res.message || 'Failed to publish products.');
          this.bulkIsError.set(true);
        }
      },
      error: (err) => {
        this.publishingBulk.set(false);
        this.bulkMessage.set(err?.error?.message || 'Error occurred during bulk product publication.');
        this.bulkIsError.set(true);
      }
    });
  }

  loadColors(): void {
    this.catalogService.getColors().subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.data) {
          this.availableColors.set(res.data);
        }
      }
    });
  }

  loadSizes(): void {
    this.catalogService.getSizes().subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.data) {
          const sorted = [...res.data].sort((a, b) => {
            const categoryOrder: Record<string, number> = { 
              'Women Clothing': 1, 
              'Women Shoes': 2, 
              'Kids Clothing': 3, 
              'Kids Shoes': 4, 
              'Universal': 5 
            };
            const catA = categoryOrder[a.categoryType] || 6;
            const catB = categoryOrder[b.categoryType] || 6;
            if (catA !== catB) return catA - catB;
            return a.sortOrder - b.sortOrder;
          });
          this.availableSizes.set(sorted);
        }
      }
    });
  }

  resolveColorName(hex: string): string {
    if (!hex) return '';
    let h = hex.trim().replace('#', '');
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    if (h.length !== 6) return '';
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);

    const baseColors = [
      { name: 'Tan', r: 196, g: 158, b: 122 },
      { name: 'Black', r: 31, g: 27, b: 26 },
      { name: 'Gold', r: 212, g: 175, b: 55 },
      { name: 'Silver', r: 176, g: 181, b: 188 },
      { name: 'Champagne', r: 241, g: 229, b: 215 },
      { name: 'Emerald', r: 59, g: 122, b: 87 },
      { name: 'Oatmeal', r: 227, g: 223, b: 213 },
      { name: 'Charcoal', r: 67, g: 74, b: 84 },
      { name: 'Blush', r: 236, g: 200, b: 191 },
      { name: 'Ivory', r: 253, g: 251, b: 247 },
      { name: 'Taupe', r: 140, g: 133, b: 123 },
      { name: 'Sage', r: 158, g: 176, b: 162 },
      { name: 'Blue', r: 127, g: 155, b: 176 },
      { name: 'White', r: 255, g: 255, b: 255 },
      { name: 'Red', r: 255, g: 0, b: 0 },
      { name: 'Green', r: 0, g: 128, b: 0 },
      { name: 'Yellow', r: 255, g: 255, b: 0 },
      { name: 'Pink', r: 255, g: 192, b: 203 },
      { name: 'Purple', r: 128, g: 0, b: 128 },
      { name: 'Orange', r: 255, g: 165, b: 0 },
      { name: 'Brown', r: 165, g: 42, b: 42 },
      { name: 'Navy', r: 0, g: 0, b: 128 },
      { name: 'Teal', r: 0, g: 128, b: 128 },
      { name: 'Olive', r: 128, g: 128, b: 0 },
      { name: 'Maroon', r: 128, g: 0, b: 0 },
      { name: 'Lime', r: 0, g: 255, b: 0 }
    ];

    let minDistance = Infinity;
    let closestColorName = '';

    for (const color of baseColors) {
      const distance = Math.sqrt(
        Math.pow(r - color.r, 2) +
        Math.pow(g - color.g, 2) +
        Math.pow(b - color.b, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestColorName = color.name;
      }
    }

    return closestColorName;
  }

  onColorHexChange(hex: string): void {
    this.newColorHex.set(hex);
    const resolvedName = this.resolveColorName(hex);
    if (resolvedName) {
      this.newColorName.set(resolvedName);
    }
  }

  saveColor(): void {
    const name = this.newColorName().trim();
    const hex = this.newColorHex().trim();
    if (!name || !hex) {
      this.alertService.showAlert({
        title: 'Error',
        message: 'Color name and hex code are required.',
        type: 'error',
        confirmText: 'OK'
      });
      return;
    }

    const editId = this.editingColorId();
    if (editId) {
      this.catalogService.updateColor(editId, { name, hexCode: hex }).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            this.alertService.showAlert({
              title: 'Success',
              message: 'Color updated successfully.',
              type: 'success',
              confirmText: 'OK'
            });
            this.cancelEditColor();
            this.loadColors();
          } else {
            this.alertService.showAlert({
              title: 'Error',
              message: res.message || 'Failed to update color.',
              type: 'error',
              confirmText: 'OK'
            });
          }
        }
      });
    } else {
      this.catalogService.createColor({ name, hexCode: hex }).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            this.alertService.showAlert({
              title: 'Success',
              message: 'Color created successfully.',
              type: 'success',
              confirmText: 'OK'
            });
            this.cancelEditColor();
            this.loadColors();
          } else {
            this.alertService.showAlert({
              title: 'Error',
              message: res.message || 'Failed to create color.',
              type: 'error',
              confirmText: 'OK'
            });
          }
        }
      });
    }
  }

  deleteColor(id: string): void {
    if (confirm('Are you sure you want to delete this color?')) {
      this.catalogService.deleteColor(id).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            this.alertService.showAlert({
              title: 'Success',
              message: 'Color deleted successfully.',
              type: 'success',
              confirmText: 'OK'
            });
            this.loadColors();
          } else {
            this.alertService.showAlert({
              title: 'Error',
              message: res.message || 'Failed to delete color.',
              type: 'error',
              confirmText: 'OK'
            });
          }
        }
      });
    }
  }

  startEditColor(color: any): void {
    this.editingColorId.set(color.id);
    this.newColorName.set(color.name);
    this.newColorHex.set(color.hexCode);
  }

  cancelEditColor(): void {
    this.editingColorId.set(null);
    this.newColorName.set('');
    this.newColorHex.set('#FFFFFF');
  }

  onSizeCategoryTypeChange(catType: string): void {
    this.newSizeCategoryType.set(catType);
    if (catType === 'Universal') {
      this.newSizeAudience.set('Both');
    } else if (catType.startsWith('Women')) {
      this.newSizeAudience.set('Women');
    } else if (catType.startsWith('Kids')) {
      this.newSizeAudience.set('Kids');
    }
  }

  autoCalculateSortOrder(catType: string): number {
    const sizesInCat = this.availableSizes().filter(s => s.categoryType === catType);
    if (sizesInCat.length === 0) return 0;
    const maxOrder = Math.max(...sizesInCat.map(s => s.sortOrder));
    return maxOrder + 1;
  }

  saveSize(): void {
    const name = this.newSizeName().trim();
    const catType = this.newSizeCategoryType();
    
    let audience = 'Both';
    if (catType === 'Universal') {
      audience = 'Both';
    } else if (catType.startsWith('Women')) {
      audience = 'Women';
    } else if (catType.startsWith('Kids')) {
      audience = 'Kids';
    }

    const order = this.editingSizeId() 
      ? this.newSizeSortOrder() 
      : this.autoCalculateSortOrder(catType);

    if (!name) {
      this.alertService.showAlert({
        title: 'Error',
        message: 'Size name is required.',
        type: 'error',
        confirmText: 'OK'
      });
      return;
    }

    const editId = this.editingSizeId();
    if (editId) {
      this.catalogService.updateSize(editId, { name, targetAudience: audience, sortOrder: order, categoryType: catType }).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            this.alertService.showAlert({
              title: 'Success',
              message: 'Size updated successfully.',
              type: 'success',
              confirmText: 'OK'
            });
            this.cancelEditSize();
            this.loadSizes();
          } else {
            this.alertService.showAlert({
              title: 'Error',
              message: res.message || 'Failed to update size.',
              type: 'error',
              confirmText: 'OK'
            });
          }
        }
      });
    } else {
      this.catalogService.createSize({ name, targetAudience: audience, sortOrder: order, categoryType: catType }).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            this.alertService.showAlert({
              title: 'Success',
              message: 'Size created successfully.',
              type: 'success',
              confirmText: 'OK'
            });
            this.cancelEditSize();
            this.loadSizes();
          } else {
            this.alertService.showAlert({
              title: 'Error',
              message: res.message || 'Failed to create size.',
              type: 'error',
              confirmText: 'OK'
            });
          }
        }
      });
    }
  }

  deleteSize(id: string): void {
    if (confirm('Are you sure you want to delete this size?')) {
      this.catalogService.deleteSize(id).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            this.alertService.showAlert({
              title: 'Success',
              message: 'Size deleted successfully.',
              type: 'success',
              confirmText: 'OK'
            });
            this.loadSizes();
          } else {
            this.alertService.showAlert({
              title: 'Error',
              message: res.message || 'Failed to delete size.',
              type: 'error',
              confirmText: 'OK'
            });
          }
        }
      });
    }
  }

  startEditSize(size: any): void {
    this.editingSizeId.set(size.id);
    this.newSizeName.set(size.name);
    this.newSizeAudience.set(size.targetAudience);
    this.newSizeSortOrder.set(size.sortOrder);
    this.newSizeCategoryType.set(size.categoryType || 'Women Clothing');
  }

  cancelEditSize(): void {
    this.editingSizeId.set(null);
    this.newSizeName.set('');
    this.newSizeAudience.set('Both');
    this.newSizeSortOrder.set(0);
    this.newSizeCategoryType.set('Women Clothing');
  }

  loadBrands(): void {
    this.loadingBrands.set(true);
    this.brandMessage.set('');
    this.brandIsError.set(false);

    this.http.get<any>('http://localhost:5153/api/admin/brands').subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.brands.set(res.data);
        } else {
          this.brandMessage.set('Failed to load brands.');
          this.brandIsError.set(true);
        }
      },
      error: (err) => {
        this.brandMessage.set(err?.error?.message || 'Error loading brand registry.');
        this.brandIsError.set(true);
      },
      complete: () => {
        this.loadingBrands.set(false);
      }
    });
  }

  loadAnalyticsSummary(): void {
    if (!this.authService.hasPermission('Analytics:Read')) return;
    this.loadingAnalytics.set(true);
    this.analyticsError.set('');

    this.http.get<any>('http://localhost:5153/api/admin/analytics/summary').subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.analyticsSummary.set(res.data);
        } else {
          this.analyticsError.set(res.message || 'Failed to calculate analytics summary.');
        }
        this.loadingAnalytics.set(false);
      },
      error: (err) => {
        this.analyticsError.set(err?.error?.message || 'Error occurred during analytics calculation.');
        this.loadingAnalytics.set(false);
      }
    });
  }

  createBrand(): void {
    this.brandMessage.set('');
    this.brandIsError.set(false);

    if (!this.brandFormName.trim()) {
      this.brandMessage.set('Brand Name is required.');
      this.brandIsError.set(true);
      return;
    }
    if (!this.brandFormLogoUrl.trim()) {
      this.brandMessage.set('Logo Image URL is required.');
      this.brandIsError.set(true);
      return;
    }

    this.submittingBrand.set(true);
    const payload = {
      name: this.brandFormName.trim(),
      logoUrl: this.brandFormLogoUrl.trim(),
      showInCards: this.brandFormShowInCards,
      isVisible: this.brandFormIsVisible
    };

    this.http.post<any>('http://localhost:5153/api/admin/brands', payload).subscribe({
      next: (res) => {
        this.submittingBrand.set(false);
        if (res.isSuccess) {
          this.brandMessage.set(`Brand "${payload.name}" registered successfully.`);
          this.resetBrandForm();
          this.loadBrands();
        } else {
          this.brandMessage.set(res.message || 'Failed to register brand.');
          this.brandIsError.set(true);
        }
      },
      error: (err) => {
        this.submittingBrand.set(false);
        this.brandMessage.set(err?.error?.message || 'Error registering brand.');
        this.brandIsError.set(true);
      }
    });
  }

  startEditBrand(brand: Brand): void {
    this.editingBrandId.set(brand.id);
    this.brandFormName = brand.name;
    this.brandFormLogoUrl = brand.logoUrl;
    this.brandFormShowInCards = brand.showInCards;
    this.brandFormIsVisible = brand.isVisible;
    this.brandMessage.set('');
    this.brandIsError.set(false);
  }

  cancelEditBrand(): void {
    this.resetBrandForm();
  }

  updateBrand(): void {
    const id = this.editingBrandId();
    if (!id) return;

    this.brandMessage.set('');
    this.brandIsError.set(false);

    if (!this.brandFormName.trim()) {
      this.brandMessage.set('Brand Name is required.');
      this.brandIsError.set(true);
      return;
    }
    if (!this.brandFormLogoUrl.trim()) {
      this.brandMessage.set('Logo Image URL is required.');
      this.brandIsError.set(true);
      return;
    }

    this.submittingBrand.set(true);
    const payload = {
      name: this.brandFormName.trim(),
      logoUrl: this.brandFormLogoUrl.trim(),
      showInCards: this.brandFormShowInCards,
      isVisible: this.brandFormIsVisible
    };

    this.http.put<any>(`http://localhost:5153/api/admin/brands/${id}`, payload).subscribe({
      next: (res) => {
        this.submittingBrand.set(false);
        if (res.isSuccess) {
          this.brandMessage.set(`Brand "${payload.name}" updated successfully.`);
          this.resetBrandForm();
          this.loadBrands();
        } else {
          this.brandMessage.set(res.message || 'Failed to update brand.');
          this.brandIsError.set(true);
        }
      },
      error: (err) => {
        this.submittingBrand.set(false);
        this.brandMessage.set(err?.error?.message || 'Error updating brand.');
        this.brandIsError.set(true);
      }
    });
  }

  deleteBrand(id: string): void {
    this.alertService.showAlert({
      title: 'Delete Brand',
      message: 'Are you sure you want to delete this brand? Products linked to this brand will not be deleted but will have their brand unlinked.',
      type: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.brandMessage.set('');
        this.brandIsError.set(false);

        this.http.delete<any>(`http://localhost:5153/api/admin/brands/${id}`).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.brandMessage.set('Brand deleted successfully.');
              this.loadBrands();
              if (this.editingBrandId() === id) {
                this.resetBrandForm();
              }
            } else {
              this.brandMessage.set(res.message || 'Failed to delete brand.');
              this.brandIsError.set(true);
            }
          },
          error: (err) => {
            this.brandMessage.set(err?.error?.message || 'Error deleting brand.');
            this.brandIsError.set(true);
          }
        });
      }
    });
  }

  resetBrandForm(): void {
    this.editingBrandId.set(null);
    this.brandFormName = '';
    this.brandFormLogoUrl = '';
    this.brandFormShowInCards = true;
    this.brandFormIsVisible = true;
  }



  loadRoles() {
    this.loadingRoles.set(true);
    this.loadUsers();
    this.http.get<any>('http://localhost:5153/api/admin/roles').subscribe({
      next: (res) => {
        this.loadingRoles.set(false);
        if (res.isSuccess && res.data) {
          this.roles.set(res.data);
          if (!this.selectedRoleId() && res.data.length > 0) {
            this.selectRole(res.data[0]);
          } else if (this.selectedRoleId()) {
            const current = res.data.find((r: any) => r.id === this.selectedRoleId());
            if (current) {
              this.selectRole(current);
            }
          }
        }
      },
      error: () => this.loadingRoles.set(false)
    });
  }

  selectRole(role: any) {
    this.selectedRoleId.set(role.id);
    this.selectedRolePermissions.set([...role.permissions]);
  }

  togglePermission(permission: string) {
    const current = this.selectedRolePermissions();
    if (current.includes(permission)) {
      this.selectedRolePermissions.set(current.filter(p => p !== permission));
    } else {
      this.selectedRolePermissions.set([...current, permission]);
    }
  }

  savePermissions() {
    const roleId = this.selectedRoleId();
    if (!roleId) return;
    this.savingPermissions.set(true);

    const roleObj = this.roles().find((r: any) => r.id === roleId);
    const roleName = roleObj?.name;

    const payload = {
      roleId: roleId,
      permissions: this.selectedRolePermissions()
    };
    this.http.post<any>('http://localhost:5153/api/admin/roles/assign', payload).subscribe({
      next: (res) => {
        this.savingPermissions.set(false);
        if (res.isSuccess) {
          const currentUser = this.authService.currentUser();
          if (currentUser && currentUser.role === roleName) {
            this.authService.updateLocalPermissions(this.selectedRolePermissions());
          }
          this.alertService.showAlert({
            title: 'Console Updated',
            message: 'Access console changes saved successfully. Your session permissions have been updated.',
            type: 'success'
          });
          this.loadRoles();
        } else {
          this.alertService.showAlert({
            title: 'Operation Failed',
            message: 'Failed to save permissions: ' + (res.message || 'Unknown error'),
            type: 'error'
          });
        }
      },
      error: () => {
        this.savingPermissions.set(false);
        this.alertService.showAlert({
          title: 'Connection Error',
          message: 'Failed to save permissions: Network or server error',
          type: 'error'
        });
      }
    });
  }

  createRole() {
    if (!this.newRoleName.trim()) return;
    const payload = {
      name: this.newRoleName.trim(),
      description: this.newRoleDescription.trim() || (this.newRoleName.trim() + ' Role')
    };
    this.http.post<any>('http://localhost:5153/api/admin/roles', payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.newRoleName = '';
          this.newRoleDescription = '';
          this.alertService.showAlert({
            title: 'Role Created',
            message: 'Role created successfully.',
            type: 'success'
          });
          this.loadRoles();
        } else {
          this.alertService.showAlert({
            title: 'Operation Failed',
            message: 'Failed to create role: ' + (res.message || 'Unknown error'),
            type: 'error'
          });
        }
      },
      error: () => {
        this.alertService.showAlert({
          title: 'Connection Error',
          message: 'Failed to create role: Network or server error',
          type: 'error'
        });
      }
    });
  }

  loadUsers(): void {
    this.loadingUsers.set(true);
    this.http.get<any>('http://localhost:5153/api/admin/users').subscribe({
      next: (res) => {
        this.loadingUsers.set(false);
        if (res.isSuccess && res.data) {
          this.systemUsers.set(res.data);
        }
      },
      error: () => this.loadingUsers.set(false)
    });
  }

  assignUserRole(userId: string, roleId: string): void {
    this.http.post<any>('http://localhost:5153/api/admin/users/assign-role', {
      userId,
      roleId
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.alertService.showAlert({
            title: 'Authority Delegated',
            message: 'Authority role assigned and delegated successfully. The user must re-authenticate to apply changes.',
            type: 'success'
          });
          this.loadUsers();
        } else {
          this.alertService.showAlert({
            title: 'Operation Failed',
            message: 'Failed to delegate authority: ' + (res.message || 'Unknown error'),
            type: 'error'
          });
        }
      },
      error: () => {
        this.alertService.showAlert({
          title: 'Connection Error',
          message: 'Failed to delegate authority: Network or server error',
          type: 'error'
        });
      }
    });
  }

  getPermissionDescription(perm: string): string {
    return 'Custom system authorization claim.';
  }
}
