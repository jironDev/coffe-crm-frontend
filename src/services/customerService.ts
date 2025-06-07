import httpClient from './httpClient';
import type { Customer } from '../models/Customer';

export interface CreateCustomerDTO {
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  customerType: 'DIRECTO' | 'REVENDEDOR';
  contacto1?: string;
  contacto2?: string;
}

export async function getAllCustomers(
  token: string,
  filters: Partial<{
    q: string;
    firstName: string;
    lastName: string;
    phone: string;
  }> = {}
): Promise<Customer[]> {
  const params = new URLSearchParams();
  if (filters.q)         params.append('q', filters.q);
  if (filters.firstName) params.append('firstName', filters.firstName);
  if (filters.lastName)  params.append('lastName', filters.lastName);
  if (filters.phone)     params.append('phone', filters.phone);

  const query = params.toString() ? `?${params.toString()}` : '';
  return httpClient<Customer[]>(
    `/customers/all-customers${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}


export async function getCustomerById(
  token: string,
  id: number
): Promise<Customer> {
  return httpClient<Customer>(
    `/customers/get-customer/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function createCustomer(
  token: string,
  data: CreateCustomerDTO
): Promise<Customer> {
  return httpClient<Customer>(
    '/customers/add-customer',
    { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: data }
  );
}

export async function updateCustomer(
  token: string,
  id: number,
  data: CreateCustomerDTO
): Promise<Customer> {
  return httpClient<Customer>(
    `/customers/update-customer/${id}`,
    { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: data }
  );
}

export async function deleteCustomer(
  token: string,
  id: number
): Promise<{ message: string }> {
  return httpClient<{ message: string }>(
    `/admin/delete-customer/${id}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  );
}
