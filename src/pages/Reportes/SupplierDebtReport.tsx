
// src/pages/SupplierDebtReport.tsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getSupplierDebtReport, SupplierDebtResponse } from '../../services/reportService'
import { productTypeNames, productTypeValues } from '../../components/productTypeNames'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

const SupplierDebtReport: React.FC = () => {
  const { token } = useAuth()
  const [supplierId, setSupplierId] = useState<number|''>('')
  const [productTypeName, setProductTypeName] = useState<string>('')
  const [data, setData] = useState<SupplierDebtResponse|null>(null)
  const [error, setError] = useState<string|null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      const resp = await getSupplierDebtReport(token, {
        supplierId: supplierId || undefined,
        productTypeName: productTypeName || undefined
      })
      setData(resp)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Error al cargar reporte')
    }
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-3"><CurrencyBitcoinIcon fontSize="large"/> Deuda a Proveedores</h1>
       <div className="mb-5"></div>

      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            type="number"
            className="form-control"
            placeholder="ID Proveedor"
            value={supplierId}
            onChange={e => setSupplierId(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={!!productTypeName}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={productTypeName}
            onChange={e => setProductTypeName(e.target.value)}
            disabled={!!supplierId}
          >
            <option value="">Seleccione tipo de producto</option>
            {Object.entries(productTypeNames).map(([id, display]) => {
              // Para cada id, obtenemos el valor crudo sin emojis
              const rawValue = productTypeValues[Number(id)]
              return (
                <option key={id} value={rawValue}>
                  {display}
                </option>
              )
            })}
          </select>
        </div>
        <div className="col-md-12">
          <button type="submit" className="btn btn-primary w-100">Buscar</button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {data && (
        <>
          <h5 className='text-teal fw-bold mb-3'>Total a Pagar: ${data.totalToPay.toFixed(2)}</h5>

          <div className="table-responsive shadow rounded">
            <table className="table table-hover small">
              <thead className="table-dark table-active small">
                <tr>
                  <th>Proveedor</th>
                  <th>Vencimiento</th>
                  <th>Usuario</th>
                  <th>Tipo</th>
                  <th>Precio Compra</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.supplier}</td>
                    <td>{r.vencimiento.slice(0,10)}</td>
                    <td>{r.username}</td>
                    <td>{
  (() => {
    if (!r.productType) return ''
    // Buscamos la entrada normalizando a minúsculas
    const entry = Object.entries(productTypeValues)
      .find(([, val]) =>
        val.toLowerCase() === r.productType.toLowerCase()
      )
    // Si la encontramos, devolvemos el nombre con emoji
    return entry
      ? productTypeNames[Number(entry[0])]
      : r.productType
  })()
}</td>
                    <td>${Number(r.pricePurchase).toFixed(2)}</td>
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

export default SupplierDebtReport

