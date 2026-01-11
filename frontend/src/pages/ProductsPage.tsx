import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { Product } from "../types/product";
import { useCart } from "../store/cart";

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1rem"
};

const cardStyle: React.CSSProperties = {
  padding: "1rem",
  borderRadius: "12px",
  background: "#ffffff",
  boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem"
};

const buttonStyle: React.CSSProperties = {
  marginTop: "auto",
  padding: "0.6rem 0.9rem",
  background: "#111827",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(value);
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error inesperado");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return (
      <div>
        <h2 style={{ marginTop: 0 }}>Productos</h2>
        <p style={{ color: "#b91c1c" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Productos</h2>
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div style={gridStyle}>
          {products.map((product) => (
            <article key={product.id} style={cardStyle}>
              <div>
                <h3 style={{ margin: "0 0 0.25rem" }}>{product.name}</h3>
                <p style={{ margin: 0, color: "#4b5563" }}>
                  {formatPrice(product.price)}
                </p>
              </div>
              <button type="button" style={buttonStyle} onClick={() => addItem(product)}>
                Agregar al carrito
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
