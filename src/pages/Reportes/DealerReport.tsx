// // src/pages/DealerReport.tsx
// import { useState, useMemo } from 'react'
// import { useAuth } from '../../context/AuthContext'
// import { getDealerReport, DealerReportRow } from '../../services/reportService'
// import { productTypeNames, productTypeValues } from '../../components/productTypeNames'

// const DealerReport: React.FC = () => {
//   const { token } = useAuth()
//   const [customerId, setCustomerId] = useState<number>(0)
//   const [rows, setRows] = useState<DealerReportRow[]>([])
//   const [error, setError] = useState<string|null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!token) return
//     try {
//       const data = await getDealerReport(token, customerId)
//       setRows(data)
//       setError(null)
//     } catch (err: any) {
//       setError(err.message ?? 'Error al cargar reporte')
//     }
//   }

  


//   // 2) Ordenar usando productTypeOrder y dejando totales al final
//   const sortedRows = useMemo(() => {
//     return [...rows].sort((a, b) => {
//       const isTotalA = a.productType == null
//       const isTotalB = b.productType == null
//       if (isTotalA && !isTotalB) return 1
//       if (!isTotalA && isTotalB) return -1

//       const groupA = (a as any).vencimiento_order ?? (a.vencimiento === 'Hasta el 15' ? 1 : 2)
//       const groupB = (b as any).vencimiento_order ?? (b.vencimiento === 'Hasta el 15' ? 1 : 2)
//       if (groupA !== groupB) return groupA - groupB

    

//       // Fecha de asignación
//       const dateA = a.assignedAt ? new Date(a.assignedAt).getDate() : 0
//       const dateB = b.assignedAt ? new Date(b.assignedAt).getDate() : 0
//       return dateA - dateB
//     })
//   }, [rows])
  










 
//   // Función para obtener el nombre y emoji del tipo de producto
//   const getProductTypeName = (productType: string | null): string => {
//     if (!productType) return ''; // Maneja el caso de null

//     // Convertir a minúsculas para comparación y // Buscar el ID en productTypeValues

//     // const lowerCaseProductType = productType.toLowerCase();    
//     // const productTypeId = Object.keys(productTypeValues).find(key => productTypeValues[Number(key)].toLowerCase() === lowerCaseProductType);

//      const productTypeId = Object.keys(productTypeValues).find(key => productTypeValues[Number(key)].toLowerCase() === productType);
    
//     // Si se encuentra el ID, obtener el nombre y emoji
//     return productTypeId ? productTypeNames[Number(productTypeId)] : productType; // Devuelve el texto original si no se encuentra
//   }





//   return (
//     <div className="container mt-4">
//       <h1 className="mb-3">Reporte de Revendedor</h1>
//       <form className="row g-2 mb-4" onSubmit={handleSubmit}>
//         <div className="col-md-4">
//           <input
//             type="number"
//             className="form-control"
//             placeholder="ID de Cliente"
//             value={customerId}
//             onChange={e => setCustomerId(Number(e.target.value))}
//             required
//           />
//         </div>
//         <div className="col-md-2">
//           <button type="submit" className="btn btn-primary w-100">Buscar</button>
//         </div>
//       </form>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {sortedRows.length > 0 && (
//         <div className="table-responsive">
//           <table className="table table-hover small">
//             <thead className="table-active">
//               <tr>
//                 <th>Cliente</th>
//                 <th>Usuario</th>
//                 <th>Tipo de Producto</th>
//                 <th>Tipo Precio</th>
//                 <th>Asignada</th>
//                 <th>Paga</th>
//                 <th>Precio</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((r, i) => (
//                 <tr key={i}>
//                   <td>{r.customerId}: {r.firstName} {r.lastName}</td>
//                   <td>{r.username}</td>
//                   <td>{getProductTypeName(r.productType)}</td> 
//                   <td>{r.priceType}</td>
//                   <td>{r.assignedAt?.slice(0,10)}</td>
//                   <td>{r.vencimiento}</td>
//                   {/* <td>{r.price?.toFixed(2)}</td> */}
//                   <td>
//   {r.price != null 
//     ? Number(r.price).toFixed(2) 
//     : '—'}
// </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   )
// }

// export default DealerReport



// src/pages/DealerReport.tsx
import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getDealerReport, DealerReportRow } from '../../services/reportService'
import { productTypeNames, productTypeValues } from '../../components/productTypeNames'

