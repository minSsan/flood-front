import React from "react";
import "./HomeButton.css";

interface HomeButtonProps {
  style?: React.CSSProperties;
  onClick?: () => any;
}

function HomeButton(props: HomeButtonProps) {
  const { style, onClick } = props;
  return (
    <button id="homeBtn" style={style} onClick={onClick}>
      <p className="fontSemiBold font18">홈으로</p>
    </button>
  );
}

export default HomeButton;
