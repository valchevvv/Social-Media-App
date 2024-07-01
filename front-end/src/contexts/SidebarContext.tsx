// SidebarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}
interface SidebarProviderProps {
    children: ReactNode; // This line ensures that SidebarProvider accepts children
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebarContext must be used within a SidebarProvider');
    }
    return context;
};

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};