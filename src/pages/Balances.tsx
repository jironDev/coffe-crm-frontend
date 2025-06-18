// // src/pages/Balances.tsx
// import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { getAllBalances, GetAllBalancesFilters, BalanceRecord } from '../services/balanceService';
// import { CircularProgress } from '@mui/material';
// import Box from '@mui/material/Box';

// const Balances: React.FC = () => {
//   const { token } = useAuth();
//   const [balances, setBalances] = useState<BalanceRecord[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Estados para filtros
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [username, setUsername] = useState('');
//   const [customerId, setCustomerId] = useState<string>(''); // como string para input
//   const [customerType, setCustomerType] = useState<'DIRECTO' | 'REVENDEDOR' | ''>('');
//   const [expirationDate, setExpirationDate] = useState(''); // YYYY-MM-DD
//   const [amountMin, setAmountMin] = useState<string>('');
//   const [amountMax, setAmountMax] = useState<string>('');
//   const [status, setStatus] = useState<'Activo' | 'Vencido' | ''>('');
//   const [expiresDays, setExpiresDays] = useState<string>(''); // número como string

// //   const navigate = useNavigate();

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token) return;
//     setLoading(true);
//     setError(null);
//     try {
//       // Construir filtros
//       const filters: GetAllBalancesFilters = {};
//       if (firstName) filters.firstName = firstName;
//       if (lastName) filters.lastName = lastName;
//       if (phone) filters.phone = phone;
//       if (username) filters.username = username;
//       if (customerId) {
//         const cid = parseInt(customerId, 10);
//         if (!isNaN(cid)) {
//           filters.customerId = cid;
//         }
//       }
//       if (customerType) filters.customerType = customerType;
//       if (expirationDate) filters.expirationDate = expirationDate;
//       if (amountMin) {
//         const amn = parseFloat(amountMin);
//         if (!isNaN(amn)) filters.amountMin = amn;
//       }
//       if (amountMax) {
//         const amx = parseFloat(amountMax);
//         if (!isNaN(amx)) filters.amountMax = amx;
//       }
//       if (status) filters.status = status;
//       if (expiresDays) {
//         const exd = parseInt(expiresDays, 10);
//         if (!isNaN(exd)) filters.expiresDays = exd;
//       }

//       const data = await getAllBalances(token, filters);
//       setBalances(data);
//     } catch (err: any) {
//       console.error('Error fetching balances:', err);
//       setError(err.message || 'Error al obtener balances');
//       setBalances([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Función para formatear fecha en formato dd/MM/yyyy usando UTC
//   const formatDate = (iso: string) => {
//     const d = new Date(iso);
//     // Usar getUTC para evitar desfases de zona
//     const day = d.getUTCDate().toString().padStart(2, '0');
//     const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
//     const year = d.getUTCFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-3">Cobranza</h2>

//       {/* Formulario de búsqueda */}
//       <form className="row g-2 mb-4" onSubmit={handleSearch}>
//         <div className="col-md-2">
//           <input
//             type="number"
//             className="form-control"
//             placeholder="ID Cliente"
//             value={customerId}
//             onChange={e => setCustomerId(e.target.value)}
//           />
//         </div>
//         <div className="col-md-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Nombre"
//             value={firstName}
//             onChange={e => setFirstName(e.target.value)}
//             disabled={!!customerId}
//           />
//         </div>
//         <div className="col-md-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Apellido"
//             value={lastName}
//             onChange={e => setLastName(e.target.value)}
//             disabled={!!customerId}
//           />
//         </div>
//         <div className="col-md-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Teléfono"
//             value={phone}
//             onChange={e => setPhone(e.target.value)}
//             disabled={!!customerId}
//           />
//         </div>
//         <div className="col-md-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Producto (username)"
//             value={username}
//             onChange={e => setUsername(e.target.value)}
//           />
//         </div>


