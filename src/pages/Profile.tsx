import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    correo: user?.correo || '',
    telefono: user?.telefono || '',
    direccion_principal: user?.direccion_principal || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Simulación de actualización - en producción usaríamos la API
      updateUser(formData);
      setMessage('Perfil actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="profile-header mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <div className="profile-avatar">
                <i className="bi bi-person-circle" style={{ fontSize: '5rem' }}></i>
              </div>
            </Col>
            <Col md={9}>
              <h1 className="text-white">Mi Perfil</h1>
              <p className="text-white-50">Gestiona tu información personal</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Información Personal</h4>
            </Card.Header>
            <Card.Body>
              {message && (
                <Alert variant="success">
                  <i className="bi bi-check-circle"></i> {message}
                </Alert>
              )}
              
              {error && (
                <Alert variant="danger">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="nombre">
                      <Form.Label>Nombre Completo</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="correo">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                        disabled
                      />
                      <Form.Text className="text-muted">
                        El correo electrónico no se puede modificar
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="telefono">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="55-1234-5678"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="direccion">
                      <Form.Label>Dirección Principal</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion_principal"
                        value={formData.direccion_principal}
                        onChange={handleChange}
                        placeholder="Calle, número, colonia"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Guardando cambios...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle"></i> Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Información de Cuenta</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>ID de Usuario:</strong>
                <p className="text-muted mb-0">#{user?.id_usuario}</p>
              </div>
              <div className="mb-3">
                <strong>Rol:</strong>
                <p className="text-muted mb-0">{user?.role_nombre}</p>
              </div>
              <div className="mb-3">
                <strong>Fecha de Registro:</strong>
                <p className="text-muted mb-0">
                  {user?.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="mb-3">
                <strong>Estado:</strong>
                <p className="text-muted mb-0">
                  {user?.activo ? (
                    <span className="badge bg-success">Activo</span>
                  ) : (
                    <span className="badge bg-danger">Inactivo</span>
                  )}
                </p>
              </div>
              {user?.puntos !== undefined && (
                <div>
                  <strong>Puntos Acumulados:</strong>
                  <p className="text-muted mb-0">{user.puntos} puntos</p>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Acciones Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" as="a" href="/pedidos">
                  <i className="bi bi-box-seam"></i> Mis Pedidos
                </Button>
                <Button variant="outline-primary" as="a" href="/wishlist">
                  <i className="bi bi-heart"></i> Lista de Deseos
                </Button>
                <Button variant="outline-primary" as="a" href="/cart">
                  <i className="bi bi-cart3"></i> Mi Carrito
                </Button>
                <Button variant="outline-danger" as="a" href="/logout">
                  <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
