import { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../store/cart";

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

const inputStyle: React.CSSProperties = {
  width: "70px",
  padding: "0.35rem 0.5rem",
  borderRadius: "6px",
  border: "1px solid #d1d5db"
};

const buttonStyle: React.CSSProperties = {
  padding: "0.4rem 0.7rem",
  borderRadius: "6px",
  border: "none",
  background: "#ef4444",
  color: "#ffffff",
  cursor: "pointer"
};

const summaryStyle: React.CSSProperties = {
  marginTop: "1.5rem",
  display: "flex",
  justifyContent: "flex-end"
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(value);
};

const CartPage = () => {
  const { items, updateQuantity, removeItem } = useCart();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleQuantityChange = (id: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    if (Number.isNaN(nextValue)) {
      return;
    }
    updateQuantity(id, nextValue);
  };

  if (items.length === 0) {
    return (
      <section>
        <h2 style={{ marginTop: 0 }}>Carrito</h2>
        <p>
          Tu carrito esta vacio. <Link to="/">Volver a productos</Link>.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Carrito</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>Producto</th>
            <th style={cellStyle}>Precio</th>
            <th style={cellStyle}>Cantidad</th>
            <th style={cellStyle}>Subtotal</th>
            <th style={cellStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={cellStyle}>{item.name}</td>
              <td style={cellStyle}>{formatPrice(item.price)}</td>
              <td style={cellStyle}>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={handleQuantityChange(item.id)}
                  style={inputStyle}
                />
              </td>
              <td style={cellStyle}>{formatPrice(item.price * item.quantity)}</td>
              <td style={cellStyle}>
                <button type="button" style={buttonStyle} onClick={() => removeItem(item.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={summaryStyle}>
        <strong>Total: {formatPrice(total)}</strong>
      </div>
    </section>
  );
};

export default CartPage;
