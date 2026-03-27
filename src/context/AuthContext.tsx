//auth.context.tsx

import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../types/auth-context.interface';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

//creamos un provider para el contexto de autenticación,
//que se encargará de manejar el estado de autenticación
//y proporcionar funciones para iniciar sesión y cerrar sesión.

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //inicializamos el estado de autenticación, verificando si existe un token en localStorage.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    //pasamos una funcion para que se ejecute solo una vez al cargar el componente, y no cada vez que se renderiza.
    return !!localStorage.getItem('access_token'); //con "!!" convertimos el valor a booleano, si existe el token devuelve true, sino false.
  });

  const login = (token: string) => {
    localStorage.setItem('access_token', token); //guardamos el token en localStorage
    setIsAuthenticated(true); //actualizamos el estado de autenticación a true
  };

  const logout = () => {
    localStorage.removeItem('access_token'); //eliminamos el token de localStorage
    setIsAuthenticated(false); //actualizamos el estado de autenticación a false
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
