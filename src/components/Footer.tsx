import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>MuebleClick</h5>
            <p>Tu plataforma de confianza para encontrar los mejores muebles.</p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="bi bi-whatsapp fs-5"></i>
              </a>
            </div>
          </Col>
          
          <Col md={4}>
            <h5>Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white text-decoration-none">Inicio</a></li>
              <li><a href="/nosotros" className="text-white text-decoration-none">Nosotros</a></li>
              <li><a href="/contacto" className="text-white text-decoration-none">Contacto</a></li>
              <li><a href="/terminos" className="text-white text-decoration-none">Términos y Condiciones</a></li>
              <li><a href="/privacidad" className="text-white text-decoration-none">Política de Privacidad</a></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5>Contacto</h5>
            <p><i className="bi bi-envelope"></i> info@muebleclick.com</p>
            <p><i className="bi bi-phone"></i> +52 123 456 7890</p>
            <p><i className="bi bi-geo-alt"></i> Ciudad de México, México</p>
            <div className="mt-3">
              <h6>Métodos de Pago</h6>
              <div className="d-flex gap-2">
                <i className="bi bi-credit-card fs-4"></i>
                <i className="bi bi-paypal fs-4"></i>
                <i className="bi bi-bank fs-4"></i>
              </div>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4 bg-white" />
        
        <div className="text-center">
          <p>&copy; {currentYear} MuebleClick. Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  );
};
