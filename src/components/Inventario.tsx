// Inventario.tsx
import { useState, useEffect } from 'react';
import ArticulosService from '../services/articulos.service';
import { useSearch } from '../context/SearchContext';
import type { Articulo } from '../types/articulo.type';
import { Link } from 'react-router-dom';
import { IMAGES_URL } from '../utils/constants.ts';
import type { EstadoArticulo } from '../types/estado-articulo.type';
import CategoriasService from '../services/categorias.service.ts';

const Inventario = () => {
  const { searchTerm } = useSearch();
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [pagina, setPagina] = useState(1);
  const [totalArticulos, setTotalArticulos] = useState(0);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>('');

  const limite = 12;

  const [filtroEstado, setFiltroEstado] =
    useState<EstadoArticulo>('DISPONIBLE');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPagina(1);
  }, [debouncedTerm, filtroEstado]);

  useEffect(() => {
    if (debouncedTerm.length > 0 && debouncedTerm.trim() === '') {
      return;
    }

    //
    useEffect(() => {
      const categorias = CategoriasService.obtenerTodas();
    }, []);

    const obtenerArticulos = async () => {
      setCargando(true);
      try {
        const res = await ArticulosService.obtenerArticulos({
          estado: filtroEstado,
          search: debouncedTerm,
          pagina: pagina,
          limite: limite,
          categoria: categoriaSeleccionada
            ? parseInt(categoriaSeleccionada)
            : undefined,
        });
        setArticulos(res.data);
        setTotalArticulos(res.meta?.total || res.total || 0);
      } catch (error) {
        console.error('Error al traer datos', error);
      } finally {
        setCargando(false);
      }
    };
    obtenerArticulos();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [debouncedTerm, filtroEstado, pagina]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Grupo 1: Título y Contador - flex-1 para empujar desde la izquierda */}
        <div className="flex-1 space-y-1">
          <h2 className="text-stitch-primary text-2xl font-black tracking-tighter uppercase italic">
            Inventario
          </h2>
          <p className="text-stitch-text-muted text-xs font-medium">
            {articulos.length} {filtroEstado.toLowerCase()}s encontrados
          </p>
        </div>

        {/* Grupo 2: Selector de Estado - Quedará centrado en MD gracias al flex-1 de los lados */}
        <div className="bg-stitch-sidebar border-stitch-border flex self-center rounded-xl border p-1 shadow-inner md:self-auto">
          {/* Botón DISPONIBLES */}
          <button
            onClick={() => setFiltroEstado('DISPONIBLE')}
            className={`rounded-lg px-4 py-2 text-[10px] font-black transition-all md:text-xs ${
              filtroEstado === 'DISPONIBLE'
                ? 'bg-stitch-primary text-white shadow-md' // Activo: Celeste
                : 'text-stitch-text-muted hover:text-stitch-primary' // MEJORA: Hover celeste cuando está inactivo
            }`}
          >
            DISPONIBLES
          </button>

          {/* Botón VENDIDOS */}
          <button
            onClick={() => setFiltroEstado('VENDIDO')}
            className={`rounded-lg px-4 py-2 text-[10px] font-black transition-all md:text-xs ${
              filtroEstado === 'VENDIDO'
                ? 'bg-red-600 text-white shadow-md' // Activo: Rojo (puedes usar bg-red-500 o 600 según tu card)
                : 'text-stitch-text-muted hover:text-red-500' // Inactivo: Hover rojo
            }`}
          >
            VENDIDOS
          </button>
        </div>

        {/* Grupo 3: Botón Cargar - flex-1 + justify-end para empujar desde la derecha */}
        <div className="flex flex-1 justify-end">
          <Link
            to="/articulos/nuevo"
            className="bg-stitch-primary shadow-stitch-primary/20 flex h-11 w-full items-center justify-center gap-2 rounded-xl px-6 font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 md:w-auto"
          >
            <span className="text-xl">+</span>
            <span className="text-sm">Cargar Artículo</span>
          </Link>
        </div>
      </header>

      {cargando ? (
        <div className="flex h-64 items-center justify-center">
          <div className="border-stitch-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articulos.length > 0 ? (
            articulos.map((art) => (
              <Link
                to={`/articulo/${art.id_articulo}`}
                key={art.id_articulo}
                className="bg-stitch-sidebar border-stitch-border group flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Imagen del Artículo */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
                  {art.imagen ? (
                    <img
                      src={`${IMAGES_URL}${art.imagen}`}
                      alt={art.nombre}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-500 italic">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold text-white uppercase shadow-sm ${
                        art.estado === 'DISPONIBLE'
                          ? 'bg-stitch-primary'
                          : 'bg-red-500'
                      }`}
                    >
                      {art.estado}
                    </span>
                  </div>
                </div>
                {/* Cuerpo de la Tarjeta */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-stitch-primary mb-1 line-clamp-1 font-bold">
                    {art.nombre}
                  </h3>
                  <p className="text-stitch-text-muted mb-4 line-clamp-2 text-xs">
                    {art.descripcion || 'Sin descripción disponible.'}
                  </p>

                  <div className="border-stitch-border mt-auto flex items-center justify-between border-t pt-3">
                    <span className="text-lg font-black text-white">
                      ${new Intl.NumberFormat('es-AR').format(art.precio_venta)}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-stitch-text-muted text-lg">
                No se encontraron productos que coincidan con "{debouncedTerm}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Paginación */}
      {totalArticulos > limite && (
        <div className="mt-6 flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          {/* 1. Texto de resultados (Izquierda en desktop, arriba en mobile) */}
          <div className="order-2 text-sm text-gray-400 md:order-1">
            Mostrando {articulos.length} de {totalArticulos} resultados
          </div>

          {/* 2. Controles de Paginación (Centro en desktop, abajo en mobile) */}
          <div className="order-1 flex items-center gap-2 md:absolute md:left-1/2 md:order-2 md:-translate-x-1/2">
            <button
              className="rounded bg-gray-800 p-2 disabled:opacity-50"
              onClick={() => setPagina((p) => p - 1)}
              disabled={pagina === 1}
            >
              ←
            </button>

            <span className="rounded-md bg-gray-700 px-4 py-2 font-bold">
              Página {pagina}
            </span>

            <button
              className="rounded bg-gray-800 p-2 disabled:opacity-50"
              onClick={() => setPagina((p) => p + 1)}
              disabled={pagina >= Math.ceil(totalArticulos / limite)}
            >
              →
            </button>
          </div>

          {/* 3. Espaciador invisible para mantener el equilibrio (Solo Desktop) */}
          <div className="hidden w-[150px] md:order-3 md:block"></div>
        </div>
      )}
    </div>
  );
};

export default Inventario;
