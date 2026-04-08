// Tipos principales de la aplicación

export interface Muebleria {
  id_muebleria: number;
  nombre_negocio: string;
  razon_social: string;
  rfc: string;
  direccion_principal: string;
  telefono: string;
  creado_en: string;
  propietario_nombre?: string;
  propietario_email?: string;
  num_sucursales?: number;
  total_productos?: number;
  descripcion?: string;
  email?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  horario?: {
    lunes_viernes: string;
    sabado: string;
    domingo: string;
  };
  envio_gratis_minimo?: number;
  tiempo_entrega?: string;
  metodos_pago?: string[];
  categorias_principales?: string[];
}

export interface Producto {
  id_producto: number;
  sku: string;
  id_muebleria: number;
  nombre: string;
  descripcion: string;
  categoria?: string;
  unidad_medida: string;
  imagen_url?: string;
  precio_venta: number;
  peso_kg?: number;
  volumen_m3?: number;
  tipo_producto: 'materia_prima' | 'ensamblado' | 'producto_final';
  color?: string;
  material?: string;
  medidas?: string;
  creado_en: string;
  actualizado_en: string;
  muebleria_nombre?: string;
  categoria_nombre?: string;
  caracteristicas?: string[];
  stock_disponible?: number;
}

export interface Sucursal {
  id_sucursal: number;
  id_muebleria: number;
  nombre_sucursal: string;
  calle_numero: string;
  id_municipio: number;
  telefono: string;
  horario?: {
    lunes_viernes: string;
    sabado: string;
    domingo: string;
  };
  activo: boolean;
  creado_en: string;
  nombre?: string;
  estado_nombre?: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  role_id: number;
  fecha_registro: string;
  activo: boolean;
  role_nombre?: string;
  telefono?: string;
  id_municipio_default?: number;
  direccion_principal?: string;
  puntos?: number;
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  total_items: number;
}

export interface WishlistItem {
  id_deseo: number;
  id_cliente: number;
  id_producto: number;
  fecha_agregado: string;
  producto: Producto;
}

export interface Pedido {
  id_pedido: number;
  id_cliente: number;
  id_direccion?: number;
  fecha_pedido: string;
  tipo_entrega: 'recoger_tienda' | 'envio_domicilio';
  id_sucursal_origen?: number;
  estado_pedido: 'pendiente' | 'confirmado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
}

export interface DireccionEnvio {
  id_direccion: number;
  id_cliente: number;
  calle_numero: string;
  id_municipio: number;
  referencias?: string;
  nombre?: string;
  estado_nombre?: string;
}

export interface MetodoPago {
  id_metodo: number;
  tipo_pago: string;
  detalles_pago: any;
  estado_pago: string;
}

export interface Cupon {
  id_cupon: number;
  codigo: string;
  descuento_porcentaje: number;
  fecha_expiracion?: string;
  activo: boolean;
}

export interface Venta {
  id_venta: number;
  id_pedido?: number;
  id_cliente: number;
  id_metodo_pago?: number;
  id_cupon?: number;
  id_vendedor?: number;
  fecha_venta: string;
  sub_total: number;
  descuento: number;
  total_venta: number;
  comision: number;
  estado_venta: string;
}

export interface DetalleVenta {
  id_detalle_venta: number;
  id_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  total: number;
  total_items: number;
  loading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Filters {
  categoria?: string;
  ordenar?: 'nombre' | 'precio_asc' | 'precio_desc';
  precio_min?: number;
  precio_max?: number;
  color?: string;
  material?: string;
}

export interface SearchParams {
  q?: string;
  categoria?: string;
  ordenar?: string;
  pagina?: number;
}

// Tipos para el contexto de autenticación
export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  correo: string;
  password: string;
  password_confirm: string;
  telefono?: string;
}

// Tipos para el formulario de contacto
export interface ContactForm {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
}

// Tipos para reviews/calificaciones
export interface Review {
  id_review: number;
  id_producto: number;
  id_cliente: number;
  calificacion: number;
  comentario: string;
  fecha_review: string;
  cliente_nombre: string;
}

// Tipos para notificaciones
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

// Tipos para el estado de la UI
export interface UIState {
  loading: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}
