import React from "react";
import { Link } from "react-router-dom";
import "./HomeButton.css";

interface HomeButtonProps {
  style?: React.CSSProperties;
}

function HomeButton(props: HomeButtonProps) {
  const { style } = props;
  return (
    <Link to={"/"} id="homeBtn" style={style}>
      <p className="fontSemiBold font18">홈으로</p>
    </Link>
  );
}

export default HomeButton;
