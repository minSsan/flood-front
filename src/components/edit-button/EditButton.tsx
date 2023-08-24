import React from "react";
import PencilIcon from "../../assets/images/pencil-skyblue.svg";
import "./EditButton.css";

interface EditButtonProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => any;
}

function EditButton(props: EditButtonProps) {
  const { text, style, className, onClick } = props;
  const _style = Object.assign({ color: "#86B0EE" }, { ...style });

  return (
    <span
      style={_style}
      className={`modifyTextContainer fontSemiBold ${
        className ? className : ""
      }`}
      onClick={onClick}
    >
      {/* 아이콘 + 수정하기 */}
      <p>(</p>
      {/* pencil svg */}
      <img src={PencilIcon} alt="" />
      <p style={{ textDecoration: "underline" }}>{text}</p>
      <p>)</p>
    </span>
  );
}

export default EditButton;
