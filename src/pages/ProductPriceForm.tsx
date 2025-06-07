// src/pages/ProductPriceForm.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  createProductPriceAdmin,
  updateProductPriceAdmin,
  getAllProductPrices,
  CreateProductPriceDTO
} from '../services/productPricesService';
import SaveIcon from '@mui/icons-material/Save';

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

const PRICE_TYPES = [
  'perfil_directo',
  'completa_directo',
  'combo_directo',
  'completa_revendedor',
  'perfil_revendedor'
] as const;



interface FormProps {
  isEdit?: boolean;
}

const ProductPriceForm: React.FC<FormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CreateProductPriceDTO>({
    productTypeId: 0,
    customerType: 'DIRECTO',
    priceType: '',
    price: 0,
    exchangeRateId: 0
  });

  // Precarga datos si es edición
  useEffect(() => {
    if (isEdit && id && token) {
      (async () => {
        setLoading(true);
        try {
          const all = await getAllProductPrices(token);
          const existing = all.find(p => p.id === +id);
          if (existing) {
            setFormData({
              productTypeId: existing.productTypeId,
              customerType: existing.customerType,
              priceType: existing.priceType,
              price: existing.price,
              exchangeRateId: existing.exchangeRateId
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isEdit, id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name.endsWith('Id') ? +value : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateProductPriceAdmin(token!, +id, formData);
      } else {
        await createProductPriceAdmin(token!, formData);
      }
      navigate('/product-prices');
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEdit ? 'Editar Precio' : 'Agregar Precio'}</h2>
      <form onSubmit={handleSubmit}>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Tipo de Producto</label>
              <select
                name="productTypeId"
                className="form-select"
                value={formData.productTypeId}
                onChange={handleChange}
                required
                disabled={role !== 'ADMIN'}
              >
                <option value={0} disabled>Selecciona un producto</option>
                {Object.entries(productTypeNames).map(([id, name]) => (
                  <option key={id} value={Number(id)}>
                    {id}: {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Tipo de Cliente</label>
              <select
                name="customerType"
                className="form-select"
                value={formData.customerType}
                onChange={handleChange}
                required
                disabled={role !== 'ADMIN'}
              >
                <option value="DIRECTO">DIRECTO</option>
                <option value="REVENDEDOR">REVENDEDOR</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Tipo de Precio</label>
              <select
                name="priceType"
                className="form-select"
                value={formData.priceType}
                onChange={handleChange}
                required
                disabled={role !== 'ADMIN'}
              >
                <option value="" disabled>Selecciona un tipo de precio</option>
                {PRICE_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt.replace('_', ' ')}  {/* o déjalo tal cual si prefieres */}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Precio</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={role !== 'ADMIN'}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Id - Tasa de cambio</label>
              <input
                type="number"
                name="exchangeRateId"
                className="form-control"
                value={formData.exchangeRateId}
                onChange={handleChange}
                required
                disabled={role !== 'ADMIN'}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading || role !== 'ADMIN'}
            >
              {loading ? 'Guardando…' : <SaveIcon />}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ProductPriceForm;
