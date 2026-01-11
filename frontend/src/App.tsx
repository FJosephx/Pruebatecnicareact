import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProductsPage from "./pages/ProductsPage";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProductsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
