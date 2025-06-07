// src/services/productPricesService.ts

import httpClient from './httpClient';

export type CustomerType = 'DIRECTO' | 'REVENDEDOR';

export interface ProductPrice {
  id: number;
  productTypeId: number;
  customerType: CustomerType;
  priceType: string;       // si quieres, define un enum igual que en tu schema
  price: number;
  exchangeRateId: number;
  createdAt: string;
  // puedes incluir aquí relaciones si las necesitas, e.g. productType, exchangeRate...
}

// DTO para creación (admin)
export interface CreateProductPriceDTO {
  productTypeId: number;
  customerType: CustomerType;
  priceType: string;
  price: number;
  exchangeRateId: number;
}

/**
 * Obtiene todos los precios de producto (ruta pública,
 * exige solo token de admin o worker)
 */
export async function getAllProductPrices(
  token: string,
  filters: Partial<{
    productTypeId: number;
    customerType: CustomerType;
    price: number;
    effective_date: string; // formato YYYY-MM-DD
  }> = {}
): Promise<ProductPrice[]> {
  // Construye query params si hay filtros
  const params = new URLSearchParams();
  if (filters.productTypeId !== undefined) {
    params.append('productTypeId', String(filters.productTypeId));
  }
  if (filters.customerType) {
    params.append('customerType', filters.customerType);
  }
  if (filters.price !== undefined) {
    params.append('price', String(filters.price));
  }
  if (filters.effective_date) {
    params.append('effective_date', filters.effective_date);
  }

  return httpClient<ProductPrice[]>(
    `/product_prices/${params.toString() ? `?${params.toString()}` : ''}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}

/**
 * Crea un nuevo precio de producto (solo ADMIN)
 */
export async function createProductPriceAdmin(
  token: string,
  data: CreateProductPriceDTO
): Promise<ProductPrice> {
  return httpClient<ProductPrice>(
    '/admin/product_prices/',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    }
  );
}


export async function updateProductPriceAdmin(
  token: string,
  id: number,
  data: CreateProductPriceDTO
): Promise<ProductPrice> {
  return httpClient<ProductPrice>(
    `/admin/product_prices/${id}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    }
  );
}



/**
 * Elimina un precio de producto por ID (solo ADMIN)
 */
export async function deleteProductPriceAdmin(
  token: string,
  id: number
): Promise<{ message: string }> {
  return httpClient<{ message: string }>(
    `/admin/product_prices/${id}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}
