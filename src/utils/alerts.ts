import Swal from 'sweetalert2';

// Configuramos un diseño base para no repetir código
const StitchSwal = Swal.mixin({
  background: '#1a1d21', // Tu color de sidebar
  color: '#ffffff',
  confirmButtonColor: '#00e5ff', // Tu color primario (ajustalo al tuyo)
  cancelButtonColor: '#30363d',
  customClass: {
    popup: 'rounded-2xl border border-stitch-border',
  },
});

export const Alertas = {
  exito: (titulo: string, texto: string) => {
    return StitchSwal.fire({
      icon: 'success',
      title: titulo,
      text: texto,
      timer: 2000,
      showConfirmButton: false,
    });
  },
  error: (titulo: string, texto: string) => {
    return StitchSwal.fire({
      icon: 'error',
      title: titulo,
      text: texto,
    });
  },
  confirmar: (titulo: string, texto: string) => {
    return StitchSwal.fire({
      icon: 'question',
      title: titulo,
      text: texto,
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    });
  },
};
