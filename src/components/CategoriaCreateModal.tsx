import { useState } from 'react';
import { X } from 'lucide-react';
import CategoriasService from '../services/categorias.service';
import { Alertas } from '../utils/alerts';
import type { Categoria } from '../types/categoria.interface';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (categoria: Categoria) => void;
}

const CategoriaCreateModal = ({ open, onClose, onCreate }: Props) => {
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      Alertas.error(
        'Nombre requerido',
        'Por favor ingresa un nombre para la categoría',
      );
      return;
    }

    setCargando(true);
    try {
      const nuevaCategoria = await CategoriasService.crear(nombre.trim());
      await Alertas.exito(
        '¡Categoría creada!',
        'La categoría se agregó correctamente',
      );
      onCreate(nuevaCategoria);
      setNombre('');
      onClose();
    } catch (error) {
      console.error('Error al crear categoría:', error);
      Alertas.error('Error', 'No se pudo crear la categoría');
    } finally {
      setCargando(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-stitch-sidebar border-stitch-border w-full max-w-md rounded-2xl border p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-stitch-primary text-xl font-black tracking-tighter uppercase italic">
            Nueva Categoría
          </h2>
          <button
            onClick={onClose}
            className="text-stitch-text-muted hover:text-stitch-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-stitch-text-muted mb-2 block text-xs font-bold tracking-widest uppercase">
              Nombre de la categoría
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mesas, Sillas, Armarios..."
              className="bg-stitch-bg border-stitch-border focus:border-stitch-primary w-full rounded-xl border p-3 text-white transition-all outline-none"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border-stitch-border bg-stitch-bg hover:bg-stitch-border flex-1 rounded-xl border py-3 font-bold text-white transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="bg-stitch-primary shadow-stitch-primary/20 flex-1 rounded-xl py-3 font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              {cargando ? 'Creando...' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaCreateModal;
