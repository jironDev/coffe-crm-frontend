// // src/pages/BalancesByOrder.tsx
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { getBalancesByOrderId, BalanceRecord } from '../services/balanceService';
// import { CircularProgress } from '@mui/material';
// import Box from '@mui/material/Box';

// // Importamos los helpers de fecha
// import { formatDate, calcRemainingDays, calcExpiredDays, calcStatus } from '../components/CalcDays';



// const BalancesByOrder: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const orderId = parseInt(id || '', 10);
//   const { token } = useAuth();
//   const [balances, setBalances] = useState<BalanceRecord[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   // const navigate = useNavigate();

//   useEffect(() => {
//     if (!token || isNaN(orderId)) return;
//     const fetch = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await getBalancesByOrderId(token, orderId);
//         setBalances(data);
//       } catch (err: any) {
//         console.error('Error fetching balances by order:', err);
//         setError(err.message || 'Error al obtener balances de la orden');
//         setBalances([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetch();
//   }, [token, orderId]);

//   if (isNaN(orderId)) {
//     return (
//       <div className="container mt-4">
//         <div className="alert alert-danger">Order ID inválido.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <h1 className="mb-3">Cobranza de Factura N°{orderId}</h1>
//       <div className="mb-5" ></div>

//       {error && <div className="alert alert-danger">{error}</div>}

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : balances.length > 0 ? (
//         <div className="table-responsive shadow rounded">
//           <table className="table table-hover">
//             <thead className="table-dark table-active">
//               <tr>
//                 <th>Cliente</th>
//                 <th>Producto</th>
//                 <th>Estado</th>
//                 <th>Vence</th>
//                 <th>RemDays</th>
//                 <th>Días Venc.</th>
//                 <th>Monto</th>

//                 <th>RemAmount</th>




//               </tr>
//             </thead>
//             <tbody>
//               {balances.map(b => {
//                 const expISO = b.customerProduct.expirationDate;
//                 const remainingDaysDyn = calcRemainingDays(expISO);
//                 const expiredDaysDyn = calcExpiredDays(expISO);
//                 const statusDyn = calcStatus(expISO);

//                 // 2) Calcula remainingAmountDyn:
//                 let remainingAmountDyn: number | null = null;
//                 const totalDays = b.customerProduct.totalDays;
//                 if (typeof totalDays === 'number' && totalDays > 0) {
//                   // Determina totalPaid:
//                   // Si `amount` es totalPaid directamente:
//                   const totalPaid = typeof b.amount === 'number'
//                     ? b.amount
//                     : Number(b.amount);
//                   // Si en tu caso `amount` fuera solo precio unitario, descomenta y ajusta:
//                   // const priceUnitario = typeof b.amount === 'number' ? b.amount : Number(b.amount);
//                   // const totalPaid = priceUnitario * b.customerProduct.assignedSlots;

//                   const dailyValue = totalPaid / totalDays;
//                   remainingAmountDyn = dailyValue * remainingDaysDyn;
//                   if (remainingAmountDyn < 0) remainingAmountDyn = 0;
//                 }

//                 // 3) Clases dinámicas para estilos:

//                 const statusClass = statusDyn === 'Vencido' ? 'text-danger' : 'text-success';
//                 const remDaysClass = remainingDaysDyn > 0 ? 'text-success' : '';
//                 const expDaysClass = expiredDaysDyn > 0 ? 'text-danger' : '';
//                 const remAmountClass = remainingAmountDyn != null && remainingAmountDyn > 0
//                   ? 'text-success'
//                   : '';



//                 return (
//                   <tr key={b.id}>

//                     <td>
//                       {b.customerProduct.customer.id}:{' '}
//                       {b.customerProduct.customer.firstName}{' '}
//                       {b.customerProduct.customer.lastName}
//                     </td>
//                     <td>{b.customerProduct.product.username}</td>
//                     <td className={`${statusClass} text-center`}>{statusDyn}</td>
//                     <td>{formatDate(expISO)}</td>
//                     <td className={`${remDaysClass} text-center`}>{remainingDaysDyn}</td>
//                     <td className={`${expDaysClass} text-center`}>{expiredDaysDyn}</td>

//                     <td>
//                       {typeof b.amount === 'number'
//                         ? b.amount.toFixed(2)
//                         : Number(b.amount).toFixed(2)}
//                     </td>

//                     <td className={`${remAmountClass} text-center`}>
//                       {remainingAmountDyn != null ? remainingAmountDyn.toFixed(2) : '—'}
//                     </td>



//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="alert alert-info">No hay balances para esta orden.</div>
//       )}
//     </div>
//   );
// };

// export default BalancesByOrder;




// src/pages/BalancesByOrder.tsx
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBalancesByOrderId, BalanceRecord } from '../services/balanceService';
import { deactivateCustomerProduct } from '../services/customerProductService';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

