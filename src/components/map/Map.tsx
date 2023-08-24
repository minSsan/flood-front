import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./Map.css";

interface MapProps extends google.maps.MapOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export interface Position {
  lat: number;
  lng: number;
}

function Map({ onClick, style, children, ...options }: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  console.log("map rendered");

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { ...options }));
    }
  }, [ref, map]);

  useEffect(() => {
    if (onClick) {
      map?.addListener("click", onClick);
    }
  }, [map, onClick]);

  return (
    <>
      <div ref={ref} id="googleMap" style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
      <h3 className="screenSubtitle" style={{ marginTop: "0.3rem" }}>
        마커를 클릭하면 주소가 노출됩니다.
      </h3>
    </>
  );
}

export default Map;
