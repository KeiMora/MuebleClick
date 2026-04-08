import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export const AnalisisVentas: React.FC = () => {
  // Función de ventas: f(t) = 20 + 5*sin(t)
  const calcularVentas = (t: number): number => {
    return 20 + 5 * Math.sin(t);
  };

  // ============================================
  // TRANSFORMADA DE LAPLACE
  // ============================================
  // Para f(t) = 20 + 5*sin(t):
  // L{20} = 20/s
  // L{5*sin(t)} = 5/(s² + 1)
  // F(s) = 20/s + 5/(s² + 1)

  const calcularTransformadaLaplace = (sigma: number, omega: number): number => {
    const s = sigma + omega; // s = σ + jω (tomamos la parte real para visualización)
    if (s === 0) return 0;
    const term1 = 20 / s;           // L{20}
    const term2 = 5 / (s * s + 1);  // L{5*sin(t)}
    return term1 + term2;
  };

  // Generar datos de la Transformada de Laplace para visualización
  const datosLaplace = useMemo(() => {
    const puntos = [];
    for (let sigma = 0.1; sigma <= 5; sigma += 0.1) {
      // Mostramos la magnitud |F(s)| para diferentes valores de s = σ
      const valor = calcularTransformadaLaplace(sigma, 0);
      puntos.push({
        sigma: Math.round(sigma * 10) / 10,
        magnitud: Math.round(valor * 100) / 100,
        terminoConstante: Math.round((20 / sigma) * 100) / 100,
        terminoSinusoidal: Math.round((5 / (sigma * sigma + 1)) * 100) / 100
      });
    }
    return puntos;
  }, []);

  // Proyección usando Inversa de Laplace (estimación futura)
  // Para periodos futuros, extendemos la función periódica
  const datosProyeccion = useMemo(() => {
    const puntos = [];
    // Datos históricos (t = 0 a 10)
    for (let t = 0; t <= 10; t += 0.5) {
      const tRedondeado = Math.round(t * 10) / 10;
      puntos.push({
        tiempo: tRedondeado,
        tipo: 'Histórico',
        ventas: Math.round(calcularVentas(tRedondeado) * 100) / 100
      });
    }
    // Proyección futura usando periodicidad (t = 10 a 20)
    for (let t = 10.5; t <= 20; t += 0.5) {
      const tRedondeado = Math.round(t * 10) / 10;
      // Usamos la periodicidad: sin(t) = sin(t - 2πn) donde n es el número de periodos
      const tEquivalente = tRedondeado % (2 * Math.PI);
      puntos.push({
        tiempo: tRedondeado,
        tipo: 'Proyección (Laplace)',
        ventas: Math.round(calcularVentas(tEquivalente) * 100) / 100
      });
    }
    return puntos;
  }, []);

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          Análisis de Ventas con Transformada de Laplace
        </h1>
        <p className="section-description" style={{ maxWidth: '800px', margin: '0 auto' }}>
          Modelado matemático avanzado para proyección de ventas usando el dominio de la frecuencia compleja
        </p>
      </div>

      {/* ============================================
          TRANSFORMADA DE LAPLACE - SECCIÓN MATEMÁTICA
          ============================================ */}
      <Card className="mb-4" style={{ border: 'none', boxShadow: 'var(--card-shadow)' }}>
        <Card.Body>
          <h4 className="mb-4" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
            <i className="bi bi-calculator me-2"></i>
            Transformada de Laplace - Análisis Matemático
          </h4>

          {/* Ecuaciones de Laplace */}
          <Row className="mb-4">
            <Col md={6}>
              <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
                <Card.Body>
                  <h6 style={{ fontWeight: 600 }}>Función de Ventas en Tiempo</h6>
                  <div className="p-2 bg-white bg-opacity-25 rounded text-center" style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    f(t) = 20 + 5·sin(t)
                  </div>
                  <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                  <h6 style={{ fontWeight: 600 }}>Transformada de Laplace ℒ{'{'}f(t){'}'}</h6>
                  <div className="p-2 bg-white bg-opacity-25 rounded text-center" style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    F(s) = 20/s + 5/(s² + 1)
                  </div>
                  <p className="mt-2 mb-0 small">
                    <strong>Donde:</strong> s = σ + jω (variable compleja)
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', border: 'none' }}>
                <Card.Body>
                  <h6 style={{ fontWeight: 600 }}>Descomposición de Términos</h6>
                  <div className="p-2 bg-white bg-opacity-25 rounded" style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>
                    <div>ℒ{'{'}20{'}'} = 20/s</div>
                    <div className="mt-1">ℒ{'{'}5·sin(t){'}'} = 5/(s² + 1)</div>
                    <div className="mt-1 text-warning">ℒ{'{'}e^(at)·f(t){'}'} = F(s-a)</div>
                  </div>
                  <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                  <h6 style={{ fontWeight: 600 }}>Inversa de Laplace ℒ⁻¹{'{'}F(s){'}'}</h6>
                  <div className="p-2 bg-white bg-opacity-25 rounded text-center" style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    f(t) = ℒ⁻¹{'{'}20/s{'}'} + ℒ⁻¹{'{'}5/(s²+1){'}'}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Gráfica de Transformada de Laplace */}
          <h5 className="mb-3" style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>
            Magnitud de F(s) en el Dominio de Laplace
          </h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosLaplace} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis
                dataKey="sigma"
                label={{ value: 'σ (parte real de s)', position: 'insideBottom', offset: -5 }}
                stroke="var(--text-secondary)"
              />
              <YAxis
                label={{ value: '|F(s)|', angle: -90, position: 'insideLeft' }}
                stroke="var(--text-secondary)"
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ccc' }}
                formatter={(value, name) => [value ?? 0, name]}
                labelFormatter={(label) => `σ = ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="magnitud"
                stroke="#667eea"
                strokeWidth={3}
                name="|F(s)| = |20/s + 5/(s²+1)|"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="terminoConstante"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Término: 20/s"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="terminoSinusoidal"
                stroke="#f5576c"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Término: 5/(s²+1)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <Alert variant="info" className="mt-3" style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', border: '1px solid #667eea' }}>
            <small>
              <strong>Interpretación:</strong> La Transformada de Laplace convierte la función de ventas del dominio del tiempo
              al dominio de la frecuencia compleja s. El término 20/s representa el componente constante, mientras que
              5/(s²+1) captura la periodicidad sinusoidal.
            </small>
          </Alert>
        </Card.Body>
      </Card>

      {/* ============================================
          PROYECCIÓN DE VENTAS CON LAPLACE
          ============================================ */}
      <Card className="mb-4" style={{ border: 'none', boxShadow: 'var(--card-shadow)' }}>
        <Card.Body>
          <h4 className="mb-4" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
            <i className="bi bi-graph-up-arrow me-2"></i>
            Estimación de Ventas - Proyección con Inversa de Laplace
          </h4>

          <Row className="mb-4">
            <Col md={8}>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={datosProyeccion} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="tiempo"
                    label={{ value: 'Tiempo (t) - periodos', position: 'insideBottom', offset: -5 }}
                    stroke="var(--text-secondary)"
                  />
                  <YAxis
                    label={{ value: 'Ventas', angle: -90, position: 'insideLeft' }}
                    stroke="var(--text-secondary)"
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ccc' }}
                    formatter={(value, name, props) => {
                      const tipo = (props as any)?.payload?.tipo;
                      return [`${value ?? 0} (${tipo})`, 'Ventas'];
                    }}
                  />
                  <Legend />
                  <ReferenceLine x={10} stroke="#ff6b6b" strokeDasharray="3 3" label="Proyección Inicia" />
                  <Line
                    type="monotone"
                    dataKey="ventas"
                    stroke="#4ecdc4"
                    strokeWidth={3}
                    name="Ventas Reales + Proyección"
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      const color = payload.tipo === 'Histórico' ? '#4ecdc4' : '#ff6b6b';
                      return <circle cx={cx} cy={cy} r={4} fill={color} stroke="none" />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Col>
            <Col md={4}>
              <Card className="h-100" style={{ background: 'var(--neutral-light)', border: 'none' }}>
                <Card.Body>
                  <h6 style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                    Fórmula de Proyección
                  </h6>
                  <div className="p-3 bg-white rounded mb-3" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    <div className="text-muted">// Usando periodicidad</div>
                    <div>f(t) = f(t - 2πn)</div>
                    <div className="mt-2 text-muted">// Donde n = períodos</div>
                    <div>Proy(t) = 20 + 5·sin(t % 2π)</div>
                  </div>

                  <h6 style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>
                    Estimación Próximos Periodos
                  </h6>
                  <Table striped size="sm">
                    <thead>
                      <tr>
                        <th>Periodo</th>
                        <th>Estimado</th>
                        <th>Tendencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>t = 12</td>
                        <td>{Math.round(calcularVentas(12 % (2 * Math.PI)) * 100) / 100}</td>
                        <td><Badge bg="success">↗ Creciendo</Badge></td>
                      </tr>
                      <tr>
                        <td>t = 14</td>
                        <td>{Math.round(calcularVentas(14 % (2 * Math.PI)) * 100) / 100}</td>
                        <td><Badge bg="danger">↘ Decreciendo</Badge></td>
                      </tr>
                      <tr>
                        <td>t = 16</td>
                        <td>{Math.round(calcularVentas(16 % (2 * Math.PI)) * 100) / 100}</td>
                        <td><Badge bg="success">↗ Creciendo</Badge></td>
                      </tr>
                      <tr>
                        <td>t = 18</td>
                        <td>{Math.round(calcularVentas(18 % (2 * Math.PI)) * 100) / 100}</td>
                        <td><Badge bg="danger">↘ Decreciendo</Badge></td>
                      </tr>
                    </tbody>
                  </Table>

                  <Alert variant="warning" className="mt-2" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-info-circle me-1"></i>
                    La proyección usa la <strong>Inversa de Laplace</strong> para recuperar
                    la función temporal a partir de F(s) = 20/s + 5/(s²+1).
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Análisis y Recomendaciones */}
      <Card style={{ border: 'none', boxShadow: 'var(--card-shadow)' }}>
        <Card.Body>
          <h4 style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
            Analisis y Recomendaciones de Negocio
          </h4>
          <Row className="mt-4">
            <Col md={4}>
              <div className="d-flex align-items-start">
                <div className="me-3" style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: 'var(--primary-color)', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  <i className="bi bi-box-seam"></i>
                </div>
                <div>
                  <h6 style={{ fontWeight: 600 }}>Inventario</h6>
                  <p className="text-muted small">
                    Aumentar stock antes de los periodos de crecimiento 
                    (t = 4.71, 7.85) para satisfacer demanda.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex align-items-start">
                <div className="me-3" style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: 'var(--secondary-color)', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  <i className="bi bi-building"></i>
                </div>
                <div>
                  <h6 style={{ fontWeight: 600 }}>Producción</h6>
                  <p className="text-muted small">
                    Programar mayor capacidad de producción entre t = 0-1.57 
                    y t = 4.71-7.85 (50% del tiempo).
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex align-items-start">
                <div className="me-3" style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: 'var(--accent-color)', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  <i className="bi bi-bullhorn"></i>
                </div>
                <div>
                  <h6 style={{ fontWeight: 600 }}>Marketing</h6>
                  <p className="text-muted small">
                    Lanzar campañas promocionales al inicio de cada 
                    período creciente para maximizar impacto.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};
