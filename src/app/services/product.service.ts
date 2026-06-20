import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CatalogService, ProductDto, PaginationResult, ApiResponse } from '../core/services/catalog.service';

export type { ProductDto, PaginationMetadata, PaginationResult, ApiResponse } from '../core/services/catalog.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private catalogService = inject(CatalogService);

  /**
   * Fetches products using filters, sorting, and pagination (delegated to core CatalogService)
   */
  getProducts(queryParams?: {
    textTerm?: string;
    sortBy?: string;
    isSortAscending?: boolean;
    page?: number;
    pageSize?: number;
    sizes?: string[];
    colors?: string[];
  }): Observable<ApiResponse<PaginationResult<ProductDto>>> {
    return this.catalogService.getProducts(queryParams);
  }
}
