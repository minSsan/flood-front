import React from "react";
import Logo from "../assets/images/logo.svg";
import "./Header.css";

function Header() {
  return (
    <div id="headerContainer">
      <img src={Logo} id="logoImg" />
    </div>
  );
}

export default Header;
