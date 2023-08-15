import React, { useCallback, useEffect, useRef, useState } from "react";
import { FloodResult, getFloodResult } from "../../services/flood";
import "./Home.css";
import * as loadImage from "blueimp-load-image";
import {
  DateTimeFormatter,
  FormattedDateInfo,
} from "../../utils/date-time-formatter";
import QuestionIcon from "../../assets/images/question-icon.svg";
import CloseIcon from "../../assets/images/close.png";
import EditButton from "../../components/edit-button/EditButton";
import Modal from "../../components/modal/Modal";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Row from "../../components/row/Row";

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
  // ? 사진 촬영일 텍스트
  const [dateInfo, setDateInfo] = useState<Date | null>(null);
  // ? 홍수 이미지 분석 여부
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  // ? 홍수 분석 결과 텍스트
  const [floodResult, setFloodResult] = useState<FloodResult | null>(null);
  // ? 모달창 열림 / 닫힘 여부
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // * 홍수 모델 실행 함수
  const executeModel = useCallback(() => {
    getFloodResult(imagePreviewRef.current!)
      .then((res) => {
        if (!res) {
          alert(
            "홍수를 판별하는 과정에서 오류가 발생하였습니다.\n다시 시도해주세요."
          );
          return;
        }

        setIsAnalyzed(true);

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
  }, []);

  /**
   * 입력 이미지가 변경될 때마다 실행되는 함수 (onChange 콜백함수)
   * 1. preview image를 FileReader를 사용하여 반영한다.
   * 2. 입력 이미지의 메타 데이터(위치 정보 및 촬영 시간)를 추출한다.
   */
  const handleFileChange = useCallback(async () => {
    // TODO: 시간정보 불러올 수 없는 경우
    setDateInfo(null);
    setIsAnalyzed(false);
    setFloodResult(null);

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
          console.log("GPS >>>", data.exif?.get("GPSInfo"));
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
    if (isAnalyzed) {
      return (
        <button
          className={`submitBtn ${floodResult ? "active" : "inactive"}`}
          type="submit"
          onClick={
            floodResult
              ? () => alert("지도 스크린 이동")
              : () => alert("홍수 사진이 아닌 정보는 제출하실 수 없습니다.")
          }
        >
          위치 입력
        </button>
      );
    } else {
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
  }, [isAnalyzed, floodResult, inputImage, dateInfo]);

  // * 분석 결과 노출시 스크롤을 맨 아래로 이동
  useEffect(() => {
    isAnalyzed && window.scrollTo(0, scrollRef.current?.scrollHeight!);
  }, [isAnalyzed]);

  return (
    <div ref={scrollRef} className="homeContainer">
      {/* //* 촬영 시간 입력 모달창 */}
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          modalStyle={{ position: "relative" }}
        >
          <Row style={{ justifyContent: "space-between" }}>
            <p className="fontSemiBold">촬영 시간 직접입력</p>
            <img
              src={CloseIcon}
              alt="닫기"
              style={{
                width: "1.5rem",
                height: "1.5rem",
              }}
              onClick={() => setIsModalOpen(false)}
            />
          </Row>
          <DateTimePicker
            className="datePicker"
            format={`YYYY년 MM월 DD일 HH:mm`}
            value={dayjs(dateInfo)}
            maxDateTime={dayjs()}
            slotProps={{ textField: { size: "small" } }}
            onAccept={(value) => {
              if (value) {
                setDateInfo(new Date(value.toISOString()));
              }
              setIsModalOpen(false);
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
                <button className="removeImgBtn" onClick={handleRemoveButton} />
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
                      <img className="questionMark" src={QuestionIcon} alt="" />
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
                    style={{ marginTop: "1.25rem", marginBottom: "0.375rem" }}
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
                <div className="imageFileInputLabel">
                  {/* //? 이미지 추가(+) 아이콘 */}
                  <svg
                    width={"3.75rem"}
                    height={"3.75rem"}
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M56.6667 33.3333H3.33333C1.51111 33.3333 0 31.8222 0 30C0 28.1778 1.51111 26.6667 3.33333 26.6667H56.6667C58.4889 26.6667 60 28.1778 60 30C60 31.8222 58.4889 33.3333 56.6667 33.3333Z"
                      fill="#BEBEBF"
                    />
                    <path
                      d="M30 60C28.1778 60 26.6667 58.4889 26.6667 56.6667V3.33334C26.6667 1.51112 28.1778 7.62939e-06 30 7.62939e-06C31.8222 7.62939e-06 33.3333 1.51112 33.3333 3.33334V56.6667C33.3333 58.4889 31.8222 60 30 60Z"
                      fill="#BEBEBF"
                    />
                  </svg>
                </div>
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

        {/* //? submit button (분석 시작 버튼) */}
        <SubmitButton />
      </div>
    </div>
  );
}

export default Home;
