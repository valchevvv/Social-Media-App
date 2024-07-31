import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MdClose } from "react-icons/md";

interface ModalProps {
  title?: string;
  content: ReactNode;
  isRequired?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge'; // Additional sizes
  fullscreen?: boolean; // Default is not fullscreen
  isImagePreview?: boolean; // Flag for image preview
}

interface ModalContextProps {
  showModal: (props: ModalProps) => void;
  hideAllModals: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalProps[]>([]);

  const showModal = (props: ModalProps) => {
    setModals([]);
    setModals([props]);
  };

  const hideAllModals = () => {
    setModals([]);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modals.length > 0 && !modals[modals.length - 1].isRequired) {
        setModals((prevModals) => prevModals.slice(0, -1));
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [modals]);

  const getModalSizeClass = (size: string | undefined) => {
    switch (size) {
      case 'small':
        return 'laptop:w-1/4 laptop:max-w-sm w-3/4 max-w-4xl';
      case 'medium':
        return 'laptop:w-1/2 laptop:max-w-2xl w-11/12 max-w-5xl';
      case 'large':
        return 'laptop:w-3/4 laptop:max-w-4xl w-full max-w-6xl';
      case 'xlarge':
        return 'laptop:w-full laptop:max-w-6xl w-full max-w-7xl';
      default:
        return 'laptop:w-3/4 laptop:max-w-4xl';
    }
  };

  const closeModalOnClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((event.target as Element).classList.contains('modal-overlay') && !modals[modals.length - 1]?.isRequired) {
      hideAllModals();
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, hideAllModals }}>
      {children}
      {modals.map((modal, index) => (
        <div
          key={index}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out modal-overlay`}
          onClick={closeModalOnClickOutside}
        >
          <div className={`bg-white ${modal.isImagePreview ? 'border-none p-0' : 'p-6'} rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out scale-95 ${modal.fullscreen ? 'w-full h-full' : modal.isImagePreview ? '' : getModalSizeClass(modal.size)}`}>
            {modal.isImagePreview ? (
              <div className="relative flex items-center justify-center w-full h-full rounded-xl">
                <button
                  onClick={() => setModals([])}
                  className="text-white hover:text-gray-200 absolute top-4 right-4 z-50"
                >
                  <MdClose fontSize={25} />
                </button>
                <div className="flex items-center justify-center w-full rounded-xl">
                  <img
                    src={modal.content as string}
                    alt="Preview"
                    className="tablet:h-screen ax-w-full object-contain rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className={`flex justify-between items-center ${modal.isImagePreview ? 'bg-transparent' : 'border-b pb-2 mb-4'}`}>
                  {!modal.isImagePreview && <h2 className="text-xl font-bold">{modal.title}</h2>}
                  <button
                    onClick={() => setModals([])}
                    className="text-gray-600 hover:text-gray-800 absolute top-4 right-4"
                  >
                    <MdClose fontSize={25} />
                  </button>
                </div>
                {modal.content}
              </>
            )}
          </div>
        </div>
      ))}
    </ModalContext.Provider>
  );
};
