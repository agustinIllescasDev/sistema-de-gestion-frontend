export interface crearArticuloDto {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  porcentaje_ganancia: number;
  id_categoria: number;
}
