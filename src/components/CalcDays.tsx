// src/components/CalcDays.ts
// Exportamos las funciones para que puedan importarse y no queden sin uso:

/**
 * Formatea una fecha ISO o Date a "dd/MM/yyyy" en UTC.
 */
export function formatDate(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  // Usamos UTC para evitar desfases de zona
  const day = d.getUTCDate().toString().padStart(2, '0');
  const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Calcula remainingDays dinámico: si expirationDate > hoy, devuelve días completos restantes; si expiró, 0.
 */
export function calcRemainingDays(expirationISO: string): number {
  const now = new Date();
  const exp = new Date(expirationISO);
  const diffMs = exp.getTime() - now.getTime() ;
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Calcula expiresDays dinámico: si expiró (expirationDate < hoy), devuelve cuántos días desde expiración; si no expiró, 0.
 */
export function calcExpiredDays(expirationISO: string): number {
  const now = new Date();
  const exp = new Date(expirationISO);
  const diffMs = now.getTime() - exp.getTime();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))-2; // Restamos 2, uno por el desface horario y el segundo porque el dia de expiración no cuenta como vencido
}

/**
 * Determina status dinámico: "Activo" si expirationDate >= hoy, "Vencido" si expirationDate < hoy.
 */
export function calcStatus(expirationISO: string): 'Activo' | 'Vencido' {
  const now = new Date();
  const exp = new Date(expirationISO);
  return exp.getTime() < now.getTime() ? 'Vencido' : 'Activo';
}
