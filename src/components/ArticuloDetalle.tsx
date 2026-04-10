import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useEscapeNavigate from '../hooks/useEscapeNavigate';
import ArticulosService from '../services/articulos.service';
import type { Articulo } from '../types/articulo.type';
import { IMAGES_URL } from '../utils/constants.ts';
import { Alertas } from '../utils/alerts';

const ArticuloDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useEscapeNavigate(() => navigate('/'));

  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const res: Articulo = await ArticulosService.obtenerArticuloPorId(
          Number(id),
        );
        setArticulo(res);
      } catch (error) {
        console.error('Error al cargar el artículo:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id]);

  const handleEliminar = async () => {
    const confirmacion = await Alertas.confirmar(
      '¿Estás seguro?',
      'Esta acción ocultará el artículo del inventario.',
    );

    if (confirmacion.isConfirmed) {
      try {
        await ArticulosService.eliminarArticulo(Number(id));
        await Alertas.exito('Eliminado', 'El artículo ha sido eliminado.');
        navigate('/');
      } catch (error) {
        console.error('Error al eliminar:', error);
        Alertas.error('Error', 'No se pudo eliminar el artículo.');
      }
    }
  };

  const handleVender = async () => {
    const confirmacion = await Alertas.confirmar(
      '¿Confirmar venta?',
      'El estado del artículo pasará a ser VENDIDO.',
    );

    if (confirmacion.isConfirmed) {
      try {
        await ArticulosService.venderArticulo(Number(id));
        await Alertas.exito(
          '¡Vendido!',
          'El artículo se actualizó correctamente.',
        );
        window.location.reload();
      } catch (error) {
        console.error(error);
        Alertas.error('Error', 'No se pudo procesar la venta.');
      }
    }
  };

  const handleAnularVenta = async () => {
    const confirmacion = await Alertas.confirmar(
      '¿Anular venta?',
      'El artículo volverá a estar DISPONIBLE y podrá ser editado o eliminado.',
    );

    if (confirmacion.isConfirmed) {
      try {
        await ArticulosService.anularVenta(Number(id));
        await Alertas.exito(
          'Venta Anulada',
          'El artículo vuelve a estar disponible.',
        );
        window.location.reload();
      } catch (error) {
        console.error(error);
        Alertas.error('Error', 'No se pudo anular la venta.');
      }
    }
  };

  if (cargando) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-stitch-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  if (!articulo) {
    return <div className="text-white">Artículo no encontrado.</div>;
  }

  const estaVendido = articulo.estado === 'VENDIDO';

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <Link
        to="/"
        className="text-stitch-text-muted hover:text-stitch-primary mb-4 flex w-fit items-center gap-2 transition-colors"
      >
        <span className="text-xl">←</span>
        <span className="font-medium">Volver al inventario</span>
      </Link>

      <div className="bg-stitch-sidebar border-stitch-border grid grid-cols-1 gap-10 rounded-3xl border p-8 shadow-2xl lg:grid-cols-2">
        {/* Lado Izquierdo: Imagen */}
        <div className="border-stitch-border bg-stitch-bg relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border">
          {articulo.imagen ? (
            <img
              src={`${IMAGES_URL}${articulo.imagen}`}
              alt={articulo.nombre}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="text-stitch-text-muted flex flex-col items-center">
              <span className="mb-2 text-4xl">🪑</span>
              <p className="text-sm font-medium">Sin imagen disponible</p>
            </div>
          )}
        </div>

        {/* Lado Derecho: Detalles */}
        <div className="flex flex-col py-2">
          <div className="mb-6">
            <h1 className="mb-2 text-4xl leading-tight font-black text-white">
              {articulo.nombre}
            </h1>
            <p className="text-stitch-primary text-sm font-semibold tracking-wide uppercase">
              {articulo.categoria.nombre}
            </p>
          </div>

          <div className="mb-8">
            <span
              className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase ${
                articulo.estado === 'DISPONIBLE'
                  ? 'bg-stitch-primary/10 text-stitch-primary border-stitch-primary/20'
                  : 'bg-stitch-sold/10 text-stitch-sold border-stitch-sold/20'
              }`}
            >
              {articulo.estado}
            </span>
          </div>

          <div className="flex-1">
            <h3 className="mb-2 font-bold text-white">Descripción</h3>
            <p className="text-stitch-text-muted text-lg leading-relaxed">
              {articulo.descripcion ||
                'Este artículo no tiene una descripción detallada todavía.'}
            </p>
          </div>

          {/* Sección de Precio y Acciones */}
          <div className="border-stitch-border mt-8 border-t pt-8">
            <div className="mb-8 flex flex-col">
              <span className="text-stitch-text-muted mb-1 text-sm font-medium">
                Precio de venta
              </span>
              <span className="text-5xl font-black text-white">
                $
                {new Intl.NumberFormat('es-AR').format(
                  Number(articulo.precio_venta),
                )}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                {!estaVendido ? (
                  <button
                    onClick={handleVender}
                    className="bg-stitch-primary shadow-stitch-primary/20 flex-1 rounded-xl px-8 py-4 font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
                  >
                    Marcar como vendido
                  </button>
                ) : (
                  <div className="bg-stitch-sidebar border-stitch-border text-stitch-text-muted flex flex-1 items-center justify-center rounded-xl border px-8 py-4 text-center text-xs font-black tracking-widest uppercase opacity-60 shadow-inner">
                    Producto ya vendido
                  </div>
                )}

                {/* Botón Editar Condicional */}
                {!estaVendido ? (
                  <Link
                    to={`/articulos/editar/${articulo.id_articulo}`}
                    className="border-stitch-border flex-1 rounded-xl border bg-transparent px-8 py-4 text-center font-bold text-white transition-all hover:bg-white/5"
                  >
                    Editar Artículo
                  </Link>
                ) : (
                  <button
                    disabled
                    className="bg-stitch-sidebar border-stitch-border text-stitch-text-muted flex-1 cursor-not-allowed rounded-xl border px-8 py-4 text-center font-bold opacity-50"
                  >
                    Editar Artículo
                  </button>
                )}
              </div>

              {/* Fila inferior: Eliminar o Anular */}
              {estaVendido ? (
                <button
                  onClick={handleAnularVenta}
                  className="w-full rounded-xl border border-amber-500/50 bg-amber-500/10 py-4 font-bold text-amber-500 transition-all hover:bg-amber-500 hover:text-white active:scale-[0.98]"
                >
                  Anular Venta
                </button>
              ) : (
                <button
                  onClick={handleEliminar}
                  className="w-full rounded-xl border border-red-500/50 bg-red-500/10 py-4 font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-[0.98]"
                >
                  Eliminar Artículo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticuloDetalle;
