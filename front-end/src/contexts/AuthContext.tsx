import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface User {
    _id: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    verifyToken: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
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
            if(!decodedUser) return localStorage.removeItem('userToken');
            if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
                localStorage.removeItem('userToken');
            }
        }else{
            localStorage.removeItem('userToken');
        }
    }
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

    const verifyToken = () => {
        const token = localStorage.getItem('userToken');
        if (token) {
            const decodedUser = jwtDecode<JwtPayload>(token);
            if(!decodedUser) return logout();
            if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
                logout();
            }
        }else {
            logout();
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, verifyToken }}>
            {children}
        </AuthContext.Provider>
    );
};