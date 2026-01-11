import { ChangeEvent, useState } from "react";
import { FiSave, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { saveCart } from "../api/cart";
import { useCart } from "../store/cart";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(value);
};

const CartPage = () => {
  const { items, updateQuantity, removeItem, clear } = useCart();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleQuantityChange = (id: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    if (Number.isNaN(nextValue)) {
      return;
    }
    updateQuantity(id, nextValue);
  };

  const handleSaveCart = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    setError(null);

    try {
      await saveCart({
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      });
      setSaveMessage("Carrito guardado correctamente");
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  if (items.length === 0) {
    return (
      <section>
        <h2 className="page__title">Carrito</h2>
        {saveMessage && <p className="alert alert--success">{saveMessage}</p>}
        <p>
          Tu carrito esta vacio. <Link to="/">Volver a productos</Link>.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="page__title">Carrito</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td data-label="Producto">{item.name}</td>
              <td data-label="Precio">{formatPrice(item.price)}</td>
              <td data-label="Cantidad">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={handleQuantityChange(item.id)}
                  className="input"
                />
              </td>
              <td data-label="Subtotal">{formatPrice(item.price * item.quantity)}</td>
              <td data-label="Acciones">
                <button
                  type="button"
                  className="button button--danger"
                  onClick={() => removeItem(item.id)}
                >
                  <FiTrash2 /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-actions">
        <div>
          <button type="button" className="button button--primary" onClick={handleSaveCart} disabled={isSaving}>
            <FiSave /> {isSaving ? "Guardando..." : "Guardar carrito"}
          </button>
          {saveMessage && <p className="alert alert--success">{saveMessage}</p>}
          {error && <p className="alert alert--error">Error: {error}</p>}
        </div>
        <strong>Total: {formatPrice(total)}</strong>
      </div>
    </section>
  );
};

export default CartPage;
