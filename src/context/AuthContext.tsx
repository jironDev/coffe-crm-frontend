// import { createContext, useContext, useState, ReactNode } from 'react';

// interface AuthContextType {
//   token: string | null;
//   login: (token: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType>(null!);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   const login = (newToken: string) => {
//     localStorage.setItem('token', newToken);
//     setToken(newToken);
    

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, FC } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        return payload.role ?? null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setRole(payload.role ?? null);
    } catch {
      setRole(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
};
