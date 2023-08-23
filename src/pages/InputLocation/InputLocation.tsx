import React, { ReactElement } from "react";
import InputScreenLayout from "../../components/input-screen-layout/InputScreenLayout";
import { Link, useLocation } from "react-router-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Spinner from "../../components/spinner/Spinner";
import Map from "../../components/map/Map";
import Layout from "../../components/Layout";
import "./InputLocation.css";

const render = (status: Status): React.ReactElement => {
  if (status === Status.FAILURE) return <></>;
  return <Spinner />;
};

function InputLocation() {
  const location = useLocation();
  const { latitude, longitude } = location.state;
  console.log("latitude >>>", latitude);
  console.log("longitude >>>", longitude);
  return (
    <>
      <Layout>
        <div id="inputLocationContainer">
          <div id="inputLocationWrapper">
            {/* //* title */}
            <h1 className="screenTitle">위치 선택</h1>

            {/* //* subtitle */}
            <h3 className="screenSubtitle" style={{ marginTop: "0.375rem" }}>
              업로드한 사진의 촬영 위치를 선택해주세요.
            </h3>
          </div>
          <Wrapper
            apiKey={"AIzaSyCn8uyroZOIRRZxPeAmwAUYnt-z08X9KbY"}
            render={render}
          >
            <Map
              style={{ marginTop: "0.563rem" }}
              center={{ lat: latitude, lng: longitude }}
              zoom={15}
            />
          </Wrapper>
        </div>

        <div className="submitBtnContainer">
          <Link to={"/complete"} className="submitBtn active">
            접수하기
          </Link>
        </div>
      </Layout>
    </>
  );
}

export default InputLocation;
