import type { EstadoArticulo } from './estado-articulo.type';

export interface ParametrosPaginacion {
  estado?: EstadoArticulo;
  search?: string;
  pagina: number;
  limite: number;
}
