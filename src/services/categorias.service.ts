import api from './api';
import type { Categoria } from '../types/categoria.interface.ts';

const CategoriasService = {
  /**
   * Obtiene la lista completa de categorías desde el backend
   */
  obtenerTodas: async (): Promise<Categoria[]> => {
    const response = await api.get('/categorias');
    return response.data;
  },

  /**
   * Obtiene una sola categoría por su ID
   */
  obtenerPorId: async (id: number): Promise<Categoria> => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva categoría
   */
  crear: async (nombre: string): Promise<Categoria> => {
    const response = await api.post('/categorias', { nombre });
    return response.data;
  },

  /**
   * Actualiza una categoría existente
   * Nota: Usamos .put porque tu backend tiene @Put(':id')
   */
  actualizar: async (id: number, nombre: string): Promise<Categoria> => {
    const response = await api.put(`/categorias/${id}`, { nombre });
    return response.data;
  },

  /**
   * Elimina una categoría (siempre que no tenga artículos asociados)
   */
  eliminar: async (id: number): Promise<void> => {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  },
};

export default CategoriasService;
