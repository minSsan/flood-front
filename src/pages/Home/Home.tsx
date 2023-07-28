import React, { useCallback, useRef, useState } from "react";
import { getFloodResult } from "../../services/flood";
import "./Home.css";
import AddImg from "../../assets/icon-add.png";
import assert from "assert";

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
  }, [imageInputRef.current]);

  // * 분석 시작 버튼을 누르면 실행되는 함수
  const handleExecuteModel = useCallback(() => {
    getFloodResult(imagePreviewRef.current!)
      // TODO: res가 빈 문자열인 경우 - 정상적으로 실행되지 않았음
      .then((res) => console.log("result >>>", res))
      .catch((err) => console.error(err));
  }, [imagePreviewRef.current]);

  return (
    <div>
      {inputImage ? (
        <img
          ref={imagePreviewRef}
          src={inputImage}
          alt="ww"
          width={281}
          height={255}
        />
      ) : (
        <>
          <label htmlFor="file">
            <div className="imageFileInputLabel">
              <img src={AddImg} />
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

      <button type="submit" onClick={handleExecuteModel}>
        분석 시작
      </button>
    </div>
  );
}

export default Home;
