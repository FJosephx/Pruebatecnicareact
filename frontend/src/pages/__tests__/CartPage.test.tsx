import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CartPage from "../CartPage";
import { CartProvider } from "../../store/cart";

jest.mock("../../api/cart", () => ({
  saveCart: jest.fn(() => Promise.resolve({ id: 1, items: [] }))
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </BrowserRouter>
  );

describe("CartPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("muestra carrito vacio", () => {
    renderPage();
    expect(screen.getByText(/Tu carrito esta vacio/)).toBeInTheDocument();
  });

  it("permite editar cantidad y guardar", async () => {
    localStorage.setItem(
      "mini-ecommerce-cart",
      JSON.stringify([{ id: 1, name: "Remera", price: 1000, quantity: 1 }])
    );

    renderPage();

    const input = screen.getByDisplayValue("1");
    fireEvent.change(input, { target: { value: "2" } });

    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    expect(screen.getByText("Guardar carrito")).toBeInTheDocument();
  });
});
