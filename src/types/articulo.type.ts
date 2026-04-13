import type { EstadoArticulo } from './estado-articulo.type';
import type { Categoria } from './categoria.interface';

export interface Articulo {
  id_articulo: number;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  estado: EstadoArticulo;
  precio_base: number;
  precio_venta: number;
  deletedAt: Date | null;
  fecha_venta?: Date | string | null;
  categoria: Categoria;
}
