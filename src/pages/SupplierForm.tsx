import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  createSupplier,
  updateSupplier,
  getSupplierById
} from '../services/supplierService';
import SaveIcon from '@mui/icons-material/Save';

interface FormState {
  name: string;
  contactInfo: string;
}

const SupplierForm: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ name: '', contactInfo: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id && token) {
      (async () => {
        setLoading(true);
        try {
          const data = await getSupplierById(token, +id);
          setForm({ name: data.name, contactInfo: data.contactInfo || '' });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isEdit, id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateSupplier(token!, +id, form);
      } else {
        await createSupplier(token!, form);
      }
      navigate('/suppliers');
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h1>
    <div className="mb-5"></div>

      <form onSubmit={handleSubmit}>
        {loading ? (
          <p>Cargando…</p>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contacto</label>
              <textarea
                name="contactInfo"
                className="form-control"
                value={form.contactInfo}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <button type="submit" className="btn btn-primary col-md-12 w-100" disabled={loading}>
              {loading ? 'Guardando…' : <SaveIcon />}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default SupplierForm;
