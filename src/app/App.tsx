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
            <h1>Welcome to Darkside Betting</h1>
            <p>Where you can play with balls but of course also lose them</p>
            <button className="btn">Log in to get AI benefits</button>
          </div>

          <div className="stats">
            <div className="stat">
              <h3>13</h3>
              <span>Events</span>
            </div>
            <div className="stat">
              <h3>1 / X / 2</h3>
              <span>AI-Powered</span>
            </div>
            <div className="stat">
              <h3>35%</h3>
              <span>winning*</span>
            </div>
          </div>
        </section>
        <Coupon />
      </main>
      <Footer />
    </>
  );
}
export default App;
