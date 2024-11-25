import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxHeight: '90%',
        overflowY: 'auto',
        position: 'relative',
      }}>
        <button 
          onClick={() => onClose()} 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '5px 10px',
            cursor: 'pointer',
          }}>
          Zamknij
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
