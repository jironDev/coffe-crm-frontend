// src/pages/CustomerDetail.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCustomerById } from '../services/customerService';
import { getCustomerOrderById } from '../services/customerProductService';
import { deleteCustomer } from '../services/customerService';
import type { Customer, OrderSummary } from '../models/Customer';
import type { OrderDetail, OrderLineDetail } from '../services/customerProductService';
import { productTypeNames } from '../components/productTypeNames';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

// ---------- Helper para formatear fechas ISO sin desfase ----------
function formatDate(isoString: string) {
  // Extraemos “YYYY-MM-DD” para evitar efectos de huso horario
  const [year, month, day] = isoString.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState<boolean>(false);
  const [errorCustomer, setErrorCustomer] = useState<string | null>(null);

  // Para almacenar órdenes cargadas (detalle completo) y su estado de carga
  const [loadedOrders, setLoadedOrders] = useState<Record<number, OrderDetail>>({});
  const [loadingOrders, setLoadingOrders] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!token || !id) return;
    setLoadingCustomer(true);
    getCustomerById(token, +id)
      .then(c => {
        setCustomer(c);
      })
      .catch(err => {
        console.error(err);
        setErrorCustomer('Error al cargar el cliente.');
      })
      .finally(() => setLoadingCustomer(false));
  }, [token, id]);

  // Función que dispara la carga de una orden (por demanda)
  const handleLoadOrder = async (orderId: number) => {
    // Si ya está cargada o ya se está cargando, no hacemos nada
    if (loadedOrders[orderId] || loadingOrders[orderId]) return;

    setLoadingOrders(prev => ({ ...prev, [orderId]: true }));
    try {
      if (!token) throw new Error('No autenticado');
      const detail: OrderDetail = await getCustomerOrderById(token, orderId);
      setLoadedOrders(prev => ({ ...prev, [orderId]: detail }));
    } catch (err) {
      console.error(err);
      // Podrías agregar un estado de error específico si quieres
    } finally {
      setLoadingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (loadingCustomer) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (errorCustomer || !customer) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {errorCustomer ?? 'Cliente no encontrado.'}
        </div>
      </div>
    );
  }

  // Ordenamos las órdenes de más reciente a más antigua por createdAt
  const sortedOrders: OrderSummary[] = (customer.orders ?? []).slice().sort((a, b) => {
    // Comparamos las cadenas ISO directamente: 
    // la más grande es la más reciente
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div className="container mt-4 ">
      <div className="row">
        {/* --------------------------------------------------------- */}
        {/*  Card de Perfil del Cliente (30% de ancho aprox)        */}
        {/* --------------------------------------------------------- */}
        <div className="col-md-4 py-4">
          <div className="card mb-4 shadow card-rounded text-start">
            <div className="card-header bg-indigo">
              <small className="card-title mb-0 text-light text-start fw-bold opacity-75">
                ID-CLIENTE: {customer.id}
              </small>
            </div>
            <div className="card-body">
              
              <h3 className='text-center py-2 mb-2 fw-bold text-white'>{customer.firstName} {customer.lastName}</h3>

                <ul className="list-group list-group-flush">
    <li className="list-group-item mt-2"><span><strong>Celular: </strong> {customer.phone}</span></li>
    <li className="list-group-item"><span><strong>Tipo: </strong> {customer.customerType}</span></li>
    <li className="list-group-item"><span><strong>Dirección: </strong> {customer.address ?? '—'}</span></li>
    <li className="list-group-item"><span><strong>Contacto 1: </strong> {customer.contacto1 ?? '—'}</span></li>
    <li className="list-group-item"><span><strong>Contacto 2: </strong> {customer.contacto2 ?? '—'}</span></li>
    <small className='text-end mt-2 text-secondary'>{formatDate(customer.createdAt)}</small>
  </ul>


            </div>


            
            <div className="card-footer text-end ">

              <div className="row g-2">


              <div className="col-6">
              <button
                className="btn btn-sm btn-outline-secondary w-100 border-0"
                onClick={() => navigate(`/customers/edit/${customer.id}`)}
                title="Editar Cliente"
                disabled={role !== 'ADMIN'}
              >
                <EditIcon/>
              </button>
              </div>

              <div className="col-6">

<button
  className="btn btn-sm btn-outline-danger w-100 border-0"
  onClick={async () => {
    if (role !== 'ADMIN') return;
    if (!window.confirm('¿Eliminar este cliente?')) return;
    try {
      // Llamada al servicio para borrar al cliente
      await deleteCustomer(token!, customer.id);
      // Luego volvemos al listado
      navigate('/customers');
    } catch (err: any) {
      console.error(err);
      alert(`Error al eliminar: ${err.message}`);
    }
  }}
  disabled={role !== 'ADMIN'}
  title={role !== 'ADMIN' ? 'Solo administradores' : 'Eliminar Cliente'}
>
  <DeleteOutlineIcon/>
</button>

</div>


</div>



            </div>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/*  Sección de Actividades / Órdenes (70% de ancho aprox)    */}
        {/* --------------------------------------------------------- */}

        

        <div className="col-md-8">
          <h4 className='text-center'>💸 Compras</h4>

          {sortedOrders.length === 0 ? (
            <div className="alert alert-info">No hay órdenes para este cliente.</div>
          ) : (
            <div className="accordion" id="ordersAccordion">
              {sortedOrders.map((order) => {
                const collapseId = `collapseOrder${order.id}`;
                const headingId = `headingOrder${order.id}`;

                return (
                  <div className="accordion-item" key={order.id}>
                    <h2 className="accordion-header" id={headingId}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded="false"
                        aria-controls={collapseId}
                        onClick={() => handleLoadOrder(order.id)}
                      >
                        Factura N°{order.id} — {new Date(order.createdAt).toLocaleDateString('es-ES')}
                      </button>
                    </h2>
                    <div
                      id={collapseId}
                      className="accordion-collapse collapse"
                      aria-labelledby={headingId}
                    //   data-bs-parent="#ordersAccordion"
                    >
                      <div className="accordion-body">
                        {loadingOrders[order.id] ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress size={24} />
                          </Box>
                        ) : loadedOrders[order.id] ? (
                          <OrderMiniInvoice orderDetail={loadedOrders[order.id]} />
                        ) : (
                          <p>Haga clic para cargar detalles de la orden.</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;


// ===========================
// Component “mini‐factura”
// ===========================
interface OrderMiniInvoiceProps {
  orderDetail: OrderDetail;
}

const OrderMiniInvoice: React.FC<OrderMiniInvoiceProps> = ({ orderDetail }) => {
  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <strong>N° Factura: {orderDetail.id}</strong>
        </div>
        <div>
          <small className="text-secondary">
            {new Date(orderDetail.createdAt).toLocaleDateString('es-ES')}
          </small>
        </div>
      </div>
      <div className="card-body p-2">
        <p className="mb-2">
          <strong>Cliente:</strong> {orderDetail.customer.firstName}{' '}
          {orderDetail.customer.lastName} ({orderDetail.customer.phone})
        </p>
        <div className="list-group mb-2">
          {orderDetail.lines.map((line: OrderLineDetail) => {
            // const assigned = line.assignedAt.split('T')[0].split('-');
            const expiration = line.expirationDate.split('T')[0].split('-');
            // const assignedStr = `${assigned[2]}/${assigned[1]}/${assigned[0]}`;
            const expirationStr = `${expiration[2]}/${expiration[1]}/${expiration[0]}`;

// Buscar el nombre legible del tipo de producto
            const typeId = line.product.productTypeId;
            const typeName = productTypeNames[typeId] || 'DESCONOCIDO';

            return (
              <div key={line.id} className="list-group-item py-2 px-1">
                <div className="d-flex justify-content-between">
                      <div>
                    <strong></strong> {typeName}:
                  </div>
                           <span>
                    <strong>Días:</strong> {line.totalDays}
                  </span>

                  <span>
                    <strong>Slots:</strong> {line.assignedSlots}
                  </span>

           

                </div>
                <div className="d-flex justify-content-between small mt-1">

  <div>
                    <strong></strong> {line.product.username}
                  </div>



                  {/* <span>
                    <strong>Asignada:</strong> {assignedStr}
                  </span> */}
                  <span>
                    <strong>Vence:</strong> {expirationStr}
                  </span>

                  
                  <div>
                    <strong>Precio:</strong> ${Number(line.productPrice.price).toFixed(2)}
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-end">
          <strong>Total:</strong> ${orderDetail.totalAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
