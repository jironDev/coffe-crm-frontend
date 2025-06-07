import httpClient from './httpClient';
import type { Supplier } from '../models/Supplier';

export interface CreateSupplierDTO {
  name: string;
  contactInfo?: string;
}

export async function getAllSuppliers(
  token: string,
  q: string = ''
): Promise<Supplier[]> {
  const query = q ? `?q=${encodeURIComponent(q)}` : '';
  return httpClient<Supplier[]>(
    `/suppliers/${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function getSupplierById(
  token: string,
  id: number
): Promise<Supplier> {
  return httpClient<Supplier>(
    `/suppliers/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function createSupplier(
  token: string,
  data: CreateSupplierDTO
): Promise<Supplier> {
  return httpClient<Supplier>(
    '/suppliers',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    }
  );
}

export async function updateSupplier(
  token: string,
  id: number,
  data: CreateSupplierDTO
): Promise<Supplier> {
  return httpClient<Supplier>(
    `/suppliers/${id}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    }
  );
}

export async function deleteSupplier(
  token: string,
  id: number
): Promise<{ message: string }> {
  return httpClient<{ message: string }>(
    `/suppliers/${id}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}
