import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLinkClick }) => {
  return (
    <nav className="navbarr">
      <h1 className="logo">
        <span className="logo-e m-3">E -</span>WASTE
      </h1>
      <ul className="nav-links">
        <li>
          <a href="#home" onClick={() => onLinkClick("home")}>
            Home
          </a>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <a href="#recycling" onClick={() => onLinkClick("recycling")}>
            Recycling
          </a>
        </li>
        <li>
          <a href="#advantages" onClick={() => onLinkClick("advantages")}>
            Advantages
          </a>
        </li>
        <li>
          <a href="#semiconductors" onClick={() => onLinkClick("semiconductors")}>
            Semiconductors
          </a>
        </li>
        <li>
          <a href="#about" onClick={() => onLinkClick("about")}>
            About
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
