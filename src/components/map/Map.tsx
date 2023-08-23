import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./Map.css";

interface MapProps extends google.maps.MapOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  style?: React.CSSProperties;
  children?: ReactNode;
}

function Map({ onClick, style, children, ...options }: MapProps) {
  const ref = useRef<HTMLDivElement>(document.createElement("div"));
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
    </>
  );
}

export default Map;
