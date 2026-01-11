import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { createProduct, deleteProduct, getProducts } from "../api/products";
import { useAuth } from "../store/auth";
import { Product } from "../types/product";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

type FormState = {
  name: string;
  price: string;
  image_url: string;
};

const initialForm: FormState = {
  name: "",
  price: "",
  image_url: ""
};

const AdminProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const priceValue = Number(form.price);
    if (!form.name.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      setError("Completa nombre y precio valido.");
      return;
    }

    setIsSaving(true);
    try {
      await createProduct({
        name: form.name.trim(),
        price: priceValue,
        image_url: form.image_url.trim()
      });
      setForm(initialForm);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar producto?")) {
      return;
    }

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  if (!user?.is_staff) {
    return (
      <section>
        <h2 className="page__title">Panel de productos</h2>
        <p className="alert alert--error">No tenes permisos para administrar productos.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="page__title">Panel de productos</h2>
      <form className="admin-card" onSubmit={handleCreate}>
        <label className="admin-card__field">
          Nombre
          <input
            className="input admin-card__input"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        </label>
        <label className="admin-card__field">
          Precio
          <input
            className="input admin-card__input"
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
          />
        </label>
        <label className="admin-card__field">
          Imagen (URL)
          <input
            className="input admin-card__input"
            value={form.image_url}
            onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
          />
        </label>
        <div className="admin-card__actions">
          <button type="submit" className="button button--primary" disabled={isSaving}>
            <FiPlus /> {isSaving ? "Creando..." : "Crear producto"}
          </button>
        </div>
        {error && <p className="alert alert--error">Error: {error}</p>}
      </form>

      {isLoading ? (
        <p>Cargando productos...</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td data-label="Producto">{product.name}</td>
                <td data-label="Precio">{formatPrice(product.price)}</td>
                <td data-label="Acciones">
                  <div className="admin-actions">
                    <Link to={`/admin/products/${product.id}/edit`} className="button button--ghost">
                      <FiEdit2 /> Editar
                    </Link>
                    <button type="button" className="button button--danger" onClick={() => handleDelete(product.id)}>
                      <FiTrash2 /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default AdminProductsPage;
