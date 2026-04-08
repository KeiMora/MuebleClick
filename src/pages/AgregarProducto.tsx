import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ProductoForm {
  nombre: string;
  sku: string;
  categoria: string;
  descripcion: string;
  precio_compra: number | string;
  precio_venta: number | string;
  stock_inicial: number | string;
  imagen_url: string;
  id_muebleria: number | string;
  material: string;
  dimensiones: string;
  peso: number | string;
  color: string;
  garantia: string;
}

export const AgregarProducto: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductoForm>({
    nombre: '',
    sku: '',
    categoria: '',
    descripcion: '',
    precio_compra: 0,
    precio_venta: 0,
    stock_inicial: 0,
    imagen_url: '',
    id_muebleria: 1,
    material: '',
    dimensiones: '',
    peso: 0,
    color: '',
    garantia: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState<Partial<ProductoForm>>({});

  const categorias = [
    'Sofás', 'Sillas', 'Mesas', 'Camas', 'Armarios', 'Escritorios', 
    'Librerías', 'Sillones', 'Reclinables', 'Comedores', 'Recámaras', 'Oficina'
  ];

  const materiales = [
    'Madera', 'Metal', 'Cuero', 'Tela', 'Vidrio', 'Plástico', 
    'Madera y Metal', 'Cuero Sintético', 'Tela Premium', 'Madera Sólida'
  ];

  const colores = [
    'Negro', 'Blanco', 'Marrón', 'Gris', 'Beige', 'Azul', 'Verde', 'Rojo', 'Dorado', 'Plata'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio_compra' || name === 'precio_venta' || name === 'stock_inicial' || name === 'peso' 
        ? parseFloat(value) || 0 
        : name === 'id_muebleria'
        ? parseInt(value) || 1
        : value
    }));
    
    // Limpiar error del campo
    if (errors[name as keyof ProductoForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductoForm> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es requerido';
    if (!formData.categoria) newErrors.categoria = 'La categoría es requerida';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (typeof formData.precio_venta === 'string' ? parseFloat(formData.precio_venta) <= 0 : formData.precio_venta <= 0) newErrors.precio_venta = 'El precio de venta debe ser mayor a 0';
    if (typeof formData.stock_inicial === 'string' ? parseFloat(formData.stock_inicial) < 0 : formData.stock_inicial < 0) newErrors.stock_inicial = 'El stock no puede ser negativo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    try {
      // Simulación de guardado (reemplazar con API real)
      console.log('Guardando producto:', formData);
      
      // Aquí iría la llamada a la API
      // await productosAPI.create(formData);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/productos');
      }, 2000);
      
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulación de subida de imagen
      const imageUrl = `/mueblerias/${formData.id_muebleria}/productos/${Date.now()}_${file.name}`;
      setFormData(prev => ({ ...prev, imagen_url: imageUrl }));
    }
  };

  // Card header component with icon
  const CardHeader = ({ icon, title, color = '#6B8E6B' }: { icon: string, title: string, color?: string }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      padding: '14px 18px',
      background: '#f8f8f5',
      borderRadius: '10px',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <i className={`bi ${icon}`} style={{ fontSize: '1.2rem' }}></i>
      </div>
      <h5 style={{ margin: 0, color: '#4a4a4a', fontWeight: '600', fontSize: '1rem' }}>
        {title}
      </h5>
    </div>
  );

  // Styled input component
  const StyledInput = ({ label, name, type = 'text', value, onChange, error, placeholder, as, rows }: any) => (
    <Form.Group className="mb-3">
      <Form.Label style={{ color: '#5a5a5a', fontWeight: '500', fontSize: '0.85rem', marginBottom: '6px' }}>
        {label}
      </Form.Label>
      <Form.Control
        as={as}
        rows={rows}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        isInvalid={!!error}
        placeholder={placeholder}
        style={{ 
          borderRadius: '8px', 
          padding: '10px 14px',
          border: '1px solid #d0d0d0',
          fontSize: '0.9rem',
          background: '#fafafa'
        }}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );

  // Styled select component
  const StyledSelect = ({ label, name, value, onChange, error, options }: any) => (
    <Form.Group className="mb-3">
      <Form.Label style={{ color: '#5a5a5a', fontWeight: '500', fontSize: '0.85rem', marginBottom: '6px' }}>
        {label}
      </Form.Label>
      <Form.Select
        name={name}
        value={value}
        onChange={onChange}
        isInvalid={!!error}
        style={{ 
          borderRadius: '8px', 
          padding: '10px 14px',
          border: '1px solid #d0d0d0',
          fontSize: '0.9rem',
          background: '#fafafa',
          cursor: 'pointer'
        }}
      >
        <option value="">Selecciona...</option>
        {options.map((opt: any) => (<option key={opt} value={opt}>{opt}</option>))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <div style={{ background: '#f0f0e8', minHeight: '100vh', padding: '30px' }}>
      <Container fluid style={{ maxWidth: '1400px' }}>
        {/* Top Stats Bar */}
        <Row className="mb-4">
          <Col>
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '10px',
              flexWrap: 'wrap'
            }}>
              {[
                { icon: 'bi-box-seam', label: 'Productos Totales', value: '156', color: '#6B8E6B' },
                { icon: 'bi-check-circle', label: 'Activos', value: '142', color: '#8FA4B8' },
                { icon: 'bi-exclamation-triangle', label: 'Stock Bajo', value: '8', color: '#D4C4B0' },
                { icon: 'bi-currency-dollar', label: 'Valor Inventario', value: '$2.4M', color: '#6B8E6B' }
              ].map((stat, idx) => (
                <div key={idx} style={{
                  flex: '1',
                  minWidth: '160px',
                  background: 'white',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.3rem'
                  }}>
                    <i className={stat.icon}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>{stat.label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#4a4a4a' }}>{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        {showSuccess && (
          <Alert variant="success" className="mb-3" style={{ borderRadius: '10px', border: 'none' }}>
            <i className="bi bi-check-circle me-2"></i> Producto agregado exitosamente
          </Alert>
        )}

        {showError && (
          <Alert variant="danger" className="mb-3" style={{ borderRadius: '10px', border: 'none' }}>
            <i className="bi bi-exclamation-triangle me-2"></i> Error al agregar el producto. Revise los campos.
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Column 1: Informacion Basica */}
            <Col lg={4} className="mb-4">
              <Card style={{ 
                border: 'none', 
                borderRadius: '16px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                height: '100%'
              }}>
                <Card.Body style={{ padding: '24px' }}>
                  <CardHeader icon="bi-info-circle" title="Informacion Basica" color="#6B8E6B" />
                  
                  <StyledInput
                    label="Nombre del Producto *"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    error={errors.nombre}
                    placeholder="Ej: Sofa Moderno de 3 Plazas"
                  />

                  <StyledInput
                    label="SKU *"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    error={errors.sku}
                    placeholder="Ej: SOF-001-MOD"
                  />

                  <StyledSelect
                    label="Categoria *"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    error={errors.categoria}
                    options={categorias}
                  />

                  <StyledInput
                    label="Descripcion *"
                    name="descripcion"
                    as="textarea"
                    rows={3}
                    value={formData.descripcion}
                    onChange={handleChange}
                    error={errors.descripcion}
                    placeholder="Describe las caracteristicas..."
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* Column 2: Precios y Stock */}
            <Col lg={4} className="mb-4">
              <Card style={{ 
                border: 'none', 
                borderRadius: '16px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                height: '100%'
              }}>
                <Card.Body style={{ padding: '24px' }}>
                  <CardHeader icon="bi-currency-dollar" title="Precios y Stock" color="#8FA4B8" />
                  
                  <Row>
                    <Col md={6}>
                      <StyledInput
                        label="Precio Compra"
                        name="precio_compra"
                        type="number"
                        step="0.01"
                        value={formData.precio_compra}
                        onChange={handleChange}
                        placeholder="0.00"
                      />
                    </Col>
                    <Col md={6}>
                      <StyledInput
                        label="Precio Venta *"
                        name="precio_venta"
                        type="number"
                        step="0.01"
                        value={formData.precio_venta}
                        onChange={handleChange}
                        error={errors.precio_venta}
                        placeholder="0.00"
                      />
                    </Col>
                  </Row>

                  <StyledInput
                    label="Stock Inicial *"
                    name="stock_inicial"
                    type="number"
                    value={formData.stock_inicial}
                    onChange={handleChange}
                    error={errors.stock_inicial}
                    placeholder="0"
                  />

                  <StyledInput
                    label="ID Muebleria"
                    name="id_muebleria"
                    type="number"
                    value={formData.id_muebleria}
                    onChange={handleChange}
                    placeholder="1"
                  />

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#5a5a5a', fontWeight: '500', fontSize: '0.85rem' }}>
                      Subir Imagen
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ 
                        borderRadius: '8px', 
                        padding: '8px 12px',
                        border: '1px solid #d0d0d0',
                        fontSize: '0.9rem'
                      }}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            {/* Column 3: Caracteristicas */}
            <Col lg={4} className="mb-4">
              <Card style={{ 
                border: 'none', 
                borderRadius: '16px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                height: '100%'
              }}>
                <Card.Body style={{ padding: '24px' }}>
                  <CardHeader icon="bi-box" title="Caracteristicas" color="#D4C4B0" />
                  
                  <StyledSelect
                    label="Material"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    options={materiales}
                  />

                  <StyledSelect
                    label="Color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    options={colores}
                  />

                  <StyledInput
                    label="Dimensiones"
                    name="dimensiones"
                    value={formData.dimensiones}
                    onChange={handleChange}
                    placeholder="Ej: 200cm x 80cm x 90cm"
                  />

                  <StyledInput
                    label="Peso (kg)"
                    name="peso"
                    type="number"
                    step="0.1"
                    value={formData.peso}
                    onChange={handleChange}
                    placeholder="0.0"
                  />

                  <StyledInput
                    label="Garantia"
                    name="garantia"
                    value={formData.garantia}
                    onChange={handleChange}
                    placeholder="Ej: 2 anos"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Action Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '10px',
            padding: '20px 24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
          }}>
            <Button 
              variant="light" 
              onClick={() => navigate('/productos')}
              style={{ 
                borderRadius: '8px', 
                padding: '10px 20px',
                fontWeight: '500',
                border: '1px solid #d0d0d0',
                fontSize: '0.9rem'
              }}
            >
              <i className="bi bi-arrow-left me-2"></i> Cancelar
            </Button>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button 
                variant="outline-secondary"
                type="button"
                style={{ 
                  borderRadius: '8px', 
                  padding: '10px 20px',
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}
              >
                <i className="bi bi-save me-2"></i> Guardar Borrador
              </Button>
              
              <Button 
                variant="primary" 
                type="submit"
                style={{ 
                  borderRadius: '8px', 
                  padding: '10px 24px',
                  fontWeight: '500',
                  background: '#6B8E6B',
                  border: 'none',
                  fontSize: '0.9rem'
                }}
              >
                <i className="bi bi-check-circle me-2"></i> Agregar Producto
              </Button>
            </div>
          </div>
        </Form>
      </Container>
    </div>
  );
};
