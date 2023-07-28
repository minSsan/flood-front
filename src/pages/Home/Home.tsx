import React, { useCallback, useRef, useState } from "react";
import { getFloodResult } from "../../services/flood";
import "./Home.css";

function Home() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewRef = useRef<HTMLImageElement>(null);

  const [inputImage, setInputImage] = useState<string>("");

  // * 입력 이미지가 바뀔 때마다 실행되는 함수
  // * - preview image를 FileReader를 사용하여 반영한다.
  const handleFileChange = useCallback(() => {
    // TODO: input값 없을 경우 처리 필요 - 현재 에러 발생함
    if (imageInputRef.current?.files) {
      const file = imageInputRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // ? type 검증 - string type 보장
        // assert(typeof reader.result === "string");
        if (typeof reader.result === "string") setInputImage(reader.result);
      };
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