const DealerReport: React.FC = () => {
  const { token } = useAuth()
  const [customerId, setCustomerId] = useState<number>(0)
  const [rows, setRows] = useState<DealerReportRow[]>([])
  const [error, setError] = useState<string|null>(null)

  // Mapa de valor limpio -> orden (según productTypeValues keys)
//   const productTypeOrder = useMemo(() => {
//     return Object.entries(productTypeValues).reduce<Record<string, number>>((acc, [id, val]) => {
//       acc[val] = Number(id)
//       return acc
//     }, {})
//   }, [])

const productTypeOrder = useMemo(() => {
  return Object.entries(productTypeValues).reduce<Record<string, number>>((acc, [id, val]) => {
    acc[val.toUpperCase().trim()] = Number(id)
    return acc
  }, {})
}, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      const data = await getDealerReport(token, customerId)
      setRows(data)
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Error al cargar reporte')
    }
  }

//   // Ordenar filas según vencimiento, tipo de producto y fecha, pero dejando totales al final
//   const sortedRows = useMemo(() => {
//     return [...rows].sort((a, b) => {
//       // Detectar totales (filas con productType null)
//       const isTotalA = a.productType == null
//       const isTotalB = b.productType == null
//       if (isTotalA && !isTotalB) return 1
//       if (!isTotalA && isTotalB) return -1

//       // 1. Por grupo de vencimiento
//       const groupA = (a as any).vencimiento_order ?? (a.vencimiento === 'Hasta el 15' ? 1 : 2)
//       const groupB = (b as any).vencimiento_order ?? (b.vencimiento === 'Hasta el 15' ? 1 : 2)
//       if (groupA !== groupB) return groupA - groupB

//      // 3) Por tipo de producto (según productTypeOrder)
//      const prodA = a.productType != null
//        ? productTypeOrder[a.productType] ?? Number.MAX_SAFE_INTEGER
//       : Number.MAX_SAFE_INTEGER
//      const prodB = b.productType != null
//        ? productTypeOrder[b.productType] ?? Number.MAX_SAFE_INTEGER
//        : Number.MAX_SAFE_INTEGER
//      if (prodA !== prodB) return prodA - prodB
 

//     //   // 3. Por fecha de asignación
//     //   const dateA = a.assignedAt ? new Date(a.assignedAt).getDate() : 0;
//     // const dateB = b.assignedAt ? new Date(b.assignedAt).getDate() : 0;
//     // return dateA - dateB;

//     return 0
//     })
//   }, [rows, productTypeOrder])





// const sortedRows = useMemo(() => {
//   // 1) Separamos filas “de detalle” (con productType) y “totales” (productType == null)
//   const detailRows = rows.filter(r => r.productType != null)
//   const totalRows  = rows.filter(r => r.productType == null)

//   // 2) Dentro de las filas de detalle, separamos vencimiento 15 vs 30
//   const grupo15 = detailRows.filter(r => r.vencimiento === 'Hasta el 15')
//   const grupo30 = detailRows.filter(r => r.vencimiento !== 'Hasta el 15')

//   // 3) Ordenamos **cada** grupo sólo por el tipo de producto
//   //    (haciendo lookup en productTypeOrder)
//   const ordenarPorProducto = (a: DealerReportRow, b: DealerReportRow) => {
//     const pa = productTypeOrder[a.productType!]  ?? Number.MAX_SAFE_INTEGER
//     const pb = productTypeOrder[b.productType!]  ?? Number.MAX_SAFE_INTEGER
//     return pa - pb
//   }

//   grupo15.sort(ordenarPorProducto)
//   grupo30.sort(ordenarPorProducto)

//   // 4) Reconstruimos el array final: primero todos los “15”,
//   //    luego los totales de 15, luego todos los “30”, luego los totales de 30.
//   const total15 = totalRows.filter(r => r.vencimiento === 'Total hasta el 15')
//   const total30 = totalRows.filter(r => r.vencimiento === 'Total hasta el 30')

//   return [
//     ...grupo15,
//     ...total15,
//     ...grupo30,
//     ...total30,
//   ]
// }, [rows, productTypeOrder])







// // ESTA FUNCIONA EXCELENTE

// const sortedRows = useMemo(() => {
//   // 2) Enriquecer cada fila con productTypeId garantizado
//   const enriched = rows.map(r => {
//     const raw = r.productType ? r.productType.toUpperCase().trim() : ''
//     const id  = productTypeOrder[raw] ?? Number.MAX_SAFE_INTEGER
//     return { ...r, productTypeId: id }
//   })

//   // 3) Separar detalle vs totales
//   const detailRows = enriched.filter(r => r.productType !== null)
//   const totalRows  = enriched.filter(r => r.productType === null)

