import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Cart, Producto } from '../types';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

interface CartContextType extends Cart {
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (id_producto: number) => void;
  updateQuantity: (id_producto: number, cantidad: number) => void;
  clearCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_ITEM'; payload: { producto: Producto; cantidad: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id_producto: number; cantidad: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: Cart & { loading: boolean } = {
  items: [],
  total: 0,
  total_items: 0,
  loading: false,
};

const cartReducer = (state: Cart & { loading: boolean }, action: CartAction): Cart & { loading: boolean } => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_CART':
      return {
        ...action.payload,
        loading: false,
      };
    case 'ADD_ITEM': {
      const { producto, cantidad } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.producto.id_producto === producto.id_producto
      );

      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // El producto ya existe, actualizar cantidad
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                subtotal: (item.cantidad + cantidad) * item.producto.precio_venta,
              }
            : item
        );
      } else {
        // Agregar nuevo producto
        newItems = [
          ...state.items,
          {
            producto,
            cantidad,
            subtotal: cantidad * producto.precio_venta,
          },
        ];
      }

      const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const newTotalItems = newItems.reduce((sum, item) => sum + item.cantidad, 0);

      return {
        ...state,
        items: newItems,
        total: newTotal,
        total_items: newTotalItems,
      };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.producto.id_producto !== action.payload);
      const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const newTotalItems = newItems.reduce((sum, item) => sum + item.cantidad, 0);

      return {
        ...state,
        items: newItems,
        total: newTotal,
        total_items: newTotalItems,
      };
    }
    case 'UPDATE_QUANTITY': {
      const { id_producto, cantidad } = action.payload;
      
      if (cantidad <= 0) {
        // Si la cantidad es 0 o menos, eliminar el item
        const newItems = state.items.filter(item => item.producto.id_producto !== id_producto);
        const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
        const newTotalItems = newItems.reduce((sum, item) => sum + item.cantidad, 0);

        return {
          ...state,
          items: newItems,
          total: newTotal,
          total_items: newTotalItems,
        };
      }

      const newItems = state.items.map(item =>
        item.producto.id_producto === id_producto
          ? {
              ...item,
              cantidad,
              subtotal: cantidad * item.producto.precio_venta,
            }
          : item
      );

      const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const newTotalItems = newItems.reduce((sum, item) => sum + item.cantidad, 0);

      return {
        ...state,
        items: newItems,
        total: newTotal,
        total_items: newTotalItems,
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        total_items: 0,
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde el servidor al iniciar
  useEffect(() => {
    const loadCart = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const response = await cartAPI.getCart();
        if (response.success && response.data) {
          dispatch({ type: 'SET_CART', payload: response.data });
        }
      } catch (error) {
        // Si hay error, cargar desde localStorage como fallback
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const cartData = JSON.parse(savedCart);
            dispatch({ type: 'SET_CART', payload: cartData });
          } catch (parseError) {
            console.error('Error parsing saved cart:', parseError);
          }
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadCart();
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    const cartData = {
      items: state.items,
      total: state.total,
      total_items: state.total_items,
    };
    localStorage.setItem('cart', JSON.stringify(cartData));
  }, [state.items, state.total, state.total_items]);

  const addItem = async (producto: Producto, cantidad = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { producto, cantidad } });
    
    try {
      await cartAPI.addItem(producto.id_producto, cantidad);
      toast.success('Producto agregado al carrito');
    } catch (error: any) {
      // Si hay error con el servidor, revertir el cambio local
      dispatch({ type: 'REMOVE_ITEM', payload: producto.id_producto });
      toast.error(error.response?.data?.message || 'Error al agregar producto');
    }
  };

  const removeItem = async (id_producto: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id_producto });
    
    try {
      await cartAPI.removeItem(id_producto);
      toast.success('Producto eliminado del carrito');
    } catch (error: any) {
      // Si hay error, podríamos recargar el carrito del servidor
      toast.error(error.response?.data?.message || 'Error al eliminar producto');
    }
  };

  const updateQuantity = async (id_producto: number, cantidad: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id_producto, cantidad } });
    
    try {
      await cartAPI.updateQuantity(id_producto, cantidad);
    } catch (error: any) {
      // Si hay error, podríamos recargar el carrito del servidor
      toast.error(error.response?.data?.message || 'Error al actualizar cantidad');
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    
    try {
      await cartAPI.clearCart();
      toast.success('Carrito vaciado');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al vaciar carrito');
    }
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
