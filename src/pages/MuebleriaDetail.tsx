import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { muebleriasAPI, productosAPI } from '../services/api';
import { Muebleria, Producto, Filters } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const MuebleriaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [muebleria, setMuebleria] = useState<Muebleria | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    categoria: '',
    ordenar: 'nombre'
  });
  
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 12;

  useEffect(() => {
    const loadMuebleriaData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Simulación de carga - en producción usaríamos la API
        const mockMuebleria: Muebleria = {
          id_muebleria: parseInt(id),
          nombre_negocio: `In Decor Davila`,
          razon_social: `In Decor Davila SA de CV`,
          rfc: `MUE${id}010101ABC`,
          direccion_principal: `San Pedro Tultepec, Lerma. EdoMex`,
          telefono: `55-1234-567${id}`,
          creado_en: new Date().toISOString(),
          total_productos: 15,
          num_sucursales: 2,
          descripcion: `Diseñó, calidad e innovación.`,
          email: `indecor@davila.com`,
          whatsapp: `55-9876-5432`,
          facebook: `https://facebook.com/indecordavila`,
          instagram: `https://instagram.com/indecordavila`,
        };
        
        const mockCategorias = ['Salas', 'Recámaras', 'Comedores', 'Oficina'];
        const mockProductos: Producto[] = Array.from({ length: 15 }, (_, i) => ({
          id_producto: i + 1,
          sku: `MUE${id}-PRD${String(i + 1).padStart(3, '0')}`,
          id_muebleria: parseInt(id),
          nombre: `Producto ${i + 1} de Mueblería ${id}`,
          descripcion: `Descripción detallada del producto ${i + 1}`,
          categoria: mockCategorias[i % mockCategorias.length],
          unidad_medida: 'pieza',
          imagen_url: `producto1.jpg`,
          precio_venta: Math.floor(Math.random() * 10000) + 1000,
          peso_kg: Math.floor(Math.random() * 100) + 10,
          volumen_m3: Math.random() * 2 + 0.5,
          tipo_producto: 'producto_final' as const,
          color: ['Negro', 'Blanco', 'Madera', 'Gris'][i % 4],
          material: ['Madera de roble', 'Metal', 'Tela', 'Cuero'][i % 4],
          medidas: `${1 + i}m x ${0.5 + i * 0.2}m x ${0.7 + i * 0.1}m`,
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString(),
          muebleria_nombre: mockMuebleria.nombre_negocio,
        }));
        
        setMuebleria(mockMuebleria);
        setCategorias(mockCategorias);
        setProductos(mockProductos);
        
      } catch (err) {
        setError('Error al cargar la información de la mueblería');
      } finally {
        setLoading(false);
      }
    };

    loadMuebleriaData();
  }, [id]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPaginaActual(1);
  };

  const handleAddToCart = (producto: Producto) => {
    addItem(producto, 1);
  };

  const handleAddToWishlist = (producto: Producto) => {
    // Simulación - en producción usaríamos la API
    alert('Producto agregado a la lista de deseos');
  };

  const productosFiltrados = productos.filter(producto => {
    if (filters.categoria && producto.categoria !== filters.categoria) {
      return false;
    }
    return true;
  });

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (filters.ordenar) {
      case 'precio_asc':
        return a.precio_venta - b.precio_venta;
      case 'precio_desc':
        return b.precio_venta - a.precio_venta;
      case 'nombre':
      default:
        return a.nombre.localeCompare(b.nombre);
    }
  });

  const totalPaginas = Math.ceil(productosOrdenados.length / itemsPorPagina);
  const productosPaginados = productosOrdenados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando información de la mueblería...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3">Error</h3>
          <p className="text-muted">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </Container>
    );
  }

  if (!muebleria) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="bi bi-shop text-muted" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3">Mueblería no encontrada</h3>
          <p className="text-muted">La mueblería que buscas no existe o no está disponible.</p>
          <Button variant="primary" href="/">
            Volver al inicio
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Header de la mueblería */}
      <section className="muebleria-header py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={3}>
              <img
                src={`/assets/images/mueblerias/${muebleria.id_muebleria}/logo.jpg`}
                alt={muebleria.nombre_negocio}
                className="img-fluid rounded muebleria-logo"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23e9ecef" width="200" height="200"/%3E%3Ctext fill="%236c757d" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ELogo%3C/text%3E%3C/svg%3E';
                }}
              />
            </Col>
            <Col lg={9}>
              <h1 className="display-5 fw-bold">{muebleria.nombre_negocio}</h1>
              <p className="lead">{muebleria.razon_social}</p>
              <Row className="mt-3">
                <Col md={6}>
                  <p><i className="bi bi-geo-alt text-primary"></i> {muebleria.direccion_principal}</p>
                  <p><i className="bi bi-telephone text-primary"></i> {muebleria.telefono}</p>
                  <p><i className="bi bi-envelope text-primary"></i> {muebleria.email}</p>
                </Col>
                <Col md={6}>
                  <div className="d-flex gap-3">
                    <div className="text-center">
                      <h4 className="text-primary">{muebleria.total_productos}</h4>
                      <small className="text-muted">Productos</small>
                    </div>
                    <div className="text-center">
                      <h4 className="text-primary">{muebleria.num_sucursales}</h4>
                      <small className="text-muted">Sucursales</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Filtros y productos */}
      <section className="py-5">
        <Container>
          <Row>
            {/* Filtros */}
            <Col lg={3}>
              <Card className="filters-sidebar">
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="bi bi-funnel"></i> Filtros
                  </h5>
                </Card.Header>
                <Card.Body>
                  {/* Categorías */}
                  <div className="filter-group">
                    <h6 className="filter-title">Categorías</h6>
                    <Form.Select
                      name="categoria"
                      value={filters.categoria}
                      onChange={handleFilterChange}
                      className="mb-3"
                    >
                      <option value="">Todas las categorías</option>
                      {categorias.map(categoria => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </Form.Select>
                  </div>

                  {/* Ordenar por */}
                  <div className="filter-group">
                    <h6 className="filter-title">Ordenar por</h6>
                    <Form.Select
                      name="ordenar"
                      value={filters.ordenar}
                      onChange={handleFilterChange}
                    >
                      <option value="nombre">Nombre (A-Z)</option>
                      <option value="precio_asc">Precio: Menor a Mayor</option>
                      <option value="precio_desc">Precio: Mayor a Menor</option>
                    </Form.Select>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Productos */}
            <Col lg={9}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Catálogo de Productos</h4>
                <small className="text-muted">
                  Mostrando {productosPaginados.length} de {productosFiltrados.length} productos
                </small>
              </div>

              {productosPaginados.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-box text-muted" style={{ fontSize: '4rem' }}></i>
                  <h5 className="mt-3">No se encontraron productos</h5>
                  <p className="text-muted">Intenta con otros filtros o vuelve más tarde.</p>
                </div>
              ) : (
                <Row>
                  {productosPaginados.map((producto) => (
                    <Col lg={4} md={6} key={producto.id_producto} className="mb-4">
                      <Card className="producto-card h-100">
                        <div className="producto-imagen-container">
                          <img
                            src={producto.imagen_url}
                            alt={producto.nombre}
                            className="producto-imagen"
                            onError={(e) => {
                              console.log(`Error cargando imagen para producto ${producto.id_producto}:`, e.currentTarget.src);
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect fill="%23e9ecef" width="300" height="250"/%3E%3Ctext fill="%236c757d" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EProducto%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <h6 className="card-title">{producto.nombre}</h6>
                          <p className="card-text small text-muted flex-grow-1">
                            {producto.categoria && (
                              <Badge bg="secondary" className="me-1">{producto.categoria}</Badge>
                            )}
                            {producto.color && (
                              <Badge bg="info" className="me-1">Color: {producto.color}</Badge>
                            )}
                            {producto.material && (
                              <Badge bg="warning text-dark">Material: {producto.material}</Badge>
                            )}
                          </p>
                          {producto.medidas && (
                            <p className="card-text small">
                              <i className="bi bi-rulers"></i> {producto.medidas}
                            </p>
                          )}
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="text-primary mb-0">{formatPrice(producto.precio_venta)}</h5>
                              <Badge bg="success">Disponible</Badge>
                            </div>
                            
                            <div className="btn-group w-100" role="group">
                              <Button
                                variant="primary"
                                size="sm"
                                className="flex-fill"
                                onClick={() => handleAddToCart(producto)}
                              >
                                <i className="bi bi-cart-plus"></i> Agregar
                              </Button>
                              
                              {isAuthenticated && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleAddToWishlist(producto)}
                                >
                                  <i className="bi bi-heart"></i>
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="pagination-container">
                  <div className="btn-group" role="group">
                    <Button
                      variant="outline-primary"
                      onClick={() => setPaginaActual(paginaActual - 1)}
                      disabled={paginaActual === 1}
                    >
                      Anterior
                    </Button>
                    
                    {Array.from({ length: totalPaginas }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={paginaActual === i + 1 ? "primary" : "outline-primary"}
                        onClick={() => setPaginaActual(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline-primary"
                      onClick={() => setPaginaActual(paginaActual + 1)}
                      disabled={paginaActual === totalPaginas}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};
