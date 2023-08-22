import React, { useCallback, useEffect, useRef, useState } from "react";
import { FloodResult, getFloodResult } from "../../services/flood";
import "./Home.css";
import * as loadImage from "blueimp-load-image";
import {
  DateTimeFormatter,
  FormattedDateInfo,
} from "../../utils/date-time-formatter";
import QuestionIcon from "../../assets/images/question-icon.svg";
import EditButton from "../../components/edit-button/EditButton";
import Modal from "../../components/modal/Modal";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import InputScreenLayout from "../../components/input-screen-layout/InputScreenLayout";
import { Link, NavLink } from "react-router-dom";
import Layout from "../../components/Layout";
import useCurrentLocation, { Location } from "../../hooks/useCurrentLocation";
import { locationFormatter } from "../../utils/location-formatter";

function Home() {
  // ? scroll ref - 스크롤 조작을 위해 사용
  const scrollRef = useRef<HTMLDivElement>(null);
  // ? file(image) input tag
  const imageInputRef = useRef<HTMLInputElement>(null);
  // ? image preview tag
  const imagePreviewRef = useRef<HTMLImageElement>(null);

  // ? 사용자가 입력한 이미지를 base64 형식으로 저장
  // -> base64 형식 변환은 onChange 내에서 FileReader로 처리)
  const [inputImage, setInputImage] = useState<string | null>(null);
  // ? 홍수 이미지 분석 여부
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  // ? 홍수 분석 결과 텍스트
  const [floodResult, setFloodResult] = useState<FloodResult | null>(null);
  // ? 모달창 열림 / 닫힘 여부
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // ? 사진 촬영일 텍스트
  const [dateInfo, setDateInfo] = useState<Date | null>(null);
  // ? 디바이스 위치 정보
  const { location: deviceLocation, error: deviceLocationError } =
    useCurrentLocation();
  // ? 현재 입력된 이미지의 위치 정보
  const [imageLocation, setImageLocation] = useState<Location | null>(null);

  // ! test
  console.log("rendered");
  console.info("location >>> ", deviceLocation);
  console.info("location error >>>", deviceLocationError);
  console.info("imageLocation >>>", imageLocation);

  // * 홍수 모델 실행 함수
  const executeModel = useCallback(() => {
    getFloodResult(imagePreviewRef.current!)
      .then((res) => {
        if (!res) {
          alert("분석 과정에서 오류가 발생하였습니다.\n다시 시도해주세요.");
          return;
        }
        // ? 분석이 완료되었음을 기록
        setIsAnalyzed(true);

        // ? 홍수 사진이 아닐 경우에는 결괏값을 기록하지 않는다.
        if (res.floodLevel === "normal") return;
        setFloodResult(res);
      })
      .catch((err) => console.error(err));
  }, []);

  // * 이미지 삭제 버튼 클릭시 실행되는 함수
  // - 모든 입력값 초기화
  const handleRemoveButton = useCallback(() => {
    setInputImage(null);
    setDateInfo(null);
    setIsAnalyzed(false);
    setFloodResult(null);
    setImageLocation(null);
  }, []);

  /**
   * 입력 이미지가 변경될 때마다 실행되는 함수 (onChange 콜백함수)
   * 1. preview image를 FileReader를 사용하여 반영한다.
   * 2. 입력 이미지의 메타 데이터(위치 정보 및 촬영 시간)를 추출한다.
   */
  const handleFileChange = useCallback(async () => {
    setDateInfo(null);
    setIsAnalyzed(false);
    setFloodResult(null);
    setImageLocation(null);

    // TODO: input값 없을 경우 처리 필요 - 현재 에러 발생함
    if (imageInputRef.current?.files) {
      // * 1. Preview Image 설정
      const file = imageInputRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // ? type 검증 - string type 보장
        if (typeof reader.result === "string") {
          setInputImage(reader.result);
        }
      };

      // * 2. MetaData 추출
      loadImage.parseMetaData(file, (data) => {
        // * - 촬영 시간 정보
        if (data.exif?.get("Exif")) {
          //@ts-ignore
          const dateTimeInfo = data.exif?.get("Exif").get("DateTimeOriginal");

          // ? 촬영일 정보가 존재하는 경우
          if (dateTimeInfo) {
            const date: FormattedDateInfo = DateTimeFormatter(dateTimeInfo);
            setDateInfo(
              new Date(
                date.year,
                date.month - 1,
                date.date,
                date.hours,
                date.minutes
              )
            );
          }
        }

        // * - 촬영 위치 정보
        if (data.exif?.get("GPSInfo")) {
          const GPS = data.exif.get("GPSInfo");
          // console.log("GPS >>>", GPS);
          setImageLocation(
            locationFormatter({
              //@ts-ignore
              latitude: GPS.get("GPSLatitude"),
              //@ts-ignore
              longitude: GPS.get("GPSLongitude"),
            })
          );
        }
      });
    }
  }, []);

  // * 분석 시작 버튼을 누를 때 실행되는 함수
  // - 항상 isAnalyzed === false 인 상태에서 호출된다.
  const handleStartAnalyze = useCallback(() => {
    // ? 사진을 입력하지 않은 경우
    if (!inputImage) {
      alert("사진을 입력해주세요.");
      return;
    }
    // ? 사진 입력 완료 + 날짜 기입 안 된 경우
    if (!dateInfo) {
      alert("촬영 시간을 입력해주세요.");
      return;
    }
    // ? 사진 입력 완료 + 날짜 기입 완료된 경우
    executeModel();
  }, [inputImage, dateInfo]);

  // * 제출 버튼 - 조건부 렌더링
  const SubmitButton: () => JSX.Element = useCallback(() => {
    // ? 홍수 분석을 아직 하지않은 경우
    if (!isAnalyzed) {
      return (
        <button
          className={`submitBtn ${
            inputImage && dateInfo ? "active" : "inactive"
          }`}
          type="submit"
          onClick={handleStartAnalyze}
        >
          분석 시작
        </button>
      );
    }

    // ? 홍수 분석을 완료한 경우
    // ? 1. 홍수로 판별된 사진인 경우
    if (floodResult) {
      return (
        <Link to={"/location"} className="submitBtn active">
          위치 입력
        </Link>
      );
    }
    // ? 2. 홍수가 아니라고 판별된 사진인 경우
    else {
      return (
        <button
          className={"submitBtn inactive"}
          type="submit"
          onClick={() => alert("홍수 사진이 아닌 정보는 제출하실 수 없습니다.")}
        >
          위치 입력
        </button>
      );
    }
  }, [isAnalyzed, floodResult, inputImage, dateInfo]);

  // * 분석 결과 노출시 스크롤을 맨 아래로 이동
  useEffect(() => {
    isAnalyzed && window.scrollTo(0, scrollRef.current?.scrollHeight!);
  }, [isAnalyzed]);

  return (
    <>
      <Layout>
        <div ref={scrollRef} className="homeContainer">
          {/* //* 촬영 시간 입력 모달창 */}
          {isModalOpen && (
            <Modal
              title="촬영 시간 직접입력"
              setIsModalOpen={setIsModalOpen}
              modalStyle={{ position: "relative" }}
            >
              <DateTimePicker
                className="datePicker"
                format={`YYYY년 MM월 DD일 HH:mm`}
                value={dayjs(dateInfo)}
                maxDateTime={dayjs()}
                slotProps={{ textField: { size: "small" } }}
                onAccept={(value) => {
                  if (value) {
                    setDateInfo(new Date(value.toISOString()));
                    setIsModalOpen(false);
                  }
                }}
              />
            </Modal>
          )}

          <div style={{ padding: "2.875rem 0" }}>
            {/* //* title */}
            <h1 className="screenTitle">사진 업로드</h1>
            {/* //* subtitle */}
            <h3 className="screenSubtitle" style={{ marginTop: "0.375rem" }}>
              홍수 발생 지역의 사진을 업로드 해주세요.
            </h3>

            {/* //* image input & image preview */}
            <div className="previewContainer">
              {inputImage ? (
                // ? 이미지를 입력한 경우, 입력한 이미지를 띄운다.
                <>
                  <div>
                    <img
                      className="previewImg"
                      ref={imagePreviewRef}
                      src={inputImage}
                      alt="입력 사진"
                    />
                    {/* //? 이미지 삭제 버튼 */}
                    <button
                      className="removeImgBtn"
                      onClick={handleRemoveButton}
                    />
                  </div>

                  {/* //* 촬영 시간 정보 */}
                  {/* //? 촬영 시간 제목 */}
                  <h3
                    className="screenSmallTitle"
                    style={{ marginTop: "1.375rem" }}
                  >
                    촬영 시간
                  </h3>

                  {/* //? 촬영 시간 텍스트 */}
                  <div style={{ marginTop: "0.375rem" }}>
                    {dateInfo ? (
                      <>
                        <p className="dateText">{`${dateInfo.getFullYear()}년 ${
                          dateInfo.getMonth() + 1
                        }월 ${dateInfo.getDate()}일 ${
                          dateInfo.getHours() < 10
                            ? "0" + dateInfo.getHours()
                            : dateInfo.getHours()
                        }:${
                          dateInfo.getMinutes() < 10
                            ? "0" + dateInfo.getMinutes()
                            : dateInfo.getMinutes()
                        }`}</p>
                        {/* //? 촬영 시간 수정 안내 및 버튼 */}
                        <span
                          className="dateInputInfoContainer"
                          style={{ marginTop: "0.25rem" }}
                          onClick={() => setIsModalOpen(true)}
                        >
                          {/* 촬영 시간 수정 안내 */}
                          <img
                            className="questionMark"
                            src={QuestionIcon}
                            alt=""
                          />
                          <p style={{ marginLeft: "0.188rem" }}>
                            사진의 실제 촬영 시간과 다른가요?
                          </p>

                          {/* 촬영 시간 수정 버튼 */}
                          <EditButton style={{ marginLeft: "0.188rem" }} />
                        </span>
                      </>
                    ) : (
                      <>
                        <p
                          className="fontRegular font14"
                          style={{ color: "#F96A6A" }}
                        >
                          촬영 시간을 불러올 수 없습니다.
                        </p>
                        <span
                          className="fontBold font12"
                          style={{ color: "#F96A6A" }}
                        >
                          시간을 직접 입력해주세요.
                          <EditButton
                            style={{ marginLeft: "0.188rem" }}
                            onClick={() => setIsModalOpen(true)}
                          />
                        </span>
                      </>
                    )}
                  </div>

                  {isAnalyzed && (
                    <>
                      {/* //* 홍수 분석 결과 */}
                      <h3
                        className="screenSmallTitle"
                        style={{
                          marginTop: "1.25rem",
                          marginBottom: "0.375rem",
                        }}
                      >
                        분석 결과
                      </h3>
                      {floodResult ? (
                        <span className="resultTextContainer">
                          침수 -&nbsp;
                          <span className="resultText">{`${floodResult.floodLevel} ${floodResult.accuracy}%`}</span>
                        </span>
                      ) : (
                        <span className="floodErrorText">
                          홍수 발생 지역의 사진이 아닌 것 같습니다.
                          <p>사진을 다시 입력해주세요.</p>
                        </span>
                      )}
                    </>
                  )}
                </>
              ) : (
                // ? 이미지를 입력하지 않은 경우, 이미지 입력 버튼을 띄운다.
                <>
                  <label htmlFor="file">
                    {/* //? 이미지 추가 box - 점선 background */}
                    <div className="imageFileInputLabel"></div>
                  </label>
                  <input
                    id="file"
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {/* //? submit button (분석 시작 버튼) */}
        <div className="submitBtnContainer">
          <SubmitButton />
        </div>
      </Layout>
    </>
  );
}

export default Home;
