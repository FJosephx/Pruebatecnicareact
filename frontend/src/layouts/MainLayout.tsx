import { Outlet } from "react-router-dom";

const headerStyle: React.CSSProperties = {
  padding: "1.5rem 2rem",
  background: "#111827",
  color: "#f9fafb"
};

const mainStyle: React.CSSProperties = {
  padding: "2rem",
  maxWidth: "1100px",
  margin: "0 auto"
};

const MainLayout = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Mini ecommerce</h1>
      </header>
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
