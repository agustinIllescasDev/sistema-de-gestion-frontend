//reportes.service.tsx

import api from './api';

const ReportesService = {
  obtenerCatalogo: async () => {
    const response = await api.get('/pdf/catalogo', {
      responseType: 'blob',
    });
    return response.data;
  },

  obtenerReporteVentas: async () => {
    const response = await api.get('/pdf/ventas', {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default ReportesService;
