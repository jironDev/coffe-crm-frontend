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

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAllCustomers,
  getCustomerById
} from '../services/customerService';
import type { Customer } from '../models/Customer';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/Info';

const Customers: React.FC = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  // filtros
  const [idFilter, setIdFilter] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      let result: Customer[] = [];

      if (idFilter) {
        const c = await getCustomerById(token, parseInt(idFilter, 10));
        result = [c];
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
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 py-4">
      <h1 className="text-center mb-3 display-5">
        COFFEE <span className="h1 text-primary display-5">CRM</span>
      </h1>
     <p className='text-secondary mb-0'>Busqueda de clientes</p>

      {/* Formulario de búsqueda */}
      <form className="row g-2 mb-4 align-items-end" onSubmit={handleSearch}>
        <div className="col-md-2">
          <label className="form-label"></label>
          <input
            type="number"
            className="form-control rounded"
            placeholder="ID Cliente"
            value={idFilter}
            onChange={e => setIdFilter(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label"></label>
          <input
            type="text"
            className="form-control rounded"
            placeholder="Nombre"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            disabled={!!idFilter}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label"></label>
          <input
            type="text"
            className="form-control rounded"
            placeholder="Apellido"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            disabled={!!idFilter}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label"></label>
          <input
            type="text"
            className="form-control rounded"
            placeholder="Teléfono"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            disabled={!!idFilter}
          />
        </div>
        <div className="col-md-2 text-end">
          <button type="submit" className="btn btn-primary w-100 rounded">
            Buscar
          </button>
        </div>
      </form>
      <hr className="mb-4"/>

      {/* Spinner */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tabla de resultados */}
      {!loading && (
        <>
          <div className="table-responsive mb-3">
            <table className="table table-hover rounded shadow-sm bg-white mb-0">
              <thead className="table-dark rounded-top">
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
                      <button
                        className="btn btn-outline-light border-0"
                        onClick={() => window.open(`/customers/view/${c.id}`, '_blank')}
                        title="Ver detalles"
                      >
                        <InfoIcon/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {customers.length === 0 && (
            <div className="alert alert-info mt-3">
              No se encontraron clientes.
            </div>
          )}

          {/* Botón Nuevo Cliente debajo de la tabla */}
          <div className="text-end mt-2">
            <button
              type="button"
              className="btn btn-success rounded"
              onClick={() => window.open('/customers/new', '_blank')}
            >
              + Nuevo
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Customers;
