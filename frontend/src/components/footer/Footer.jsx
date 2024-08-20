import React from "react";
import "./footer.css";
import {
  AiFillFacebook,
  AiFillTwitterSquare,
  AiFillInstagram,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-info">
          <h2>Defence Research and Development Organisation</h2>
          <p>
            &copy; 2024 DRDO. All rights reserved. | Developed by <a href="https://www.linkedin.com/in/ansh-varma/" target="_blank" rel="noopener noreferrer">Ansh Varma</a>
          </p>
        </div>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <AiFillFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <AiFillTwitterSquare />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <AiFillInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
