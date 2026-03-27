import { useState } from 'react';
import {
  Menu,
  X,
  Search,
  FileDown,
  KeyRound,
  LogOut,
  Database,
  Settings,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import ReportesService from '../services/reportes.service.ts';
import { useSearch } from '../context/SearchContext.tsx';

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const { logout } = useAuth();
  const { obtenerCatalogo, obtenerReporteVentas } = ReportesService;

  const handleDownloadCatalogo = async () => {
    setSideBarOpen(false);
    try {
      const blob = await obtenerCatalogo();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al descargar el catálogo:', error);
    }
  };

  const handleDownloadReporteVentas = async () => {
    setSideBarOpen(false);
    try {
      const blob = await obtenerReporteVentas();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al descargar el reporte de ventas:', error);
    }
  };

  return (
    <div className="bg-stitch-bg text-stitch-text-main min-h-screen">
      {/* Navbar fija */}
      <nav className="bg-stitch-sidebar border-stitch-border fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b px-4 shadow-lg">
        <div className="flex items-center">
          <button
            onClick={() => setSideBarOpen(!sideBarOpen)}
            className="hover:bg-stitch-border cursor-pointer rounded-md p-2 transition-colors"
          >
            {sideBarOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} className="text-stitch-primary" />
            )}
          </button>
          <span className="text-stitch-primary ml-4 hidden text-xl font-bold text-balance italic md:block">
            Compra y Venta - "Mi Sierra"
          </span>
        </div>

        <div className="relative mx-auto max-w-[180px] md:ml-auto md:max-w-md">
          <Search
            size={20}
            className="text-stitch-text-muted absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-stitch-bg border-stitch-border focus:ring-stitch-primary w-full rounded-full border py-2 pr-4 pl-10 focus:ring-1 focus:outline-none"
          />
        </div>
      </nav>

      {/* 1. Overlay (Fondo borroso que cierra al clickear) */}
      {sideBarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSideBarOpen(false)}
        />
      )}

      {/* 2. Sidebar Único y Estilizado */}
      <aside
        className={`bg-stitch-sidebar border-stitch-border fixed top-16 left-0 z-40 h-[calc(100vh-64px)] w-72 border-r p-4 shadow-2xl transition-transform duration-300 ease-in-out ${
          sideBarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between">
          <nav className="space-y-8">
            {/* Grupo de Reportes */}
            <div>
              <p className="text-stitch-text-muted mb-4 flex items-center gap-2 px-2 text-xs font-semibold tracking-widest uppercase">
                <BarChart3 size={14} /> Reportes y Datos
              </p>
              <ul className="space-y-1">
                <li
                  className="group hover:bg-stitch-primary/10 flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all"
                  onClick={handleDownloadCatalogo}
                >
                  <Database
                    size={20}
                    className="group-hover:text-stitch-primary text-stitch-text-muted transition-colors"
                  />
                  <span className="font-medium">Descargar catálogo</span>
                </li>
                <li
                  className="group hover:bg-stitch-primary/10 flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all"
                  onClick={handleDownloadReporteVentas}
                >
                  <FileDown
                    size={20}
                    className="group-hover:text-stitch-primary text-stitch-text-muted transition-colors"
                  />
                  <span className="font-medium">Reporte de ventas</span>
                </li>
              </ul>
            </div>

            {/* Grupo de Configuración */}
            <div>
              <p className="text-stitch-text-muted mb-4 flex items-center gap-2 px-2 text-xs font-semibold tracking-widest uppercase">
                <Settings size={14} /> Sistema
              </p>
              <ul className="space-y-1">
                <li className="group hover:bg-stitch-primary/10 flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all">
                  <KeyRound
                    size={20}
                    className="group-hover:text-stitch-primary text-stitch-text-muted transition-colors"
                  />
                  <span className="font-medium">Cambiar contraseña</span>
                </li>
              </ul>
            </div>
          </nav>

          {/* Botón de Salida */}
          <div className="border-stitch-border border-t pt-4">
            <button
              onClick={logout}
              className="hover:bg-stitch-sold/10 text-stitch-sold flex w-full items-center gap-3 rounded-lg p-3 font-bold transition-all"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="p-6 pt-20">{children}</main>
    </div>
  );
};

export default MainLayout;
