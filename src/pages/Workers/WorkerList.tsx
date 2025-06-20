import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWorkers } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


const API_BASE = 'https://crm-nicastream.onrender.com'; 

const WorkerList = () => {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        if (token) {
          const data = await fetchWorkers(token);
          setWorkers(data);
          setError(null);
        }
      } catch (err) {
        setError('Error al cargar los trabajadores');
        console.error('Error loading workers:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkers();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este trabajador?')) {
      try {
        if (token) {
          await fetch(`${API_BASE}/workers/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setWorkers(workers.filter(worker => worker.id !== id));
        }
      } catch (error) {
        console.error('Error deleting worker:', error);
      }
    }
  };

  if (loading) {
    return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'         // ocupa toda la altura de la ventana
      }}>
      <CircularProgress />
    </Box>
  );
  }

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">     
        <h1 className="mb-3">Trabajadores</h1>
        <div className="mb-3"></div>

         <div className="text-end mb-3">
         <button
                    type="button"
                    className="btn btn-success rounded col-md-2"
                    onClick={() => window.open('/workers/new', '_blank')}
                >
          + Nuevo Trabajador
        </button>
      </div>

<div className="table-responsive shadow rounded">
      <table className="table table-hover">
        <thead className="table-active small">
          <tr >
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Rol</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody >
          {workers.map((worker) => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.firstName}</td>
              <td>{worker.lastName}</td>
              <td>{worker.phone}</td>
              <td>{worker.email}</td>
              <td>{worker.role}</td>
              <td className="text-end">
                <Link
                  to={`/workers/edit/${worker.id}`}
                  className="btn btn-sm btn-outline-secondary border-0 me-2"
                  title="Editar"
                >
                  <i className="bi bi-pencil"></i><EditIcon fontSize="small"/>
                </Link>
                <button 
                  onClick={() => handleDelete(worker.id)}
                  className="btn btn-sm btn-outline-secondary border-0 "
                  title="Eliminar"
                >
                  <i className="bi bi-trash"></i>
                <DeleteOutlineIcon fontSize="small"/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {workers.length === 0 && (
        <div className="alert alert-info mt-4">
          No se encontraron trabajadores registrados
        </div>
      )}
    </div>
  );
};

export default WorkerList;