// Importamos los helpers de fecha
import { formatDate, calcRemainingDays, calcExpiredDays, calcStatus } from '../components/CalcDays';

const BalancesByOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || '', 10);
  const { token } = useAuth();
  const [balances, setBalances] = useState<BalanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!token || isNaN(orderId)) return;
  //   const fetch = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const data = await getBalancesByOrderId(token, orderId);
  //       setBalances(data);
  //     } catch (err: any) {
  //       console.error('Error fetching balances by order:', err);
  //       setError(err.message || 'Error al obtener balances de la orden');
  //       setBalances([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetch();
  // }, [token, orderId]);


// Extraer la lógica de fetch en una función para poder llamarla tras desactivar
  const fetchBalances = useCallback(async () => {
    if (!token || isNaN(orderId)) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getBalancesByOrderId(token, orderId);
      setBalances(data);
    } catch (err: any) {
      console.error('Error fetching balances by order:', err);
      setError(err.message || 'Error al obtener balances de la orden');
      setBalances([]);
    } finally {
      setLoading(false);
    }
  }, [token, orderId]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  if (isNaN(orderId)) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Order ID inválido.</div>
      </div>
    );
  }








  if (isNaN(orderId)) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Order ID inválido.</div>
      </div>
    );
  }

  // Variables para info común
  let commonCustomer: { id: number; firstName: string; lastName: string } | null = null;
  let commonExpirationISO: string | null = null;
  let commonRemainingDays: number | null = null;
  let commonExpiredDays: number | null = null;
  let commonStatus: string | null = null;
  let commonTotalDays: number | null = null;
  let commonPct: number | null = null;

  if (balances.length > 0) {
    const first = balances[0];
    commonCustomer = first.customerProduct.customer;
    commonExpirationISO = first.customerProduct.expirationDate;
    commonRemainingDays = calcRemainingDays(commonExpirationISO);
    commonExpiredDays = calcExpiredDays(commonExpirationISO);
    commonStatus = calcStatus(commonExpirationISO);

    // Calculamos totalDays y pct (porcentaje de transcurrido)
    const td = first.customerProduct.totalDays;
    if (typeof td === 'number' && td > 0 && commonRemainingDays !== null) {
      commonTotalDays = td;
      // porcentaje de transcurrido = (días transcurridos / totalDays) * 100
      const diasTranscurridos = td - commonRemainingDays;
      let pctCalc = (diasTranscurridos / td) * 100;
      if (pctCalc < 0) pctCalc = 0;
      if (pctCalc > 100) pctCalc = 100;
      commonPct = Math.round(pctCalc);

      
    }

      
  }

  // Función para obtener clase según porcentaje
  const getProgressBarClass = (pct: number) => {
    if (pct <= 25) {
      return 'bg-info';
    }
    if (pct <= 50) {
      return 'bg-success';
    }
    if (pct <= 75) {
      return 'bg-warning';
    }
    return 'bg-danger';
  };



  // Función para desactivar un CustomerProduct desde aquí
  const handleDeactivate = async (customerProductId: number) => {
    if (!token) return;

    if (!window.confirm('¿Desactivar este producto del cliente?')) return;
    try {
      await deactivateCustomerProduct(token, customerProductId);
      // tras desactivar, recargamos balances:
      await fetchBalances();
    } catch (err: any) {
      console.error('Error al desactivar CustomerProduct:', err);
      alert(err.message || 'No se pudo desactivar');
    }
  };






  return (
    <div className="container mt-4">
      <h1 className="mb-3 text-center">Cobranza de Factura N°{orderId}</h1>
      <div className="mb-5"></div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : balances.length > 0 && commonCustomer && commonExpirationISO && commonStatus !== null ? (
        <div className="card shadow rounded w-75 mx-auto">
          {/* Header con info común */}
          <div className="card-header bg-secondary text-white">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              {/* Cliente */}
              <div className="mb-2 mb-md-0">
                <small className="text-muted"></small>
                <div className="fw-semibold">
                  {commonCustomer.id}: {commonCustomer.firstName} {commonCustomer.lastName}
                </div>
              </div>
              {/* Estado general según expiración */}
              <div className="mb-2 mb-md-0 text-center">
                <small className="text-muted d-block"></small>
                <span className={`badge ${commonStatus === 'Vencido' ? 'bg-danger' : 'bg-success'}`}>
                  {commonStatus}
                </span>
              </div>
              {/* Fecha de vencimiento */}
              <div className="mb-2 mb-md-0 text-center">
                <small className="text-muted d-block">Vence</small>
                <div>{formatDate(commonExpirationISO)}</div>
              </div>
              {/* Días restantes / vencidos */}
              <div className="d-flex">
                <div className="me-3 text-center">
                  <small className="text-muted d-block">Días restantes</small>
                  <div className={commonRemainingDays! > 0 ? 'text-success-emphasis fw-bold' : 'text-muted'}>
                    {commonRemainingDays}
                  </div>
                </div>
                <div className="text-center">
                  <small className="text-muted d-block">Días vencidos</small>
                  <div className={commonExpiredDays! > 0 ? 'text-danger-emphasis fw-bold' : 'text-muted'}>
                    {commonExpiredDays}
                  </div>
                </div>
              </div>
            </div>
         {/* Barra de progreso con color condicional */}
            {commonTotalDays !== null && commonPct !== null && (
              <div className="mt-2">
                <div className="progress mb-1" style={{ height: '6px' }}>
                  <div
                    className={`progress-bar ${getProgressBarClass(commonPct)}`}
                    role="progressbar"
                    style={{ width: `${commonPct}%` }}
                    aria-valuenow={commonPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                {/* <small className="text-muted">{commonPct}% transcurrido</small> */}
              </div>
            )}
          </div>

          {/* Body: lista de productos dentro de esta factura */}
          <div className="card-body">
            <h5 className="card-title">Productos:</h5>
            <ul className="list-group list-group-flush">
              {balances.map(b => {
                const username = b.customerProduct.product.username;

                // Cálculo del remainingAmount por producto, usando commonRemainingDays
                let remainingAmountDyn: number | null = null;
                const td = b.customerProduct.totalDays;
                if (typeof td === 'number' && td > 0 && commonRemainingDays !== null) {
                  const totalPaid = typeof b.amount === 'number'
                    ? b.amount
                    : Number(b.amount);
                  const dailyValue = totalPaid / td;
                  remainingAmountDyn = dailyValue * commonRemainingDays;
                  if (remainingAmountDyn < 0) remainingAmountDyn = 0;
                }

                const montoTotal = typeof b.amount === 'number'
                  ? b.amount.toFixed(2)
                  : Number(b.amount).toFixed(2);
                const montoRem = remainingAmountDyn != null
                  ? remainingAmountDyn.toFixed(2)
                  : '—';

                const remAmountClass = remainingAmountDyn != null && remainingAmountDyn > 0
                  ? 'text-success fw-bold'
                  : 'text-muted';


             // Verificamos si está activo o no, para mostrar o no botón de desactivar.
                // Asumimos que BalanceRecord incluye customerProduct.active:
                const isActive = (b.customerProduct as any).active;
                // Y statusDyn para colorear etc.:
                const statusDyn = calcStatus(b.customerProduct.expirationDate);


                return (
                  <li
                    key={b.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <small className="text-muted d-block"></small>
                      <span className="fw-semibold">{username}</span>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">Monto total</small>
                      <div>{montoTotal}</div>
                      <small className="text-muted d-block">Monto restante</small>
                      <div className={remAmountClass}>{montoRem}</div>

                                 {/* Botón de Desactivar si está activo y, por ejemplo, vencido: */}
                      {isActive && statusDyn === 'Vencido' && (
                        <button
                          className="btn btn-sm btn-outline-warning mt-2"
                          onClick={() =>
                            handleDeactivate(b.customerProduct.id)
                          }
                        >
                          Desactivar
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        !loading && <div className="alert alert-info">No hay balances para esta orden.</div>
      )}
    </div>
  );
};

export default BalancesByOrder;
