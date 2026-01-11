import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { getProducts } from "../api/products";
import { Product } from "../types/product";
import { useCart } from "../store/cart";

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
        <h2 className="page__title">Productos</h2>
        <p className="alert alert--error">Error: {error}</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="page__title">Productos</h2>
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const initial = product.name.trim().charAt(0).toUpperCase();
            return (
              <article key={product.id} className="product-card">
                <div className="product-card__media">{initial || "P"}</div>
                <div className="product-card__body">
                  <div>
                    <h3 className="product-card__title">{product.name}</h3>
                    <p className="product-card__price">{formatPrice(product.price)}</p>
                  </div>
                  <button
                    type="button"
                    className="button button--primary"
                    onClick={() => addItem(product)}
                  >
                    <FiPlus /> Agregar al carrito
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
