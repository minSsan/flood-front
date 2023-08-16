import React from "react";

interface RowProps {
  children?: any;
  style?: React.CSSProperties;
}

function Row(props: RowProps) {
  const { children, style } = props;
  const _style: React.CSSProperties = Object.assign(
    {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    style
  );

  return <div style={_style}>{children}</div>;
}

export default Row;
