import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Usuario, 
  Muebleria, 
  Producto, 
  Cart, 
  WishlistItem, 
  LoginCredentials, 
  RegisterData,
  ApiResponse,
  PaginatedResponse,
  Filters
} from '../types';

// Configuración base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8004/api';

// Crear instancia de axios con configuración base
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Función helper para manejar respuestas
const handleResponse = <T>(response: AxiosResponse): ApiResponse<T> => {
  // El backend devuelve { success: true, data: [...] }
  // Extraemos response.data.data si existe, sino usamos response.data
  const responseData = response.data;
  return {
    success: responseData.success ?? true,
    data: responseData.data ?? responseData,
  };
};

// API de Autenticación
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: Usuario; token: string }>> => {
    try {
      const response = await api.post('/login', credentials);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  },

  register: async (data: RegisterData): Promise<ApiResponse<{ user: Usuario; token: string }>> => {
    try {
      const response = await api.post('/register', data);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario',
      };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<Usuario>> => {
    try {
      const response = await api.get('/verify');
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener usuario',
      };
    }
  },

  updateProfile: async (data: Partial<Usuario>): Promise<ApiResponse<Usuario>> => {
    try {
      const response = await api.put('/auth/profile', data);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar perfil',
      };
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      await api.post('/auth/logout');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cerrar sesión',
      };
    }
  },
};

// API de Mueblerías
export const muebleriasAPI = {
  getAll: async (): Promise<ApiResponse<Muebleria[]>> => {
    try {
      const response = await api.get('/mueblerias');
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener mueblerías',
      };
    }
  },

  getById: async (id: number): Promise<ApiResponse<Muebleria>> => {
    try {
      const response = await api.get(`/mueblerias/${id}`);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener mueblería',
      };
    }
  },

  getSucursales: async (id: number): Promise<ApiResponse<any[]>> => {
    try {
      const response = await api.get(`/mueblerias/${id}/sucursales`);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener sucursales',
      };
    }
  },

  create: async (data: Partial<Muebleria>): Promise<ApiResponse<Muebleria>> => {
    try {
      const response = await api.post('/mueblerias', data);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear mueblería',
      };
    }
  },
};

// API de Productos
export const productosAPI = {
  getByMuebleria: async (
    idMuebleria: number, 
    filters?: Filters,
    page = 1,
    perPage = 12
  ): Promise<ApiResponse<PaginatedResponse<Producto>>> => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('per_page', perPage.toString());
      
      if (filters) {
        if (filters.categoria) searchParams.append('categoria', filters.categoria);
        if (filters.ordenar) searchParams.append('ordenar', filters.ordenar);
        if (filters.precio_min) searchParams.append('precio_min', filters.precio_min.toString());
        if (filters.precio_max) searchParams.append('precio_max', filters.precio_max.toString());
        if (filters.color) searchParams.append('color', filters.color);
        if (filters.material) searchParams.append('material', filters.material);
      }
      
      const response = await api.get(`/productos/muebleria/${idMuebleria}?${searchParams}`);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener productos',
      };
    }
  },

  getById: async (id: number): Promise<ApiResponse<Producto>> => {
    try {
      const response = await api.get(`/productos/${id}`);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener producto',
      };
    }
  },

  search: async (
    query: string,
    filters?: Filters,
    page = 1,
    perPage = 12
  ): Promise<ApiResponse<PaginatedResponse<Producto>>> => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('per_page', perPage.toString());
      searchParams.append('q', query);
      
      if (filters) {
        if (filters.categoria) searchParams.append('categoria', filters.categoria);
        if (filters.ordenar) searchParams.append('ordenar', filters.ordenar);
        if (filters.precio_min) searchParams.append('precio_min', filters.precio_min.toString());
        if (filters.precio_max) searchParams.append('precio_max', filters.precio_max.toString());
        if (filters.color) searchParams.append('color', filters.color);
        if (filters.material) searchParams.append('material', filters.material);
      }
      
      const response = await api.get(`/productos/search?${searchParams}`);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al buscar productos',
      };
    }
  },

  getCategorias: async (idMuebleria: number): Promise<ApiResponse<string[]>> => {
    try {
      const response = await api.get(`/productos/muebleria/${idMuebleria}/categorias`);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener categorías',
      };
    }
  },
};

// API de Carrito
export const cartAPI = {
  getCart: async (): Promise<ApiResponse<Cart>> => {
    try {
      const response = await api.get('/cart');
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener carrito',
      };
    }
  },

  addItem: async (idProducto: number, cantidad: number): Promise<ApiResponse<Cart>> => {
    try {
      const response = await api.post('/cart/add', {
        id_producto: idProducto,
        cantidad,
      });
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al agregar producto',
      };
    }
  },

  removeItem: async (idProducto: number): Promise<ApiResponse<Cart>> => {
    try {
      const response = await api.delete(`/cart/item/${idProducto}`);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar producto',
      };
    }
  },

  updateQuantity: async (idProducto: number, cantidad: number): Promise<ApiResponse<Cart>> => {
    try {
      const response = await api.put(`/cart/item/${idProducto}`, {
        cantidad,
      });
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar cantidad',
      };
    }
  },

  clearCart: async (): Promise<ApiResponse<null>> => {
    try {
      await api.delete('/cart');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al vaciar carrito',
      };
    }
  },
};

// API de Lista de Deseos
export const wishlistAPI = {
  getWishlist: async (): Promise<ApiResponse<WishlistItem[]>> => {
    try {
      const response = await api.get('/wishlist');
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener lista de deseos',
      };
    }
  },

  addItem: async (idProducto: number): Promise<ApiResponse<WishlistItem>> => {
    try {
      const response = await api.post('/wishlist/add', {
        id_producto: idProducto,
      });
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al agregar a la lista de deseos',
      };
    }
  },

  removeItem: async (idProducto: number): Promise<ApiResponse<null>> => {
    try {
      await api.delete(`/wishlist/item/${idProducto}`);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar de la lista de deseos',
      };
    }
  },

  moveToCart: async (idProducto: number): Promise<ApiResponse<Cart>> => {
    try {
      const response = await api.post(`/wishlist/move-to-cart/${idProducto}`);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al mover al carrito',
      };
    }
  },
};

// API de Pedidos
export const pedidosAPI = {
  getPedidos: async (page = 1, perPage = 10): Promise<ApiResponse<PaginatedResponse<any>>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      
      const response = await api.get(`/pedidos?${params}`);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener pedidos',
      };
    }
  },

  getPedidoById: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener pedido',
      };
    }
  },

  createPedido: async (data: any): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post('/pedidos', data);
      return handleResponse(response);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear pedido',
      };
    }
  },
};

// API de Contacto
export const contactAPI = {
  sendContactForm: async (data: any): Promise<ApiResponse<null>> => {
    try {
      await api.post('/contact', data);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al enviar formulario de contacto',
      };
    }
  },
};

export default api;
