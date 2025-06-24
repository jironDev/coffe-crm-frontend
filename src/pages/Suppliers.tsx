import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAllSuppliers,
  deleteSupplier
} from '../services/supplierService';
import type { Supplier } from '../models/Supplier';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Suppliers: React.FC = () => {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllSuppliers(token, q);
      setSuppliers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return;
    try {
      if (token) {
        await deleteSupplier(token, id);
        setSuppliers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error: any) {
      console.error(error);
      alert(`No se pudo eliminar: ${error.message}`);
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
      <h1 className="mb-3"> <LocalShippingIcon fontSize="large"/> Proveedores</h1>
      <div className="mb-3"></div>


<div className="text-end mb-3">
           <button
          type="button"
          className="btn btn-success rounded col-md-2"
          onClick={() => window.open('/suppliers/new', '_blank')}
        >
          + Nuevo Proveedor
        </button>
        </div>


      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-12">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre del Proveedor"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        </div>


        <div className="col-md-12">
        <button className="btn btn-primary w-100">Buscar</button>
</div>

   
      </form>

      <div className="mb-5"></div>


<div className="table-responsive shadow rounded">
      <table className="table table-hover">
        <thead className="table-active">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Creado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.contactInfo || '-'}</td>
              <td>{new Date(s.createdAt).toLocaleDateString()}</td>
              <td className="text-end">
                <button
                  className="btn btn-sm btn-outline-secondary border-0 e-2"
                  onClick={() => navigate(`/suppliers/edit/${s.id}`)}
                  title="Editar"
                >
                  <EditIcon fontSize="small" />
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary border-0"
                  onClick={() => handleDelete(s.id)}
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

      {suppliers.length === 0 && (
        <div className="alert alert-info mt-3">No se encontraron proveedores.</div>
      )}
    </div>
  );
};

export default Suppliers;
