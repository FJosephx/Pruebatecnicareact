import { apiFetch } from "./client";
import { Product } from "../types/product";

export type ProductPayload = {
  id?: number;
  name: string;
  price: number;
  image_url?: string;
};

export const getProducts = () => apiFetch<Product[]>("/products");

export const createProduct = (payload: ProductPayload) =>
  apiFetch<Product>("/products/create", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const deleteProduct = (id: number) =>
  apiFetch<{ detail: string }>("/products/delete", {
    method: "POST",
    body: JSON.stringify({ id })
  });
