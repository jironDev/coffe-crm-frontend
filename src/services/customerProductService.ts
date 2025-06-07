// src/services/customerProductService.ts
import httpClient from './httpClient'
import type { CustomerProduct } from '../models/CustomerProduct';

// ------------------------------------------------------------------------------------------------
// ✱ Exportamos este tipo para poder usarlo en Sales.tsx sin que dé “not exported”
// ------------------------------------------------------------------------------------------------
export interface CustomerProductWithRelations extends CustomerProduct {
  customer: { id: number; firstName: string; lastName: string; phone: string; };
  product:  { id: number; username: string; };
  productPrice: { id: number; price: string; };
  order:    { id: number; createdAt: string; };
  status:   'Activo' | 'Vencido';
}
// ------------------------------------------------------------------------------------------------



// DTOs / demás funciones…
export interface CreateCustomerProductDTO {
  notes?: string;
  customerId: number;
  productId: number;
  priceType:
    | 'perfil_directo'
    | 'completa_directo'
    | 'combo_directo'
    | 'completa_revendedor'
    | 'perfil_revendedor';
  totalDays: number;
  assignedAt: string;   // “YYYY-MM-DD” o ISO
  finalUser1?: string;
  finalUser2?: string;
  assignedSlots: number;
}

export interface UpdateCustomerProductDTO {
  productId: number;
}

// POST /customer_products/add-sale
export async function createSale(
  token: string,
  data: CreateCustomerProductDTO
): Promise<{ customerProduct: CustomerProduct; balance: unknown }> {
  return httpClient<{ customerProduct: CustomerProduct; balance: unknown }>(
    '/customer_products/add-sale',
    { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: data }
  );
}

// GET /customer_products/all-sales
export async function getAllCustomerProducts(
  token: string,
  filters: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    username: string;
    assignedAt: string;
    expirationDate: string;
    finalUser1: string;
    finalUser2: string;
    status: string;
  }> = {}
): Promise<CustomerProductWithRelations[]> {
  const params = new URLSearchParams();
  if (filters.firstName)       params.append('firstName', filters.firstName);
  if (filters.lastName)        params.append('lastName', filters.lastName);
  if (filters.phone)           params.append('phone', filters.phone);
  if (filters.username)        params.append('username', filters.username);
  if (filters.assignedAt)      params.append('assignedAt', filters.assignedAt);
  if (filters.expirationDate)  params.append('expirationDate', filters.expirationDate);
  if (filters.finalUser1)      params.append('finalUser1', filters.finalUser1);
  if (filters.finalUser2)      params.append('finalUser2', filters.finalUser2);
  if (filters.status)          params.append('status', filters.status);

  const query = params.toString() ? `?${params.toString()}` : '';
  return httpClient<CustomerProductWithRelations[]>(
    `/customer_products/all-sales${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

// GET /customer_products/get-order/:id
export interface OrderLineDetail {
  id: number;
  orderId?: number;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
  };
  product: { id: number; username: string; productTypeId: number;  };
  productPrice: { id: number; price: string };
  priceType:
    | 'perfil_directo'
    | 'completa_directo'
    | 'combo_directo'
    | 'completa_revendedor'
    | 'perfil_revendedor';
  totalDays: number;
  assignedAt: string;
  expirationDate: string;
  finalUser1?: string | null;
  finalUser2?: string | null;
  assignedSlots: number;
  status: 'Activo' | 'Vencido';
}

// export interface OrderDetail {
//   id: number;
//   customer: { id: number; firstName: string; lastName: string;  phone: string;   };
//   lines: OrderLineDetail[];
//   totalAmount: number;
// }

export interface OrderDetail {
  id: number;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    customerType: 'DIRECTO' | 'REVENDEDOR'; // Asegúrate de usar exactamente los strings que envía tu API.
  };
  createdAt: string;           // ISO date string (p. ej. "2025-05-01T04:38:12.228Z")
  notes?: string | null;       // Podemos recibir null o string
  lines: OrderLineDetail[];
  totalAmount: number;
}

export async function getCustomerOrderById(
  token: string,
  orderId: number
): Promise<OrderDetail> {
  return httpClient<OrderDetail>(
    `/customer_products/get-order/${orderId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}



// PUT /customer_products/deactivate/:id
export async function deactivateCustomerProduct(
  token: string,
  id: number
): Promise<{ message: string; customerProduct: any }> {
  return httpClient<{ message: string; customerProduct: any }>(
    `/customer_products/deactivate/${id}`,
    { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
  );
}

// DELETE /admin/delete-order/:id
export async function deleteCustomerOrderById(
  token: string,
  orderId: number
): Promise<{ message: string }> {
  return httpClient<{ message: string }>(
    `/admin/delete-order/${orderId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  );
}

// PUT /customer_products/update-product/:id
export async function updateSaleProduct(
  token: string,
  id: number,
  data: UpdateCustomerProductDTO
): Promise<{ customerProduct: CustomerProduct }> {
  return httpClient<{ customerProduct: CustomerProduct }>(
    `/customer_products/update-product/${id}`,
    { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: data }
  );
}

