// src/services/exchangeRatesService.ts
import httpClient from './httpClient';

export interface ExchangeRate {
  id: number;
  value: number;
  createdAt: string;
}

// Obtener todas las tasas (ADMIN)
export async function getAllExchangeRatesAdmin(token: string): Promise<ExchangeRate[]> {
  return httpClient<ExchangeRate[]>(
    `/exchange_rates/`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}


export async function createExchangeRateAdmin(token: string, data: { effectiveDate: string; rate: number }) {
  return httpClient('/exchange_rates/', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: data
  });
}




// ——— Función de eliminación (ADMIN) ———
export async function deleteExchangeRateAdmin(
  token: string,
  id: number
): Promise<{ message: string }> {
  return httpClient<{ message: string }>(
    `/exchange_rates/${id}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}