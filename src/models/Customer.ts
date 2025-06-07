export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  customerType: 'DIRECTO' | 'REVENDEDOR';
  contacto1?: string;
  contacto2?: string;
  createdAt: string;  // ISO
   orders?: OrderSummary[];
}

export interface OrderSummary {
  id: number;
  createdAt: string;  // ISO string
}