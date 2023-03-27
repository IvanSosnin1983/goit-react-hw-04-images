import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ largImage, onClose }) => {
  const handleKeyDown = evt => {
    if (evt.code === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = evt => {
    if (evt.currentTarget === evt.target) {
      onClose();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return createPortal(
    <div onClick={handleBackdropClick} className={css.overlay}>
      <div className={css.modal}>
        <img width={700} src={largImage} alt="" />
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  largImage: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
