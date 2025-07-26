// // src/pages/Customers.tsx

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import {
//   getAllCustomers,
//   getCustomerById
// } from '../services/customerService';
// import type { Customer } from '../models/Customer';
// import { CircularProgress } from '@mui/material';
// import Box from '@mui/material/Box';
// import InfoIcon from '@mui/icons-material/Info';

// const Customers: React.FC = () => {
//   const { token } = useAuth();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(false);

//   // filtros
//   const [idFilter, setIdFilter] = useState<string>('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [phone, setPhone] = useState('');

//   const navigate = useNavigate();

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token) return;

//     setLoading(true);
//     try {
//       let result: Customer[] = [];

//       if (idFilter) {
//         // Si hay ID, traemos uno solo
//         const c = await getCustomerById(token, parseInt(idFilter, 10));
//         result = [c];
//       } else {
//         // Búsqueda por campos
//         result = await getAllCustomers(token, {
//           firstName,
//           lastName,
//           phone
//         });
//       }

//       setCustomers(result);
//     } catch (err: any) {
//       console.error(err);
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-4 py-4">
//       <h1  className="text-center mb-3 display-5">
//   COFFEE <span className="h1 text-primary display-5">CRM</span>
// </h1>

//       {/* Formulario de búsqueda */}
//       <form className="row g-2 mb-4" onSubmit={handleSearch}>
//         <div className="col-md-2">
//           <input
//             type="number"
//             className="form-control"
//             placeholder="ID Cliente"
//             value={idFilter}
//             onChange={e => setIdFilter(e.target.value)}
//           />
//         </div>
//         <div className="col-md-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Nombre"
//             value={firstName}
//             onChange={e => setFirstName(e.target.value)}
//             disabled={!!idFilter}
//           />
//         </div>
//         <div className="col-md-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Apellido"
//             value={lastName}
//             onChange={e => setLastName(e.target.value)}
//             disabled={!!idFilter}
//           />
//         </div>
//         <div className="col-md-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Teléfono"
//             value={phone}
//             onChange={e => setPhone(e.target.value)}
//             disabled={!!idFilter}
//           />
//         </div>
//         <div className="col-md-1">
//           <button className="btn btn-primary w-100 w-md-auto">Buscar Cliente</button>
//         </div>
//         <div className="col-md-1 text-end">
//           <button
//             type="button"
//             className="btn btn-success"
//             onClick={() => window.open('/customers/new', '_blank')}
//           >
//             + Nuevo
//           </button>
//         </div>
//       </form>

//       {/* Spinner */}
//       {loading && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {/* Tabla de resultados */}
//       {!loading && (
//         <>
//           <table className="table table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th>ID</th>
//                 <th>Nombre</th>
//                 <th>Apellido</th>
//                 <th>Teléfono</th>
//                 <th>Tipo</th>
//                 <th className="text-center">Ver más</th>
//               </tr>
//             </thead>
//             <tbody>
//               {customers.map(c => (
//                 <tr key={c.id}>
//                   <td>{c.id}</td>
//                   <td>{c.firstName}</td>
//                   <td>{c.lastName}</td>
//                   <td>{c.phone}</td>
//                   <td>{c.customerType}</td>
//                   <td className="text-center">
//                     <button
//                       className="btn btn-sm btn-outline-info"
//                       onClick={() => window.open(`/customers/view/${c.id}`, '_blank')}
//                       title="Ver detalles"
//                     >
//                       <InfoIcon fontSize="small" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {customers.length === 0 && (
//             <div className="alert alert-info mt-3">
//               No se encontraron clientes.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Customers;




// // segunda version
// import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import {
//   getAllCustomers,
//   getCustomerById
// } from '../services/customerService';
// import type { Customer } from '../models/Customer';
// import { CircularProgress } from '@mui/material';
// import Box from '@mui/material/Box';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// const Customers: React.FC = () => {
//   const { token } = useAuth();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(false);

