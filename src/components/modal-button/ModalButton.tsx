import React from "react";
import "./ModalButton.css";

interface ModalButtonProps {
  onClick?: () => any;
  style?: React.CSSProperties;
  text?: string;
  active?: boolean;
}

function ModalButton(props: ModalButtonProps) {
  const { onClick, style, text, active } = props;
  return (
    <button
      onClick={onClick}
      className={`modalButton ${active ? "active" : ""}`}
      style={style}
    >
      <p className="fontSemiBold">{text}</p>
    </button>
  );
}

export default ModalButton;
