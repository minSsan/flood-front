import React, { useCallback, useRef, useState } from "react";
import { getFloodResult } from "../../services/flood";
import "./Home.css";
import * as loadImage from "blueimp-load-image";
import {
  DateTimeFormatter,
  FormattedDateInfo,
} from "../../utils/date-time-formatter";
import QuestionIcon from "../../assets/images/question-icon.svg";

function Home() {
  // ? file(image) input tag
  const imageInputRef = useRef<HTMLInputElement>(null);
  // ? image preview tag
  const imagePreviewRef = useRef<HTMLImageElement>(null);
  // ? 사용자가 입력한 이미지를 base64 형식으로 저장
  // -> base64 형식 변환은 onChange 내에서 FileReader로 처리)
  const [inputImage, setInputImage] = useState<string>("");
  // ? 사진 촬영일 텍스트
  const [dateTimeText, setDateTimeText] = useState<string>("");

  console.log("dateTimeText >>>", dateTimeText);

  /**
   * 입력 이미지가 변경될 때마다 실행되는 함수 (onChange 콜백함수)
   * 1. preview image를 FileReader를 사용하여 반영한다.
   * 2. 입력 이미지의 메타 데이터(위치 정보 및 촬영 시간)를 추출한다.
   */
  const handleFileChange = useCallback(async () => {
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
        // ? - 촬영 시간 정보
        if (data.exif?.get("Exif")) {
          // ! test code
          // console.log("Exif data: ", data.exif);
          // console.log(
          //   "date >>>",
          //   // @ts-ignore
          //   data.exif?.get("Exif").get("DateTimeOriginal")
          //   );
          // ! =========

          //@ts-ignore
          const dateTimeInfo = data.exif?.get("Exif").get("DateTimeOriginal");

          // ? 촬영일 정보가 존재하는 경우
          if (dateTimeInfo) {
            const date: FormattedDateInfo = DateTimeFormatter(dateTimeInfo);
            setDateTimeText(
              `${date.year}년 ${date.month}월 ${date.date}일 ${date.hours}:${date.minutes}`
            );
          }
        }

        // ? - 촬영 위치 정보
        if (data.exif?.get("GPSInfo")) {
          console.log("GPS >>>", data.exif?.get("GPSInfo"));
        }
      });
    }
  }, []);

  // * 분석 시작 버튼을 누르면 실행되는 함수
  const handleExecuteModel = useCallback(() => {
    getFloodResult(imagePreviewRef.current!)
      // TODO: res가 빈 문자열인 경우 - 정상적으로 실행되지 않았음
      .then((res) => console.log("result >>>", res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="homeContainer">
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
                  onClick={() => setInputImage("")}
                />
              </div>

              {/* //? 촬영 시간 제목 */}
              <h3
                className="screenSmallTitle"
                style={{ marginTop: "1.375rem" }}
              >
                촬영 시간
              </h3>

              {/* //? 촬영 시간 텍스트 */}
              <p className="dateText">{dateTimeText}</p>

              {/* //? 촬영 시간 수정 안내 및 버튼 */}
              <p
                className="dateInputInfoContainer"
                style={{ marginTop: "0.25rem" }}
                onClick={() => alert("수정하기 클릭")}
              >
                {/* 촬영 시간 수정 안내 */}
                <img className="questionMark" src={QuestionIcon} />
                <p style={{ marginLeft: "0.188rem" }}>
                  사진의 실제 촬영 시간과 다른가요?
                </p>

                {/* 촬영 시간 수정 버튼 */}
                <p
                  style={{ color: "#86B0EE", marginLeft: "0.188rem" }}
                  className="modifyText"
                >
                  <p>(</p>
                  {/* pencil svg */}
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.04003 2.44852L7.48002 1L10 3.53491L8.56001 4.98342M6.04003 2.44852L1.14912 7.36835C1.05364 7.46438 1 7.59466 1 7.73048V10.0532H3.30912C3.44415 10.0532 3.57364 9.99932 3.66912 9.90324L8.56001 4.98342M6.04003 2.44852L8.56001 4.98342"
                      stroke="#86B0EE"
                      stroke-width="1.02275"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  수정하기
                  <p>)</p>
                </p>
              </p>
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
        <button
          className={`submitBtn ${inputImage ? "active" : "inactive"}`}
          type="submit"
          onClick={
            inputImage
              ? handleExecuteModel
              : () => alert("사진을 입력해주세요.")
          }
        >
          분석 시작
        </button>
      </div>
    </div>
  );
}

export default Home;
