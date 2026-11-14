import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";

import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebookF,
  faYoutube,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import {
  faLocationDot,
  faPhone,
  faEnvelope,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: t("navbar.about"), href: "#about" },
    { label: t("navbar.pricing"), href: "#pricing" },
    { label: t("navbar.stars"), href: "#player" },
    { label: t("navbar.programs"), href: "#programs" },
    { label: t("navbar.join"), href: "#joinUs" },
  ];

  const socialLinks = [
    {
      icon: faFacebookF,
      label: "Facebook",
      href: "#!",
    },
    {
      icon: faInstagram,
      label: "Instagram",
      href: "#!",
    },
    {
      icon: faYoutube,
      label: "YouTube",
      href: "#!",
    },
    {
      icon: faWhatsapp,
      label: "WhatsApp",
      href: "https://wa.me/201091654379",
    },
  ];

  return (
    <footer
      className={`footer-section ${isAr ? "footer-rtl" : "footer-ltr"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <Container>
        {/* Main Footer */}
        <div className="footer-main">
          <Row className="g-5">
            {/* Brand & Contact */}
            <Col lg={4} md={6}>
              <div className="footer-brand-column">
                <a href="#" className="footer-brand">
                  <span className="footer-brand-mark">A</span>
                  <span className="footer-brand-name">
                    {t("footer.brand")}
                  </span>
                </a>

                <p className="footer-description">
                  {t("footer.description")}
                </p>

                <div className="footer-contact">
                  <h4 className="footer-column-title">
                    {t("footer.contact_title")}
                  </h4>

                  <div className="footer-contact-item">
                    <span className="footer-contact-icon">
                      <FontAwesomeIcon icon={faLocationDot} />
                    </span>
                    <span>{t("footer.country")}</span>
                  </div>

                  <div className="footer-contact-item">
                    <span className="footer-contact-icon">
                      <FontAwesomeIcon icon={faLocationDot} />
                    </span>
                    <span>{t("footer.address")}</span>
                  </div>

                  <div className="footer-contact-item">
                    <span className="footer-contact-icon">
                      <FontAwesomeIcon icon={faPhone} />
                    </span>
                    <span dir="ltr">556 50776546</span>
                  </div>

                  <div className="footer-contact-item">
                    <span className="footer-contact-icon">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <span dir="ltr">info@acstart.com</span>
                  </div>
                </div>
              </div>
            </Col>

            {/* Navigation */}
            <Col lg={3} md={6}>
              <div className="footer-nav-column">
                <h4 className="footer-column-title">
                  {t("footer.navigation_title")}
                </h4>

                <ul className="footer-links">
                  {footerLinks.map((link, index) => (
                    <li key={link.href}>
                      <a href={link.href}>
                        <span className="footer-link-index">
                          0{index + 1}
                        </span>

                        <span>{link.label}</span>

                        <FontAwesomeIcon
                          icon={faArrowUpRightFromSquare}
                          className="footer-link-arrow"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* Newsletter */}
            <Col lg={5} md={12}>
              <div className="footer-newsletter">
                <span className="footer-newsletter-label">
                  {t("footer.newsletter_label")}
                </span>

                <h3 className="footer-newsletter-title">
                  {t("footer.newsletter_title")}
                </h3>

                <p className="footer-newsletter-description">
                  {t("footer.newsletter_description")}
                </p>

                <form
                  className="footer-newsletter-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="name@email.com"
                    aria-label="Email address"
                    dir="ltr"
                  />

                  <button type="button">
                    {t("footer.subscribe")}
                    <FontAwesomeIcon
                      icon={isAr ? faArrowUpRightFromSquare : faArrowUpRightFromSquare}
                    />
                  </button>
                </form>

                <div className="footer-newsletter-note">
                  <span className="footer-note-dot" />
                  {t("footer.newsletter_note")}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <Row className="align-items-center gy-4">
            {/* Social Media */}
            <Col lg={4} md={6}>
              <div className="footer-social-wrapper">
                <span className="footer-social-title">
                  {t("footer.social_title")}
                </span>

                <div className="footer-social-icons">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <FontAwesomeIcon icon={social.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </Col>

            {/* Policies */}
            <Col lg={4} md={6}>
              <div className="footer-policy-links">
                <a href="#!">{t("footer.privacy")}</a>
                <span />
                <a href="#!">{t("footer.payment_policy")}</a>
              </div>
            </Col>

            {/* Copyright */}
            <Col lg={4}>
              <p className="footer-copyright">
                {t("footer.rights")}
                <span>© {currentYear}</span>
              </p>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
}