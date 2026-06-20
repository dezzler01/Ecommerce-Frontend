import { Routes } from '@angular/router';
import { StorefrontLandingComponent } from './components/storefront-landing/storefront-landing.component';
import { ProductsCatalogComponent } from './components/products-catalog/products-catalog.component';
import { ProductsCatalogDetailComponent } from './components/products-catalog/products-catalog-detail.component';
import { CheckoutCartComponent } from './components/checkout-cart/checkout-cart.component';
import { AdminOrdersBoardComponent } from './components/admin-orders-board/admin-orders-board.component';

export const routes: Routes = [
  { path: '', component: StorefrontLandingComponent },
  { path: 'products', component: ProductsCatalogComponent },
  { path: 'products/:id', component: ProductsCatalogDetailComponent },
  { path: 'cart', component: CheckoutCartComponent },
  { path: 'admin/dashboard', component: AdminOrdersBoardComponent },
  { path: '**', redirectTo: '' }
];
