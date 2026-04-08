import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { WishlistItem, Producto } from '../types';

export const Wishlist: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const loadWishlist = async () => {
      try {
        setLoading(true);
        // Simulación de carga - en producción usaríamos la API
        const mockWishlist: WishlistItem[] = [];
        setWishlistItems(mockWishlist);
      } catch (err) {
        setError('Error al cargar la lista de deseos');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [isAuthenticated]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const handleAddToCart = (producto: Producto) => {
    addItem(producto, 1);
    // Eliminar de la lista de deseos
    setWishlistItems(prev => prev.filter(item => item.id_producto !== producto.id_producto));
  };

  const handleRemoveFromWishlist = (idProducto: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto de tu lista de deseos?')) {
      setWishlistItems(prev => prev.filter(item => item.id_producto !== idProducto));
    }
  };

  const handleMoveAllToCart = () => {
    if (window.confirm('¿Agregar todos los productos al carrito?')) {
      wishlistItems.forEach(item => {
        addItem(item.producto, 1);
      });
      setWishlistItems([]);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="bi bi-lock text-muted" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-4">Inicia sesión para ver tu lista de deseos</h3>
          <p className="text-muted">Guarda tus productos favoritos y cómpralos cuando quieras.</p>
          <Button variant="primary" size="lg" href="/login">
            <i className="bi bi-box-arrow-in-right"></i> Iniciar Sesión
          </Button>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando lista de deseos...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-heart-fill text-danger"></i> Mi Lista de Deseos
          {wishlistItems.length > 0 && (
            <small className="text-muted ms-2">({wishlistItems.length} productos)</small>
          )}
        </h2>
        {wishlistItems.length > 0 && (
          <Button variant="success" onClick={handleMoveAllToCart}>
            <i className="bi bi-cart-plus"></i> Agregar todos al carrito
          </Button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle"></i> {error}
        </div>
      )}

      {wishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-heart text-muted" style={{ fontSize: '5rem' }}></i>
          <h3 className="mt-4">Tu lista de deseos está vacía</h3>
          <p className="text-muted">Agrega productos que te interesen y recíbelos aquí.</p>
          <Button variant="primary" size="lg" href="/">
            <i className="bi bi-shop"></i> Explorar Mueblerías
          </Button>
        </div>
      ) : (
        <Row>
          {wishlistItems.map((item) => (
            <Col lg={3} md={6} key={item.id_deseo} className="mb-4">
              <Card className="wishlist-item h-100">
                <div className="producto-imagen-container">
                  <img
                    src={item.producto.imagen_url || '/assets/images/default-product.jpg'}
                    alt={item.producto.nombre}
                    className="card-img-top producto-imagen"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect fill="%23e9ecef" width="300" height="250"/%3E%3Ctext fill="%236c757d" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EProducto%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="producto-deseos active">
                    <i className="bi bi-heart-fill"></i>
                  </div>
                </div>
                <Card.Body className="d-flex flex-column">
                  <h6 className="card-title">{item.producto.nombre}</h6>
                  <p className="card-text small text-muted flex-grow-1">
                    {item.producto.categoria && (
                      <span className="badge bg-secondary me-1">{item.producto.categoria}</span>
                    )}
                    {item.producto.color && (
                      <span className="badge bg-info me-1">Color: {item.producto.color}</span>
                    )}
                    {item.producto.material && (
                      <span className="badge bg-warning text-dark">Material: {item.producto.material}</span>
                    )}
                  </p>
                  {item.producto.medidas && (
                    <p className="card-text small">
                      <i className="bi bi-rulers"></i> {item.producto.medidas}
                    </p>
                  )}
                  <small className="text-muted">
                    <i className="bi bi-calendar"></i> Agregado: {new Date(item.fecha_agregado).toLocaleDateString()}
                  </small>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="text-primary mb-0">{formatPrice(item.producto.precio_venta)}</h5>
                      <span className="badge bg-success">Disponible</span>
                    </div>
                    
                    <div className="btn-group w-100" role="group">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="flex-fill"
                        onClick={() => handleAddToCart(item.producto)}
                      >
                        <i className="bi bi-cart-plus"></i> Carrito
                      </Button>
                      
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(item.id_producto)}
                        title="Eliminar de deseos"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="w-100 mt-2"
                      href={`/muebleria/${item.producto.id_muebleria}`}
                    >
                      <i className="bi bi-eye"></i> Ver Detalles
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Productos recomendados */}
      {wishlistItems.length === 0 && (
        <section className="py-5 bg-light mt-5">
          <Container>
            <h3 className="text-center mb-4">Productos que podrían gustarte</h3>
            <Row>
              {Array.from({ length: 4 }, (_, i) => (
                <Col lg={3} md={6} key={i} className="mb-4">
                  <Card className="h-100">
                    <Card.Img 
                      variant="top" 
                      src="/assets/images/default-product.jpg"
                      alt="Producto recomendado"
                    />
                    <Card.Body>
                      <h6 className="card-title">Producto Recomendado {i + 1}</h6>
                      <p className="card-text">
                        <strong className="text-primary">$1,999.00</strong>
                      </p>
                      <Button variant="outline-primary" size="sm" className="w-100">
                        <i className="bi bi-eye"></i> Ver Detalles
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
    </Container>
  );
};
