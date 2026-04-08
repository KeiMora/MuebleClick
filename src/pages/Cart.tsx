import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const Cart: React.FC = () => {
  const { items, total, total_items, updateQuantity, removeItem, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      removeItem(id);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
      clearCart();
    }
  };

  const applyCoupon = () => {
    // Lógica para aplicar cupón (ejemplo simple)
    if (couponCode === 'BIENVENIDA10') {
      setDiscount(total * 0.10);
      alert('Cupón aplicado: 10% de descuento');
    } else {
      alert('Cupón inválido');
      setDiscount(0);
    }
  };

  const finalTotal = total - discount;

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando carrito...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-cart3"></i> Mi Carrito de Compras
          {total_items > 0 && (
            <small className="text-muted ms-2">({total_items} productos)</small>
          )}
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '5rem' }}></i>
          <h3 className="mt-4">Tu carrito está vacío</h3>
          <p className="text-muted">¡Agrega algunos productos para comenzar!</p>
          <Button variant="primary" size="lg" href="/">
            <i className="bi bi-shop"></i> Ver Mueblerías
          </Button>
        </div>
      ) : (
        <Row>
          <Col lg={8}>
            {/* Lista de productos */}
            <Card className="mb-4">
              <Card.Body>
                {items.map((item) => (
                  <div key={item.producto.id_producto} className="cart-item">
                    <Row className="align-items-center">
                      <Col md={2}>
                        <img
                          src={item.producto.imagen_url || '/assets/images/default-product.jpg'}
                          alt={item.producto.nombre}
                          className="cart-item-image"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect fill="%23e9ecef" width="80" height="80"/%3E%3Ctext fill="%236c757d" font-family="Arial" font-size="12" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EProducto%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </Col>
                      <Col md={4}>
                        <h6 className="mb-1">{item.producto.nombre}</h6>
                        <small className="text-muted">
                          {item.producto.muebleria_nombre}
                          {item.producto.color && ` | Color: ${item.producto.color}`}
                        </small>
                      </Col>
                      <Col md={2}>
                        <div className="input-group input-group-sm">
                          <Form.Control
                            type="number"
                            value={item.cantidad}
                            onChange={(e) => handleQuantityChange(item.producto.id_producto, parseInt(e.target.value) || 1)}
                            min="1"
                            max="99"
                          />
                        </div>
                        <small className="text-muted">Precio: {formatPrice(item.producto.precio_venta)}</small>
                      </Col>
                      <Col md={2} className="text-center">
                        <strong>{formatPrice(item.subtotal)}</strong>
                      </Col>
                      <Col md={2} className="text-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.producto.id_producto)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Acciones */}
            <div className="d-flex justify-content-between">
              <Button variant="outline-primary" href="/">
                <i className="bi bi-arrow-left"></i> Seguir Comprando
              </Button>
              <Button variant="outline-danger" onClick={handleClearCart}>
                <i className="bi bi-trash"></i> Vaciar Carrito
              </Button>
            </div>
          </Col>

          <Col lg={4}>
            {/* Resumen del pedido */}
            <Card className="cart-summary">
              <Card.Header>
                <h5 className="mb-0">Resumen del Pedido</h5>
              </Card.Header>
              <Card.Body>
                {/* Cupón */}
                <Form className="mb-4">
                  <Form.Group>
                    <div className="input-group">
                      <Form.Control
                        type="text"
                        placeholder="Código de cupón"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button variant="outline-primary" onClick={applyCoupon}>
                        Aplicar
                      </Button>
                    </div>
                  </Form.Group>
                </Form>

                {/* Totales */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                  {discount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Descuento:</span>
                      <strong>-{formatPrice(discount)}</strong>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span>Envío:</span>
                    <strong className="text-success">GRATIS</strong>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <h5>Total:</h5>
                    <h5 className="text-primary">{formatPrice(finalTotal)}</h5>
                  </div>
                </div>

                {/* Botón de checkout */}
                {isAuthenticated ? (
                  <Button variant="primary" size="lg" className="w-100" href="/checkout">
                    <i className="bi bi-credit-card"></i> Proceder al Pago
                  </Button>
                ) : (
                  <Alert variant="info">
                    <i className="bi bi-info-circle"></i>{' '}
                    <Alert.Link href="/login">Inicia sesión</Alert.Link> para continuar con tu compra.
                  </Alert>
                )}

                {/* Información adicional */}
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    <i className="bi bi-shield-check"></i> Compra 100% segura<br />
                    <i className="bi bi-truck"></i> Envío gratis en pedidos mayores a $2,000
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};
