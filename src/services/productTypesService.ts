import httpClient from "./httpClient";

export interface ProductType {
  id: number;
  name: string;
  defaultCapacity: number;
  createdAt?: string;
}

export interface CreateProductTypeDTO {
  name: string;
  defaultCapacity: number;
}

// Obtener todos los tipos (GET /admin/product_types)
export async function getAllProductTypes(token: string): Promise<ProductType[]> {
  return httpClient<ProductType[]>("/admin/product_types", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Crear (POST /admin/product_types)
export async function createProductTypeAdmin(
  token: string,
  data: CreateProductTypeDTO
): Promise<ProductType> {
  return httpClient<ProductType>("/admin/product_types", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
}

// Actualizar (PUT /admin/product_types/:id)
export async function updateProductTypeAdmin(
  token: string,
  id: number,
  data: Partial<CreateProductTypeDTO>
): Promise<ProductType> {
  return httpClient<ProductType>(`/admin/product_types/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
}

// Eliminar (DELETE /admin/product_types/:id)
export async function deleteProductTypeAdmin(
  token: string,
  id: number
): Promise<{ message: string }> {
  return httpClient<{ message: string }>(`/admin/product_types/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
