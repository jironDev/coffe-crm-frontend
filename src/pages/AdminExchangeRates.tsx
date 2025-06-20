import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAllExchangeRatesAdmin,
  createExchangeRateAdmin,
  deleteExchangeRateAdmin
} from '../services/exchangeRatesService';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


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


  function formatDateOnly(dateTimeStr: string): string {
  // Asume que dateTimeStr es algo como "2025-06-01T00:00:00.000Z" o "2025-06-01T00:00:00.000"
  const datePart = dateTimeStr.split('T')[0]; // "2025-06-01"
  // Opcional: reordenar a dd/mm/YYYY:
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`; // "01/06/2025"
}

  return (
    <div className="container mt-4">
      <h1>Tasas de Cambio</h1>
      <div className="mb-5"></div>


      <form className="row g-2 mb-4">

      <div className="col-md-6">
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        </div>

        <div className="col-md-6">
        <input
          type="number"
          step="0.0001"
          className="form-control"
          placeholder="Tasa"
          value={rateValue}
          onChange={e => setRateValue(+e.target.value)}
        />
        </div>



</form>

<div className="col-md-12">
         <button className="btn btn-primary w-100" onClick={handleAdd}>Agregar</button>
         </div>

 <div className="mb-5"></div>



       
      

<div className="table-responsive shadow rounded">
      <table className="table table-hover">
        <thead className="table-active small">
          <tr>
            <th>ID</th>  
            <th>Fecha</th>
            <th>Tasa</th>
            <th className='text-center'>Eliminar T/C</th>
          </tr></thead>
        <tbody>
          {rates.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td> 
              {/* <td>{new Date(r.effectiveDate).toLocaleDateString('es-ES')}</td> */}
              <td>{formatDateOnly(r.effectiveDate)}</td>

              <td>{r.rate}</td>
              <td className='text-center'>
                <button className="btn btn-sm btn-outline-secondary border-0" onClick={() => handleDelete(r.id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>


    </div>
  );
};

export default AdminExchangeRates;
