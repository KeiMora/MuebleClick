import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { total_items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <BootstrapNavbar 
      style={{ 
        background: 'var(--primary-gradient)',
        backgroundColor: 'var(--primary-color)',
        color: 'white'
      }}
      variant="dark"
      expand="lg" 
      expanded={expanded}
      onToggle={setExpanded}
      sticky="top"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" onClick={handleNavClick} style={{ color: 'white' }}>
          <i className="bi bi-shop"></i> MuebleClick
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" onClick={handleNavClick} style={{ color: 'white' }}>
              <i className="bi bi-house"></i> Inicio
            </Nav.Link>
            
            <Nav.Link as={Link} to="/cart" onClick={handleNavClick} className="position-relative" style={{ color: 'white' }}>
              <i className="bi bi-cart"></i> Carrito
              {total_items > 0 && (
                <Badge 
                  style={{ 
                    backgroundColor: 'var(--accent-color)',
                    color: 'white'
                  }}
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {total_items}
                </Badge>
              )}
            </Nav.Link>
            
            <Nav.Link as={Link} to="/wishlist" onClick={handleNavClick} style={{ color: 'white' }}>
              <i className="bi bi-heart"></i> Lista de Deseos
            </Nav.Link>
            
            <Nav.Link as={Link} to="/agregar-producto" onClick={handleNavClick} style={{ color: 'white' }}>
              <i className="bi bi-plus-circle"></i> Agregar Producto
            </Nav.Link>
            
            <Nav.Link as={Link} to="/analisis-ventas" onClick={handleNavClick} style={{ color: 'white' }}>
              <i className="bi bi-graph-up"></i> Análisis de Ventas
            </Nav.Link>
            {isAuthenticated ? (
              <NavDropdown title={<><i className="bi bi-person"></i> {user?.nombre}</>} id="basic-nav-dropdown" style={{ color: 'white' }}>
                <NavDropdown.Item as={Link} to="/profile" onClick={handleNavClick}>
                  <i className="bi bi-person"></i> Mi Perfil
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders" onClick={handleNavClick}>
                  <i className="bi bi-receipt"></i> Mis Pedidos
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={handleNavClick} style={{ color: 'white' }}>
                  <i className="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={handleNavClick} style={{ color: 'white' }}>
                  <i className="bi bi-person-plus"></i> Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};
