import React, { useEffect, useRef } from "react";
import "./Map.css";

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  style?: React.CSSProperties;
}

function Map({ center, zoom, style }: MapProps) {
  const ref = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    if (ref.current) {
      new window.google.maps.Map(ref.current, { center, zoom });
    }
  });

  return <div ref={ref} id="googleMap" style={style} />;
}

export default Map;
