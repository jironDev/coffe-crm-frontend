import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { createWorker, updateWorker, fetchWorkers } from '../../services/api.ts';
import SaveIcon from '@mui/icons-material/Save';


interface WorkerFormProps {
  isEdit?: boolean;
}

const WorkerForm = ({ isEdit = false }: WorkerFormProps) => {
  const { id } = useParams();
  console.log('WorkerForm. id from URL:', id);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    password: '',
    phone: '',
    role: 'WORKER'
  });
  

  useEffect(() => {
    if (isEdit && id && token) {
      (async () => {
        try {
          // 1) Trae toda la lista de trabajadores
          const all = await fetchWorkers(token);
          // 2) Filtra el que coincide con el id de la URL
          const worker = all.find((w: any) => String(w.id) === id);
          if (!worker) throw new Error('Worker no encontrado en lista');
          // 3) Rellena el formulario de una vez
          setFormData({
            firstName: worker.firstName ?? '',
            lastName:  worker.lastName  ?? '',
            email:     worker.email     ?? '',
            phone:     worker.phone     ?? '',
            password:  '',               // no mostramos la contraseña
            role:      worker.role      ?? 'WORKER'
          });
        } catch (err) {
          console.error('Error loading worker from list:', err);
        }
      })();
    }
  }, [isEdit, id, token]);
  // ──────────────────────────────────────────────


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    
 console.log('Enviando datos de trabajador:', formData); // ← agrega esto

    try {
      if (isEdit && id && token) {
        await updateWorker(token, id, formData);
      } else if (token) {
        await createWorker(token, formData);
      }
      navigate('/workers');
    } catch (error: any) {
      console.error('Error saving worker:', error);
      alert(`No se pudo crear el trabajador: ${error.message}`);
    } 
    
        finally {
      setLoading(false);
    } 

  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEdit ? 'Editar' : 'Agregar nuevo trabajador'}</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={formData.firstName  ?? ''}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={formData.lastName  ?? ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone  ?? ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email  ?? ''}
            onChange={handleChange}
            required
          />
        </div>

        {!isEdit && (
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password  ?? ''}
              onChange={handleChange}
              required={!isEdit}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="role"
            value={formData.role  ?? ''}
            onChange={handleChange}
            required
          >
            <option value="WORKER">Worker</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100 w-md-auto"
          disabled={loading}
          
        >
          {loading ? 'Guardando...' : <SaveIcon/> }
        </button>
      </form>
    </div>
  );
};

export default WorkerForm;
