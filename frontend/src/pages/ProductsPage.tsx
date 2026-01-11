import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiPlus } from "react-icons/fi";
import { getProducts } from "../api/products";
import { Product } from "../types/product";
import { useCart } from "../store/cart";
import { useToast } from "../store/toast";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { addItem } = useCart();
  const { push } = useToast();

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

  const handleAdd = (product: Product) => {
    addItem(product);
    push({ message: "Producto agregado al carrito", tone: "success" });
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const min = Number(minPrice);
    const max = Number(maxPrice);

    return products.filter((product) => {
      if (normalizedQuery && !product.name.toLowerCase().includes(normalizedQuery)) {
        return false;
      }

      if (minPrice && !Number.isNaN(min) && product.price < min) {
        return false;
      }

      if (maxPrice && !Number.isNaN(max) && product.price > max) {
        return false;
      }

      return true;
    });
  }, [products, query, minPrice, maxPrice]);

  if (isLoading) {
    return (
      <section>
        <h2 className="page__title">Productos</h2>
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_value, index) => (
            <div key={index} className="product-card product-card--skeleton">
              <div className="product-card__media skeleton" />
              <div className="product-card__body">
                <div className="skeleton skeleton--line" />
                <div className="skeleton skeleton--line short" />
                <div className="skeleton skeleton--button" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="page__title">Productos</h2>
        <p className="alert alert--error">Error: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <section className="empty-state">
        <h2 className="page__title">Productos</h2>
        <p>No hay productos disponibles por ahora.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="page__title">Productos</h2>
      <div className="filters">
        <label className="filters__field">
          Buscar
          <input
            className="input filters__input"
            type="text"
            placeholder="Nombre del producto"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="filters__field">
          Precio desde
          <input
            className="input filters__input"
            type="number"
            min={0}
            step={1}
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
        </label>
        <label className="filters__field">
          Precio hasta
          <input
            className="input filters__input"
            type="number"
            min={0}
            step={1}
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </label>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => {
            setQuery("");
            setMinPrice("");
            setMaxPrice("");
          }}
        >
          Limpiar
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No hay productos que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const initial = product.name.trim().charAt(0).toUpperCase();
            const imageSrc = product.image_url;
            return (
              <article key={product.id} className="product-card">
                <Link to={`/products/${product.id}`} className="product-card__media">
                  {imageSrc ? (
                    <img
                      className="product-card__image"
                      src={imageSrc}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <span>{initial || "P"}</span>
                  )}
                </Link>
                <div className="product-card__body">
                  <div>
                    <h3 className="product-card__title">{product.name}</h3>
                    <p className="product-card__price">{formatPrice(product.price)}</p>
                  </div>
                  <div className="product-card__actions">
                    <button type="button" className="button button--primary" onClick={() => handleAdd(product)}>
                      <FiPlus /> Agregar al carrito
                    </button>
                    <Link to={`/products/${product.id}`} className="button button--ghost">
                      Ver detalle <FiArrowRight />
                    </Link>
                  </div>
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
