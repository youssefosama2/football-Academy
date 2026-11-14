import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const THEME_KEY = "academy-site-theme";

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "light";
    } catch {
      return "light";
    }
  });

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = isArabic ? "ar" : "en";
  }, [isArabic]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Theme still works for the current session.
    }
  }, [theme]);

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
    setExpanded(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const closeMenu = () => setExpanded(false);

  const navLinks = [
    { to: "/#about", label: t("navbar.about") },
    { to: "/#pricing", label: t("navbar.pricing") },
    { to: "/#player", label: t("navbar.stars") },
    { to: "/#programs", label: t("navbar.programs") },
    { to: "/#joinUs", label: t("navbar.join") },
  ];

  return (
    <Navbar
      expand="lg"
      sticky="top"
      expanded={expanded}
      onToggle={setExpanded}
      className="academy-navbar"
    >
      <Container>
        <Navbar.Brand
          as={HashLink}
          to="/#top"
          className="academy-navbar-brand"
          onClick={closeMenu}
        >
          <span className="brand-mark">
            {/* {t("navbar.brand")?.charAt(0)} */}
            <img src="\assets\img\icon-192.png" alt="icon" />
          </span>
          <span className="brand-name">{t("navbar.brand")}</span>
        </Navbar.Brand>

        <div className="navbar-mobile-controls">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
          >
            <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
          </button>

          <Navbar.Toggle
            aria-controls="academy-navbar-collapse"
            aria-label="Toggle navigation"
          />
        </div>

        <Navbar.Collapse id="academy-navbar-collapse">
          <Nav className="academy-nav-links">
            {navLinks.map((link) => (
              <HashLink
                key={link.to}
                className="nav-link"
                to={link.to}
                onClick={closeMenu}
                scroll={(el) =>
                  el.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {link.label}
              </HashLink>
            ))}

            <div className="navbar-actions">
              <button
                type="button"
                className="theme-toggle desktop-theme-toggle"
                onClick={toggleTheme}
                aria-label={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
                title={theme === "light" ? "Dark Mode" : "Light Mode"}
              >
                <FontAwesomeIcon
                  icon={theme === "light" ? faMoon : faSun}
                />
              </button>

              <button
                type="button"
                className="lang-toggle"
                onClick={toggleLanguage}
                aria-label={isArabic ? "Switch to English" : "Switch to Arabic"}
              >
                <FontAwesomeIcon icon={faGlobe} />
                <span>{isArabic ? "EN" : "AR"}</span>
              </button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;