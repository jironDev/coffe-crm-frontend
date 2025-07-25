// src/pages/AuditLogs.tsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllAuditLogs, deleteAuditLog, AuditLog, GetAuditLogsFilters } from '../../services/auditLogService'
import JsonPreview from '../../components/JsonPreview'
import PeopleIcon from '@mui/icons-material/People';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';




const AuditLogs: React.FC = () => {
  const { token, role } = useAuth()
  const today = new Date().toISOString().slice(0,10)
  
  const [startDate, setStartDate] = useState<string>(today)
  const [endDate, setEndDate]     = useState<string>(today)
  const [workerId, setWorkerId]   = useState<number|''>('')
  // const [productId, setProductId] = useState<number|''>('')

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
      // productId: productId === '' ? undefined : Number(productId)
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
      <h1 className="mb-3"><PeopleIcon fontSize='large'/> Logs de Auditoría</h1>
      <div className="mb-5"></div>

      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-4">
          
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
         
          <input
            type="number"
            className="form-control"
            placeholder="ID Trabajador"
            value={workerId}
            onChange={e => setWorkerId(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        {/* <div className="col-md-2">
          <label className="form-label">Product ID</label>
          <input
            type="number"
            className="form-control"
            value={productId}
            onChange={e => setProductId(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div> */}
        <div className="col-md-12 align-self-end mb-3">
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Cargando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {logs.length > 0 && (
        <div className="table-responsive shadow rounded">
          <table className="table table-hover">
            <thead className="table-dark table-active small">
              <tr>
                {/* <th>ID</th> */}
                <th className='text-center'>Worker</th>
                <th className='text-center'>Tabla</th>
                <th>Registro</th>
                <th>Operación</th>
                <th>Old Data</th>
                <th>New Data</th>
                <th>Fecha</th>
                {role === 'ADMIN' && <th className='text-center'>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  {/* <td>{log.id}</td> */}
                  <td className='text-center'>{log.workerId ?? '—'}</td>
                  <td className='text-center'>{log.tableName}</td>
                  <td>{log.recordId ?? '—'}</td>
                  <td>{log.operation}</td>
                  {/* <td><pre className="small mb-0">{JSON.stringify(log.oldData, null, 2)}</pre></td> */}
                  <td>{log.oldData != null ? <JsonPreview data={log.oldData} previewChars={1} /> : '—'}</td>


                  {/* <td><pre className="small mb-0">{JSON.stringify(log.newData, null, 2)}</pre></td> */}
                       <td> {log.newData != null ? <JsonPreview data={log.newData} previewChars={1} /> : '—'} </td>

                  <td>{formatDateTime(log.createdAt)}</td>
                  {role === 'ADMIN' && (
                    <td className='text-center'>
                      <button
                        className="btn btn-sm btn-outline-danger border-0 text"
                        onClick={() => handleDelete(log.id)}
                      >
                        <DeleteOutlineIcon/>
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
