export interface Supplier {
  id: number;
  name: string;
  contactInfo?: string;
  createdAt: string;
}

export interface ProductType {
  id: number;
  name: string;
  defaultCapacity: number;
}

export interface Product {
  id: number;
  supplierId?: number | null;
  productTypeId: number;
  username: string;
  password: string;
  startDate: string;       // ISO date string, e.g. "2025-04-14T00:00:00.000Z"
  endDate: string;         // ISO date string
  capacity: number;
  usedSlots: number;
  observations?: string;
  pricePurchase: number;
  createdAt: string;       // ISO datetime string
  supplier?: Supplier;     // relación opcional
  productType: ProductType; // relación siempre presente
}