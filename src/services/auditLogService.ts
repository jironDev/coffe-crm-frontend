// src/services/auditLogService.ts
import httpClient from './httpClient'

export interface AuditLog {
  id: number
  workerId?: number
  tableName: string
  recordId?: number
  operation: 'INSERT' | 'UPDATE' | 'DELETE'
  oldData?: any
  newData?: any
  createdAt: string
}

export interface GetAuditLogsFilters {
  startDate?: string  // “YYYY-MM-DD”
  endDate?: string    // “YYYY-MM-DD”
  workerId?: number
  productId?: number
}

/**
 * GET /audit_log/
 */
export async function getAllAuditLogs(
  token: string,
  filters: GetAuditLogsFilters = {}
): Promise<AuditLog[]> {
  const params = new URLSearchParams()
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate)   params.append('endDate', filters.endDate)
  if (filters.workerId)  params.append('workerId', filters.workerId.toString())
  if (filters.productId) params.append('productId', filters.productId.toString())

  const query = params.toString() ? `?${params.toString()}` : ''
  return httpClient<AuditLog[]>(
    `/audit_log/${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
}

/**
 * GET /audit_log/:id
 */
export async function getAuditLogById(
  token: string,
  id: number
): Promise<AuditLog> {
  return httpClient<AuditLog>(
    `/audit_log/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
}

/**
 * DELETE /audit_log/:id
 */
export async function deleteAuditLog(
  token: string,
  id: number
): Promise<{ message: string }> {
  return httpClient<{ message: string }>(
    `/audit_log/${id}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  )
}