//         {/* Segunda fila de filtros */}
//         <div className="col-md-2">
//           <select
//             className="form-select"
//             value={customerType}
//             onChange={e => setCustomerType(e.target.value as 'DIRECTO' | 'REVENDEDOR' | '')}
//           >
//             <option value="">Tipo Cliente</option>
//             <option value="DIRECTO">DIRECTO</option>
//             <option value="REVENDEDOR">REVENDEDOR</option>
//           </select>
//         </div>


//    <div className="col-md-2">
//           <select
//             className="form-select"
//             value={status}
//             onChange={e => setStatus(e.target.value as 'Activo' | 'Vencido' | '')}
//           >
//             <option value="">Estado</option>
//             <option value="Activo">Activo</option>
//             <option value="Vencido">Vencido</option>
//           </select>
//         </div>

//      <div className="col-md-2">
//           <input
//             type="date"
//             className="form-control"
//             placeholder="Vence"
//             value={expirationDate}
//             onChange={e => setExpirationDate(e.target.value)}
//           />
//         </div>


//         <div className="col-md-2">
//           <input
//             type="number"
//             className="form-control"
//             placeholder="Días Vencido"
//             value={expiresDays}
//             onChange={e => setExpiresDays(e.target.value)}
//             min="0"
//           />
//         </div>



//         <div className="col-md-2">
//           <input
//             type="number"
//             className="form-control"
//             placeholder="Monto Mín"
//             value={amountMin}
//             onChange={e => setAmountMin(e.target.value)}
//             step="0.01"
//           />
//         </div>
//         <div className="col-md-2">
//           <input
//             type="number"
//             className="form-control"
//             placeholder="Monto Máx"
//             value={amountMax}
//             onChange={e => setAmountMax(e.target.value)}
//             step="0.01"
//           />
//         </div>


//          <div className="col-md-2 text-end">
//           <button type="submit" className="btn btn-primary w-100">
//             Buscar
//           </button>
//         </div>
//       </form>
//       <hr className="mb-4" /> 

//       {error && <div className="alert alert-danger">{error}</div>}

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : balances.length > 0 ? (
//         <div className="table-responsive">
//           <table className="table table-hover">
//             <thead className="table-active">
//               <tr>
//                 <th>Cliente</th>
//                 <th>Producto</th>
//                 <th>Order ID</th>
//                 <th>Estado</th>
//                 <th>Vence</th>
//                 <th>RemDays</th>
//                 <th>Días Venc.</th>
//                 <th>Monto</th>                
//                 <th>RemAmount</th>        


//                 <th>Actualizado</th>
//               </tr>
//             </thead>
//             <tbody>
//               {balances.map(b => (
//                 <tr key={b.id}>
//                   <td>
//                     {b.customerProduct.customer.firstName}{' '}
//                     {b.customerProduct.customer.lastName} (ID:{b.customerProduct.customer.id})
//                   </td>
//                   <td>{b.customerProduct.product.username}</td>
//                   <td>
//                     {/* <button
//                       className="btn btn-link btn-sm p-0"
//                       onClick={() => navigate(`/balances/${b.customerProduct.orderId}`)}
//                     >
//                       {b.customerProduct.orderId}
//                     </button> */}

//               <a href={`/balances/${b.customerProduct.orderId}`} target="_blank" rel="noopener noreferrer">
//  {b.customerProduct.orderId}
// </a>

//                   </td>
//                   <td>{b.status}</td>
//                   <td>{formatDate(b.customerProduct.expirationDate)}</td>
//                   <td>{b.remainingDays}</td>
//                   <td>{b.expiresDays}</td>
//                   <td>{b.amount.toFixed?.(2) ?? b.amount}</td>

//                   <td>{b.remainingAmount.toFixed?.(2) ?? b.remainingAmount}</td>


//                  <td>{new Date(b.updatedAt).toLocaleDateString('es-ES')}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="alert alert-info mt-3">No se encontraron balances.</div>
//       )}
//     </div>
//   );
// };

// export default Balances;


// src/pages/Balances.tsx
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllBalances, GetAllBalancesFilters, BalanceRecord } from '../services/balanceService';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

