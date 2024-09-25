import { ReactNode, createContext, useEffect, useState } from 'react';

import { JwtPayload, jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  verifyToken: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthLoading: true,
  login: (token: string) => {
    localStorage.setItem('userToken', token);
  },
  logout: () => {
    localStorage.removeItem('userToken');
  },
  verifyToken: () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedUser = jwtDecode<JwtPayload>(token);
      if (!decodedUser) return localStorage.removeItem('userToken');
      if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
        localStorage.removeItem('userToken');
      }
    } else {
      localStorage.removeItem('userToken');
    }
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      login(token);
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const login = (token: string) => {
    const decodedUser = jwtDecode<User>(token);
    setUser(decodedUser);
    localStorage.setItem('userToken', token);
    setIsAuthLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
    setIsAuthLoading(false);
  };

  const verifyToken = () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedUser = jwtDecode<JwtPayload>(token);
      if (!decodedUser) return logout();
      if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser(decodedUser as User);
        setIsAuthLoading(false);
      }
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, login, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};
