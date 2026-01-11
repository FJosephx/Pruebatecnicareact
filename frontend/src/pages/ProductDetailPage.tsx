import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { getProduct } from "../api/products";
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

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { push } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProduct(Number(id));
        if (isMounted) {
          setProduct(data);
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

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAdd = () => {
    if (!product) {
      return;
    }
    addItem(product);
    push({ message: "Producto agregado al carrito", tone: "success" });
  };

  if (isLoading) {
    return (
      <section className="product-detail">
        <div className="product-detail__media skeleton" />
        <div className="product-detail__info">
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--line short" />
          <div className="skeleton skeleton--button" />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="empty-state">
        <h2 className="page__title">Producto</h2>
        <p className="alert alert--error">No se encontro el producto.</p>
        <Link to="/" className="button button--ghost">
          <FiArrowLeft /> Volver
        </Link>
      </section>
    );
  }

  return (
    <section className="product-detail">
      <div className="product-detail__media">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="product-detail__placeholder">{product.name.slice(0, 1).toUpperCase()}</div>
        )}
      </div>
      <div className="product-detail__info">
        <Link to="/" className="link-inline">
          <FiArrowLeft /> Volver a productos
        </Link>
        <h2 className="page__title">{product.name}</h2>
        <p className="product-detail__price">{formatPrice(product.price)}</p>
        <p className="product-detail__desc">
          Producto destacado de la coleccion mini ecommerce. Ideal para completar tu carrito.
        </p>
        <button type="button" className="button button--primary" onClick={handleAdd}>
          <FiPlus /> Agregar al carrito
        </button>
      </div>
    </section>
  );
};

export default ProductDetailPage;
