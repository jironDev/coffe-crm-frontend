// src/pages/SaleForm.tsx

import { useState, useEffect } from "react";
import { useNavigate,  useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createSale,
  updateSaleProduct
} from "../services/customerProductService";

import type {  OrderLineDetail } from "../services/customerProductService";

interface FormState {
  // Cuando venimos de “Editar”, location.state.line será de tipo OrderLineDetail (o CustomerProductWithRelations),
  // pero asumimos que ambas comparten los campos que necesitamos (p.ej. id, customerId, productId, etc.).
  line?: OrderLineDetail;
}

const SaleForm: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  // const { id } = useParams<{ id: string }>(); // este “id” es el ID de la línea que queremos editar, si es edición
  const location = useLocation();
  const state = location.state as FormState;

  // --- Campos básicos del formulario ---
  // 1) Si es edición, rellenamos estos estados con los datos de state.line (p.ej. customerId, productId, priceType…).
  // 2) Si es nueva venta, parten todos en "" o 0.
  const [customerId, setCustomerId]       = useState<number>(state?.line ? state.line.customer.id : 0);
  const [productId, setProductId]         = useState<number>(state?.line ? state.line.product.id : 0);
  const [priceType, setPriceType]         = useState<string>(state?.line ? state.line.priceType : "");
  const [totalDays, setTotalDays]         = useState<number>(state?.line ? state.line.totalDays : 0);
  const [assignedAt, setAssignedAt]       = useState<string>(state?.line ? state.line.assignedAt.substring(0, 10) : "");
  const [finalUser1, setFinalUser1]       = useState<string>(state?.line ? (state.line.finalUser1 ?? "") : "");
  const [assignedSlots, setAssignedSlots] = useState<number>(state?.line ? state.line.assignedSlots : 1);
  // “notes” va en la orden. Si venimos de edición, la orden pudo tener notas concatenadas,
  // pero como sólo editamos producto, tal vez no sea crítico. Lo dejamos para crear la venta nueva.
  const [notes, setNotes] = useState<string>("");

  // Si estamos en edición, no vamos a permitir cambiar “orderId ni createdAt ni totalAmount”.
  // Sólo permitimos “mover” la línea a otro producto. Por tanto, el único campo que realmente
  // usamos para PUT /updateSaleProduct es productId. El resto, aunque lo mostremos en pantalla,
  // no se envía al backend.

  const isEdit = Boolean(state?.line);

  // Si es edición, podríamos mostrar un pequeño mensaje:
  useEffect(() => {
    if (isEdit) {
      // Por ejemplo, en edición no dejamos tocar ciertos campos:
      // - Podrías deshabilitar customerId / priceType / totalDays / assignedAt / assignedSlots, etc.
      // - Sólo `productId` será editable.
      setNotes(""); // En edición no modificamos notas de la orden.
    }
  }, [isEdit]);

  // ------------ Función para cuando el usuario envía el formulario ------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("No estás autenticado.");
      return;
    }

    try {
      if (isEdit && state.line) {
        // ——— EDITAR LÍNEA ———
        // Backend sólo permite cambiar el producto de una venta existente
        // llamando a PUT /customer_products/update-product/:id
        await updateSaleProduct(token, state.line.id, { productId });
        // Una vez actualizado, redirigimos al listado de ventas:
        navigate("/sales");
      } else {
        // ——— CREAR NUEVA VENTA ———
        // Para crear la venta, debemos enviar exactamente lo que el backend espera en POST /add-sale:
        // {
        //   customerId,
        //   productId,
        //   priceType,
        //   totalDays,
        //   assignedAt: "YYYY-MM-DD",
        //   finalUser1?,
        //   finalUser2?,           // si no lo usas, lo dejamos undefined
        //   assignedSlots,
        //   notes?                 // aquí va la nota; el orden se crea automáticamente
        // }
        await createSale(token, {
          customerId,
          productId,
          priceType: priceType as
            | "perfil_directo"
            | "completa_directo"
            | "combo_directo"
            | "completa_revendedor"
            | "perfil_revendedor",
          totalDays,
          assignedAt,       // “YYYY-MM-DD”
          finalUser1: finalUser1 || undefined,
          finalUser2: undefined,
          assignedSlots,
          notes: notes || undefined
        });
        navigate("/sales");
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Error al procesar la venta.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEdit ? "Editar Línea de Venta" : "Nueva Venta"}</h2>

      <form onSubmit={handleSubmit}>
        {/*** Cargamos algunos campos en read-only o hidden si es edición ***/}
        {isEdit && state.line && (
          <>
            <div className="mb-3">
              <label className="form-label">ID de la Línea</label>
              <input
                type="text"
                className="form-control"
                value={state.line.id}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Cliente</label>
              <input
                type="text"
                className="form-control"
                value={`${state.line.customer.firstName} ${state.line.customer.lastName} (ID=${state.line.customer.id})`}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price Type</label>
              <input
                type="text"
                className="form-control"
                value={state.line.priceType.replace("_", " ")}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Total de Días</label>
              <input
                type="text"
                className="form-control"
                value={state.line.totalDays}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha Asignada</label>
              <input
                type="text"
                className="form-control"
                value={new Date(state.line.assignedAt)
                  .toISOString()
                  .substring(0, 10)}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Slots Asignados</label>
              <input
                type="number"
                className="form-control"
                value={state.line.assignedSlots}
                readOnly
              />
            </div>
          </>
        )}

        {/*** Campo productId: editable en ambos casos ***/}
        <div className="mb-3">
          <label className="form-label">Producto (ID)</label>
          <input
            type="number"
            className="form-control"
            value={productId}
            onChange={(e) => setProductId(Number(e.target.value))}
            required
          />
          <small className="form-text text-muted">
            En edición solo cambiarás a qué producto está asignada esta línea.
            En nuevo, indica el ID del producto a vender.
          </small>
        </div>

        {/*** Cuando es nueva venta, mostramos todos los campos necesarios ***/}
        {!isEdit && (
          <>
            <div className="mb-3">
              <label className="form-label">Cliente (ID)</label>
              <input
                type="number"
                className="form-control"
                value={customerId}
                onChange={(e) => setCustomerId(Number(e.target.value))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price Type</label>
              <select
                className="form-select"
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                required
              >
                <option value="">Seleccione priceType</option>
                <option value="perfil_directo">perfil_directo</option>
                <option value="completa_directo">completa_directo</option>
                <option value="combo_directo">combo_directo</option>
                <option value="completa_revendedor">completa_revendedor</option>
                <option value="perfil_revendedor">perfil_revendedor</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Total de Días</label>
              <input
                type="number"
                className="form-control"
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                required
                min={1}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha de Asignación</label>
              <input
                type="date"
                className="form-control"
                value={assignedAt}
                onChange={(e) => setAssignedAt(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Final User 1 (opcional)</label>
              <input
                type="text"
                className="form-control"
                value={finalUser1}
                onChange={(e) => setFinalUser1(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Slots a Asignar</label>
              <input
                type="number"
                className="form-control"
                value={assignedSlots}
                onChange={(e) => setAssignedSlots(Number(e.target.value))}
                required
                min={1}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Notas de la Orden (opcional)</label>
              <input
                type="text"
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary">
          {isEdit ? "Actualizar Línea" : "Crear Venta"}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/sales")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default SaleForm;
