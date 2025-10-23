import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllProductTypes } from "../../services/productTypesService";
import { deleteProductTypeAdmin } from "../../services/productTypesService";
import { ProductType } from "../../services/productTypesService";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

const ProductTypes: React.FC = () => {
  const { token, role } = useAuth();
  const [items, setItems] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getAllProductTypes(token);
        setItems(data);
      } catch (err: any) {
        console.error("getAllProductTypes error:", err);
        alert(`Error obteniendo tipos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (role !== "ADMIN") return;
    if (!window.confirm("¿Seguro que querés eliminar este tipo de producto?")) return;

    try {
      if (!token) throw new Error("Sin token");
      await deleteProductTypeAdmin(token, id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error("deleteProductType error:", err);
      alert(`No se pudo eliminar: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Tipos de Producto</h1>
        <div>
          <button
            className="btn btn-success"
            onClick={() => navigate("/product-types/new")}
            disabled={role !== "ADMIN"}
            title="Nuevo tipo"
          >
            <AddIcon /> Nuevo
          </button>
        </div>
      </div>

      <div className="table-responsive shadow rounded">
        <table className="table table-hover mb-0">
          <thead className="table-active small">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th className="text-center">Capacidad por defecto</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td className="text-center">{t.defaultCapacity}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-secondary border-0 me-2"
                    onClick={() => navigate(`/product-types/edit/${t.id}`)}
                    disabled={role !== "ADMIN"}
                    title="Editar"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary border-0"
                    onClick={() => handleDelete(t.id)}
                    disabled={role !== "ADMIN"}
                    title="Eliminar"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && <div className="alert alert-info mt-3">No hay tipos registrados.</div>}
    </div>
  );
};

export default ProductTypes;


//http://localhost:5173/product-types