// src/services/administradores.service.ts
import API from './api'; // Asumiendo que usas tu instancia de axios configurada

const AdministradoresService = {
  cambiarPassword: async (id: number, datos: any) => {
    const res = await API.patch(
      `/administradores/${id}/cambiar-password`,
      datos,
    );
    return res.data;
  },

  // Función auxiliar para obtener el ID del admin desde el token
  getIdDesdeToken: (): number | null => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id; // Ajusta según el nombre del campo en tu JWT de NestJS
    } catch (e) {
      return null;
    }
  },
};

export default AdministradoresService;
