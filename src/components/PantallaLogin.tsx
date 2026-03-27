//PantallaLogin.tsx

import { useState } from 'react';
import handleLogin from '../services/auth.service.ts';
import type { LoginResponse } from '../types/login-response.interface.tsx';
import { useAuth } from '../context/AuthContext.tsx';

const PantallaLogin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setError(null); //reiniciamos el error antes de intentar iniciar sesión
    try {
      const response: LoginResponse = await handleLogin({
        mail: email,
        password: password,
      });

      login(response.access_token);
      console.log('Inicio de sesion exitoso');
    } catch (error: any) {
      console.error('Error capturado:', error.response?.data);

      //Manejo de errores basado en la respuesta del backend
      const backendMessage = error.response?.data?.message;
      if (error.response?.status === 401) {
        setError('Credenciales incorrectas. Revisa tu correo y contraseña.');
      } else if (error.respnse?.status === 400) {
        const mensajeFinal = Array.isArray(backendMessage)
          ? backendMessage[0]
          : backendMessage;
        setError(
          mensajeFinal ||
            'Datos invalidos. Por favor, verifica e intenta nuevamente.',
        );
      } else {
        setError('Hubo un problema con el servidor. Intenta más tarde.');
      }
    }
  };

  return (
    <div className="bg-stitch-bg flex min-h-screen items-center justify-center p-4">
      <div className="bg-stitch-card border-stitch-border w-full max-w-md rounded-lg border p-8 shadow-xl">
        <header className="mb-8 text-center">
          <h1 className="text-stitch-primary mb-2 text-3xl font-bold">
            Sistema de Gestión
          </h1>
          <p className="text-stitch-text-muted">
            Compra-venta de artículos usados
          </p>
        </header>

        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="mail"
              className="text-stitch-text-main mb-2 block text-sm font-medium"
            >
              Correo Electrónico
            </label>
            {error && (
              <div className="bg-stitch-sold/20 border-stitch-sold text-stitch-sold mb-4 rounded-md border p-3 text-center text-sm">
                <strong>⚠️ Error:</strong> {error}
              </div>
            )}
            <input
              type="email"
              id="mail"
              value={email}
              placeholder="nombre@ejemplo.com"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-stitch-bg border-stitch-border text-stitch-text-main focus:ring-stitch-primary w-full rounded-md border p-3 transition-all focus:ring-2 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-stitch-text-main mb-2 block text-sm font-medium"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-stitch-bg border-stitch-border text-stitch-text-main focus:ring-stitch-primary w-full rounded-md border p-3 transition-all focus:ring-2 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-stitch-primary hover:bg-stitch-primary-hover text-stitch-bg w-full rounded-md py-3 font-bold transition-colors duration-300"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default PantallaLogin;
