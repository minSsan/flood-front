import Layout from "../../components/Layout";
import "./Complete.css";
import CompleteLogo from "../../assets/images/complete-logo.svg";
import HomeButton from "../../components/home-button/HomeButton";

function Complete() {
  return (
    <Layout isOverlap>
      <div id="resultContainer">
        <div id="resultWrapper">
          <img
            style={{ marginTop: "19px", width: "6.875rem", height: "6.875rem" }}
            src={CompleteLogo}
            alt="정상 접수 로고"
          />

          <p className="font36 fontBold" style={{ color: "#363636" }}>
            접수 완료
          </p>
          <p
            style={{
              marginTop: "19px",
              color: "#aaaaaa",
              lineHeight: "1.563rem",
            }}
            className="font18"
          >
            성공적으로 접수되었습니다.
            <br />
            감사합니다.
          </p>
        </div>

        <HomeButton style={{ marginTop: "5rem" }} />
      </div>
    </Layout>
  );
}

export default Complete;