//   // filtros
//   const [idFilter, setIdFilter] = useState<string>('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [phone, setPhone] = useState('');

//   // estado para saber si ya se hizo la búsqueda
//   const [hasSearched, setHasSearched] = useState(false);

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token) return;

//     setHasSearched(true); // marcamos que ya se intentó buscar
//     setLoading(true);
//     try {
//       let result: Customer[] = [];

//       if (idFilter.trim()) {
//         const idNum = parseInt(idFilter, 10);
//         if (!isNaN(idNum)) {
//           try {
//             const c = await getCustomerById(token, idNum);
//             result = c ? [c] : [];
//           } catch (err: any) {
//             console.error(err);
//             // Si tu API devuelve error 404 cuando no existe, aquí result se queda en []
//             result = [];
//           }
//         } else {
//           alert('ID de cliente inválido');
//           result = [];
//         }
//       } else {
//         result = await getAllCustomers(token, {
//           firstName,
//           lastName,
//           phone
//         });
//       }

//       setCustomers(result);
//     } catch (err: any) {
//       console.error(err);
//       alert(err.message || 'Error al buscar clientes');
//       setCustomers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-4 py-4">
//       <h1 className="text-center mb-3 display-5">
//         COFFEE <span className="h1 text-primary display-5">CRM</span>
//       </h1>

//       {/* Botón Nuevo Cliente */}
//       <div className="text-end mt-2">
//         <button
//           type="button"
//           className="btn btn-success rounded col-md-2"
//           onClick={() => window.open('/customers/new', '_blank')}
//         >
//           + Nuevo
//         </button>
//       </div>

//       <p className="text-secondary mb-0">Búsqueda de clientes</p>

//       {/* Formulario de búsqueda */}
//       <form className="row g-2 mb-4 align-items-end" onSubmit={handleSearch}>
//         <div className="col-md-3">
//           <input
//             type="number"
//             className="form-control rounded"
//             placeholder="ID Cliente"
//             value={idFilter}
//             onChange={e => setIdFilter(e.target.value)}
//           />
//         </div>
//         <div className="col-md-3">
//           <input
//             type="text"
//             className="form-control rounded"
//             placeholder="Nombre"
//             value={firstName}
//             onChange={e => setFirstName(e.target.value)}
//             disabled={!!idFilter.trim()}
//           />
//         </div>
//         <div className="col-md-3">
//           <input
//             type="text"
//             className="form-control rounded"
//             placeholder="Apellido"
//             value={lastName}
//             onChange={e => setLastName(e.target.value)}
//             disabled={!!idFilter.trim()}
//           />
//         </div>
//         <div className="col-md-3">
//           <input
//             type="text"
//             className="form-control rounded"
//             placeholder="Teléfono"
//             value={phone}
//             onChange={e => setPhone(e.target.value)}
//             disabled={!!idFilter.trim()}
//           />
//         </div>
//         <div className="col-md-12 text-end">
//           <button type="submit" className="btn btn-primary w-100 rounded">
//             Buscar
//           </button>
//         </div>
//       </form>

//       <div className="mb-5"></div>

//       {/* Spinner */}
//       {loading && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {/* Antes de la primera búsqueda */}
//       {!loading && !hasSearched && (
//         <div className="alert alert-secondary">
//           Ingrese criterios de búsqueda y presione “Buscar” para ver resultados.
//         </div>
//       )}

