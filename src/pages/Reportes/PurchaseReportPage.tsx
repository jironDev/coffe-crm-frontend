// src/pages/PurchaseReportPage.tsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'


import { getPurchaseReport } from '../../services/reportService'
import { PurchaseReportResponse } from '../../services/reportService'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';




const PurchaseReportPage: React.FC = () => {
  const { token } = useAuth()
  const today = new Date().toISOString().slice(0,10)
  const [startDate, setStartDate] = useState<string>(today)
  const [endDate, setEndDate] = useState<string>(today)
  const [report, setReport] = useState<PurchaseReportResponse|null>(null)
  const [error, setError] = useState<string|null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      const resp = await getPurchaseReport(token, startDate, endDate)
      setReport(resp)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Error al cargar reporte')
    }
  }

  const computedTotal = report
  ? report.report.reduce((sum, r) => sum + Number(r.purchaseDetails.amountUSD), 0)
  : 0;

  return (
    <div className="container mt-4">
      <h1 className="mb-3"><ShoppingBagIcon fontSize='large'/> Reporte de Compras</h1>
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
          <div className="mb-3 fw-bold text-teal h5">
            <strong>Total Compras:</strong> ${computedTotal.toFixed(2)}
          </div>

          <div className="table-responsive shadow rounded">
            <table className="table table-hover">
              <thead className="table-dark table-active small">
                <tr>
                  {/* <th>ID Producto</th> */}
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Proveedor</th>
                  <th>Fecha Compra</th>
                  <th>Monto USD</th>
                </tr>
              </thead>
              <tbody>
                {report.report.map((r, i) => (
                  <tr key={i}>
                    {/* <td>{r.productId}</td> */}
                    <td>{r.productInfo.username}</td>
                    <td>{r.productInfo.type}</td>
                    <td>{r.productInfo.supplier}</td>
                    <td>{r.purchaseDetails.date}</td>
                    <td>{Number(r.purchaseDetails.amountUSD).toFixed(2)}</td>
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

export default PurchaseReportPage
