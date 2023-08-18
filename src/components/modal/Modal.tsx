import React from "react";
import "./Modal.css";
import Row from "../row/Row";
import CloseIcon from "../../assets/images/close.png";

interface ModalProps {
  title?: string;
  children?: any;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalStyle?: React.CSSProperties;
}

function Modal(props: ModalProps) {
  const { title, children, setIsModalOpen, modalStyle } = props;

  return (
    <div id="modalContainer">
      <div id="modalBackdrop" onClick={() => setIsModalOpen(false)}>
        <div
          id="modalView"
          onClick={(e) => e.stopPropagation()}
          style={modalStyle}
        >
          {/* //* 모달창 제목 + 닫기 버튼 */}
          <Row style={{ justifyContent: "space-between" }}>
            <p className="fontSemiBold">{title}</p>
            <img
              src={CloseIcon}
              alt="닫기"
              style={{
                width: "1.5rem",
                height: "1.5rem",
              }}
              onClick={() => setIsModalOpen(false)}
            />
          </Row>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
