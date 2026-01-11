import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminEditProductPage from "./pages/AdminEditProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/products/:id/edit" element={<AdminEditProductPage />} />
      </Route>
    </Routes>
  );
};

export default App;
