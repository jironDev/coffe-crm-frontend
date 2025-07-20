// src/pages/PurchaseReportPage.tsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'


import { getPurchaseReport } from '../../services/reportService'
import { PurchaseReportResponse } from '../../services/reportService'





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

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Reporte de Compras</h1>
      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <label className="form-label">Desde</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Hasta</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-2 align-self-end">
          <button type="submit" className="btn btn-primary w-100">Generar</button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {report && (
        <>
          <div className="mb-3">
            <strong>Total Compras:</strong> ${Number(report.summary.totalPurchases).toFixed(2)}  (<em>{report.summary.transactionCount} transacciones</em>)
          </div>

          <div className="table-responsive">
            <table className="table table-hover small">
              <thead>
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
