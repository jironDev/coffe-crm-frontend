import httpClient from './httpClient';
import type { Supplier } from '../models/Supplier';
import type { Product } from '../models/Product';

export interface CreateProductDTO {
  supplierId?: number | null;
  productTypeId: number;
  username: string;
  password: string;
  startDate: string;      // YYYY-MM-DD
  endDate: string;        // YYYY-MM-DD
  observations?: string;
  pricePurchase: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export async function getAllProducts(
  token: string,
  filters: Partial<{
    q: string;
    productType: string;
    capacity: number;
    pricePurchase: number;
    startDate: string;
    endDate: string;
    supplierName: string;
    productTypeId: number;
  }> = {}
): Promise<Array<Product & { supplier?: Supplier; productType: { id: number; name: string; defaultCapacity: number } }>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      params.append(k, String(v));
    }
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  return httpClient(
    `/products/all-products${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function getProductById(
  token: string,
  id: number
): Promise<Product & { supplier?: Supplier; productType: { id: number; name: string; defaultCapacity: number } }> {
  return httpClient(
    `/products/get-product/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function createProduct(
  token: string,
  data: CreateProductDTO
) {
  return httpClient(
    '/products/add-product',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    }
  );
}

export async function updateProduct(
  token: string,
  id: number,
  data: UpdateProductDTO
) {
  return httpClient(
    `/products/update-product/${id}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    }
  );
}

export async function deleteProduct(
  token: string,
  id: number
) {
  return httpClient(
    `/admin/delete-product/${id}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}
