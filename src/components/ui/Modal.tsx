"use client";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import Tooltip from "./Tooltip";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#101110] rounded-lg shadow-2xl max-w-3xl w-full mx-auto border border-[#292c29] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#272727] to-[#292c29] p-2 flex items-center justify-between">
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 rounded-full bg-red-500 items-center group hover:scale-[1.3] transition-all duration-300 cursor-pointer"
              onClick={onClose}
            >
              <Tooltip delay={10} content="Close modal" position="right">
                <X className="w-3 h-3 text-red-500 group-hover:text-gray-200 transition-colors ease-in-out duration-200" />
              </Tooltip>
            </div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {title && (
            <h2 className="text-sm font-mono text-green-400">~/{title}</h2>
          )}
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto font-mono text-green-400 bg-[#101110] scrollbar-terminal">
          <pre className="whitespace-pre-wrap">{children}</pre>
        </div>
      </div>
    </div>
  );
};

export default Modal;
