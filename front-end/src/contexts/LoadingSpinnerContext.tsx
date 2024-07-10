import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingSpinnerContextType {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

const LoadingSpinnerContext = createContext<LoadingSpinnerContextType | undefined>(undefined);

export const LoadingSpinnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    return (
        <LoadingSpinnerContext.Provider value={{ isLoading, startLoading, stopLoading }}>
            {children}
        </LoadingSpinnerContext.Provider>
    );
};

export const useLoadingSpinner = (): LoadingSpinnerContextType => {
    const context = useContext(LoadingSpinnerContext);
    if (!context) {
        throw new Error('useLoadingSpinner must be used within a LoadingSpinnerProvider');
    }
    return context;
};
