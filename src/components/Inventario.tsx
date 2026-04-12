// Inventario.tsx
import { useState, useEffect } from 'react';
import ArticulosService from '../services/articulos.service';
import CategoriasService from '../services/categorias.service.ts';
import { useSearch } from '../context/SearchContext';
import { Link } from 'react-router-dom';
import { IMAGES_URL } from '../utils/constants.ts';
import type { Articulo } from '../types/articulo.type';
import type { EstadoArticulo } from '../types/estado-articulo.type';
import type { Categoria } from '../types/categoria.interface.ts';
import CategoriaCreateModal from './CategoriaCreateModal';

const Inventario = () => {
  const { searchTerm } = useSearch();
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [pagina, setPagina] = useState(1);
  const [totalArticulos, setTotalArticulos] = useState(0);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>('');
  const [filtroEstado, setFiltroEstado] =
    useState<EstadoArticulo>('DISPONIBLE');
  const [mostrarCrearCategoria, setMostrarCrearCategoria] = useState(false);

  const limite = 12;

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await CategoriasService.obtenerTodas();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    cargarCategorias();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPagina(1);
  }, [debouncedTerm, filtroEstado, categoriaSeleccionada]);

  useEffect(() => {
    const obtenerArticulos = async () => {
      if (debouncedTerm.length > 0 && debouncedTerm.trim() === '') return;
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
  }, [debouncedTerm, filtroEstado, pagina, categoriaSeleccionada]);

  return (
    <div className="space-y-10">
      {' '}
      {/* Aumentamos el espacio general entre bloques */}
      {/* 1. SECCIÓN SUPERIOR: Título y Acción Principal */}
      <div className="border-stitch-border flex flex-col gap-6 border-b pb-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <h2 className="text-stitch-primary text-3xl font-black tracking-tighter uppercase italic md:text-4xl">
              Inventario
            </h2>
            <span className="bg-stitch-sidebar border-stitch-border text-stitch-text-muted rounded-full border px-4 py-1 text-[10px] font-bold tracking-wider uppercase shadow-inner">
              {totalArticulos} Items
            </span>
          </div>
          <p className="text-stitch-text-muted max-w-lg text-sm leading-relaxed font-medium">
            Gestioná y filtrá los artículos de tu catálogo.
          </p>
        </div>

        <Link
          to="/articulos/nuevo"
          className="bg-stitch-primary shadow-stitch-primary/20 flex h-12 w-full items-center justify-center gap-2.5 rounded-xl px-7 font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 md:w-auto"
        >
          <span className="text-2xl leading-none">+</span>
          <span className="text-xs font-extrabold tracking-wider uppercase">
            Cargar Artículo
          </span>
        </Link>
      </div>
      {/* 2. BARRA DE FILTROS: Unificada */}
      <div className="bg-stitch-sidebar border-stitch-border flex flex-col gap-6 rounded-2xl border p-5 shadow-sm md:flex-row md:items-end">
        {/* Selector de Categoría */}
        <div className="flex w-full flex-col gap-2 md:w-72">
          <label className="text-stitch-text-muted ml-1 text-[10px] font-black tracking-widest uppercase">
            Categoría
          </label>
          <select
            value={categoriaSeleccionada}
            onChange={(e) => {
              if (e.target.value === 'CREAR') {
                setMostrarCrearCategoria(true);
              } else {
                setCategoriaSeleccionada(e.target.value);
              }
            }}
            className="bg-stitch-background border-stitch-border focus:border-stitch-primary h-11 w-full cursor-pointer rounded-xl border px-4 text-xs font-bold text-white transition-all outline-none"
          >
            <option value="" className="bg-stitch-sidebar">
              TODAS LAS CATEGORÍAS
            </option>
            <option
              value="CREAR"
              className="bg-stitch-sidebar text-stitch-primary font-bold"
            >
              + AGREGAR CATEGORÍA
            </option>
            {categorias.map((cat) => (
              <option
                key={cat.id_categoria}
                value={cat.id_categoria}
                className="bg-stitch-sidebar"
              >
                {cat.nombre.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Estado */}
        <div className="flex flex-1 flex-col gap-2">
          <label className="text-stitch-text-muted ml-1 text-[10px] font-black tracking-widest uppercase">
            Estado
          </label>
          <div className="bg-stitch-background border-stitch-border flex h-11 w-full rounded-xl border p-1 md:w-fit">
            <button
              onClick={() => setFiltroEstado('DISPONIBLE')}
              className={`flex-1 rounded-lg px-6 text-[10px] font-black transition-all md:flex-none ${
                filtroEstado === 'DISPONIBLE'
                  ? 'bg-stitch-primary text-white shadow-md'
                  : 'text-stitch-text-muted hover:text-white'
              }`}
            >
              DISPONIBLES
            </button>
            <button
              onClick={() => setFiltroEstado('VENDIDO')}
              className={`flex-1 rounded-lg px-6 text-[10px] font-black transition-all md:flex-none ${
                filtroEstado === 'VENDIDO'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-stitch-text-muted hover:text-white'
              }`}
            >
              VENDIDOS
            </button>
          </div>
        </div>
      </div>
      {/* 3. GRILLA DE ARTÍCULOS */}
      {cargando ? (
        <div className="flex h-64 items-center justify-center">
          <div className="border-stitch-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articulos.length > 0 ? (
            articulos.map((art) => (
              <Link
                to={`/articulo/${art.id_articulo}`}
                key={art.id_articulo}
                className="bg-stitch-sidebar border-stitch-border group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
                  {art.imagen ? (
                    <img
                      src={`${IMAGES_URL}${art.imagen}`}
                      alt={art.nombre}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-500 italic">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-black text-white uppercase ${art.estado === 'DISPONIBLE' ? 'bg-stitch-primary' : 'bg-red-600'}`}
                    >
                      {art.estado}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="group-hover:text-stitch-primary mb-1 line-clamp-1 font-bold tracking-tight text-white uppercase italic transition-colors">
                    {art.nombre}
                  </h3>
                  <p className="text-stitch-text-muted mb-4 line-clamp-2 text-xs leading-relaxed font-medium">
                    {art.descripcion || 'Sin descripción disponible.'}
                  </p>
                  <div className="border-stitch-border mt-auto flex items-center justify-between border-t pt-4">
                    <span className="text-xl font-black text-white">
                      ${new Intl.NumberFormat('es-AR').format(art.precio_venta)}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-stitch-sidebar border-stitch-border col-span-full rounded-2xl border border-dashed py-20 text-center">
              <p className="text-stitch-text-muted text-lg font-medium italic">
                No se encontraron artículos.
              </p>
            </div>
          )}
        </div>
      )}
      {/* 4. PAGINACIÓN */}
      {totalArticulos > limite && (
        <div className="border-stitch-border mt-12 flex w-full flex-col items-center justify-between gap-6 border-t pt-10 md:flex-row">
          <div className="text-stitch-text-muted text-xs font-bold tracking-widest uppercase">
            Mostrando {articulos.length} de {totalArticulos} productos
          </div>
          <div className="flex items-center gap-3">
            <button
              className="bg-stitch-sidebar border-stitch-border hover:bg-stitch-background rounded-xl border px-5 py-2 text-xs font-bold text-white transition-all disabled:opacity-20"
              onClick={() => setPagina((p) => p - 1)}
              disabled={pagina === 1}
            >
              ← ANTERIOR
            </button>
            <div className="bg-stitch-primary/10 border-stitch-primary/30 text-stitch-primary flex h-10 w-10 items-center justify-center rounded-xl border font-black">
              {pagina}
            </div>
            <button
              className="bg-stitch-sidebar border-stitch-border hover:bg-stitch-background rounded-xl border px-5 py-2 text-xs font-bold text-white transition-all disabled:opacity-20"
              onClick={() => setPagina((p) => p + 1)}
              disabled={pagina >= Math.ceil(totalArticulos / limite)}
            >
              SIGUIENTE →
            </button>
          </div>
        </div>
      )}
      <CategoriaCreateModal
        open={mostrarCrearCategoria}
        onClose={() => setMostrarCrearCategoria(false)}
        onCreate={(categoria) => {
          setCategorias((prev) => [...prev, categoria]);
          setCategoriaSeleccionada(categoria.id_categoria.toString());
        }}
      />
    </div>
  );
};

export default Inventario;
