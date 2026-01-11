import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import AdminProductsPage from "./pages/AdminProductsPage";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