// Importamos los helpers de fecha
import { formatDate, calcRemainingDays, calcExpiredDays, calcStatus } from '../components/CalcDays';



const Balances: React.FC = () => {
  const { token } = useAuth();
  // const navigate = useNavigate();


  // Estados para datos y UI
  const [balances, setBalances] = useState<BalanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ... estados de filtros igual que antes ...

  // --- Estados para filtros de búsqueda (adapta según tus necesidades) ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [customerId, setCustomerId] = useState<string>(''); // campo numérico en texto
  const [expirationDate, setExpirationDate] = useState('');  // "YYYY-MM-DD"
  const [customerType, setCustomerType] = useState<'' | 'DIRECTO' | 'REVENDEDOR'>('');      // 'DIRECTO' | 'REVENDEDOR'
  const [statusFilter, setStatusFilter] = useState<'Activo' | 'Vencido' | ''>('');
  const [amountMin, setAmountMin] = useState<string>('');
  const [amountMax, setAmountMax] = useState<string>('');
  // const [expiresDaysFilter, setExpiresDaysFilter] = useState<string>(''); // num días vencido


  // handleSearch: invoca al servicio con filtros y actualiza estados
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // Construimos objeto de filtros según GetAllBalancesFilters
      const filters: GetAllBalancesFilters = {};
      if (firstName.trim()) filters.firstName = firstName.trim();
      if (lastName.trim()) filters.lastName = lastName.trim();
      // if (phone.trim()) filters.phone = phone.trim();
      if (username.trim()) filters.username = username.trim();
      if (customerId.trim()) {
        const cid = parseInt(customerId, 10);
        if (!isNaN(cid)) {
          filters.customerId = cid;
        }
      }
      if (expirationDate) filters.expirationDate = expirationDate;
      if (customerType) filters.customerType = customerType;
      if (statusFilter) filters.status = statusFilter;
      if (amountMin.trim()) {
        const min = parseFloat(amountMin);
        if (!isNaN(min)) filters.amountMin = min;
      }
      if (amountMax.trim()) {
        const max = parseFloat(amountMax);
        if (!isNaN(max)) filters.amountMax = max;
      }
      // if (expiresDaysFilter.trim()) {
      //   const ed = parseInt(expiresDaysFilter, 10);
      //   if (!isNaN(ed)) filters.expiresDays = ed;
      // }

      // Llamada al servicio
      const data = await getAllBalances(token, filters);
      setBalances(data);
    } catch (err: any) {
      console.error('Error fetching balances:', err);
      setError(err.message || 'Error al obtener balances');
      setBalances([]);
    } finally {
      setLoading(false);
    }
  };








  return (
    <div className="container mt-4">
      <h1 className="mb-3">Cobranza</h1>
      <div className="mb-5"></div>

      {/* Formulario de búsqueda */}
      <form className="row g-2 mb-4" onSubmit={handleSearch}>


        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as '' | 'Activo' | 'Vencido')}
          >
            <option value="">Estado</option>
            <option value="Activo">Activo</option>
            <option value="Vencido">Vencido</option>
          </select>
        </div>




        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            placeholder="Vence"
            value={expirationDate}
            onChange={e => setExpirationDate(e.target.value)}
          />
        </div>


        <div className="col-md-4">
          <select
            className="form-select"
            value={customerType}
            onChange={e => setCustomerType(e.target.value as '' | 'DIRECTO' | 'REVENDEDOR')}
          >
            <option value="">Tipo de Cliente</option>
            <option value="DIRECTO">DIRECTO</option>
            <option value="REVENDEDOR">REVENDEDOR</option>
          </select>
        </div>


        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="ID Cliente"
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
          />
        </div>



        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Apellido"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        {/* <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Teléfono"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div> */}



        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Producto (Username)"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>







        {/* <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Días Venc."
            value={expiresDaysFilter}
            onChange={e => setExpiresDaysFilter(e.target.value)}
          />
        </div> */}

        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Monto Mínimo"
            value={amountMin}
            onChange={e => setAmountMin(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Monto Máximo"
            value={amountMax}
            onChange={e => setAmountMax(e.target.value)}
          />
        </div>

        <div className="col-md-12">
          <button type="submit" className="btn btn-primary w-100">
            Buscar
          </button>
        </div>
      </form>
      <div className="mb-5" ></div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : balances.length > 0 ? (
        <div className="table-responsive shadow rounded">
          <table className="table table-hover">
            <thead className="table-dark table-active">
              <tr>
                <th>Cliente</th>
                <th>Producto</th>


                <th>Estado</th>
                <th >Vence</th>
                <th className='text-center'>Días Rest.</th>
                <th className='text-center'>Días Venc.</th>
                <th>Monto</th>
                <th className='text-center'>Saldo</th>

                <th className='text-center'>Factura N°</th>
                {/* <th>Fecha Consulta</th> */}
              </tr>
            </thead>
            <tbody>
              {balances.map(b => {

                const expISO = b.customerProduct.expirationDate;

                // 1) Calcula remainingDaysDyn (elige floor o ceil según tu política):
                const remainingDaysDyn = calcRemainingDays(expISO);
                const expiredDaysDyn = calcExpiredDays(expISO);
                const statusDyn = calcStatus(expISO);





                // 2) Calcula remainingAmountDyn:
                let remainingAmountDyn: number | null = null;
                const totalDays = b.customerProduct.totalDays;
                if (typeof totalDays === 'number' && totalDays > 0) {
                  // Determina totalPaid:
                  // Si `amount` es totalPaid directamente:
                  const totalPaid = typeof b.amount === 'number'
                    ? b.amount
                    : Number(b.amount);
                  // Si en tu caso `amount` fuera solo precio unitario, descomenta y ajusta:
                  // const priceUnitario = typeof b.amount === 'number' ? b.amount : Number(b.amount);
                  // const totalPaid = priceUnitario * b.customerProduct.assignedSlots;

                  const dailyValue = totalPaid / totalDays;
                  remainingAmountDyn = dailyValue * remainingDaysDyn;
                  if (remainingAmountDyn < 0) remainingAmountDyn = 0;
                }

                // 3) Clases dinámicas para estilos:

                const statusClass = statusDyn === 'Vencido' ? 'text-danger' : 'text-success';
                const remDaysClass = remainingDaysDyn > 0 ? 'text-success' : '';
                const expDaysClass = expiredDaysDyn > 0 ? 'text-danger' : '';
                const remAmountClass = remainingAmountDyn != null && remainingAmountDyn > 0
                  ? 'text-success'
                  : '';



                return (
                  <tr key={b.id}>
                    <td>
                      {b.customerProduct.customer.id}: {' '}
                      {b.customerProduct.customer.firstName}{' '}
                      {b.customerProduct.customer.lastName}
                    </td>
                    <td>{b.customerProduct.product.username}</td>


                    <td className={`${statusClass} text-center`}>{statusDyn}</td>
                    <td>{formatDate(expISO)}</td>
                    <td className={`${remDaysClass} text-center`}>{remainingDaysDyn}</td>
                    <td className={`${expDaysClass} text-center`}>{expiredDaysDyn}</td>

                    <td>
                      {typeof b.amount === 'number'
                        ? b.amount.toFixed(2)
                        : Number(b.amount).toFixed(2)}
                    </td>

                    <td className={`${remAmountClass} text-center`}>
                      {remainingAmountDyn != null ? remainingAmountDyn.toFixed(2) : '—'}
                    </td>

                    <td className='text-center'>
               


                      <a href={`/balances/${b.customerProduct.orderId}`} target="_blank" rel="noopener noreferrer">
                        {b.customerProduct.orderId}
                      </a>
                    </td>


                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info mt-3">No se encontraron balances.</div>
      )}
    </div>
  );
};

export default Balances;