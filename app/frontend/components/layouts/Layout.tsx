import React, { ReactNode } from "react";
import Flash from "../Flash";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      <Flash />

      {children}
      <Footer />
    </div>
  );
};
