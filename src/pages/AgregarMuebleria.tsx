import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { muebleriasAPI } from '../services/api';

interface MuebleriaForm {
  nombre_negocio: string;
  descripcion: string;
  telefono: string;
  email: string;
}

export const AgregarMuebleria: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MuebleriaForm>({
    nombre_negocio: '',
    descripcion: '',
    telefono: '',
    email: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await muebleriasAPI.create(formData);
      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setShowError(true);
        setErrorMessage(response.error || 'Error al crear la mueblería');
      }
    } catch (error) {
      setShowError(true);
      setErrorMessage('Error de conexión con el servidor');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">Agregar Nueva Mueblería</h4>
            </Card.Header>
            <Card.Body>
              {showSuccess && (
                <Alert variant="success">
                  ¡Mueblería creada exitosamente! Redirigiendo...
                </Alert>
              )}
              
              {showError && (
                <Alert variant="danger">
                  {errorMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Negocio *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_negocio"
                    value={formData.nombre_negocio}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Muebles Modernos"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describe tu mueblería..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="55-1234-5678"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contacto@muebleria.com"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="success" type="submit">
                    Crear Mueblería
                  </Button>
                  <Button variant="outline-secondary" onClick={() => navigate('/')}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
