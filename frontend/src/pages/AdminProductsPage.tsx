import { FormEvent, useEffect, useMemo, useState } from "react";
import { createProduct, getProducts, updateProduct } from "../api/products";
import { Product } from "../types/product";

type FormState = {
  id?: number;
  name: string;
  price: string;
};

const formContainerStyle: React.CSSProperties = {
  background: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
  marginBottom: "2rem"
};

const formRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  marginBottom: "1rem"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.8rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db"
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  alignItems: "center"
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "0.6rem 1.1rem",
  borderRadius: "8px",
  border: "none",
  background: "#111827",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 600
};

const ghostButtonStyle: React.CSSProperties = {
  padding: "0.6rem 1.1rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
  fontWeight: 600
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)"
};

const cellStyle: React.CSSProperties = {
  padding: "0.9rem",
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left"
};

const actionButtonStyle: React.CSSProperties = {
  padding: "0.35rem 0.7rem",
  borderRadius: "6px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  cursor: "pointer"
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(value);
};

const emptyForm = (): FormState => ({ name: "", price: "" });

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const priceValue = Number(form.price);
    if (!form.name.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      setError("Completa nombre y precio valido.");
      setIsSaving(false);
      return;
    }

    try {
      if (form.id) {
        await updateProduct({ id: form.id, name: form.name.trim(), price: priceValue });
      } else {
        await createProduct({ name: form.name.trim(), price: priceValue });
      }
      setForm(emptyForm());
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({ id: product.id, name: product.name, price: product.price.toString() });
  };

  const handleCancel = () => {
    setForm(emptyForm());
  };

  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Panel de productos</h2>
      <form style={formContainerStyle} onSubmit={handleSubmit}>
        <div style={formRowStyle}>
          <label>
            Nombre
            <input
              style={inputStyle}
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label>
            Precio
            <input
              style={inputStyle}
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            />
          </label>
        </div>
        <div style={buttonRowStyle}>
          <button type="submit" style={primaryButtonStyle} disabled={isSaving}>
            {isEditing ? "Actualizar producto" : "Crear producto"}
          </button>
          {isEditing && (
            <button type="button" style={ghostButtonStyle} onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <p style={{ color: "#b91c1c" }}>Error: {error}</p>}
      {isLoading ? (
        <p>Cargando productos...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Producto</th>
              <th style={cellStyle}>Precio</th>
              <th style={cellStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={cellStyle}>{product.name}</td>
                <td style={cellStyle}>{formatPrice(product.price)}</td>
                <td style={cellStyle}>
                  <button type="button" style={actionButtonStyle} onClick={() => handleEdit(product)}>
                    Editar
                  </button>
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