//       {/* Después de buscar: tabla o mensaje de “No se encontraron clientes” */}
//       {!loading && hasSearched && (
//         <>
//           {customers.length > 0 ? (
//             <div className="table-responsive mb-3 shadow rounded">
//               <table className="table table-hover rounded shadow-sm bg-white mb-0">
//                 <thead className="table-dark rounded-top table-active">
//                   <tr>
//                     <th>ID</th>
//                     <th>Nombre</th>
//                     <th>Apellido</th>
//                     <th>Teléfono</th>
//                     <th>Tipo</th>
//                     <th className="text-center">Ver más</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {customers.map(c => (
//                     <tr key={c.id} className="align-middle">
//                       <td>{c.id}</td>
//                       <td>{c.firstName}</td>
//                       <td>{c.lastName}</td>
//                       <td>{c.phone}</td>
//                       <td>{c.customerType}</td>
//                       <td className="text-center">
//                         <a
//                           href={`/customers/view/${c.id}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="btn btn-outline-light border-0"
//                           title="Ver detalles"
//                         >
//                           <InfoOutlinedIcon />
//                         </a>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="alert alert-info mt-3">
//               No se encontraron clientes.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Customers;


import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAllCustomers,
  getCustomerById
} from '../services/customerService';
import type { Customer } from '../models/Customer';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const Customers: React.FC = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  // filtros
  const [idFilter, setIdFilter] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // estado para saber si ya se hizo la búsqueda
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setHasSearched(true); // marcamos que ya se intentó buscar
    setLoading(true);
    try {
      let result: Customer[] = [];

      if (idFilter.trim()) {
        const idNum = parseInt(idFilter, 10);
        if (!isNaN(idNum)) {
          try {
            const c = await getCustomerById(token, idNum);
            result = c ? [c] : [];
          } catch (err: any) {
            console.error(err);
            // Si tu API devuelve error 404 cuando no existe, aquí result se queda en []
            result = [];
          }
        } else {
          alert('ID de cliente inválido');
          result = [];
        }
      } else {
        result = await getAllCustomers(token, {
          firstName,
          lastName,
          phone
        });
      }

      setCustomers(result);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error al buscar clientes');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 py-4">
      <h1 className="text-center mb-3 display-5">
        COFFEE <span className="h1 text-primary display-5">CRM</span>
      </h1>

      {/* Botón Nuevo Cliente */}
      <div className="text-end mt-2">
        <button
          type="button"
          className="btn btn-success rounded col-md-2"
          onClick={() => window.open('/customers/new', '_blank')}
        >
          + Nuevo
        </button>
      </div>

      <p className="text-secondary mb-0">Búsqueda de clientes</p>

      {/* Formulario de búsqueda */}
      <form className="row g-2 mb-4 align-items-end" onSubmit={handleSearch}>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control rounded"
            placeholder="ID Cliente"
            value={idFilter}
            onChange={e => setIdFilter(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control rounded"
            placeholder="Nombre"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            disabled={!!idFilter.trim()}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control rounded"
            placeholder="Apellido"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            disabled={!!idFilter.trim()}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control rounded"
            placeholder="Teléfono"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            disabled={!!idFilter.trim()}
          />
        </div>

        <div className="col-md-12 text-end">
          <button type="submit" className="btn btn-primary w-100 rounded">
            Buscar
          </button>
        </div>
      </form>

      <div className="mb-5"></div>

      {/* Spinner */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Antes de la primera búsqueda */}
      {/* {!loading && !hasSearched && (
        <div className="alert alert-secondary">
          Ingrese criterios de búsqueda y presione “Buscar” para ver resultados.
        </div>
      )} */}

      {/* Después de buscar: tabla o mensaje de “No se encontraron clientes” */}
      {!loading && hasSearched && (
        <>
          {customers.length > 0 ? (
            <div className="table-responsive mb-3 shadow rounded">
              <table className="table table-hover">
                <thead className="table-active small">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Teléfono</th>
                    <th>Tipo</th>
                    <th className="text-center">Ver más</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} className="align-middle">
                      <td>{c.id}</td>
                      <td>{c.firstName}</td>
                      <td>{c.lastName}</td>
                      <td>{c.phone}</td>
                      <td>{c.customerType}</td>
                      <td className="text-center">
                        <a
                          href={`/customers/view/${c.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-light border-0"
                          title="Ver detalles"
                        >
                          <AccountBoxIcon fontSize="small"/>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info mt-3">
              No se encontraron clientes.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Customers;
