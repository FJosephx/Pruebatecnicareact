import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductsPage from "../ProductsPage";
import { CartProvider } from "../../store/cart";

jest.mock("../../api/products", () => ({
  getProducts: jest.fn()
}));

const { getProducts } = jest.requireMock("../../api/products") as {
  getProducts: jest.Mock;
};

const renderPage = () =>
  render(
    <BrowserRouter>
      <CartProvider>
        <ProductsPage />
      </CartProvider>
    </BrowserRouter>
  );

describe("ProductsPage", () => {
  it("muestra productos del backend", async () => {
    getProducts.mockResolvedValueOnce([
      { id: 1, name: "Remera", price: 1000 },
      { id: 2, name: "Zapatillas", price: 2000 }
    ]);

    renderPage();

    expect(screen.getByText("Cargando productos...")).toBeInTheDocument();
    expect(await screen.findByText("Remera")).toBeInTheDocument();
    expect(screen.getByText("Zapatillas")).toBeInTheDocument();
  });

  it("muestra error si falla el fetch", async () => {
    getProducts.mockRejectedValueOnce(new Error("fallo"));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
