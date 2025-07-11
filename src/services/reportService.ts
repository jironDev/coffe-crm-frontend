// src/services/reportService.ts
import httpClient from './httpClient'

// --- Tipos de respuesta --- 

export interface DealerReportRow {
  customerId: number
  firstName: string | null
  lastName: string | null
  assignedAt: string | null
  vencimiento: string
  username: string | null
  productType: string | null
  priceType: string | null
  price: number | null
  sort_priority: number
  vencimiento_order: number
}

export async function getDealerReport(
  token: string,
  customerId: number
): Promise<DealerReportRow[]> {
  const url = `/reports/dealer-report?customerId=${customerId}`
  return httpClient<DealerReportRow[]>(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export interface SupplierDebtRow {
  supplier: string
  vencimiento: string
  username: string
  productType: string
  pricePurchase: string
}

export interface SupplierDebtResponse {
  totalToPay: number
  rows: SupplierDebtRow[]
}

export async function getSupplierDebtReport(
  token: string,
  opts: { supplierId?: number; productTypeName?: string }
): Promise<SupplierDebtResponse> {
  const params = new URLSearchParams()
  if (opts.supplierId) params.append('supplierId', opts.supplierId.toString())
  if (opts.productTypeName) params.append('productTypeName', opts.productTypeName)
  const url = `/reports/supplier-debt?${params.toString()}`
  return httpClient<SupplierDebtResponse>(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export interface SalesReportRow {
  orderId: number
  username: string
  productType: string
  priceType: string
  prices: {
    cordobas: number
    usd: number
    exchangeRate: number
  }
  customerName: string
  saleDate: string
}

export interface SalesReportResponse {
  metadata: {
    dateRange: { startDate: string; endDate: string }
    currencyInfo: string
    generatedAt: string
  }
  data: SalesReportRow[]
  totals: {
    totalSales: number
    totalAmountCordobas: number
    totalAmountUSD: number
  }
}

export async function getSalesReport(
  token: string,
  startDate: string,
  endDate: string
): Promise<SalesReportResponse> {
  const url = `/reports/sales-report?startDate=${startDate}&endDate=${endDate}`
  return httpClient<SalesReportResponse>(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export interface PurchaseReportRow {
  productId: number
  productInfo: {
    username: string
    type: string
    supplier: string
  }
  purchaseDetails: {
    date: string
    amountUSD: number
  }
}

export interface PurchaseReportResponse {
  report: PurchaseReportRow[]
  summary: {
    totalPurchases: number
    transactionCount: number
  }
}

export async function getPurchaseReport(
  token: string,
  startDate: string,
  endDate: string
): Promise<PurchaseReportResponse> {
  const url = `/reports/purchase-report?startDate=${startDate}&endDate=${endDate}`
  return httpClient<PurchaseReportResponse>(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
