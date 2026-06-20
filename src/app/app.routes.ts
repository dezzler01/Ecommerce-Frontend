import { Routes } from '@angular/router';
import { StorefrontLandingComponent } from './components/storefront-landing/storefront-landing.component';

export const routes: Routes = [
  { path: '', component: StorefrontLandingComponent },
  {
    path: 'products',
    loadComponent: () => import('./components/products-catalog/products-catalog.component').then(m => m.ProductsCatalogComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./components/products-catalog/products-catalog-detail.component').then(m => m.ProductsCatalogDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/checkout-cart/checkout-cart.component').then(m => m.CheckoutCartComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./components/admin-orders-board/admin-orders-board.component').then(m => m.AdminOrdersBoardComponent)
  },
  { path: '**', redirectTo: '' }
];

