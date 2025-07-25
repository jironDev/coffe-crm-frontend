// src/pages/SalesReportPage.tsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';


// import {
//   getSalesReport,
//   SalesReportResponse,
  
// } from '../services/reportService'
import { getSalesReport } from '../../services/reportService'
import { SalesReportResponse } from '../../services/reportService'



const SalesReportPage: React.FC = () => {
  const { token } = useAuth()
  const today = new Date().toISOString().slice(0,10)
  const [startDate, setStartDate] = useState<string>(today)
  const [endDate, setEndDate] = useState<string>(today)
  const [report, setReport] = useState<SalesReportResponse|null>(null)
  const [error, setError] = useState<string|null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      const resp = await getSalesReport(token, startDate, endDate)
      setReport(resp)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Error al cargar reporte')
    }
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-3"><AttachMoneyIcon fontSize='large'/> Reporte de Ventas</h1>
      <div className="mb-5"></div>

      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-6">
          
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-12 align-self-end">
          <button type="submit" className="btn btn-primary w-100">Generar</button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {report && (
        <>
          <div className="mb-3 text-teal h5">
            {/* <strong>Rango:</strong> {report.metadata.dateRange.startDate} – {report.metadata.dateRange.endDate}
            <br/> */}
            <strong>Totales:</strong> C${report.totals.totalAmountCordobas.toFixed(2)} | USD${report.totals.totalAmountUSD.toFixed(2)}
          </div>

          <div className="table-responsive shadow rounded">
            <table className="table table-hover">
              <thead className="table-dark table-active small">
                <tr>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Tipo Precio</th>
                  <th>Fecha</th>
                  <th>C$</th>
                  <th>USD</th>
                  
                </tr>
              </thead>
              <tbody>
                {report.data.map((r, i) => (
                  <tr key={i}>
                    <td>{r.orderId}</td>
                    <td>{r.customerName}</td>
                    <td>{r.username}</td>
                    <td>{r.priceType}</td>
                    <td>{r.saleDate}</td>
                    <td>{r.prices.cordobas.toFixed(2)}</td>
                    <td>{r.prices.usd.toFixed(2)}</td>                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default SalesReportPage
