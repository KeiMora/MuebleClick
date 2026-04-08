import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types';

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    correo: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    await login(formData);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* Left Side - Image/Brand Area */}
      <div style={{
        flex: '1',
        background: 'linear-gradient(135deg, #6B8E6B 0%, #8FA4B8 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }}></div>
        
        <div style={{ textAlign: 'center', maxWidth: '500px', zIndex: 1 }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 40px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <i className="bi bi-shop" style={{ fontSize: '3rem', color: '#6B8E6B' }}></i>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '20px' }}>
            MuebleClick
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: '1.6' }}>
            Sistema de gestion para mueblerias. Administra tu inventario, ventas y clientes en un solo lugar.
          </p>
          <div style={{ 
            marginTop: '60px', 
            display: 'flex', 
            gap: '30px',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>500+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Mueblerias</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>10k+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Productos</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>50k+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Clientes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: '1',
        background: '#f8f8f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
      }}>
        <Card className="border-0" style={{ 
          width: '100%',
          maxWidth: '480px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#6B8E6B',
            padding: '40px 30px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <i className="bi bi-person-circle" style={{ fontSize: '2rem', color: '#6B8E6B' }}></i>
            </div>
            <h2 style={{ color: 'white', fontWeight: '600', margin: 0, fontSize: '1.6rem' }}>
              Bienvenido
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: '10px 0 0', fontSize: '0.95rem' }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>
          <Card.Body className="p-5">

            {error && (
              <Alert variant="danger" className="mb-4" style={{ borderRadius: '10px', border: 'none', background: '#fee2e2', color: '#991b1b' }}>
                <i className="bi bi-exclamation-triangle me-2"></i> {error}
              </Alert>
            )}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="correo">
                <Form.Label style={{ color: '#5a5a5a', fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px' }}>
                  Correo Electronico
                </Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                  style={{ 
                    borderRadius: '12px', 
                    padding: '14px 18px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    background: '#fafafa'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label style={{ color: '#5a5a5a', fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px' }}>
                  Contrasena
                </Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tu contrasena"
                  required
                  style={{ 
                    borderRadius: '12px', 
                    padding: '14px 18px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    background: '#fafafa'
                  }}
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check 
                  type="checkbox" 
                  label={<span style={{ fontSize: '0.9rem', color: '#666' }}>Recordarme</span>}
                />
                <Link to="/recuperar" style={{ fontSize: '0.9rem', color: '#6B8E6B', textDecoration: 'none', fontWeight: '500' }}>
                  Olvidaste tu contrasena?
                </Link>
              </div>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-4"
                disabled={loading}
                style={{
                  borderRadius: '12px',
                  padding: '16px',
                  fontWeight: '600',
                  background: '#6B8E6B',
                  border: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(107, 142, 107, 0.3)'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Iniciando sesion...
                  </>
                ) : (
                  <>Iniciar Sesion</>
                )}
              </Button>
            </Form>

            <div className="text-center pt-4" style={{ borderTop: '2px solid #f0f0f0' }}>
              <p className="mb-3" style={{ color: '#888', fontSize: '0.9rem' }}>
                No tienes una cuenta?{' '}
                <Link to="/register" style={{ color: '#6B8E6B', fontWeight: '600', textDecoration: 'none' }}>
                  Registrate aqui
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
