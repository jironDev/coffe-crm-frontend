// src/pages/ProductPrices.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAllProductPrices,
  deleteProductPriceAdmin,
  ProductPrice,
} from '../services/productPricesService';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { productTypeNames } from '../components/productTypeNames';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';





const ProductPrices: React.FC = () => {
  const { token, role } = useAuth();
  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await getAllProductPrices(token);
        setPrices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);





const handleDelete = async (id: number) => {
  // solo admins pueden borrar
  if (role !== 'ADMIN') return;

  // confirmación al usuario
  if (!window.confirm('¿Estás seguro de eliminar este precio?')) return;

  try {
    if (token) {
      // llamamos al servicio
      await deleteProductPriceAdmin(token, id);
      // actualizamos la UI filtrando el precio eliminado
      setPrices((prev) => prev.filter((p) => p.id !== id));
    }
  } catch (error: any) {
    console.error('Error deleting product price:', error);
    alert(`No se pudo eliminar el precio: ${error.message}`);
  }
};




  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }




  return (
    <div className="container mt-4">     
        <h1><PriceCheckIcon fontSize="large"/> Precios</h1>
        <div className="mb-3"></div>

 <div className="text-end mb-3">
        <button
          className="btn btn-success rounded col-md-2"
          onClick={() => window.open('/product-prices/new', '_blank')}
          disabled={role !== 'ADMIN'}
        >
          + Nuevo Precio
        </button>
      </div>


<div className="table-responsive shadow rounded">
      <table className="table table-hover">
  <thead className="table-active small">
    <tr>
      <th>ID</th>                 {/* Este es el id del registro de precio */}
      <th>Producto</th>           {/* Aquí ponemos productTypeId + nombre */}
      <th>Tipo de Cliente</th>
      <th>Tipo Precio</th>
      <th>Precio</th>
      <th className='text-center'>Id-T/C</th>
      <th className="text-end">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {prices.map((p) => (
      <tr key={p.id}>
        {/* 1) Registro de precio */}
        <td>{p.id}</td>

        {/* 2) Categoría: ID + nombre */}
        <td>
          {p.productTypeId}:{productTypeNames[p.productTypeId] || 'Desconocido'}
        </td>

        <td>{p.customerType}</td>
        <td>{p.priceType}</td>
        <td>{p.price}</td>
        <td className='text-center'>{p.exchangeRateId}</td>
        <td className="text-end">
          <button
                  className="btn btn-sm btn-outline-secondary border-0 me-2"
                  onClick={() => navigate(`/product-prices/edit/${p.id}`)}
                  disabled={role !== 'ADMIN'}
                  title="Editar"
                >
                  <EditIcon fontSize="small" />
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary border-0"
                  onClick={() => handleDelete(p.id)}
                  disabled={role !== 'ADMIN'}
                  title="Eliminar"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>

      {prices.length === 0 && (
        <div className="alert alert-info mt-3">No hay precios registrados.</div>
      )}
    </div>
  );
};

export default ProductPrices;
