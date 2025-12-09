import React from "react";
import "./HeaderFooter.css";

export const FooterComponent = () => {
  return (
    <footer className="footer-kawaii">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} Mi Aplicación | Todos los derechos reservados nyejejej
        </p>
        <div className="footer-links">
          <a href="#">Privacidad</a>
          <span>|</span>
          <a href="#">Términos</a>
          <span>|</span>
          <a href="#">Contacto</a>
        </div>
      </div>
    </footer>
  );
};
