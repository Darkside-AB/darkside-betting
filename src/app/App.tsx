import { Routes, Route, Navigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Coupon from "../features/coupon/Coupon";
import "./index.css";

function App() {
  return (
    <>
      <Header />

      <main className="container">
        <section className="hero container">
          <div>
            <h1>Välkommen till Tipsfabriken</h1>
            <p>Ett verktyg för att generera rader mot sannolikhet och att sätta 13 rätt hos Svenska Spel</p>
            <p>“Not affiliated with Svenska Spel yet”</p>
            <Link to="/darkside-betting/stryktipset">
              <button className="btn btn-stryktipset">Stryktipset</button>
            </Link>
            <Link to="/darkside-betting/europatipset">
              <button className="btn btn-europatipset">Europatipset</button>
            </Link>
          </div>

          {/* Buttons for navigation */}
          <div className="navigation-buttons">
          </div>
        </section>

        {/* ROUTED CONTENT */}
        <Routes>
          {/* Redirect if visiting /darkside-betting directly */}
          <Route
            path="/darkside-betting"
            element={<Navigate to="/darkside-betting/europatipset" />}
          />

          {/* Route to match /darkside-betting/:couponType */}
          <Route
            path="/darkside-betting/:couponType"
            element={<Coupon />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
