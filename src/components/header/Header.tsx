import { ForwardedRef, forwardRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import "./Header.css";

const Header = forwardRef<HTMLDivElement>(
  (props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <Link to={"/"}>
        <div ref={ref} id="headerContainer">
          <img src={Logo} id="logoImg" alt="" />
        </div>
      </Link>
    );
  }
);

export default Header;
