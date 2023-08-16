import { useLayoutEffect, useRef, useState } from "react";
import Header from "./header/Header";

interface LayoutProps {
  children?: any;
  isOverlap?: boolean;
}

function Layout({ children, isOverlap }: LayoutProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [marginTop, setMarginTop] = useState<number>();

  useLayoutEffect(() => {
    setMarginTop(headerRef.current?.offsetHeight);
  }, [headerRef]);

  return (
    <>
      <Header ref={headerRef} />
      {isOverlap ? (
        <>{children}</>
      ) : (
        <div style={{ marginTop: marginTop }}>{children}</div>
      )}
    </>
  );
}

export default Layout;
