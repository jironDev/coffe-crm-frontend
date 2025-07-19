// // src/pages/SaleForm.tsx
// //Primera version

// import { useState, useEffect } from "react";
// import { useNavigate,  useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import {
//   createSale,
//   updateSaleProduct
// } from "../services/customerProductService";
// import { getProductById } from "../services/productService";

// import type {  OrderLineDetail } from "../services/customerProductService";
// import SaveIcon from "@mui/icons-material/Save";

// interface FormState {
//   // Cuando venimos de “Editar”, location.state.line será de tipo OrderLineDetail (o CustomerProductWithRelations),
//   // pero asumimos que ambas comparten los campos que necesitamos (p.ej. id, customerId, productId, etc.).
//   line?: OrderLineDetail;

//   //esto es nuevo para el boton renovar

  
// }

// const SaleForm: React.FC = () => {
//   const { token } = useAuth();
//   const navigate = useNavigate();
//   // const { id } = useParams<{ id: string }>(); // este “id” es el ID de la línea que queremos editar, si es edición
//   const location = useLocation();
//   const state = location.state as FormState;

//   // --- Campos básicos del formulario ---
//   // 1) Si es edición, rellenamos estos estados con los datos de state.line (p.ej. customerId, productId, priceType…).
//   // 2) Si es nueva venta, parten todos en "" o 0.
//   const [customerId, setCustomerId]       = useState<number>(state?.line ? state.line.customer.id : 0);
//   const [productId, setProductId]         = useState<number>(state?.line ? state.line.product.id : 0);
//   const [priceType, setPriceType]         = useState<string>(state?.line ? state.line.priceType : "perfil_directo");
//   const [totalDays, setTotalDays]         = useState<number>(state?.line ? state.line.totalDays : 30);
//   const [assignedAt, setAssignedAt]       = useState<string>(state?.line ? state.line.assignedAt.substring(0, 10) : "");
//   const [finalUser1, setFinalUser1]       = useState<string>(state?.line ? (state.line.finalUser1 ?? "") : "");
//   const [assignedSlots, setAssignedSlots] = useState<number>(state?.line ? state.line.assignedSlots : 1);

//   const [slotsDisabled, setSlotsDisabled] = useState<boolean>(false);

  
//   const [notes, setNotes] = useState<string>("");


//    // Estado de loading
//   const [loading, setLoading] = useState<boolean>(false);

//   // Si estamos en edición, no vamos a permitir cambiar “orderId ni createdAt ni totalAmount”.
//   // Sólo permitimos “mover” la línea a otro producto. Por tanto, el único campo que realmente
//   // usamos para PUT /updateSaleProduct es productId. El resto, aunque lo mostremos en pantalla,
//   // no se envía al backend.

//   const isEdit = Boolean(state?.line);

  // // Si es edición, podríamos mostrar un pequeño mensaje:
  // useEffect(() => {
  //   if (isEdit) {
  //     // Por ejemplo, en edición no dejamos tocar ciertos campos:
  //     // - Podrías deshabilitar customerId / priceType / totalDays / assignedAt / assignedSlots, etc.
  //     // - Sólo `productId` será editable.
  //     setNotes(""); // En edición no modificamos notas de la orden.
  //   }
  // }, [isEdit]);

