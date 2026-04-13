import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import CategoriasService from '../services/categorias.service';
import { Alertas } from '../utils/alerts';
import type { Categoria } from '../types/categoria.interface';

interface Props {
  open: boolean;
  onClose: () => void;
  categorias: Categoria[];
  onCreate: (categoria: Categoria) => void;
  onDelete: (idCategoria: number) => void;
}

const CategoriaManageModal = ({
  open,
  onClose,
  categorias,
  onCreate,
  onDelete,
}: Props) => {
  const [nombre, setNombre] = useState('');
  const [cargandoCrear, setCargandoCrear] = useState(false);
  const [cargandoEliminar, setCargandoEliminar] = useState<number | null>(null);

  // Desactivar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup: restaurar overflow cuando el componente se desmonte
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      Alertas.error(
        'Nombre requerido',
        'Por favor ingresa un nombre para la categoría',
      );
      return;
    }

    setCargandoCrear(true);
    try {
      const nuevaCategoria = await CategoriasService.crear(nombre.trim());
      await Alertas.exito(
        '¡Categoría creada!',
        'La categoría se agregó correctamente',
      );
      onCreate(nuevaCategoria);
      setNombre('');
    } catch (error) {
      console.error('Error al crear categoría:', error);
      Alertas.error('Error', 'No se pudo crear la categoría');
    } finally {
      setCargandoCrear(false);
    }
  };

  const handleEliminar = async (categoria: Categoria) => {
    const confirmado = await Alertas.confirmar(
      '¿Eliminar categoría?',
      `¿Estás seguro de que quieres eliminar "${categoria.nombre}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmado) return;

    setCargandoEliminar(categoria.id_categoria);
    try {
      await CategoriasService.eliminar(categoria.id_categoria);
      await Alertas.exito(
        '¡Categoría eliminada!',
        'La categoría se eliminó correctamente',
      );
      onDelete(categoria.id_categoria);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      Alertas.error(
        'Error',
        'No se pudo eliminar la categoría. Verifica que no tenga artículos asociados.',
      );
    } finally {
      setCargandoEliminar(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-stitch-sidebar border-stitch-border w-full max-w-2xl rounded-2xl border p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-stitch-primary text-xl font-black tracking-tighter uppercase italic">
            Gestionar Categorías
          </h2>
          <button
            onClick={onClose}
            className="text-stitch-text-muted hover:text-stitch-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Sección de crear categoría */}
          <div className="space-y-4">
            <h3 className="text-stitch-text-muted text-sm font-bold tracking-widest uppercase">
              Crear nueva categoría
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-stitch-text-muted mb-2 block text-xs font-bold tracking-widest uppercase">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Mesas, Sillas..."
                  className="bg-stitch-bg border-stitch-border focus:border-stitch-primary w-full rounded-xl border p-3 text-white transition-all outline-none"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={cargandoCrear}
                className="bg-stitch-primary shadow-stitch-primary/20 w-full rounded-xl py-3 font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {cargandoCrear ? 'Creando...' : 'Crear Categoría'}
              </button>
            </form>
          </div>

          {/* Sección de lista de categorías */}
          <div className="space-y-4">
            <h3 className="text-stitch-text-muted text-sm font-bold tracking-widest uppercase">
              Categorías existentes ({categorias.length})
            </h3>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {categorias.length === 0 ? (
                <p className="text-stitch-text-muted text-sm italic">
                  No hay categorías creadas aún.
                </p>
              ) : (
                categorias.map((categoria) => (
                  <div
                    key={categoria.id_categoria}
                    className="bg-stitch-bg border-stitch-border flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="font-medium text-white">
                      {categoria.nombre}
                    </span>
                    <button
                      onClick={() => handleEliminar(categoria)}
                      disabled={cargandoEliminar === categoria.id_categoria}
                      className="text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
                      title="Eliminar categoría"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="border-stitch-border bg-stitch-bg hover:bg-stitch-border rounded-xl border px-6 py-3 font-bold text-white transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriaManageModal;
