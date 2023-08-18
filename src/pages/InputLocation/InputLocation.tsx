import React from "react";
import InputScreenLayout from "../../components/input-screen-layout/InputScreenLayout";
import { Link } from "react-router-dom";

function InputLocation() {
  return (
    <>
      <InputScreenLayout
        title="위치 선택"
        subtitle="업로드한 사진의 촬영 위치를 선택해주세요."
      ></InputScreenLayout>
      <div className="submitBtnContainer">
        <Link to={"/complete"} className="submitBtn active">
          접수하기
        </Link>
      </div>
    </>
  );
}

export default InputLocation;
