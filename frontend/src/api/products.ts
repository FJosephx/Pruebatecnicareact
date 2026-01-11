import { apiFetch } from "./client";
import { Product } from "../types/product";

export const getProducts = () => apiFetch<Product[]>("/products");
