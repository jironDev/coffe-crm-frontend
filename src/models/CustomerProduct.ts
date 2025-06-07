// src/models/CustomerProduct.ts

export interface OrderInfo {
  id: number;
  createdAt: string; // ISO
}

export interface CustomerInfo {
  id: number;
  firstName: string;
  lastName: string;
}

export interface ProductInfo {
  id: number;
  username: string;
}

export interface ProductPriceInfo {
  id: number;
  price: string; // viene como string de Prisma
}

export interface CustomerProduct {
  id: number;
  orderId: number;
  notes?: string | null;

  customerId: number;
  customer: CustomerInfo;

  productId: number;
  product: ProductInfo;

  productPriceId: number;
  productPrice: ProductPriceInfo;

  priceType:
    | 'perfil_directo'
    | 'completa_directo'
    | 'combo_directo'
    | 'completa_revendedor'
    | 'perfil_revendedor';

  totalDays: number;
  assignedAt: string;     // ISO
  expirationDate: string; // ISO
  finalUser1?: string | null;
  finalUser2?: string | null;
  assignedSlots: number;
  active: boolean;
  createdAt: string;      // ISO

  status: 'Activo' | 'Vencido';
  order: OrderInfo;       // si quieres mostrar info extra de la orden

  
}
export type CustomerProductWithRelations = CustomerProduct;