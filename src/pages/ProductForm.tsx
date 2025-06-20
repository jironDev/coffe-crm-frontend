import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    getAllSuppliers
} from '../services/supplierService';
import {
    createProduct,
    updateProduct,
    getProductById
} from '../services/productService';
import type { Supplier } from '../models/Supplier';
import SaveIcon from '@mui/icons-material/Save';
import { productTypeNames } from '../components/productTypeNames';



interface FormState {
    supplierId?: number | null;
    productTypeId: number;
    username: string;
    password: string;
    startDate: string;
    endDate: string;
    observations: string;
    pricePurchase: string;
}

const ProductForm: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => {
    const { id } = useParams<{ id: string }>();
    const { token, role } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [form, setForm] = useState<FormState>({
        supplierId: null,
        productTypeId: 1,
        username: '',
        password: '',
        startDate: '',
        endDate: '',
        observations: '',
        pricePurchase: ''
    });

    // carga proveedores para el select
    useEffect(() => {
        (async () => {
            if (!token) return;
            try {
                setSuppliers(await getAllSuppliers(token, ''));
            } catch (e) {
                console.error(e);
            }
        })();
    }, [token]);





    // precarga datos si edit
    useEffect(() => {
        if (isEdit && id && token) {
            (async () => {
                setLoading(true);
                try {
                    const p = await getProductById(token, +id);
                    setForm({
                        supplierId: p.supplier?.id ?? null,
                        productTypeId: p.productType.id,
                        username: p.username,
                        password: p.password,
                        startDate: p.startDate.slice(0, 10),
                        endDate: p.endDate.slice(0, 10),
                        observations: p.observations || '',
                        pricePurchase: String(p.pricePurchase)
                    });
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [isEdit, id, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]:
                name === 'supplierId' || name === 'productTypeId'
                    ? (value ? parseInt(value) : null)
                    : name === 'pricePurchase'
                        ? value
                        : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // preparar payload
        const payload = {
            ...form,
            pricePurchase: parseFloat(form.pricePurchase) || 0
        };
        try {
            if (isEdit && id) {
                await updateProduct(token!, +id, payload);
            } else {
                await createProduct(token!, payload);
            }
            navigate('/products');
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h1>
            <div className="mb-5"></div>

            <form onSubmit={handleSubmit}>
                {loading ? <p>Cargando…</p> : (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Usuario</label>
                            <input
                                name="username"
                                className="form-control"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={form.password}
                                onChange={handleChange}
                                required={!isEdit}
                            />
                        </div>


                        <div className="mb-3">
                            <label className="form-label">Tipo de Producto</label>
                            <select
                                name="productTypeId"
                                className="form-select"
                                value={form.productTypeId}
                                onChange={handleChange}
                                required
                            >
                                {Object.entries(productTypeNames).map(([id, name]) => (
                                    <option key={id} value={Number(id)}>{id}: {name}</option>
                                ))}
                            </select>
                        </div>


                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Inicio</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    className="form-control"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Fin</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    className="form-control"
                                    value={form.endDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Precio Compra</label>
                                <input
                                    type="number"
                                    name="pricePurchase"
                                    className="form-control"
                                    value={form.pricePurchase}
                                    onChange={handleChange}
                                    required
                                />
                            </div>




                            <div className="mb-3">
                                <label className="form-label">Proveedor</label>
                                <select
                                    name="supplierId"
                                    className="form-select"
                                    value={form.supplierId ?? ''}
                                    onChange={handleChange}
                                >
                                    <option value="">Escoge Uno</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.id} — {s.name}</option>
                                    ))}
                                </select>
                            </div>



                            <div className="col-md-12 mb-3">
                                <label className="form-label">Observaciones</label>
                                <textarea
                                    name="observations"
                                    className="form-control"
                                    value={form.observations}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button className="btn btn-primary col-md-12 w-100" disabled={loading || role !== 'ADMIN'}>
                            {loading ? 'Guardando…' : <SaveIcon />}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};

export default ProductForm;
