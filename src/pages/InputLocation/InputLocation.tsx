import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Spinner from "../../components/spinner/Spinner";
import Map, { Position } from "../../components/map/Map";
import Layout from "../../components/Layout";
import "./InputLocation.css";
import MapMarker from "../../components/map-marker/MapMarker";
import InputText from "../../components/input-text/InputText";

const render = (status: Status): React.ReactElement => {
  if (status === Status.FAILURE)
    return (
      <>
        <p>지도를 불러오는 과정에서 오류가 발생했습니다. </p>
        <p>다시 시도해주세요.</p>
      </>
    );
  return <Spinner />;
};

function InputLocation() {
  // * Link 태그의 state param으로 전달받은 latitude, longitude 값 추출
  const location = useLocation();
  const { latitude, longitude, inputImage, floodResult } = location.state;

  // ! 현재 지도에서 선택된 위치 값
  const [center, setCenter] = useState<Position>({
    lat: latitude,
    lng: longitude,
  });

  // ! 사용자 입력 텍스트
  const inputTextRef = useRef<HTMLInputElement>(null);

  // * navigate
  const navigate = useNavigate();

  // * google 지도 화면을 클릭할 때 실행되는 콜백함수
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setCenter({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  }, []);

  // * 접수하기 버튼 클릭할 때 실행되는 함수
  const handleSubmit = useCallback(() => {
    // TODO: 백엔드에 입력 정보 업로드
    // ! 아래 정보를 백엔드 서버에 업로드 한다.
    console.log({
      location: center,
      image: inputImage,
      result: floodResult,
    });

    navigate("/complete");
  }, []);

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
            apiKey={process.env.REACT_APP_GOOGLE_API_KEY!}
            render={render}
          >
            <Map
              style={{ marginTop: "1.5rem" }}
              onClick={handleMapClick}
              center={center}
              zoom={19}
              mapTypeControl={false}
              streetViewControl={false}
            >
              <MapMarker position={center} />
            </Map>
          </Wrapper>

          <InputText
            ref={inputTextRef}
            style={{ marginTop: "1.25rem" }}
            placeholder="(선택) 특이사항이 있으면 입력해주세요."
          />
        </div>

        <div className="submitBtnContainer">
          <button
            type="submit"
            className="submitBtn active"
            onClick={handleSubmit}
          >
            접수하기
          </button>
        </div>
      </Layout>
    </>
  );
}

export default InputLocation;
