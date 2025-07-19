// src/services/balanceService.ts
import httpClient from './httpClient';

export interface CustomerInfo {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  customerType: 'DIRECTO' | 'REVENDEDOR';
  // ...otros campos si deseas (address, etc), pero al menos estos
}

export interface ProductInfo {
  id: number;
  username: string;
  // ...otros si necesitas
}

export interface CustomerProductInfo {
  id: number;
  orderId: number;
  expirationDate: string; // ISO
  // Puedes añadir assignedAt u otros si quieres mostrarlos
  customer: CustomerInfo;
  product: ProductInfo;
  totalDays: number; 

//esto es nuevo
priceType: 
    | 'perfil_directo'
    | 'completa_directo'
    | 'combo_directo'
    | 'completa_revendedor'
    | 'perfil_revendedor';
  finalUser1?: string;
  assignedSlots: number;



}

export interface BalanceRecord {
  id: number;
  customerProductId: number;
  amount: number;          // o string, según lo que regrese httpClient/prisma; asumo number
  remainingDays: number;
  // remainingAmount: number;
  updatedAt: string;       // ISO string
  // Campos calculados desde backend:
  status: string;          // "Activo" | "Vencido" | etc
  expiresDays: number;
  // Relación incluida:
  customerProduct: CustomerProductInfo;
}

// Filtros posibles para getAllBalances
export interface GetAllBalancesFilters {
  firstName?: string;
  lastName?: string;
  phone?: string;
  username?: string;
  finalUser1?: string;
  finalUser2?: string;
  status?: string;
  amountMin?: number;
  amountMax?: number;
  customerId?: number;
  expirationDate?: string; // “YYYY-MM-DD”
  customerType?: 'DIRECTO' | 'REVENDEDOR';
  expiresDays?: number;
}

export async function getAllBalances(
  token: string,
  filters: GetAllBalancesFilters = {}
): Promise<BalanceRecord[]> {
  const params = new URLSearchParams();

  if (filters.firstName)     params.append('firstName', filters.firstName);
  if (filters.lastName)      params.append('lastName', filters.lastName);
  if (filters.phone)         params.append('phone', filters.phone);
  if (filters.username)      params.append('username', filters.username);
  if (filters.finalUser1)    params.append('finalUser1', filters.finalUser1);
  if (filters.finalUser2)    params.append('finalUser2', filters.finalUser2);
  if (filters.status)        params.append('status', filters.status);
  if (filters.amountMin !== undefined) params.append('amountMin', filters.amountMin.toString());
  if (filters.amountMax !== undefined) params.append('amountMax', filters.amountMax.toString());
  if (filters.customerId !== undefined) params.append('customerId', filters.customerId.toString());
  if (filters.expirationDate) params.append('expirationDate', filters.expirationDate);
  if (filters.customerType)  params.append('customerType', filters.customerType);
  if (filters.expiresDays !== undefined) params.append('expiresDays', filters.expiresDays.toString());

  const query = params.toString() ? `?${params.toString()}` : '';
  return httpClient<BalanceRecord[]>(
    `/balances${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function getBalancesByOrderId(
  token: string,
  orderId: number
): Promise<BalanceRecord[]> {
  return httpClient<BalanceRecord[]>(
    `/balances/${orderId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
