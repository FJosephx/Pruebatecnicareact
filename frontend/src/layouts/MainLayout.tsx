import { Link, Outlet } from "react-router-dom";
import { FiPackage, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../store/cart";

const MainLayout = () => {
  const { itemCount } = useCart();

  return (
    <div className="app">
      <header className="app__header">
        <div className="container nav">
          <div className="brand">
            <span className="brand__badge">ME</span>
            Mini ecommerce
          </div>
          <nav className="nav__links">
            <Link to="/" className="nav__link">
              <FiPackage /> Productos
            </Link>
            <Link to="/cart" className="nav__link">
              <FiShoppingCart /> Carrito
              {itemCount > 0 && <span className="nav__badge">{itemCount}</span>}
            </Link>
          </nav>
        </div>
      </header>
      <main className="page">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
