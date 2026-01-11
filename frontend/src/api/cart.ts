import { apiFetch } from "./client";

export type CartItemPayload = {
  product_id: number;
  quantity: number;
};

export type CartPayload = {
  items: CartItemPayload[];
};

export type CartResponse = {
  id: number;
  items: CartItemPayload[];
};

export const saveCart = (payload: CartPayload) =>
  apiFetch<CartResponse>("/cart", {
    method: "POST",
    body: JSON.stringify(payload)
  });
