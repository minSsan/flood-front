import Header from "./header/Header";

function Layout({ children }: any) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default Layout;
