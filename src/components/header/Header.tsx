import Logo from "../../assets/images/logo.svg";
import "./Header.css";

function Header() {
  return (
    <div id="headerContainer">
      <img src={Logo} id="logoImg" alt="" />
    </div>
  );
}

export default Header;
