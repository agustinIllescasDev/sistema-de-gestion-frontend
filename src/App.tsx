//app.tsx
import ArticuloForm from './components/ArticuloForm';
import PantallaLogin from './components/PantallaLogin';
import { useAuth } from './context/AuthContext.tsx';
import MainLayout from './components/MainLayout';
import Inventario from './components/Inventario.tsx';
import { Routes, Route } from 'react-router-dom';
import ArticuloDetalle from './components/ArticuloDetalle.tsx';
import CambiarPassword from './components/cambiarPassword.tsx';
function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PantallaLogin />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Inventario />} />
        <Route path="/articulo/:id" element={<ArticuloDetalle />} />
        <Route path="/articulos/nuevo" element={<ArticuloForm />} />
        <Route path="/articulos/editar/:id" element={<ArticuloForm />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
