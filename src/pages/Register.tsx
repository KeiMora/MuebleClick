import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    nombre: '',
    correo: '',
    password: '',
    password_confirm: '',
    telefono: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    match: false,
  });
  
  const { register, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar contraseña en tiempo real
    if (name === 'password' || name === 'password_confirm') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'password_confirm' ? value : formData.password_confirm;
      
      setPasswordStrength({
        length: password.length >= 8,
        match: password === confirmPassword && password.length > 0,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (formData.password !== formData.password_confirm) {
      return;
    }

    await register(formData);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #2d4a3e 0%, #1a2f26 50%, #2d4a3e 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative shapes */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(107,142,107,0.2) 0%, transparent 70%)',
        borderRadius: '50%'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(212,196,176,0.15) 0%, transparent 70%)',
        borderRadius: '50%'
      }}></div>

      {/* Main Card */}
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '900px',
        minHeight: '550px',
        background: 'white',
        borderRadius: '4px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left Side - Branding */}
        <div style={{
          flex: '0 0 40%',
          background: 'linear-gradient(180deg, #6B8E6B 0%, #4a6b4a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <i className="bi bi-shop" style={{ fontSize: '2.5rem', color: '#6B8E6B' }}></i>
          </div>
          
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            marginBottom: '20px',
            letterSpacing: '2px'
          }}>
            MuebleClick
          </h1>
          
          <div style={{
            width: '60px',
            height: '3px',
            background: 'white',
            marginBottom: '20px'
          }}></div>
          
          <p style={{
            fontSize: '0.85rem',
            textAlign: 'center',
            lineHeight: '1.6',
            opacity: 0.9,
            maxWidth: '250px'
          }}>
            Sistema de gestion para mueblerias. Administra tu inventario, ventas y clientes en un solo lugar.
          </p>
        </div>

        {/* Right Side - Form */}
        <div style={{
          flex: '1',
          padding: '40px 50px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <Link to="/register" style={{
              textDecoration: 'none',
              padding: '8px 20px',
              background: '#6B8E6B',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Registrarse
            </Link>
            <Link to="/login" style={{
              textDecoration: 'none',
              padding: '8px 20px',
              color: '#666',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              Iniciar Sesión
            </Link>
          </div>

          {error && (
            <Alert variant="danger" className="mb-3" style={{ borderRadius: '4px', fontSize: '0.85rem' }}>
              <i className="bi bi-exclamation-triangle me-2"></i> {error}
            </Alert>
          )}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label style={{
                fontSize: '0.75rem',
                color: '#1e3a5f',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600',
                marginBottom: '6px'
              }}>
                Nombre Completo
              </Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre completo"
                required
                style={{
                  borderRadius: '0',
                  padding: '12px 15px',
                  border: '1px solid #c5d5e5',
                  fontSize: '0.95rem',
                  background: '#f8fafc'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="correo">
              <Form.Label style={{
                fontSize: '0.75rem',
                color: '#1e3a5f',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600',
                marginBottom: '6px'
              }}>
                Correo Electrónico
              </Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ingresa tu correo electrónico"
                required
                style={{
                  borderRadius: '0',
                  padding: '12px 15px',
                  border: '1px solid #c5d5e5',
                  fontSize: '0.95rem',
                  background: '#f8fafc'
                }}
              />
            </Form.Group>

            <div style={{ display: 'flex', gap: '15px' }}>
              <Form.Group className="mb-3" controlId="password" style={{ flex: 1 }}>
                <Form.Label style={{
                  fontSize: '0.75rem',
                  color: '#1e3a5f',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  Contraseña
                </Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  required
                  minLength={8}
                  style={{
                    borderRadius: '0',
                    padding: '12px 15px',
                    border: '1px solid #c5d5e5',
                    fontSize: '0.95rem',
                    background: '#f8fafc'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password_confirm" style={{ flex: 1 }}>
                <Form.Label style={{
                  fontSize: '0.75rem',
                  color: '#1e3a5f',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  Confirmar Contraseña
                </Form.Label>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Confirmar"
                  required
                  minLength={8}
                  style={{
                    borderRadius: '0',
                    padding: '12px 15px',
                    border: '1px solid #c5d5e5',
                    fontSize: '0.95rem',
                    background: '#f8fafc'
                  }}
                />
              </Form.Group>
            </div>

            {/* Password validation indicator */}
            <div className="mb-3">
              <small style={{ fontSize: '0.75rem', color: '#666' }}>
                <i className={`bi ${passwordStrength.length ? 'bi-check-square-fill text-success' : 'bi-square'}`}></i>
                <span className="ms-2">Mínimo 8 caracteres</span>
              </small>
            </div>

            <Form.Group className="mb-4" controlId="terminos">
              <Form.Check 
                type="checkbox" 
                label={
                  <span style={{ fontSize: '0.8rem', color: '#555' }}>
                    He aceptado los términos y condiciones
                  </span>
                }
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
              style={{
                borderRadius: '4px',
                padding: '14px',
                fontWeight: '700',
                background: '#6B8E6B',
                border: 'none',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creando...
                </>
              ) : (
                <>Registrarse</>
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
