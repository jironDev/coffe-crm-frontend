import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  createCustomer,
  updateCustomer,
  getCustomerById
} from '../services/customerService';
import type { Customer } from '../models/Customer';
import SaveIcon from '@mui/icons-material/Save';

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  customerType: 'DIRECTO' | 'REVENDEDOR';
  contacto1: string;
  contacto2: string;
}

const CustomerForm: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    customerType: 'DIRECTO',
    contacto1: '',
    contacto2: ''
  });
  const [loading, setLoading] = useState(false);

  // Si edit, precarga datos
  useEffect(() => {
    if (isEdit && id && token) {
      setLoading(true);
      getCustomerById(token, +id)
        .then((c: Customer) => {
          setForm({
            firstName: c.firstName,
            lastName: c.lastName,
            phone: c.phone,
            address: c.address ?? '',
            customerType: c.customerType,
            contacto1: c.contacto1 ?? '',
            contacto2: c.contacto2 ?? ''
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isEdit, id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await updateCustomer(token!, +id, form);
      } else {
        await createCustomer(token!, form);
      }
      navigate('/customers');
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
      <form onSubmit={handleSubmit}>
        {loading ? (
          <p>Cargando…</p>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                name="firstName"
                className="form-control"
                value={form.firstName}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Apellido</label>
              <input
                name="lastName"
                className="form-control"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                name="phone"
                className="form-control"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                name="address"
                className="form-control"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tipo de Cliente</label>
              <select
                name="customerType"
                className="form-select"
                value={form.customerType}
                onChange={handleChange}
                required
              >
                <option value="DIRECTO">DIRECTO</option>
                <option value="REVENDEDOR">REVENDEDOR</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Contacto 1</label>
              <input
                name="contacto1"
                className="form-control"
                value={form.contacto1}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contacto 2</label>
              <input
                name="contacto2"
                className="form-control"
                value={form.contacto2}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary col-md-12"
              disabled={loading || (isEdit ? role!=='ADMIN' : false)}
            >
              {loading ? 'Guardando…' : <SaveIcon />}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default CustomerForm;
