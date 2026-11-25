import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faShareNodes,
  faCopy,
  faGlobe,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Swal from "sweetalert2";
import "./ReportActions.css";

const THEME_KEY = "academy-site-theme";

const ReportActions = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "dark";
    } catch {
      return "dark";
    }
  });

  // تطبيق اتجاه ولغة الصفحة
  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = isArabic ? "ar" : "en";
  }, [isArabic]);

  // تطبيق وحفظ الثيم
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Theme still works for the current session.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  const showSuccessAlert = () => {
    Swal.fire({
      icon: "success",
      title: t("report.actions.linkCopied"),
      timer: 1500,
      showConfirmButton: false,
      scrollbarPadding: false,
    });
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: t("report.actions.shareTitle"),
          text: t("report.actions.shareText"),
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      showSuccessAlert();
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleWhatsappShare = () => {
    const url = window.location.href;
    const text = `${t("report.actions.shareWhatsappTitle")}\n\n${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccessAlert();
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="report-actions">
      <button
        type="button"
        className="action-btn home-btn"
        onClick={() => navigate("/")}
      >
        <FontAwesomeIcon icon={faHouse} />
        <span>{t("report.actions.home")}</span>
      </button>

      <button
        type="button"
        className="action-btn whatsapp-btn"
        onClick={handleWhatsappShare}
      >
        <FontAwesomeIcon icon={faWhatsapp} />
        <span>{t("report.actions.whatsapp")}</span>
      </button>

      <button
        type="button"
        className="action-btn share-btn"
        onClick={handleShare}
      >
        <FontAwesomeIcon icon={faShareNodes} />
        <span>{t("report.actions.share")}</span>
      </button>

      <button
        type="button"
        className="action-btn copy-btn"
        onClick={copyLink}
      >
        <FontAwesomeIcon icon={faCopy} />
        <span>{t("report.actions.copyLink")}</span>
      </button>

      {/* Theme Toggle */}
      <button
        type="button"
        className="action-btn theme-action-btn"
        onClick={toggleTheme}
        aria-label={
          theme === "light"
            ? t("report.actions.darkMode")
            : t("report.actions.lightMode")
        }
        title={
          theme === "light"
            ? t("report.actions.darkMode")
            : t("report.actions.lightMode")
        }
      >
        <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
      </button>

      {/* Language Toggle */}
      <button
        type="button"
        className="action-btn lang-action-btn"
        onClick={toggleLanguage}
        aria-label={
          isArabic
            ? t("report.actions.switchToEnglish")
            : t("report.actions.switchToArabic")
        }
      >
        <span>{isArabic ? "EN" : "AR"}</span>
      </button>
    </div>
  );
};

export default ReportActions;