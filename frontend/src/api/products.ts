import { apiFetch } from "./client";
import { Product } from "../types/product";

export type ProductPayload = {
  id?: number;
  name: string;
  price: number;
};

export const getProducts = () => apiFetch<Product[]>("/products");

export const createProduct = (payload: ProductPayload) =>
  apiFetch<Product>("/products/create", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const updateProduct = (payload: ProductPayload & { id: number }) =>
  apiFetch<Product>("/products/update", {
    method: "POST",
    body: JSON.stringify(payload)
  });
