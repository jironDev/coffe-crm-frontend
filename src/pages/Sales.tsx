// src/pages/Sales.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAllCustomerProducts,
  getCustomerOrderById,
  deactivateCustomerProduct,
  deleteCustomerOrderById
} from '../services/customerProductService';
import { productTypeNames } from '../components/productTypeNames';


// Importamos los tipos correspondientes:
import type {
  CustomerProductWithRelations,
  OrderDetail,
  OrderLineDetail
} from '../services/customerProductService';

import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BlockIcon from '@mui/icons-material/Block';

interface SearchFilters {
  firstName?: string;
  lastName?: string;
  phone?: string;
  username?: string;
  assignedAt?: string;
  expirationDate?: string;
  finalUser1?: string;
  // finalUser2?: string;
  // status?: string;
}

const Sales: React.FC = () => {
  const { token, role } = useAuth();
  const [salesList, setSalesList] = useState<CustomerProductWithRelations[]>([]);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // —— Estados para los campos de búsqueda ——
  const [orderId, setOrderId] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [assignedAt, setAssignedAt] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [finalUser1, setFinalUser1] = useState<string>('');
  // const [finalUser2, setFinalUser2]       = useState<string>('');
  const [status, setStatus] = useState<'Activo' | 'Vencido' | ''>('');

  const navigate = useNavigate();

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      // 1) Si el usuario ingresó un Order ID, traigo solo esa orden:
      if (orderId.trim()) {
        const parsedOrderId = parseInt(orderId, 10);
        if (isNaN(parsedOrderId)) {
          setError('Order ID inválido');
          setOrderDetail(null);
          setSalesList([]);
        } else {
          const detail: OrderDetail = await getCustomerOrderById(token, parsedOrderId);
          setOrderDetail(detail);
          setSalesList([]); // limpio la tabla general
        }

      } else {
        // 2) Si no hay OrderId, uso filtros libres para getAllCustomerProducts:
        const filtros: SearchFilters = {};

        if (firstName) filtros.firstName = firstName;
        if (lastName) filtros.lastName = lastName;
        if (phone) filtros.phone = phone;
        if (username) filtros.username = username;
        if (assignedAt) filtros.assignedAt = assignedAt;
        if (expirationDate) filtros.expirationDate = expirationDate;
        if (finalUser1) filtros.finalUser1 = finalUser1;
        // if (finalUser2)     filtros.finalUser2     = finalUser2;
        // if (status)         filtros.status         = status;

        const data = await getAllCustomerProducts(token, filtros);



        // *** AQUI FILTRAMOS “status” EN EL FRONTEND ***
        let filtered: CustomerProductWithRelations[] = data;
        if (status === 'Activo') {
          // Activo  → expirationDate > hoy
          const now = new Date();
          filtered = data.filter((line) => {
            const exp = new Date(line.expirationDate);
            return exp.getTime() > now.getTime();
          });
        } else if (status === 'Vencido') {
          // Vencido → expirationDate ≤ hoy
          const now = new Date();
          filtered = data.filter((line) => {
            const exp = new Date(line.expirationDate);
            return exp.getTime() <= now.getTime();
          });
        }
        setSalesList(filtered);
        setOrderDetail(null);
      }

    } catch (err: any) {
      console.error(err);
      setError((err?.message as string) || 'Error al cargar ventas');
      setSalesList([]);
      setOrderDetail(null);
    } finally {
      setLoading(false);
    }
  };







  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load();
  };

  const handleDeactivate = async (id: number) => {
    if (!token) return;
    try {
      await deactivateCustomerProduct(token, id);
      load();
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? 'No se pudo desactivar');
    }
  };

  const handleDeleteOrder = async (orderIdToDelete: number) => {
    if (!token) return;
    if (role !== 'ADMIN') return;
    if (!window.confirm('¿Eliminar toda la orden padre (liberando slots)?')) return;

    try {
      await deleteCustomerOrderById(token, orderIdToDelete);
      load();
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? 'No se pudo eliminar la orden');
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
    <div className="container py-4 mt-4 ">
      <h1 className="mb-3 american-typewriter">Ventas</h1>
      <hr className="mb-4" />

      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        {/* —— Busca por Order ID —— */}
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="N° Factura"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
          />
        </div>

        {/* —— Si ya hay Order ID, deshabilito filtros “cliente/producto/fechas” —— */}
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            disabled={!!orderId.trim()}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Apellido"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            disabled={!!orderId.trim()}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Celular"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            disabled={!!orderId.trim()}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Producto (Username)"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={!!orderId.trim()}
          />
        </div>

        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Usuario Final"
            value={finalUser1}
            onChange={e => setFinalUser1(e.target.value)}
            disabled={!!orderId.trim()}
          />
        </div>

        {/* —— Campos de fecha de asignación / expiración —— */}
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            placeholder="Asignada"
            value={assignedAt}
            onChange={e => setAssignedAt(e.target.value)}
            disabled={!!orderId.trim()}
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            placeholder="Vence"
            value={expirationDate}
            onChange={e => setExpirationDate(e.target.value)}
            disabled={!!orderId.trim()}
          />
        </div>

        {/* —— Notas finales (se pueden desactivar si hay Order ID) —— */}


        {/* <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="FinalUser2"
            value={finalUser2}
            onChange={e => setFinalUser2(e.target.value)}
            disabled={!!orderId.trim()}
          />
        </div> */}

        <div className="col-md-2">
          <select
            className="form-select"
            value={status}
            onChange={e => setStatus(e.target.value as "" | "Activo" | "Vencido")}
            disabled={!!orderId.trim()}
          >
            <option value="">Estado</option>
            <option value="Activo">Activo</option>
            <option value="Vencido">Vencido</option>
          </select>
        </div>

        {/* —— Botón de búsqueda —— */}
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            Buscar
          </button>
        </div>

        {/** 
         * Botón “+ Nueva Venta” siempre activo,
         * no se deshabilita aunque haya OrderId en el filtro. 
         */}
        <div className="col-md-2 text-end">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => navigate('/sales/new')}
          >
            + Nueva Venta
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {/**
       * —— Si estamos en “búsqueda por Order ID” (orderDetail ≠ null),
       * pintamos el detalle de esa orden (un bloque aparte). 
       */}
      {/* {orderDetail && (
        <>
          <h4 className="mt-4">Detalle de Orden #{orderDetail.id}</h4>
          <p>
            Cliente: {orderDetail.customer.firstName}{' '}
            {orderDetail.customer.lastName} ({orderDetail.customer.phone})
            <br />
            Monto total: ${orderDetail.totalAmount.toFixed(2)}
          </p>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Linea ID</th>
                <th>Producto</th>
                <th>Price Type</th>
                <th>Total Días</th>
                <th>Asignada</th>
                <th>Vence</th>
                <th>Slots</th>
                <th>FinalUser1</th>
                <th>FinalUser2</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail.lines.map((line: OrderLineDetail) => (
                <tr key={line.id}>
                  <td>{line.id}</td>
                  <td>{line.product.username}</td>
                  <td>{line.priceType.replace('_', ' ')}</td>
                  <td>{line.totalDays}</td>
                  <td>{new Date(line.assignedAt).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</td>
                  <td>{new Date(line.expirationDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</td>
                  <td>{line.assignedSlots}</td>
                  <td>{line.finalUser1 ?? '—'}</td>
                  <td>{line.finalUser2 ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-4"></div>
        </>
      )} */}



      {/* //pintamos el detalle de esa orden como una “factura” dentro de una Card.  */}

      {orderDetail && (
        <div className="container py-4 card mb-4 shadow-sm">
          {/* Header de la Card con ID de factura, cliente y fecha */}
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <h4 className="card-title mb-0">
                N° Factura: {orderDetail.id}
              </h4>
              <small className="text-muted">
                ID Cliente: {orderDetail.customer.id} &nbsp;|&nbsp; Tipo: {orderDetail.customer.customerType}
              </small>
            </div>
            <div>
              <small className="text-secondary">
                {/* Fecha de creación de la orden */}
                {new Date(orderDetail.createdAt).toLocaleDateString('es-ES')}
              </small>
            </div>
          </div>

          <div className="card-body">
            {/* Datos principales del cliente */}
            <p className="mb-1">
              <strong>Cliente:</strong>{' '}
              {orderDetail.customer.firstName} {orderDetail.customer.lastName}{' '}
              ({orderDetail.customer.phone})
            </p>

            {/* Notas de la orden (si existen) */}
            {orderDetail.notes && (
              <p className="mb-3">
                <strong>Notas:</strong> {orderDetail.notes}
              </p>
            )}

            {/* Lista de líneas dentro de la factura */}
            <div className="list-group">
              {orderDetail.lines.map((line: OrderLineDetail) => {
                const assignedDate = new Date(line.assignedAt);
                const expirationDateLine = new Date(line.expirationDate);

                const typeId = line.product.productTypeId;
                const typeName = productTypeNames[typeId] || 'DESCONOCIDO';

                return (
                  <div key={line.id} className="list-group-item py-3">
                    <div className="row">

              

                      {/* Producto */}
                      <div className="col-md-3 mb-1">
                        <strong> {typeName}:</strong><br />
                        {line.product.username}
                      </div>



                      {/* Total de días */}
                      <div className="col-md-2 mb-1">
                        <strong>Días:</strong><br />
                        {line.totalDays}
                      </div>

                      {/* Fecha asignada */}
                      <div className="col-md-2 mb-1">
                        <strong>Asignada:</strong><br />
                        {`${assignedDate.getUTCDate().toString().padStart(2, '0')}/${(assignedDate.getUTCMonth() + 1).toString().padStart(2, '0')
                          }/${assignedDate.getUTCFullYear()}`}
                      </div>

                      {/* Fecha de vencimiento */}
                      <div className="col-md-2 mb-1">
                        <strong>Vence:</strong><br />
                        {`${expirationDateLine.getUTCDate().toString().padStart(2, '0')}/${(expirationDateLine.getUTCMonth() + 1).toString().padStart(2, '0')
                          }/${expirationDateLine.getUTCFullYear()}`}
                      </div>

                      {/* Slots asignados */}
                      <div className="col-md-1 mb-1">
                        <strong>Slots:</strong><br />
                        {line.assignedSlots}
                      </div>

                      {/* Precio del producto */}
                      <div className="col-md-2 mb-1">
                        <strong>Precio:</strong><br />
                        ${Number(line.productPrice.price).toFixed(2)}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total al pie de la factura */}
            <div className="text-end mt-4">
              <h5>
                <strong>Total:</strong> ${orderDetail.totalAmount.toFixed(2)}
              </h5>
            </div>
          </div>
        </div>
      )}





      {/**+
       * —— Si no estamos en “búsqueda por Order ID” 
       * y hay resultados en salesList (getAllCustomerProducts), 
       * pintamos la tabla de líneas genérica. 
       */}
      {salesList.length > 0 && !orderDetail && (
        <>
          <h4 className="mt-4">Líneas encontradas</h4>
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Tipo de precio</th>
                <th>Días</th>
                <th>Asignada</th>
                <th>Vence</th>
                <th>Slots</th>
                <th>FinalUser1</th>
                <th>FinalUser2</th>
                <th>Status</th>
                <th>Orden</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {salesList.map((line) => (
                <tr key={line.id}>
                  <td>{line.id}</td>
                  <td>
                    {line.customer.firstName} {line.customer.lastName}{' '}
                    ({line.customer.phone})
                  </td>
                  <td>{line.product.username}</td>
                  <td>{line.priceType.replace('_', ' ')}</td>
                  <td>{line.totalDays}</td>

                  {/* <td>{new Date(line.assignedAt).toLocaleDateString()}</td> */}

                  <td>
                    {(() => {
                      const d = new Date(line.assignedAt);
                      return `${d.getUTCDate().toString().padStart(2, '0')}/${(d.getUTCMonth() + 1).toString().padStart(2, '0')
                        }/${d.getUTCFullYear()}`;
                    })()}
                  </td>


                  {/* <td>{new Date(line.expirationDate).toLocaleDateString()}</td> */}

                  <td>
                    {(() => {
                      const d = new Date(line.expirationDate);
                      return `${d.getUTCDate().toString().padStart(2, '0')}/${(d.getUTCMonth() + 1).toString().padStart(2, '0')
                        }/${d.getUTCFullYear()}`;
                    })()}
                  </td>

                  <td>{line.assignedSlots}</td>
                  <td>{line.finalUser1 ?? '—'}</td>
                  <td>{line.finalUser2 ?? '—'}</td>
                  <td>{line.status}</td>
                  <td className="text-center">{line.orderId}</td>
                  <td className="text-end">
                    {/* Desactivar línea (todos los usuarios autenticados) */}
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => handleDeactivate(line.id)}
                      title="Desactivar"
                    >
                      <BlockIcon fontSize="small" />
                    </button>

                    {/* Editar línea (solo cambia producto) */}
                    {/* <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => navigate(`/sales/edit/${line.id}`)}
                      title="Editar línea"
                    >
                      <EditIcon fontSize="small" />
                    </button> */}

                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => navigate(`/sales/edit/${line.id}`, { state: { line } })}
                      title="Editar"
                    >
                      <EditIcon fontSize="small" />
                    </button>



                    {/* Eliminar toda la orden (solo ADMIN) */}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteOrder(line.orderId)}
                      disabled={role !== 'ADMIN'}
                      title="Eliminar orden completa"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-4"></div>
        </>
      )}

      {/**
       * —— Si no hubo resultados en ninguno de los dos modos, muestro mensaje:
       */}
      {!loading && !orderDetail && salesList.length === 0 && (
        <div className="alert alert-info mt-3">
          No se encontraron ventas.
        </div>
      )}
    </div>
  );
};

export default Sales;