//   // ------------ Función para cuando el usuario envía el formulario ------------
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!token) {
//       alert("No estás autenticado.");
//       return;
//     }

//       setLoading(true);

//     try {
//       if (isEdit && state.line) {
//         // ——— EDITAR LÍNEA ———
//         // Backend sólo permite cambiar el producto de una venta existente
//         // llamando a PUT /customer_products/update-product/:id
//         await updateSaleProduct(token, state.line.id, { productId });
//         // Una vez actualizado, redirigimos al listado de ventas:
//         navigate("/sales");
//       } else {
//         // ——— CREAR NUEVA VENTA ———
//         // Para crear la venta, debemos enviar exactamente lo que el backend espera en POST /add-sale:
//         // {
//         //   customerId,
//         //   productId,
//         //   priceType,
//         //   totalDays,
//         //   assignedAt: "YYYY-MM-DD",
//         //   finalUser1?,
//         //   finalUser2?,           // si no lo usas, lo dejamos undefined
//         //   assignedSlots,
//         //   notes?                 // aquí va la nota; el orden se crea automáticamente
//         // }
//         await createSale(token, {
//           customerId,
//           productId,
//           priceType: priceType as
//             | "perfil_directo"
//             | "completa_directo"
//             | "combo_directo"
//             | "completa_revendedor"
//             | "perfil_revendedor",
//           totalDays,
//           assignedAt,       // “YYYY-MM-DD”
//           finalUser1: finalUser1 || undefined,
//           finalUser2: undefined,
//           assignedSlots,
//           notes: notes || undefined
//         });
//         navigate("/sales");
//       }
//     } catch (err: any) {
//       console.error(err);
//       alert(err?.message ?? "Error al procesar la venta.");
//     }
//   };



//    // Detectar cambios en priceType o productId y auto‐asignar slots si hace falta
//    useEffect(() => {
//      if (
//        !isEdit &&
//        (priceType === "completa_directo" || priceType === "completa_revendedor") &&
//        productId > 0
//      ) {
//       setSlotsDisabled(true);
//        getProductById(token!, productId)
//          .then((product) => {
//            // defaultCapacity proviene de tu API
//            setAssignedSlots(product.productType.defaultCapacity);
//          })
//          .catch((err) => {
//            console.error("No se pudo obtener el producto:", err);
//           setSlotsDisabled(false);
//          });
//      } else {
//       setSlotsDisabled(false);
//      }
//    }, [priceType, productId, isEdit, token]);



//   return (
//     <div className="container mt-4 ">
//       <h2 className="mb-5">{isEdit ? "Cambiar producto de la Venta" : "Nueva Venta"}</h2>

//       <form onSubmit={handleSubmit}>
//         {/*** Cargamos algunos campos en read-only o hidden si es edición ***/}
//         {isEdit && state.line && (
//           <>

//             <div className="mb-3">
//               <label className="form-label">Cliente</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={`${state.line.customer.id}:${" "}${state.line.customer.firstName} ${state.line.customer.lastName} `}
//                 readOnly
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Price Type</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={state.line.priceType.replace("_", " ")}
//                 readOnly
//               />
//             </div>


            
//             <div className="mb-3">
//               <label className="form-label">Total de Días</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={state.line.totalDays}
//                 readOnly
//               />
//             </div>




//             <div className="mb-3">
//               <label className="form-label">Fecha Asignada</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={new Date(state.line.assignedAt)
//                   .toISOString()
//                   .substring(0, 10)}
//                 readOnly
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Slots Asignados</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={state.line.assignedSlots}
//                 readOnly
//               />
//             </div>
//           </>
//         )}

//         {/*** Campo productId: editable en ambos casos ***/}
//         <div className="mb-3">
//           <label className="form-label">Id del Producto</label>
//           <input
//             type="number"
//             className="form-control"
//             value={productId}
//             onChange={(e) => setProductId(Number(e.target.value))}
//             required
//           />
//           <small className="form-text text-muted">
//             En edición solo cambiarás el producto que fue asignado en la venta.
//           </small>
//         </div>

//         {/*** Cuando es nueva venta, mostramos todos los campos necesarios ***/}
//         {!isEdit && (
//           <>
//             <div className="mb-3">
//               <label className="form-label">Id del Cliente</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={customerId}
//                 onChange={(e) => setCustomerId(Number(e.target.value))}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Tipo de Precio</label>
//               <select
//                 className="form-select"
//                 value={priceType}
//                 onChange={(e) => setPriceType(e.target.value)}
//                 required
//               >
//                 {/* <option value="">Seleccione Tipo de Precio</option> */}
//                 <option value="perfil_directo">perfil_directo</option>
//                 <option value="completa_directo">completa_directo</option>
//                 <option value="combo_directo">combo_directo</option>
//                 <option value="completa_revendedor">completa_revendedor</option>
//                 <option value="perfil_revendedor">perfil_revendedor</option>
//               </select>
//             </div>



//             <div className="mb-3">
//   <label className="form-label">Total de Días</label>
//   <select
//     className="form-select"
//     value={totalDays}
//     onChange={(e) => setTotalDays(Number(e.target.value))}
//     required
//   >
//     {/* <option value="">Seleccione duración</option> */}
//     <option value={30}>30 días</option>
//     <option value={60}>60 días</option>
//     <option value={90}>3 meses</option>
//     <option value={180}>6 meses</option>
//     <option value={365}>1 año</option>
//   </select>
//   {/* <small className="form-text text-muted">
//     Selecciona la duración de la venta.
//   </small> */}
// </div>


//             <div className="mb-3">
//               <label className="form-label">Fecha de Asignación</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={assignedAt}
//                 onChange={(e) => setAssignedAt(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Usuario Final (opcional)</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={finalUser1}
//                 onChange={(e) => setFinalUser1(e.target.value)}
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Cantidad de Slots</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={assignedSlots}
//                 onChange={(e) => setAssignedSlots(Number(e.target.value))}
//                 required
//                 min={1}

//                 disabled={slotsDisabled}
//               />

//                {slotsDisabled && (
//          <small className="text-muted">
//            Slots ajustados automáticamente para este tipo de precio.
//          </small>
//        )}
    
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Notas (opcional)</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />
//             </div>
//           </>
//         )}
// <div className="d-flex gap-2 mt-2">


//         <button type="submit" className="btn btn-primary col-md-12 mb-5 w-100"
//           disabled={loading}>

//                {loading ? (
//                 <>
//                   <span
//                     className="spinner-border spinner-border-sm me-2"
//                     role="status"
//                     aria-hidden="true"
//                   ></span>
//                   Guardando...
//                 </>
//               ) : (
//                 <>
//                   <SaveIcon className="me-2" />
                
//                 </>
//               )}
       
       
//            {/* {<SaveIcon />} */}
          
//         </button>

//         </div>
   
//       </form>
//     </div>
//   );
// };

// export default SaleForm;



//segunda version

// src/pages/SaleForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createSale,
  deactivateCustomerProduct,
  updateSaleProduct
} from "../services/customerProductService";
import { getProductById } from "../services/productService";
import type { OrderLineDetail } from "../services/customerProductService";
import SaveIcon from "@mui/icons-material/Save";

