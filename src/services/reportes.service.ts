// reportes.service.ts

import api from './api';

const manejarErrorBlob = async (error: any) => {
  if (error.response && error.response.data instanceof Blob) {
    const textoError = await error.response.data.text();
    try {
      const jsonError = JSON.parse(textoError);
      return jsonError.message || 'Error en el servidor';
    } catch {
      return 'Error al procesar el archivo';
    }
  }
  return error.message || 'Error de conexión';
};

const ReportesService = {
  obtenerCatalogo: async () => {
    try {
      const response = await api.get('/pdf/catalogo', { responseType: 'blob' });
      return response.data;
    } catch (error) {
      const mensaje = await manejarErrorBlob(error);
      throw new Error(mensaje);
    }
  },

  obtenerReporteVentas: async () => {
    try {
      const response = await api.get('/pdf/ventas', { responseType: 'blob' });
      return response.data;
    } catch (error) {
      const mensaje = await manejarErrorBlob(error);
      throw new Error(mensaje);
    }
  },
};

export default ReportesService;
