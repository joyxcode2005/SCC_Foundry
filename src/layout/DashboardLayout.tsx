import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--cream)",
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
      }}>
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "48px 48px",
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}