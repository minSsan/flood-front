import React, { ForwardedRef, forwardRef } from "react";

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function InputText(props: InputTextProps) {
  const { id, name, value, onChange, style, placeholder } = props;
  const _style = Object.assign(
    {
      width: "17.563rem",
      maxWidth: "281px",

      border: "1px solid #A7A7A7",
      borderRadius: "0.625rem",

      padding: "0.75rem",
    },
    style
  );
  return (
    <input
      name={name}
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={_style}
      className="textInput"
    />
  );
}

export default InputText;
