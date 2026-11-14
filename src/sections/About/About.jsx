import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGraduate,
  faShieldAlt,
  faFutbol,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import "./About.css";

const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      number: "01",
      icon: faUserGraduate,
      key: "coaches",
    },
    {
      number: "02",
      icon: faShieldAlt,
      key: "safety",
    },
    {
      number: "03",
      icon: faFutbol,
      key: "training",
    },
    {
      number: "04",
      icon: faChartLine,
      key: "development",
    },
  ];

  return (
    <section id="about" className="about-section">
      <Container>
        <div className="about-showcase">
          <Row className="align-items-center g-4 g-lg-5">
            <Col lg={6}>
              <div className="about-copy">
                <div className="about-kicker">
                  <span className="about-kicker-line"></span>
                  <span>{t("about.eyebrow")}</span>
                </div>

                <h2 className="about-main-title">
                  {t("about.title")}
                </h2>

                <p className="about-subtitle">
                  {t("about.subtitle")}
                </p>

                <div className="about-copy-text">
                  <p>{t("about.desc1")}</p>
                  <p>{t("about.desc2")}</p>
                  <p>{t("about.desc3")}</p>
                </div>

                <div className="about-values">
                  <span>{t("about.badge")}</span>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="about-visual">
                <div className="about-visual-backdrop"></div>

                <div className="about-image-container">
                  <img
                    src="/assets/img/medium-shot-kids-laying-grass_23-2149270905.webp"
                    width="600"
                    height="450"
                    loading="lazy"
                    alt={t("about.imageTitle")}
                    className="about-main-image"
                  />
                </div>

                <div className="about-image-tag">
                  <div className="about-image-tag-icon">
                    <FontAwesomeIcon icon={faFutbol} />
                  </div>

                  <div>
                    <strong>{t("about.imageTitle")}</strong>
                    <span>{t("about.imageSubtitle")}</span>
                  </div>
                </div>

                {/* <div className="about-visual-index">01 / 04</div> */}
              </div>
            </Col>
          </Row>
        </div>

        <div className="about-benefits">
          <div className="benefits-heading">
            <div className="benefits-heading-content">
              <span className="benefits-eyebrow">
                {t("about.eyebrow")}
              </span>

              <h2>{t("about.featuresTitle")}</h2>
              <p>{t("about.imageSubtitle")}</p>
            </div>

            <div className="benefits-heading-mark">
              <span>04</span>
              <small>{t("about.featuresTitle")}</small>
            </div>
          </div>

          <Row className="g-3">
            {features.map((feature) => (
              <Col xs={6} lg={3} key={feature.number}>
                <div className="benefit-card">
                  <div className="benefit-card-top">
                    <span className="benefit-number">
                      {feature.number}
                    </span>

                    <div className="benefit-icon">
                      <FontAwesomeIcon icon={feature.icon} />
                    </div>
                  </div>

                  <div className="benefit-card-content">
                    <h3>
                      {t(`about.features.${feature.key}.title`)}
                    </h3>

                    <p>
                      {t(`about.features.${feature.key}.description`)}
                    </p>
                  </div>

                  <div className="benefit-card-bottom">
                    <span></span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default About;