import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: (token: string) => {
        localStorage.setItem('userToken', token);
    },
    logout: () => {
        localStorage.removeItem('userToken');
    },
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            login(token);
        }
    }, []);

    const login = (token: string) => {
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
        localStorage.setItem('userToken', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};