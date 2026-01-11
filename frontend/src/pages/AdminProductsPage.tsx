import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../api/products";
import { useAuth } from "../store/auth";
import { Product } from "../types/product";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(value);
};

type FormState = {
  id?: number;
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
  const [isEditing, setIsEditing] = useState(false);
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

  const validateForm = () => {
    const priceValue = Number(form.price);
    if (!form.name.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      setError("Completa nombre y precio valido.");
      return null;
    }
    return priceValue;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const priceValue = validateForm();
    if (priceValue === null) {
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && form.id) {
        await updateProduct({
          id: form.id,
          name: form.name.trim(),
          price: priceValue,
          image_url: form.image_url.trim()
        });
      } else {
        await createProduct({
          name: form.name.trim(),
          price: priceValue,
          image_url: form.image_url.trim()
        });
      }
      setForm(initialForm);
      setIsEditing(false);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      image_url: product.image_url ?? ""
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setIsEditing(false);
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
      <form className="admin-card" onSubmit={handleSubmit}>
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
            <FiPlus /> {isSaving ? "Guardando..." : isEditing ? "Actualizar producto" : "Crear producto"}
          </button>
          {isEditing && (
            <button type="button" className="button button--ghost" onClick={handleCancel}>
              Cancelar
            </button>
          )}
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
                    <button type="button" className="button button--ghost" onClick={() => handleEdit(product)}>
                      <FiEdit2 /> Editar
                    </button>
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
