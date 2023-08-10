import React from "react";
import "./Modal.css";

interface ModalProps {
  children?: any;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalStyle?: React.CSSProperties;
}

function Modal(props: ModalProps) {
  const { children, setIsModalOpen, modalStyle } = props;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div id="modalContainer">
      <div id="modalBackdrop" onClick={() => setIsModalOpen(false)}>
        <div
          id="modalView"
          onClick={(e) => e.stopPropagation()}
          style={modalStyle}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
