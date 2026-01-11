import { Link, Outlet } from "react-router-dom";
import { useCart } from "../store/cart";

const headerStyle: React.CSSProperties = {
  padding: "1.5rem 2rem",
  background: "#111827",
  color: "#f9fafb"
};

const headerContentStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  maxWidth: "1100px",
  margin: "0 auto"
};

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  alignItems: "center"
};

const linkStyle: React.CSSProperties = {
  color: "#f9fafb",
  textDecoration: "none",
  fontWeight: 600
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "1.5rem",
  height: "1.5rem",
  padding: "0 0.4rem",
  borderRadius: "999px",
  background: "#f59e0b",
  color: "#111827",
  fontSize: "0.8rem",
  fontWeight: 700
};

const mainStyle: React.CSSProperties = {
  padding: "2rem",
  maxWidth: "1100px",
  margin: "0 auto"
};

const MainLayout = () => {
  const { itemCount } = useCart();

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Mini ecommerce</h1>
          <nav style={navStyle}>
            <Link to="/" style={linkStyle}>
              Productos
            </Link>
            <Link to="/cart" style={linkStyle}>
              Carrito
              {itemCount > 0 && (
                <span style={{ marginLeft: "0.5rem" }}>
                  <span style={badgeStyle}>{itemCount}</span>
                </span>
              )}
            </Link>
            <Link to="/admin/products" style={linkStyle}>
              Panel
            </Link>
          </nav>
        </div>
      </header>
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
