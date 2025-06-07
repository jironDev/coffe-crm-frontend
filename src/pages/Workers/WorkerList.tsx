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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className='american-typewriter'>Lista de Trabajadores</h2>
        <Link to="/workers/new" className="btn btn-primary text-primary-text-emphasis ">
          <i className="bi bi-plus-circle me-2"></i>
          Agregar Trabajador
        </Link>
      </div>

      <table className="table table-hover table-striped">
        <thead className="table-dark">
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
        <tbody className="table-group-divider">
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
                  <i className="bi bi-pencil"></i><EditIcon />
                </Link>
                <button 
                  onClick={() => handleDelete(worker.id)}
                  className="btn btn-sm btn-outline-secondary border-0 "
                  title="Eliminar"
                >
                  <i className="bi bi-trash"></i>
                <DeleteOutlineIcon/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {workers.length === 0 && (
        <div className="alert alert-info mt-4">
          No se encontraron trabajadores registrados
        </div>
      )}
    </div>
  );
};

export default WorkerList;
