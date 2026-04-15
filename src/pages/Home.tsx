import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { muebleriasAPI } from '../services/api';
import { Muebleria } from '../types';

export const Home: React.FC = () => {
  const [mueblerias, setMueblerias] = useState<Muebleria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMueblerias = async () => {
      try {
        setLoading(true);
        const response = await muebleriasAPI.getAll();
        if (response.success && response.data) {
          setMueblerias(response.data);
        } else {
          // Si hay error en la API, mostrar datos de demostración
          console.log('Error en API, mostrando datos de demostración');
          setMueblerias([]);
        }
      } catch (err) {
        // En caso de error, mostrar datos de demostración
        console.log('Error de conexión, mostrando datos de demostración');
        setMueblerias([]);
      } finally {
        setLoading(false);
      }
    };

    loadMueblerias();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)' }}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#e94560', width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-white fs-5">Descubriendo mueblerías exclusivas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle" style={{ fontSize: '4rem', color: '#e94560' }}></i>
          <h3 className="mt-3">Error al cargar las mueblerías</h3>
          <p className="text-muted">{error}</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
            style={{ borderRadius: '30px', padding: '0.8rem 2rem', background: '#e94560', border: 'none' }}
          >
            <i className="bi bi-arrow-clockwise"></i> Reintentar
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section - Diseño Profesional Premium */}
      <section className="hero-section-modern">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="hero-content">
              <div className="hero-text">
                <Badge className="hero-badge mb-3">COLECCIÓN EXCLUSIVA 2026</Badge>
                <h1 className="hero-title">
                  Descubre Muebles que
                  <span className="text-primary"> Transforman Espacios</span>
                </h1>
                <p className="hero-description">
                  Explora nuestro catálogo premium de mueblerías seleccionadas. 
                  Diseño excepcional, calidad superior y estilo que define tu hogar.
                </p>
                <div className="hero-stats">
                  <div className="stat-item-modern">
                    <h3 className="stat-number">150+</h3>
                    <p className="stat-label">Mueblerías</p>
                  </div>
                  <div className="stat-item-modern">
                    <h3 className="stat-number">5,000+</h3>
                    <p className="stat-label">Productos</p>
                  </div>
                  <div className="stat-item-modern">
                    <h3 className="stat-number">98%</h3>
                    <p className="stat-label">Satisfacción</p>
                  </div>
                </div>
                <div className="hero-actions">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="hero-btn-primary"
                    href="#mueblerias"
                  >
                    <i className="bi bi-shop"></i> Explorar Tiendas
                  </Button>
                  <Button 
                    variant="outline-light" 
                    size="lg" 
                    className="hero-btn-secondary"
                  >
                    <i className="bi bi-play-circle"></i> Ver Catálogo
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="hero-image">
              <div className="hero-image-container">
                <img 
                  src="/mueblerias/1/producto1.jpg"
                  alt="Muebles Premium" 
                  className="hero-main-image"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.5s ease',
                    backgroundColor: '#1a1a2e',
                    minHeight: '400px'
                  }}
                />
                <div className="hero-image-overlay"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Características Premium */}
      <section className="features-section py-5">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="bi bi-truck"></i>
                </div>
                <h4>Envío Premium</h4>
                <p>Entrega gratuita en pedidos superiores a $2,000. Instalación profesional incluida.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h4>Garantía Extendida</h4>
                <p>Hasta 5 años de garantía en todos nuestros productos. Calidad certificada.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="bi bi-credit-card"></i>
                </div>
                <h4>Pago Seguro</h4>
                <p>Métodos de pago encriptados y protección total en todas tus transacciones.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mueblerías Premium */}
      <section id="mueblerias" className="mueblerias-section py-5">
        <Container>
          <div className="text-center mb-5">
            <Badge className="section-badge">TIENDAS ELITE</Badge>
            <h2 className="section-title">Mueblerías Premium</h2>
            <p className="section-description">
              Colaboramos con las mueblerías más exclusivas del país para ofrecerte 
              diseño, calidad y servicio excepcional
            </p>
          </div>

          {mueblerias.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-shop" style={{ fontSize: '4rem', color: '#6B8E6B' }}></i>
              <h3 className="mt-3">No hay mueblerías registradas</h3>
              <p className="text-muted">Comienza agregando tu primera mueblería para probar el sistema.</p>
              <Button 
                variant="success" 
                href="/agregar-muebleria"
                className="mt-3"
                style={{ background: '#6B8E6B', border: 'none' }}
              >
                <i className="bi bi-plus-lg"></i> Agregar Mueblería
              </Button>
            </div>
          ) : (
            <Row className="g-4">
              {mueblerias.map((muebleria) => (
                <Col lg={4} md={6} key={muebleria.id_muebleria}>
                  <Card className="muebleria-card-modern h-100">
                    <div className="card-image-wrapper">
                      <img 
                        src={muebleria.logo_url || `/mueblerias/${muebleria.id_muebleria}/logo.jpg`}
                        alt={muebleria.nombre_negocio}
                        className="card-image"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s ease',
                          backgroundColor: '#1a1a2e',
                          minHeight: '280px'
                        }}
                      />
                      <div className="card-overlay">
                        <Button 
                          variant="light" 
                          className="overlay-btn"
                          href={`/muebleria/${muebleria.id_muebleria}`}
                        >
                          <i className="bi bi-eye"></i> Ver Catálogo
                        </Button>
                      </div>
                    </div>
                    <Card.Body className="p-4">
                      <div className="card-content">
                        <Card.Title className="card-title-modern">{muebleria.nombre_negocio}</Card.Title>
                        <Card.Text className="card-subtitle">{muebleria.razon_social}</Card.Text>
                        
                        <div className="card-info">
                          <div className="info-item">
                            <i className="bi bi-geo-alt"></i>
                            <span>{muebleria.direccion_principal}</span>
                          </div>
                          <div className="info-item">
                            <i className="bi bi-telephone"></i>
                            <span>{muebleria.telefono}</span>
                          </div>
                        </div>
                        
                        {muebleria.total_productos && (
                          <div className="card-badges">
                            <Badge className="product-badge">
                              <i className="bi bi-box"></i> {muebleria.total_productos} productos
                            </Badge>
                            {muebleria.num_sucursales && (
                              <Badge className="location-badge">
                                <i className="bi bi-geo"></i> {muebleria.num_sucursales} {muebleria.num_sucursales === 1 ? 'sucursal' : 'sucursales'}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* CTA Section Premium */}
      <section className="cta-section py-5">
        <Container>
          <div className="cta-content text-center">
            <Badge className="cta-badge">EXPERIENCIA PREMIUM</Badge>
            <h2 className="cta-title">Transforma tu Hogar con Estilo Exclusivo</h2>
            <p className="cta-description">
              Descubre nuestra colección premium y encuentra los muebles perfectos 
              que reflejan tu personalidad y elevan tu estilo de vida
            </p>
            <div className="cta-actions">
              <Button variant="primary" size="lg" className="cta-btn">
                <i className="bi bi-search"></i> Buscar Muebles
              </Button>
              <Button variant="outline-primary" size="lg" className="cta-btn-outline">
                <i className="bi bi-heart"></i> Lista de Deseos
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
