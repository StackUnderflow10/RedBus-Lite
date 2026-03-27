import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, children, title, originRect }) => {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('center center');

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      
      // Your original math to calculate the exact click origin
      if (originRect) {
        const MODAL_TOP = 96; // matches the pt-24 class (24 * 4px)
        const MODAL_MAX_W = 560;
        const sidePad = 16; 
        const modalWidth = Math.min(MODAL_MAX_W, window.innerWidth - sidePad * 2);
        const modalLeft = (window.innerWidth - modalWidth) / 2;

        const btnCenterX = originRect.left + originRect.width / 2;
        const btnCenterY = originRect.top + originRect.height / 2;
        const ox = btnCenterX - modalLeft;
        const oy = btnCenterY - MODAL_TOP;

        setTransformOrigin(`${ox}px ${oy}px`);
      } else {
        setTransformOrigin('center center');
      }

      // Small delay prevents the 1-frame flash before transition starts
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, originRect]);

  if (!rendered) return null;

  return (
    <div
      // Kept items-start and pt-24 so your math works perfectly
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 pb-8"
      style={{
        transition: 'background-color 0.3s ease',
        backgroundColor: visible ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          // Apple-style spring cubic-bezier for a premium feel
          transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: visible ? 1 : 0,
          // Changed from 0.04 to 0.4: Fixes the browser jank while keeping the origin effect!
          transform: visible ? 'scale(1)' : 'scale(0.4)',
          transformOrigin: transformOrigin,
          maxHeight: 'calc(100vh - 8rem)',
          overflowY: 'auto',
        }}
        className="w-full max-w-[560px] bg-[#161616] border border-[#2a2a2a] rounded-2xl shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222] shrink-0">
          <h2 className="text-[1.2rem] font-semibold tracking-tight text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#666] hover:text-white hover:bg-[#2a2a2a] transition-all duration-150"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;