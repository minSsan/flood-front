import React from "react";
import "./HomeButton.css";

function HomeButton(props: { style?: React.CSSProperties }) {
  const { style } = props;
  return (
    <button id="homeBtn" style={style}>
      <p className="fontSemiBold font18">홈으로</p>
    </button>
  );
}

export default HomeButton;
