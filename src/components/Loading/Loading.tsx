import React from "react";
import "./Loading.css";
import LoadingImg from "../../assets/images/loading.gif";

interface LoadingProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  text?: string;
}

function Loading(props: LoadingProps) {
  const { text, style } = props;
  return (
    <div id="loadingContainer" style={style}>
      <div id="loadingWrapper">
        <p className="font16 fontSemiBold" id="loadingText">
          {text}
        </p>
        <img alt="loading" src={LoadingImg} />
      </div>
    </div>
  );
}

export default Loading;