const todayStr = new Date().toISOString().substring(0, 10); // "YYYY-MM-DD"


interface FormState {
  line?: OrderLineDetail;
  prefill?: {
     originalCpId: number;
    customer: { id: number; firstName: string; lastName: string; phone: string };
    product: { id: number; username: string; productTypeId: number };
    priceType: string;
    totalDays: number;
    assignedAt: string;
    finalUser1?: string;
    assignedSlots: number;
    renew: true;
  };
}

const SaleForm: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { line, prefill } = (location.state as FormState) || {};

  const isEdit = Boolean(line);
  const isRenew = Boolean(prefill?.renew);

  // Estados iniciales (edición > renovación > nuevos)
  const [customerId, setCustomerId] = useState<number>(
    line
      ? line.customer.id
      : prefill
      ? prefill.customer.id
      : 0
  );
  const [productId, setProductId] = useState<number>(
    line
      ? line.product.id
      : prefill
      ? prefill.product.id
      : 0
  );
  const [priceType, setPriceType] = useState<string>(
    line
      ? line.priceType
      : prefill
      ? prefill.priceType
      : "perfil_directo"
  );
  const [totalDays, setTotalDays] = useState<number>(
    line
      ? line.totalDays
      : prefill
      ? prefill.totalDays
      : 30
  );
  const [assignedAt, setAssignedAt] = useState<string>(
    line
      ? line.assignedAt.substring(0, 10)
      : prefill
      ? prefill.assignedAt.substring(0, 10)
      : todayStr
  );
  const [finalUser1, setFinalUser1] = useState<string>(
    line
      ? line.finalUser1 || ""
      : prefill
      ? prefill.finalUser1 || ""
      : ""
  );
  const [assignedSlots, setAssignedSlots] = useState<number>(
    line
      ? line.assignedSlots
      : prefill
      ? prefill.assignedSlots
      : 1
  );
  const [notes, setNotes] = useState<string>("");

  const [slotsDisabled, setSlotsDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Precarga cuando llega line (edición) o prefill (renovación)
  useEffect(() => {
    if (line) {
      // en edición solo cambio de producto
      setProductId(line.product.id);
    } else if (prefill) {
      setCustomerId(prefill.customer.id);
      setProductId(prefill.product.id);
      setPriceType(prefill.priceType);
      setTotalDays(prefill.totalDays);
      setAssignedAt(prefill.assignedAt);
      setFinalUser1(prefill.finalUser1 || "");
      setAssignedSlots(prefill.assignedSlots);
    }
  }, [line, prefill]);

  // Auto‐slots para tipos "completa"
  useEffect(() => {
    if (
      !isEdit &&
      (priceType === "completa_directo" || priceType === "completa_revendedor") &&
      productId > 0
    ) {
      setSlotsDisabled(true);
      getProductById(token!, productId)
        .then((product) =>
          setAssignedSlots(product.productType.defaultCapacity)
        )
        .catch(() => setSlotsDisabled(false));
    } else {
      setSlotsDisabled(false);
    }
  }, [priceType, productId, isEdit, token]);

  // Manejo de envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("No estás autenticado.");
      return;
    }

    setLoading(true);
    try {
      if (isEdit && line) {
        // EDICIÓN: solo cambiar producto
        await updateSaleProduct(token, line.id, { productId });
      } else {
        // CREACIÓN o RENOVACIÓN
  // Si es renovación, desactivamos el antiguo
  if (isRenew && prefill) {
    try {
      await deactivateCustomerProduct(token, prefill.originalCpId);
    } catch (err) {
      console.warn("No se pudo desactivar la venta anterior:", err);
    }
  }


// 2) Luego crear la nueva venta
        await createSale(token, {
          customerId,
          productId,
          priceType: priceType as any,
          totalDays,
          assignedAt,
          finalUser1: finalUser1 || undefined,
          finalUser2: undefined,
          assignedSlots,
          notes: notes || undefined
        });


      }
      navigate("/sales");
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Error al procesar la venta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 ">
      <h2 className="mb-5">
        {isEdit
          ? "Cambiar producto de la Venta"
          : isRenew
          ? "Renovar Venta"
          : "Nueva Venta"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* --- Campos de EDICIÓN --- */}
        {isEdit && line && (
          <>
            <div className="mb-3">
              <label className="form-label">Cliente</label>
              <input
                type="text"
                className="form-control"
                value={`${line.customer.id}: ${line.customer.firstName} ${line.customer.lastName}`}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tipo de Precio</label>
              <input
                type="text"
                className="form-control"
                value={line.priceType.replace("_", " ")}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Total de Días</label>
              <input
                type="text"
                className="form-control"
                value={line.totalDays}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha Asignada</label>
              <input
                type="text"
                className="form-control"
                value={new Date(line.assignedAt).toISOString().substring(0, 10)}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Slots Asignados</label>
              <input
                type="number"
                className="form-control"
                value={line.assignedSlots}
                readOnly
              />
            </div>
          </>
        )}

        {/* --- Campo común: producto siempre editable --- */}
        <div className="mb-3">
          <label className="form-label">Id del Producto</label>
          <input
            type="number"
            className="form-control"
            value={productId}
            onChange={(e) => setProductId(Number(e.target.value))}
            required
          />
        </div>

        {/* --- Campos de CREACIÓN / RENOVACIÓN --- */}
        {!isEdit && (
          <>
            <div className="mb-3">
              <label className="form-label">Id del Cliente</label>
              <input
                type="number"
                className="form-control"
                value={customerId}
                onChange={(e) => setCustomerId(Number(e.target.value))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tipo de Precio</label>
              <select
                className="form-select"
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                required
              >
                <option value="perfil_directo">perfil_directo</option>
                <option value="completa_directo">completa_directo</option>
                <option value="combo_directo">combo_directo</option>
                <option value="completa_revendedor">completa_revendedor</option>
                <option value="perfil_revendedor">perfil_revendedor</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Total de Días</label>
              <select
                className="form-select"
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                required
              >
                <option value={30}>30 días</option>
                <option value={60}>60 días</option>
                <option value={90}>3 meses</option>
                <option value={180}>6 meses</option>
                <option value={365}>1 año</option>
              </select>
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
              <label className="form-label">Usuario Final (opcional)</label>
              <input
                type="text"
                className="form-control"
                value={finalUser1}
                onChange={(e) => setFinalUser1(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Cantidad de Slots</label>
              <input
                type="number"
                className="form-control"
                value={assignedSlots}
                onChange={(e) => setAssignedSlots(Number(e.target.value))}
                required
                min={1}
                disabled={slotsDisabled}
              />
              {slotsDisabled && (
                <small className="text-muted">
                  Slots ajustados automáticamente para este tipo de precio.
                </small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Notas (opcional)</label>
              <input
                type="text"
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </>
        )}

        {/* --- Botón --- */}
        <div className="d-flex gap-2 mt-2">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Guardando...
              </>
            ) : (
              <SaveIcon className="me-2" />
            )}
            {isEdit
              ? ""
              : isRenew
              ? ""
              : ""}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;
