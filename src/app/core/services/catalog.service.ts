import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryDto {
  id: string;
  name: string;
  targetAudience: string;
  isVisible: boolean;
}

export interface ProductDto {
  id: string;
  title: string;
  description: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  isVisible: boolean;
  scheduledPublishDate?: string;
  categoryId: string;
  mainCategory: string;
  subCategory: string;
  colors: string[];
  sizes: string[];
  materials?: string[];
  seasonTags?: string[];
  shippingSize: string;
  imageUrl?: string;
  imageUrls: ProductImageDto[];
  age?: string;
  collectionType?: string;
  categories: CategoryDto[];
  overrideStandardShipping?: boolean;
  isFreeShipping?: boolean;
  fixedShippingPrice?: number;
  brandId?: string;
  brandName?: string;
  brandLogoUrl?: string;
}

export interface ProductImageDto {
  id: string;
  url: string;
  sortOrder: number;
  altText?: string;
}

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginationResult<T> {
  items: T[];
  metadata: PaginationMetadata;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors: any;
}

export interface BulkAddProductsResultDto {
  totalProcessed: number;
  successfullyCreated: number;
  errorsCount: number;
  errors: string[];
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  showInCards: boolean;
  isVisible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = 'http://localhost:5153/api/products';

  constructor(private http: HttpClient) {}

  /**
   * Fetches products using text term filters, sorting, page index, page size, sizes, and colors.
   */
  getProducts(queryParams?: {
    textTerm?: string;
    sortBy?: string;
    isSortAscending?: boolean;
    page?: number;
    pageSize?: number;
    sizes?: string[];
    colors?: string[];
    collectionType?: string;
    brandId?: string;
  }): Observable<ApiResponse<PaginationResult<ProductDto>>> {
    let params = new HttpParams();

    if (queryParams) {
      if (queryParams.textTerm) {
        params = params.set('textTerm', queryParams.textTerm);
      }
      if (queryParams.sortBy) {
        params = params.set('sortBy', queryParams.sortBy);
      }
      if (queryParams.isSortAscending !== undefined) {
        params = params.set('isSortAscending', String(queryParams.isSortAscending));
      }
      if (queryParams.page !== undefined) {
        params = params.set('page', String(queryParams.page));
      }
      if (queryParams.pageSize !== undefined) {
        params = params.set('pageSize', String(queryParams.pageSize));
      }
      if (queryParams.collectionType) {
        params = params.set('collectionType', queryParams.collectionType);
      }
      if (queryParams.brandId) {
        params = params.set('brandId', queryParams.brandId);
      }
      if (queryParams.sizes && queryParams.sizes.length > 0) {
        // Appends size filters (e.g. sizes=S&sizes=M)
        queryParams.sizes.forEach(size => {
          params = params.append('sizes', size);
        });
      }
      if (queryParams.colors && queryParams.colors.length > 0) {
        // Appends color filters (e.g. colors=Red&colors=Blue)
        queryParams.colors.forEach(color => {
          params = params.append('colors', color);
        });
      }
    }

    return this.http.get<ApiResponse<PaginationResult<ProductDto>>>(this.apiUrl, { params });
  }

  /**
   * Fetches a single product visual sheet by its ID
   */
  getProductById(id: string): Observable<ApiResponse<ProductDto>> {
    return this.http.get<ApiResponse<ProductDto>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Upload multiple products in bulk (POST api/products/bulk)
   */
  bulkAddProducts(
    dtos: any[], 
    defaultCategoryId?: string, 
    defaultSeason?: string
  ): Observable<ApiResponse<BulkAddProductsResultDto>> {
    let params = new HttpParams();
    if (defaultCategoryId) {
      params = params.set('defaultCategoryId', defaultCategoryId);
    }
    if (defaultSeason) {
      params = params.set('defaultSeason', defaultSeason);
    }

    return this.http.post<ApiResponse<BulkAddProductsResultDto>>(`${this.apiUrl}/bulk`, dtos, { params });
  }

  /**
   * Updates product basic parameters and associated metadata (PUT api/products/{id})
   */
  updateProduct(id: string, productData: any): Observable<ApiResponse<ProductDto>> {
    return this.http.put<ApiResponse<ProductDto>>(`${this.apiUrl}/${id}`, productData);
  }

  /**
   * Deletes a single product from the storefront inventory (DELETE api/products/{id})
   */
  deleteProduct(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Toggle visibility of a product (PATCH api/products/{id}/toggle-visibility)
   */
  toggleProductVisibility(id: string): Observable<ApiResponse<ProductDto>> {
    return this.http.patch<ApiResponse<ProductDto>>(`${this.apiUrl}/${id}/toggle-visibility`, {});
  }

  getBrands(): Observable<ApiResponse<Brand[]>> {
    return this.http.get<ApiResponse<Brand[]>>('http://localhost:5153/api/brands');
  }

  getAdminBrands(): Observable<ApiResponse<Brand[]>> {
    return this.http.get<ApiResponse<Brand[]>>('http://localhost:5153/api/admin/brands');
  }

  createBrand(brand: Partial<Brand>): Observable<ApiResponse<Brand>> {
    return this.http.post<ApiResponse<Brand>>('http://localhost:5153/api/admin/brands', brand);
  }

  updateBrand(id: string, brand: Partial<Brand>): Observable<ApiResponse<Brand>> {
    return this.http.put<ApiResponse<Brand>>(`http://localhost:5153/api/admin/brands/${id}`, brand);
  }

  deleteBrand(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`http://localhost:5153/api/admin/brands/${id}`);
  }
}
