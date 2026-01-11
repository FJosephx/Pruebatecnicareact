import { apiFetch } from "./client";
import { Product } from "../types/product";

export type ProductPayload = {
  id?: number;
  name: string;
  price: number;
  image_url?: string;
  image_file?: File | null;
};

const buildBody = (payload: ProductPayload) => {
  if (payload.image_file) {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("price", payload.price.toString());
    if (payload.image_url) {
      formData.append("image_url", payload.image_url);
    }
    if (payload.id) {
      formData.append("id", payload.id.toString());
    }
    formData.append("image_file", payload.image_file);
    return formData;
  }

  return JSON.stringify(payload);
};

export const getProducts = () => apiFetch<Product[]>("/products");

export const getProduct = (id: number) => apiFetch<Product>(`/products/${id}`);

export const createProduct = (payload: ProductPayload) =>
  apiFetch<Product>("/products/create", {
    method: "POST",
    body: buildBody(payload)
  });

export const updateProduct = (payload: ProductPayload & { id: number }) =>
  apiFetch<Product>("/products/update", {
    method: "POST",
    body: buildBody(payload)
  });

export const deleteProduct = (id: number) =>
  apiFetch<{ detail: string }>("/products/delete", {
    method: "POST",
    body: JSON.stringify({ id })
  });
