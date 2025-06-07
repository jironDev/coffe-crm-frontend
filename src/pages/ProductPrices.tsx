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


const productTypeNames: Record<number, string> = {
  1: 'NETFLIX',
  2: 'NETFLIX_VARIAS',
  3: 'PRIME_VIDEO',
  4: 'DISNEY_STANDARD',
  5: 'DISNEY_PREMIUM',
  6: 'MAX',
  7: 'SPOTIFY',
  8: 'YOUTUBE',
  9: 'PARAMOUNT',
  10: 'CRUNCHYROLL',
  11: 'VIX',
  12: 'VIKI_PASS_PLUS',
  13: 'FLUJO_TV',
  14: 'CANVA',
};



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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Precios de Producto</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/product-prices/new')}
          disabled={role !== 'ADMIN'}
        >
          + Agregar Precio
        </button>
      </div>



      <table className="table table-hover">
  <thead className="table-dark table-active">
    <tr>
      <th>ID</th>                 {/* Este es el id del registro de precio */}
      <th>Producto</th>           {/* Aquí ponemos productTypeId + nombre */}
      <th>Tipo de Cliente</th>
      <th>Tipo Precio</th>
      <th>Precio</th>
      <th>Id-Tasa de cambio</th>
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
        <td>{p.exchangeRateId}</td>
        <td className="text-end">
          <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => navigate(`/product-prices/edit/${p.id}`)}
                  disabled={role !== 'ADMIN'}
                  title="Editar"
                >
                  <EditIcon fontSize="small" />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
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

      {prices.length === 0 && (
        <div className="alert alert-info mt-3">No hay precios registrados.</div>
      )}
    </div>
  );
};

export default ProductPrices;
