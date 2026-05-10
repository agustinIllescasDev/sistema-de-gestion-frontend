import { useState, useEffect, useRef } from 'react';
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

  const inputRef = useRef<HTMLInputElement>(null);

  // Efecto único para Foco, Scroll y Tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      // Bloqueamos el scroll
      document.body.style.overflow = 'hidden';
      // Escuchamos la tecla Escape
      window.addEventListener('keydown', handleKeyDown);
      // Damos foco al input
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    // Limpieza al cerrar o desmontar
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      Alertas.error('Nombre requerido', 'Por favor ingresa un nombre');
      return;
    }

    setCargandoCrear(true);
    try {
      const nuevaCategoria = await CategoriasService.crear(nombre.trim());
      onCreate(nuevaCategoria);
      setNombre('');
      // Mantenemos el foco después de crear
      inputRef.current?.focus();

      await Alertas.exito('¡Creada!', 'La categoría se agregó correctamente');
    } catch (error) {
      console.error(error);
      Alertas.error('Error', 'No se pudo crear la categoría');
    } finally {
      setCargandoCrear(false);
    }
  };

  const handleEliminar = async (categoria: Categoria) => {
    const confirmado = await Alertas.confirmar(
      '¿Eliminar categoría?',
      `¿Estás seguro de que quieres eliminar "${categoria.nombre}"?`,
    );

    if (!confirmado) return;

    setCargandoEliminar(categoria.id_categoria);
    try {
      await CategoriasService.eliminar(categoria.id_categoria);
      onDelete(categoria.id_categoria);
      await Alertas.exito(
        '¡Eliminada!',
        'La categoría se eliminó correctamente',
      );
    } catch (error) {
      console.error(error);
      Alertas.error('Error', 'No se pudo eliminar la categoría');
    } finally {
      setCargandoEliminar(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Crear */}
          <div className="space-y-4">
            <h3 className="text-stitch-text-muted text-sm font-bold tracking-widest uppercase">
              Nueva categoría
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-stitch-text-muted mb-2 block text-xs font-bold tracking-widest uppercase">
                  Nombre
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Mesas, Sillas..."
                  className="bg-stitch-bg border-stitch-border focus:border-stitch-primary w-full rounded-xl border p-3 text-white transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={cargandoCrear}
                className="bg-stitch-primary shadow-stitch-primary/20 w-full rounded-xl py-3 font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {cargandoCrear ? 'Creando...' : 'Crear (Enter)'}
              </button>
            </form>
          </div>

          {/* Lista */}
          <div className="space-y-4">
            <h3 className="text-stitch-text-muted text-sm font-bold tracking-widest uppercase">
              Existentes ({categorias.length})
            </h3>
            <div className="custom-scrollbar max-h-64 space-y-2 overflow-y-auto pr-2">
              {categorias.length === 0 ? (
                <p className="text-stitch-text-muted text-sm italic">
                  No hay categorías.
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
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="border-stitch-border bg-stitch-bg hover:bg-stitch-border rounded-xl border px-6 py-3 font-bold text-white transition-all"
          >
            Cerrar (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriaManageModal;
