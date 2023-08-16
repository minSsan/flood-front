import { ForwardedRef, forwardRef } from "react";
import Logo from "../../assets/images/logo.svg";
import "./Header.css";

const Header = forwardRef<HTMLDivElement>(
  (props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref} id="headerContainer">
        <img src={Logo} id="logoImg" alt="" />
      </div>
    );
  }
);

export default Header;
