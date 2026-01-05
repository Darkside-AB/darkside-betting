import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Coupon from "../features/coupon/Coupon";
import Login from "../pages/Login";
import ProtectedRoute from "../auth/ProtectedRoute";

function App() {
  return (
    <>
      <Header />

      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to="/europatipset" replace />}
          />

          <Route
            path="/:couponType"
            element={
              <ProtectedRoute>
                <Coupon />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
