import React, { forwardRef, ForwardedRef, ReactNode } from "react";
import Layout from "../Layout";
import "./InputScreenLayout.css";

interface InputScreenLayoutProps {
  isOverlap?: boolean;
  title: string;
  subtitle: string;
  children?: ReactNode;
}

const InputScreenLayout = forwardRef<HTMLDivElement, InputScreenLayoutProps>(
  (props: InputScreenLayoutProps, ref?: ForwardedRef<HTMLDivElement>) => {
    const { isOverlap, title, subtitle, children } = props;
    return (
      <Layout isOverlap={isOverlap}>
        <div ref={ref} id="inputScreenContainer">
          <div id="inputScreenWrapper">
            {/* //* title */}
            <h1 className="screenTitle">{title}</h1>

            {/* //* subtitle */}
            <h3 className="screenSubtitle" style={{ marginTop: "0.375rem" }}>
              {subtitle}
            </h3>
            {children}
          </div>
        </div>
      </Layout>
    );
  }
);

export default InputScreenLayout;
