// src/pages/AuditLogs.tsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'


import { getAllAuditLogs, deleteAuditLog, AuditLog, GetAuditLogsFilters } from '../../services/auditLogService'





const AuditLogs: React.FC = () => {
  const { token, role } = useAuth()
  const today = new Date().toISOString().slice(0,10)
  
  const [startDate, setStartDate] = useState<string>(today)
  const [endDate, setEndDate]     = useState<string>(today)
  const [workerId, setWorkerId]   = useState<number|''>('')
  const [productId, setProductId] = useState<number|''>('')

  const [logs, setLogs]   = useState<AuditLog[]>([])
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    setError(null)
    const filters: GetAuditLogsFilters = {
      startDate, endDate,
      workerId: workerId === '' ? undefined : Number(workerId),
      productId: productId === '' ? undefined : Number(productId)
    }
    try {
      const data = await getAllAuditLogs(token, filters)
      setLogs(data)
    } catch (err: any) {
      setError(err.message ?? 'Error al cargar auditorías')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (role !== 'ADMIN') return
    if (!window.confirm('¿Eliminar este log de auditoría?')) return
    try {
      await deleteAuditLog(token!, id)
      setLogs(logs.filter(l => l.id !== id))
    } catch (err: any) {
      alert(err.message ?? 'No se pudo eliminar')
    }
  }

  // Formatea ISO a "YYYY-MM-DD HH:mm"
  const formatDateTime = (iso: string) => {
    const d = new Date(iso)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return [
      d.getFullYear(),
      pad(d.getMonth()+1),
      pad(d.getDate())
    ].join('-')
    + ' ' +
    [pad(d.getHours()), pad(d.getMinutes())].join(':')
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Logs de Auditoría</h1>

      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-2">
          <label className="form-label">Desde</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Hasta</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Worker ID</label>
          <input
            type="number"
            className="form-control"
            value={workerId}
            onChange={e => setWorkerId(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Product ID</label>
          <input
            type="number"
            className="form-control"
            value={productId}
            onChange={e => setProductId(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="col-md-2 align-self-end">
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Cargando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {logs.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover small">
            <thead className="table-active">
              <tr>
                <th>ID</th>
                <th>Worker</th>
                <th>Tabla</th>
                <th>Registro</th>
                <th>Op.</th>
                <th>Old Data</th>
                <th>New Data</th>
                <th>Fecha</th>
                {role === 'ADMIN' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.workerId ?? '—'}</td>
                  <td>{log.tableName}</td>
                  <td>{log.recordId ?? '—'}</td>
                  <td>{log.operation}</td>
                  <td><pre className="small mb-0">{JSON.stringify(log.oldData, null, 2)}</pre></td>
                  <td><pre className="small mb-0">{JSON.stringify(log.newData, null, 2)}</pre></td>
                  <td>{formatDateTime(log.createdAt)}</td>
                  {role === 'ADMIN' && (
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(log.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {logs.length === 0 && !error && (
        <div className="alert alert-info">No hay registros que mostrar.</div>
      )}
    </div>
  )
}

export default AuditLogs