//   // 4) Dentro de detalle: grupos de vencimiento
//   const grupo15 = detailRows.filter(r => r.vencimiento === 'Hasta el 15')
//   const grupo30 = detailRows.filter(r => r.vencimiento !== 'Hasta el 15')

//   // 5) Ordenar **sólo** por productTypeId
//   grupo15.sort((a, b) => a.productTypeId - b.productTypeId)
//   grupo30.sort((a, b) => a.productTypeId - b.productTypeId)

//   // 6) Totales de cada grupo
//   const total15 = totalRows.filter(r => r.vencimiento === 'Total hasta el 15')
//   const total30 = totalRows.filter(r => r.vencimiento === 'Total hasta el 30')

//   // 7) Armar el array final
//   return [
//     ...grupo15,
//     ...total15,
//     ...grupo30,
//     ...total30,
//   ]
// }, [rows, productTypeOrder])


const sortedRows = useMemo(() => {
  // 1) Enriquecer filas con productTypeId y dayOfMonth
  const enriched = rows.map(r => {
    const raw = r.productType ? r.productType.toUpperCase().trim() : ''
    const id  = productTypeOrder[raw] ?? Number.MAX_SAFE_INTEGER

    // Ahora usamos getUTCDate() para no verse afectado por timezone
    const day = r.assignedAt
      ? new Date(r.assignedAt).getUTCDate()
      : Number.MAX_SAFE_INTEGER

    return { ...r, productTypeId: id, dayOfMonth: day }
  })

  // 2) Separar detalle vs totales
  const detailRows = enriched.filter(r => r.productType !== null)
  const totalRows  = enriched.filter(r => r.productType === null)

  // 3) Grupos de vencimiento
  const grupo15 = detailRows.filter(r => r.vencimiento === 'Hasta el 15')
  const grupo30 = detailRows.filter(r => r.vencimiento !== 'Hasta el 15')

  // 4) Sort por producto y luego por día
  const ordenarPorProductoYDía = (a: typeof enriched[0], b: typeof enriched[0]) => {
    // 4.1) Primero por productTypeId
    if (a.productTypeId !== b.productTypeId) {
      return a.productTypeId - b.productTypeId
    }
    // 4.2) Si es el mismo producto, ordena por dayOfMonth (ese “07” real)
    return a.dayOfMonth - b.dayOfMonth
  }

  grupo15.sort(ordenarPorProductoYDía)
  grupo30.sort(ordenarPorProductoYDía)

  // 5) Subtotales
  const total15 = totalRows.filter(r => r.vencimiento === 'Total hasta el 15')
  const total30 = totalRows.filter(r => r.vencimiento === 'Total hasta el 30')

  // 6) Concatenar en orden final
  return [
    ...grupo15,
    ...total15,
    ...grupo30,
    ...total30,
  ]
}, [rows, productTypeOrder])











    // Función para obtener el nombre y emoji del tipo de producto
  const getProductTypeName = (productType: string | null): string => {
    if (!productType) return ''; // Maneja el caso de null

    // Convertir a minúsculas para comparación y // Buscar el ID en productTypeValues

    // const lowerCaseProductType = productType.toLowerCase();    
    // const productTypeId = Object.keys(productTypeValues).find(key => productTypeValues[Number(key)].toLowerCase() === lowerCaseProductType);

     const productTypeId = Object.keys(productTypeValues).find(key => productTypeValues[Number(key)].toLowerCase() === productType);
    
    // Si se encuentra el ID, obtener el nombre y emoji
    return productTypeId ? productTypeNames[Number(productTypeId)] : productType; // Devuelve el texto original si no se encuentra
  }


  return (
    <div className="container mt-4">
      <h1 className="mb-3">Reporte de Revendedor</h1>
      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="ID de Cliente"
            value={customerId}
            onChange={e => setCustomerId(Number(e.target.value))}
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Buscar</button>
        </div>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {sortedRows.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover small">
            <thead className="table-active">
              <tr>
                <th>Cliente</th>
                <th>Usuario</th>
                <th>Tipo de Producto</th>
                <th>Tipo Precio</th>
                <th>Asignada</th>
                <th>Paga</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((r, i) => (
                <tr key={i}>
                  <td>{r.customerId}: {r.firstName} {r.lastName}</td>
                  <td>{r.username}</td>
             <td>{getProductTypeName(r.productType)}</td> 
                  <td>{r.priceType}</td>
                  <td>{r.assignedAt ? r.assignedAt.slice(0, 10) : '—'}</td>
                  <td>{r.vencimiento}</td>
                  <td>{r.price != null ? Number(r.price).toFixed(2) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DealerReport