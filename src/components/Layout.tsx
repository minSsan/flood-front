import React from "react";
import Header from "./Header";

function Layout({ children }: any) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default Layout;
