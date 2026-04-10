//ArticuloForm.tsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importamos el hook para navegar
import useEscapeNavigate from '../hooks/useEscapeNavigate';
import CategoriasService from '../services/categorias.service';
import ArticulosService from '../services/articulos.service';
import type { Categoria } from '../types/categoria.interface.ts';
import { Link } from 'react-router-dom';
import { Alertas } from '../utils/alerts.ts';
import { IMAGES_URL } from '../utils/constants.ts';

const ArticuloForm = () => {
  const navigate = useNavigate(); // Instanciamos la navegación
  const { id } = useParams();
  const isEdit = Boolean(id);
  useEscapeNavigate(() => {
    if (isEdit && id) {
      navigate(`/articulo/${id}`);
    } else {
      navigate('/');
    }
  });

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioBase, setPrecioBase] = useState<number | string>('');
  const [idCategoria, setIdCategoria] = useState<number | string>('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [porcentajeGanancia, setPorcentajeGanancia] = useState<number | string>(
    30,
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const inicializarFormulario = async () => {
      try {
        // 1. Cargamos las categorías primero
        const listaCategorias = await CategoriasService.obtenerTodas();
        setCategorias(listaCategorias);

        // 2. Si es edición, cargamos el artículo después de que las categorías ya estén en el estado
        if (isEdit && id) {
          const art = await ArticulosService.obtenerArticuloPorId(Number(id));

          setNombre(art.nombre);
          setDescripcion(art.descripcion);
          setPrecioBase(art.precio_base);
          setPorcentajeGanancia(art.porcentaje_ganancia);

          if (art.categoria && art.categoria.id_categoria) {
            // Validamos si id_categoria es un objeto o un número directo
            const catId = art.categoria.id_categoria;
            setIdCategoria(Number(catId));
          } else {
            Alertas.error(
              'Categoría no encontrada',
              'El artículo no tiene una categoría válida. Por favor, selecciónala manualmente.',
            );
          }
          // Lógica de imagen: intenta con 'art.imagen' que es lo común en Nest + TypeORM
          if (art.imagen) {
            // Si el backend devuelve solo el nombre del archivo, concatenamos la URL
            const urlBase = IMAGES_URL; // Asegúrate que este sea tu puerto de Nest
            const urlPreview = art.imagen.startsWith('http')
              ? art.imagen
              : `${urlBase}${art.imagen}`;
            setPreview(urlPreview);
          }
        }
      } catch (error) {
        console.error('Error al inicializar:', error);
        Alertas.error('Error', 'No se pudieron cargar los datos necesarios');
      }
    };

    inicializarFormulario();
  }, [id, isEdit]); // Se ejecutará cuando el ID de la URL cambie

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const precioVentaSugerido =
    Number(precioBase) +
    (Number(precioBase) * Number(porcentajeGanancia)) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idCategoria) {
      Alertas.error('Faltan datos', 'Por favor selecciona una categoría');
      return;
    }

    const dto = {
      nombre,
      descripcion,
      precio_base: Number(precioBase),
      porcentaje_ganancia: Number(porcentajeGanancia),
      id_categoria: Number(idCategoria),
    };

    try {
      if (isEdit && id) {
        await ArticulosService.actualizarArticulo(
          dto,
          Number(id),
          imagen || undefined,
        );
        await Alertas.exito('¡Actualizado!', 'Cambios guardados correctamente');
        navigate(`/articulo/${id}`); // Redirigimos al detalle tras actualizar
      } else {
        await ArticulosService.crearArticulos(dto, imagen || undefined);
        await Alertas.exito('¡Creado!', 'Artículo guardado con éxito');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      Alertas.error('Error', 'Hubo un problema al guardar el artículo');
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link
        to="/"
        className="text-stitch-text-muted hover:text-stitch-primary mb-4 flex w-fit items-center gap-2 transition-colors"
      >
        <span className="text-xl">←</span>
        <span className="font-medium">Volver al inventario</span>
      </Link>
      <h1 className="mb-8 text-3xl font-black tracking-tighter text-white uppercase italic">
        {isEdit ? 'Editar Artículo' : 'Nuevo Artículo'}
      </h1>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 md:grid-cols-2"
      >
        {/* COLUMNA IZQUIERDA: Datos básicos e Imagen */}
        <div className="bg-stitch-sidebar border-stitch-border space-y-6 rounded-2xl border p-6">
          <div>
            <label className="text-stitch-text-muted mb-2 block text-xs font-bold tracking-widest uppercase">
              Nombre del mueble
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej: Mesa de roble"
              className="bg-stitch-bg border-stitch-border focus:border-stitch-primary w-full rounded-xl border p-3 text-white transition-all outline-none"
            />
          </div>

          <div>
            <label className="text-stitch-text-muted mb-2 block text-xs font-bold tracking-widest uppercase">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles del estado, madera, etc..."
              className="bg-stitch-bg border-stitch-border focus:border-stitch-primary h-32 w-full resize-none rounded-xl border p-3 text-white transition-all outline-none"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-stitch-text-muted mb-2 block text-xs font-bold tracking-widest uppercase">
                Imagen del artículo (opcional)
              </label>
              <div className="border-stitch-border bg-stitch-bg hover:border-stitch-primary relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-all">
                {preview ? (
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="mb-2 h-40 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="py-4 text-center">
                    <span className="text-stitch-text-muted text-3xl">+</span>
                    <p className="text-stitch-text-muted mt-2 text-xs">
                      Click para subir imagen
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
              {imagen && (
                <p className="text-stitch-primary mt-1 text-[10px]">
                  Archivo: {imagen.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-stitch-text-muted mb-2 block text-xs font-bold tracking-widest uppercase">
                Categoría
              </label>
              <select
                value={idCategoria?.toString() || ''}
                onChange={(e) =>
                  setIdCategoria(
                    e.target.value === '' ? '' : Number(e.target.value),
                  )
                }
                required
                className="bg-stitch-bg border-stitch-border focus:border-stitch-primary w-full cursor-pointer rounded-xl border p-3 text-white outline-none"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Cálculos y Guardado */}
        <div className="space-y-6">
          <div className="bg-stitch-sidebar border-stitch-border space-y-6 rounded-2xl border p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-stitch-text-muted mb-2 block text-xs font-bold tracking-widest uppercase">
                  Precio Base ($)
                </label>
                <input
                  type="number"
                  value={precioBase}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPrecioBase(val === '' ? '' : Number(val));
                  }}
                  className="bg-stitch-bg border-stitch-border focus:border-stitch-primary w-full rounded-xl border p-3 font-mono text-white outline-none"
                />
              </div>
              <div>
                <label className="text-stitch-text-muted mb-2 block text-xs font-bold tracking-widest uppercase">
                  Ganancia (%)
                </label>
                <input
                  type="number"
                  value={porcentajeGanancia}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPorcentajeGanancia(val === '' ? '' : Number(val));
                  }}
                  className="bg-stitch-bg border-stitch-border focus:border-stitch-primary w-full rounded-xl border p-3 font-mono text-white outline-none"
                />
              </div>
            </div>

            <div className="bg-stitch-primary/10 border-stitch-primary/30 rounded-xl border p-4 text-center">
              <p className="text-stitch-text-muted mb-1 text-[10px] font-bold tracking-widest uppercase">
                Precio de venta sugerido
              </p>
              <p className="text-stitch-primary text-3xl font-black">
                ${new Intl.NumberFormat('es-AR').format(precioVentaSugerido)}
              </p>
            </div>
          </div>

          {/* Agrupamos los botones de acción para mantener el espaciado */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="bg-stitch-primary shadow-stitch-primary/20 w-full rounded-xl py-4 font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
            >
              {isEdit ? 'Actualizar Cambios' : 'Guardar Artículo'}
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={() => navigate(`/articulo/${id}`)}
                // Aplicamos los estilos exactos del botón de eliminar de tus capturas
                className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-4 font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArticuloForm;
