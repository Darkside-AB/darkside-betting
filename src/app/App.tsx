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

          <Route
            path="/darkside-betting"
            element={<Navigate to="/darkside-betting/europatipset" />}
          />

          <Route
            path="/darkside-betting/:couponType"
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
