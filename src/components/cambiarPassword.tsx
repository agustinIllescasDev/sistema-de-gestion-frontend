// src/pages/CambiarPassword.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';
import AdministradoresService from '../services/administradores.service';

const CambiarPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: 'exito' | 'error';
    texto: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    passwordActual: '',
    passwordNueva: '',
    passwordConfirm: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (formData.passwordNueva !== formData.passwordConfirm) {
      setMensaje({
        tipo: 'error',
        texto: 'Las nuevas contraseñas no coinciden.',
      });
      return;
    }

    const adminId = AdministradoresService.getIdDesdeToken();
    if (!adminId) {
      setMensaje({
        tipo: 'error',
        texto: 'No se pudo identificar la sesión activa.',
      });
      return;
    }

    setLoading(true);
    try {
      await AdministradoresService.cambiarPassword(adminId, {
        passwordActual: formData.passwordActual,
        passwordNueva: formData.passwordNueva,
        passwordConfirm: formData.passwordConfirm,
      });

      setMensaje({
        tipo: 'exito',
        texto: 'Contraseña actualizada correctamente.',
      });
      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      setMensaje({
        tipo: 'error',
        texto:
          error.response?.data?.message || 'Error al cambiar la contraseña.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center px-4">
      {/* Contenedor del Header: Forzamos max-w-md para que coincida con el ancho del form */}
      <div className="w-full max-w-md">
        {/* Botón Volver */}
        <Link
          to="/"
          className="text-stitch-text-muted mb-6 flex w-fit items-center gap-2 text-sm transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Volver al inventario
        </Link>

        {/* Header alineado */}
        <div className="mb-8">
          <h2 className="text-stitch-primary text-4xl font-black tracking-tighter uppercase italic">
            Seguridad
          </h2>
          <p className="text-stitch-text-muted text-sm font-medium">
            Actualiza tus credenciales de acceso.
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-stitch-sidebar border-stitch-border w-full space-y-6 rounded-2xl border p-8 shadow-2xl"
        >
          {mensaje && (
            <div
              className={`flex items-center gap-3 rounded-xl p-4 text-xs font-bold tracking-tight uppercase ${
                mensaje.tipo === 'exito'
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              }`}
            >
              {mensaje.tipo === 'exito' ? (
                <CheckCircle2 size={18} />
              ) : (
                <ShieldAlert size={18} />
              )}
              {mensaje.texto}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-stitch-text-muted ml-1 text-[10px] font-black tracking-widest uppercase">
                Contraseña Actual
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="bg-stitch-background border-stitch-border focus:border-stitch-primary h-12 w-full rounded-xl border px-4 text-sm text-white transition-all outline-none"
                value={formData.passwordActual}
                onChange={(e) =>
                  setFormData({ ...formData, passwordActual: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-stitch-text-muted ml-1 text-[10px] font-black tracking-widest uppercase">
                Nueva Contraseña
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="bg-stitch-background border-stitch-border focus:border-stitch-primary h-12 w-full rounded-xl border px-4 text-sm text-white transition-all outline-none"
                value={formData.passwordNueva}
                onChange={(e) =>
                  setFormData({ ...formData, passwordNueva: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-stitch-text-muted ml-1 text-[10px] font-black tracking-widest uppercase">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="bg-stitch-background border-stitch-border focus:border-stitch-primary h-12 w-full rounded-xl border px-4 text-sm text-white transition-all outline-none"
                value={formData.passwordConfirm}
                onChange={(e) =>
                  setFormData({ ...formData, passwordConfirm: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-stitch-primary flex h-12 w-full items-center justify-center gap-2 rounded-xl text-xs font-black tracking-widest text-white uppercase shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <KeyRound size={18} />
              {loading ? 'Procesando...' : 'Actualizar Contraseña'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-stitch-text-muted w-full text-center text-[10px] font-bold tracking-widest uppercase transition-all hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarPassword;
