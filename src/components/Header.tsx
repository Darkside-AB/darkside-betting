import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="nav">
        <div className="logo">
          Tips<span>Fabriken</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/stryktipset">
            Stryktipset
          </NavLink>

          <NavLink to="/europatipset">
            Europatipset
          </NavLink>

        </nav>
      </div>
    </header>
  );
};

export default Header;
