import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createProductTypeAdmin, getAllProductTypes, updateProductTypeAdmin } from "../../services/productTypesService";
import { CreateProductTypeDTO } from "../../services/productTypesService";
import SaveIcon from "@mui/icons-material/Save";

// import { ProductType } from "../../services/productTypesService";


interface Props {
  isEdit?: boolean;
}

const ProductTypeForm: React.FC<Props> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CreateProductTypeDTO>({
    name: "",
    defaultCapacity: 1,
  });

  useEffect(() => {
    if (isEdit && id && token) {
      (async () => {
        setLoading(true);
        try {
          const all = await getAllProductTypes(token);
          const existing = all.find((p) => p.id === +id);
          if (existing) {
            setFormData({ name: existing.name, defaultCapacity: existing.defaultCapacity });
          } else {
            alert("Tipo de producto no encontrado");
            navigate("/product-types");
          }
        } catch (err: any) {
          console.error(err);
          alert(`Error cargando: ${err.message}`);
          navigate("/product-types");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isEdit, id, token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "defaultCapacity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== "ADMIN") return alert("Solo administradores pueden hacer esto.");
    setLoading(true);
    try {
      if (!token) throw new Error("Sin token");
      if (isEdit && id) {
        await updateProductTypeAdmin(token, +id, formData);
      } else {
        await createProductTypeAdmin(token, formData);
      }
      navigate("/product-types");
    } catch (err: any) {
      console.error("save product type error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-3">{isEdit ? "Editar Tipo de Producto" : "Agregar Tipo de Producto"}</h1>

      <form onSubmit={handleSubmit}>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={role !== "ADMIN"}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Capacidad por defecto</label>
              <input
                name="defaultCapacity"
                type="number"
                className="form-control"
                value={formData.defaultCapacity}
                onChange={handleChange}
                min={0}
                required
                disabled={role !== "ADMIN"}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading || role !== "ADMIN"}>
              {loading ? "Guardando…" : <SaveIcon />}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ProductTypeForm;


//http://localhost:5173/product-types/new
//http://localhost:5173/product-types/edit/:id