import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ChangeLanguage from "../../components/change-language";
import ChangeTheme from "../../components/change-theme";

import { useTranslation } from "react-i18next";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
import Footer from "./footer";
const MainLayout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  if (!token) {
    navigate("/login");
  }
  const { t } = useTranslation();

  return (
    <div className="wrapper" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="main">
        <TopNav />
        <main className="content">
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
export default MainLayout;
