

// // 2da version:
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import {
//     getAllProducts,
//     deleteProduct
// } from '../services/productService';
// import type { Product } from '../models/Product';
// import { CircularProgress } from '@mui/material';
// import Box from '@mui/material/Box';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import EditIcon from '@mui/icons-material/Edit';
// import { productTypeNames } from '../components/productTypeNames';
// import CustomerListModal from '../components/CustomerListModal'; 

// const Products: React.FC = () => {
//     const { token, role } = useAuth();
//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(false);

//     // filtros de búsqueda
//     const [q, setQ] = useState('');
//     const [productType, setProductType] = useState('');
//     const [capacity, setCapacity] = useState<string>('');
//     const [pricePurchase, setPricePurchase] = useState<string>('');
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [supplierName, setSupplierName] = useState('');

//     // modal de clientes
//     const [modalUsername, setModalUsername] = useState<string | null>(null);

//     const navigate = useNavigate();

//     const load = async () => {
//         if (!token) return;
//         setLoading(true);
//         try {
//             const data = await getAllProducts(token, {
//                 q,
//                 productType,
//                 capacity: capacity ? parseInt(capacity) : undefined,
//                 pricePurchase: pricePurchase ? parseFloat(pricePurchase) : undefined,
//                 startDate,
//                 endDate,
//                 supplierName,
//             });
//             setProducts(data);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = (e: React.FormEvent) => {
//         e.preventDefault();
//         load();
//     };

//     const handleDelete = async (id: number) => {
//         if (role !== 'ADMIN') return;
//         if (!window.confirm('¿Eliminar este producto?')) return;
//         try {
//             if (token) {
//                 await deleteProduct(token, id);
//                 setProducts((prev) => prev.filter((p) => p.id !== id));
//             }
//         } catch (err: any) {
//             console.error(err);
//             alert(`Error al eliminar: ${err.message}`);
//         }
//     };

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//                 <CircularProgress size={24} color="inherit"/>
//             </Box>
//         );
//     }

//     return (
//         <div className="container mt-4">
//             <h1 className="mb-3">Productos</h1>
//   <div className="mb-5"></div>

//                <div className="text-end mb-3">
//                     <button
//                         type="button"
//                         className="btn btn-success rounded col-md-2"
//                         onClick={() => window.open('/products/new', '_blank')}
//                     >
//                         + Nuevo Producto
//                     </button>
//                 </div>




//             <form className="row g-2 mb-4" onSubmit={handleSearch}>
//                 <div className="col-md-4">
//                     <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Username"
//                         value={q}
//                         onChange={e => setQ(e.target.value)}
//                     />
//                 </div>

//                 <div className="col-md-4">
//                     <select
//                         className="form-select"
//                         value={productType}
//                         onChange={(e) => setProductType(e.target.value)}
//                     >
//                         <option value="">Tipo </option>
//                         {Object.entries(productTypeNames).map(([id, name]) => (
//                             <option key={id} value={name}>
//                                 {name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="col-md-4">
//                     <input
//                         type="number"
//                         className="form-control"
//                         placeholder="Cap."
//                         value={capacity}
//                         onChange={e => setCapacity(e.target.value)}
//                     />
//                 </div>

//                 <div className="col-md-3">
//                     <input
//                         type="date"
//                         className="form-control"
//                         value={startDate}
//                         onChange={e => setStartDate(e.target.value)}
//                     />
//                 </div>
//                 <div className="col-md-3">
//                     <input
//                         type="date"
//                         className="form-control"
//                         value={endDate}
//                         onChange={e => setEndDate(e.target.value)}
//                     />
//                 </div>

//                 <div className="col-md-3">
//                     <input
//                         type="number"
//                         className="form-control"
//                         placeholder="Precio C."
//                         value={pricePurchase}
//                         onChange={e => setPricePurchase(e.target.value)}
//                     />
//                 </div>

//                 <div className="col-md-3">
//                     <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Proveedor"
//                         value={supplierName}
//                         onChange={e => setSupplierName(e.target.value)}
//                     />
//                 </div>

//                 <div className="col-md-12">
//                     <button type="submit" className="btn btn-primary w-100">Buscar</button>
//                 </div>


//             </form>

//               <div className="mb-5"></div>

//             <table className="table table-hover">
//                 <thead className="table-active">
//                     <tr>
//                         <th>ID</th>
//                         <th>Usuario</th>
//                         <th>Password</th>
//                         <th>Tipo</th>
//                         <th >Capacidad</th>
//                         <th>Inicia</th>
//                         <th>Termina</th>
//                         <th>Precio-Compra</th>
//                         <th>Proveedor</th>
//                         <th>Observaciones</th>
//                         <th className="text-end">Acciones</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {products.map(p => (
//                         <tr key={p.id}>
//                             <td>{p.id}</td>
//                             <td>{p.username}</td>
//                             <td>{p.password}</td>
//                             <td>{p.productType.name}</td>
//                             <td className='text-center'
//                                 style={{ cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline' }}
//                                 onClick={() => setModalUsername(p.username)}
//                                 title="Ver clientes"
//                             >
//                                 {p.capacity}
//                             </td>
//                             <td>{new Date(p.startDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</td>
//                             <td>{new Date(p.endDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</td>
//                             <td>{Number(p.pricePurchase).toFixed(2)}</td>
//                             <td>{p.supplier?.name ?? '—'}</td>
//                             <td>{p.observations ?? '—'}</td>
//                             <td className="text-end">
//                                 <button
//                                     className="btn btn-sm btn-outline-secondary me-2 border-0"
//                                     onClick={() => navigate(`/products/edit/${p.id}`)}
//                                     title="Editar"
//                                 >
//                                     <EditIcon fontSize="small" />
//                                 </button>
//                                 <button
//                                     className="btn btn-sm btn-outline-secondary me-2 border-0"
//                                     onClick={() => handleDelete(p.id)}
//                                     disabled={role !== 'ADMIN'}
//                                     title="Eliminar"
//                                 >
//                                     <DeleteOutlineIcon fontSize="small" />
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {products.length === 0 && (
//                 <div className="alert alert-info mt-3">
//                     No se encontraron productos.
//                 </div>
//             )}

//             {/* ✅ Modal visible si modalUsername está definido */}
//             {modalUsername && (
//                 <CustomerListModal
//                     username={modalUsername}
//                     onClose={() => setModalUsername(null)}
//                 />
//             )}
//         </div>
//     );
// };

// export default Products;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    getAllProducts,
    deleteProduct
} from '../services/productService';
import type { Product } from '../models/Product';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { productTypeNames } from '../components/productTypeNames';
import CustomerListModal from '../components/CustomerListModal';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { productTypeValues } from '../components/productTypeNames';




const Products: React.FC = () => {
    const { token, role } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // filtros de búsqueda
    const [q, setQ] = useState('');
    const [productType, setProductType] = useState('');
    const [capacity, setCapacity] = useState<string>('');
    const [pricePurchase, setPricePurchase] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [supplierName, setSupplierName] = useState('');

    // modal de clientes
    const [modalUsername, setModalUsername] = useState<string | null>(null);

    // estado para saber si ya se hizo la búsqueda
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();

    const load = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getAllProducts(token, {
                q,
                productType,
                capacity: capacity ? parseInt(capacity) : undefined,
                pricePurchase: pricePurchase ? parseFloat(pricePurchase) : undefined,
                startDate,
                endDate,
                supplierName,
            });
            setProducts(data);
        } catch (err) {
            console.error(err);
            // opcional: podrías manejar un estado de error para mostrar alertas
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // marcar que ya se buscó
        setHasSearched(true);
        load();
    };

    const handleDelete = async (id: number) => {
        if (role !== 'ADMIN') return;
        if (!window.confirm('¿Eliminar este producto?')) return;
        try {
            if (token) {
                await deleteProduct(token, id);
                setProducts((prev) => prev.filter((p) => p.id !== id));
            }
        } catch (err: any) {
            console.error(err);
            alert(`Error al eliminar: ${err.message}`);
        }
    };

    // Creamos la "fecha de hoy" ajustada a medianoche para comparar solo fechas:
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress size={24} color="inherit" />
            </Box>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-3"><LiveTvIcon fontSize="large"/> Productos</h1>
            <div className="mb-3"></div>

            <div className="text-end mb-3">
                <button
                    type="button"
                    className="btn btn-success rounded col-md-2"
                    onClick={() => window.open('/products/new', '_blank')}
                >
                    + Nuevo Producto
                </button>
            </div>

            <form className="row g-2 mb-4" onSubmit={handleSearch}>
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                </div>
{/* 
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                    >
                        <option value="">Tipo </option>
                        {Object.entries(productTypeNames).map(([id, name]) => (
                            <option key={id} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div> */}
                
<div className="col-md-4">
  <select
    className="form-select"
    value={productType}
    onChange={(e) => setProductType(e.target.value)}
  >
    <option value="">Tipo</option>
    {Object.entries(productTypeNames).map(([idStr, label]) => {
      const id = Number(idStr);
      const valuePure = productTypeValues[id];
      if (!valuePure) return null; // por si hay inconsistencia
      return (
        <option key={id} value={valuePure}>
          {label}
        </option>
      );
    })}
  </select>
</div>



                <div className="col-md-4">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Cap."
                        value={capacity}
                        onChange={e => setCapacity(e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Precio de Compra"
                        value={pricePurchase}
                        onChange={e => setPricePurchase(e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Proveedor"
                        value={supplierName}
                        onChange={e => setSupplierName(e.target.value)}
                    />
                </div>

                <div className="col-md-12">
                    <button type="submit" className="btn btn-primary w-100">Buscar</button>
                </div>

            </form>

            <div className="mb-5"></div>






            {/* Renderizar la tabla solo después de buscar */}
            {hasSearched && (
                <>
                    {products.length > 0 ? (
                        <div className="table-responsive shadow rounded">
                            <table className="table table-hover">
                                <thead className="table-active small">
                                    <tr>
                                        <th>ID</th>
                                        <th>Usuario</th>
                                        <th>Password</th>
                                        <th className='text-center'>Tipo</th>
                                        <th>Slots</th>
                                        <th>Inicia</th>
                                        <th>Termina</th>
                                        <th>Precio-Compra</th>
                                        <th>Proveedor</th>
                                        <th>Observaciones</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>



                                    {products.map(p => {

                                        // Calculamos las clases condicionales:
                                        const capacityClass = p.capacity > 0 ? 'text-teal fw-bold' : 'text-secondary';
                                        // Parsear endDate a Date:
                                        const endDateObj = new Date(p.endDate);
                                        // Ajustar endDateObj a medianoche si se desea comparar solo fecha:
                                        endDateObj.setHours(0, 0, 0, 0);
                                        // Según tu condición: si endDate >= today, aplicar 'text-danger', si no, '', pero ajústalo a tu lógica:
                                        const endDateClass = endDateObj <= today ? 'text-danger' : '';


                                        return (


                                            <tr key={p.id}>
                                                <td>{p.id}</td>
                                                <td>{p.username}</td>
                                                <td>{p.password}</td>
                                                <td className='text-center small'>{productTypeNames[p.productType.id] ?? p.productType.name}</td>

                                                <td className={`text-center ${capacityClass}`}
                                                    style={{ cursor: 'pointer', color: 'text-light', textDecoration: 'underline' }}
                                                    onClick={() => setModalUsername(p.username)}
                                                    title="Ver clientes"
                                                >
                                                    {p.capacity}
                                                </td>
                                                <td>{new Date(p.startDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</td>
                                                <td className={endDateClass}>{new Date(p.endDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</td>
                                                <td className='text-center'>{Number(p.pricePurchase).toFixed(2)}</td>
                                                <td>{p.supplier?.name ?? '—'}</td>
                                                <td>{p.observations ?? '—'}</td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary me-2 border-0"
                                                        onClick={() => navigate(`/products/edit/${p.id}`)}
                                                        title="Editar"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary me-2 border-0"
                                                        onClick={() => handleDelete(p.id)}
                                                        disabled={role !== 'ADMIN'}
                                                        title="Eliminar"
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-info mt-3">
                            No se encontraron productos.
                        </div>
                    )}
                </>
            )}

            {/* Modal de clientes */}
            {modalUsername && (
                <CustomerListModal
                    username={modalUsername}
                    onClose={() => setModalUsername(null)}
                />
            )}
        </div>
    );
};

export default Products;
