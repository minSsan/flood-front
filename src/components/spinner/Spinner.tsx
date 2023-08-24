import "./Spinner.css";
import Loading from "../../assets/images/loading.svg";

function Spinner() {
  return (
    <div id="spinnerContainer">
      <img src={Loading} alt="로딩" />
    </div>
  );
}

export default Spinner;
