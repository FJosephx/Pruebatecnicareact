import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { getProduct, updateProduct } from "../api/products";
import { useAuth } from "../store/auth";
import { Product } from "../types/product";

type FormState = {
  name: string;
  price: string;
  image_url: string;
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(value);
};

const AdminEditProductPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    image_url: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => form.image_url, [form.image_url]);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProduct(Number(id));
        setProduct(data);
        setForm({
          name: data.name,
          price: data.price.toString(),
          image_url: data.image_url ?? ""
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperado");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (!user?.is_staff) {
    return (
      <section>
        <h2 className="page__title">Editar producto</h2>
        <p className="alert alert--error">No tenes permisos para administrar productos.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section>
        <h2 className="page__title">Editar producto</h2>
        <p>Cargando producto...</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="empty-state">
        <h2 className="page__title">Editar producto</h2>
        <p className="alert alert--error">No se encontro el producto.</p>
        <Link to="/admin/products" className="button button--ghost">
          <FiArrowLeft /> Volver
        </Link>
      </section>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const priceValue = Number(form.price);
    if (!form.name.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      setError("Completa nombre y precio valido.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProduct({
        id: product.id,
        name: form.name.trim(),
        price: priceValue,
        image_url: form.image_url.trim()
      });
      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section>
      <div className="detail-header">
        <Link to="/admin/products" className="link-inline">
          <FiArrowLeft /> Volver al panel
        </Link>
        <h2 className="page__title">Editar producto</h2>
      </div>

      <div className="detail-layout">
        <div className="detail-preview">
          {previewUrl ? (
            <img src={previewUrl} alt={form.name} />
          ) : (
            <div className="product-detail__placeholder">{form.name.slice(0, 1).toUpperCase()}</div>
          )}
          {previewUrl && (
            <p className="preview-caption">Preview: {formatPrice(Number(form.price || 0))}</p>
          )}
        </div>

        <form className="detail-form" onSubmit={handleSubmit}>
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
              <FiSave /> {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
          {error && <p className="alert alert--error">Error: {error}</p>}
        </form>
      </div>
    </section>
  );
};

export default AdminEditProductPage;
