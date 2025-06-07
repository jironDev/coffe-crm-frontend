import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAllExchangeRatesAdmin,
  createExchangeRateAdmin,
  deleteExchangeRateAdmin
} from '../services/exchangeRatesService';


const AdminExchangeRates = () => {
  const { token } = useAuth();
  const [rates, setRates] = useState<any[]>([]);
  const [date, setDate] = useState('');
  const [rateValue, setRateValue] = useState<number>(0);

  const load = async () => {
    if (!token) return;
    const data = await getAllExchangeRatesAdmin(token);
    setRates(data);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    await createExchangeRateAdmin(token!, { effectiveDate: date, rate: rateValue });
    setDate(''); setRateValue(0);
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Eliminar tasa?')) {
      await deleteExchangeRateAdmin(token!, id);
      load();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tasas de Cambio</h2>
      <div className="mb-3">
        <input
          type="date"
          className="form-control mb-2"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input
          type="number"
          step="0.0001"
          className="form-control mb-2"
          placeholder="Tasa"
          value={rateValue}
          onChange={e => setRateValue(+e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>Agregar</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>  
            <th>Fecha</th><th>Tasa</th><th>Acciones</th>
          </tr></thead>
        <tbody>
          {rates.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td> 
              <td>{new Date(r.effectiveDate).toLocaleDateString()}</td>
              <td>{r.rate}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminExchangeRates;
