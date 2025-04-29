import React, { ReactNode, useEffect } from "react";

interface ModalProps {
  children: ReactNode;
  stateModal: boolean;
  setStateModal: (state: boolean) => void;
  showClose?: boolean;
  closeOutArea?: boolean;
}

export function Modal({
  children,
  stateModal,
  setStateModal,
  showClose = true,
  closeOutArea = true,
}: ModalProps) {
  const toggleModal = () => {
    setStateModal(!stateModal);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStateModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`absolute top-0 left-0 z-40 w-screen min-h-[100svh] h-full bg-black/30 flex justify-center items-center ${
        stateModal ? "" : "hidden"
      }`}
    >
      <div className="relative z-50 flex items-center justify-center w-4/5 min-h-[20%] bg-[var(--bg-modal)] rounded-2xl overflow-hidden">
        {children}
        {showClose && (
          <div
            className="absolute flex items-center justify-center overflow-hidden text-sm text-white bg-gray-600 rounded-full w-7 h-7 top-2 right-2 cursor-pointer"
            onClick={toggleModal}
          >
            X
          </div>
        )}
      </div>
      <div
        className="absolute w-full h-full"
        onClick={() => (closeOutArea ? setStateModal(false) : null)}
      ></div>
    </div>
  );
}
