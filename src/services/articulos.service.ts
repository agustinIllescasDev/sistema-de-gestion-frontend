//articulos.service.ts

import api from './api';
import type { ParametrosPaginacion } from '../types/parametros-paginacion.interface';
import type { crearArticuloDto } from '../types/crear-articulo-dto.interface';
import type { actualizarArticuloDto } from '../types/actualizar-articulo-dto.interface';

const ArticulosService = {
  obtenerArticulos: async (queryParams: ParametrosPaginacion) => {
    const response = await api.get('/articulos', {
      params: queryParams,
    });
    return response.data;
  },

  obtenerArticuloPorId: async (id: number) => {
    const response = await api.get(`/articulos/${id}`);
    return response.data;
  },

  crearArticulos: async (dto: crearArticuloDto, imagen?: File) => {
    const formData = new FormData();
    formData.append('nombre', dto.nombre);
    formData.append('descripcion', dto.descripcion || '');
    formData.append('precio_base', dto.precio_base.toString());
    formData.append('porcentaje_ganancia', dto.porcentaje_ganancia.toString());
    formData.append('id_categoria', dto.id_categoria.toString());

    if (imagen) {
      formData.append('imagen', imagen);
    }

    const response = await api.post('/articulos', formData);
    return response.data;
  },

  actualizarArticulo: async (
    dto: actualizarArticuloDto,
    id: number,
    imagen?: File,
  ) => {
    const formData = new FormData();

    if (dto.nombre) formData.append('nombre', dto.nombre);
    if (dto.descripcion) formData.append('descripcion', dto.descripcion);
    if (dto.precio_base !== undefined) {
      formData.append('precio_base', dto.precio_base.toString());
    }

    if (dto.porcentaje_ganancia !== undefined) {
      formData.append(
        'porcentaje_ganancia',
        dto.porcentaje_ganancia.toString(),
      );
    }

    if (dto.id_categoria !== undefined) {
      formData.append('id_categoria', dto.id_categoria.toString());
    }

    if (imagen) {
      // Caso 1: Hay un archivo nuevo para subir
      formData.append('imagen', imagen);
    } else if (dto.imagen === '') {
      // Caso 2: El DTO tiene un string vacío (instrucción de borrar)
      // Enviamos un string 'null' porque FormData no soporta null real
      formData.append('imagen', 'null');
    }

    const response = await api.patch(`/articulos/${id}`, formData);
    return response.data;
  },

  eliminarArticulo: async (id: number) => {
    const response = await api.delete(`/articulos/${id}`);
    return response.data;
  },

  venderArticulo: async (id: number) => {
    const response = await api.patch(`/articulos/${id}/vender`);
    return response.data;
  },

  anularVenta: async (id: number) => {
    const response = await api.patch(`/articulos/${id}/anular-venta`);
    return response.data;
  },

  restaurarArticulo: async (id: number) => {
    const response = await api.patch(`/articulos/${id}/restaurar`);
    return response.data;
  },
};

export default ArticulosService;
