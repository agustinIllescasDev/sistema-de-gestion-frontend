import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ISearchContext } from '../types/search-context.interface';

export const SearchContext = createContext<ISearchContext | undefined>(
  undefined,
);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error(
      'useSearch debe ser utilizado dentro de un SearchProvider.',
    );
  }
  return context;
};
