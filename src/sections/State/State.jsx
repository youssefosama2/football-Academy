import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import "./State.css";

import { handleJoin } from "../../utils/joinHandler.js";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import {
  faArrowLeft,
  faArrowRight,
  faChartLine,
  faMedal,
  faUsers,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

const StatsSection = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  const isAr = i18n.language?.startsWith("ar");

  const statsData = useMemo(
    () => [
      {
        id: "coach",
        value: 16,
        plus: true,
        icon: faUserTie,
        label: t("stats.coach"),
      },
      {
        id: "technical",
        value: 8,
        plus: false,
        icon: faChartLine,
        label: t("stats.technical"),
      },
      {
        id: "trophies",
        value: 12,
        plus: false,
        icon: faMedal,
        label: t("stats.trophies"),
      },
      {
        id: "player",
        value: 170,
        plus: true,
        icon: faUsers,
        label: t("stats.player"),
      },
    ],
    [t, i18n.language]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1600;
    const startTime = performance.now();
    let animationFrame;

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setCounts(
        statsData.map((item) =>
          Math.floor(item.value * easedProgress)
        )
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [started, statsData]);

  const ArrowIcon = isAr ? faArrowLeft : faArrowRight;

  return (
    <>
      <section
        className={`stats-section ${isAr ? "stats-rtl" : "stats-ltr"}`}
        ref={sectionRef}
        dir={isAr ? "rtl" : "ltr"}
      >
        <Container>
          <div className="stats-wrapper">
            <div className="stats-main">
              <div className="stats-intro">
                <span className="stats-eyebrow">
                  <span className="stats-eyebrow-line" />
                  {t("stats.title")}
                </span>

                <h2 className="stats-heading">
                  {t("stats.heading")}
                </h2>

                <p className="stats-description">
                  {t("stats.description")}
                </p>

                <button
                  type="button"
                  className="stats-cta"
                  onClick={() =>
                    handleJoin({
                      type: "info",
                      plan: t("stats.btn"),
                    })
                  }
                >
                  <span>{t("stats.btn")}</span>
                  <FontAwesomeIcon icon={ArrowIcon} />
                </button>
              </div>

              <div className="stats-data">
                <div className="stats-data-header">
                  <span className="stats-data-caption">
                    {t("stats.overview")}
                  </span>
                  <span className="stats-data-indicator">
                    <span />
                    {t("stats.indicator")}
                  </span>
                </div>

                <div className="stats-list">
                  {statsData.map((item, index) => (
                    <div className="stats-item" key={item.id}>
                      <div className="stats-item-top">
                        <span className="stats-item-icon">
                          <FontAwesomeIcon icon={item.icon} />
                        </span>

                        <span className="stats-item-index">
                          0{index + 1}
                        </span>
                      </div>

                      <div className="stats-item-value">
                        {counts[index].toLocaleString(
                          isAr ? "ar-EG" : "en-US"
                        )}
                        {item.plus && <span className="stats-plus">+</span>}
                      </div>

                      <div className="stats-item-label">
                        {item.label}
                      </div>

                      <div className="stats-item-line">
                        <span />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="stats-bottom">
              <span>{t("stats.footer")}</span>
              <span className="stats-bottom-mark">ROVELA</span>
            </div>
          </div>
        </Container>
      </section>

      <a
        href="https://wa.me/201091654379"
        className="stats-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>
    </>
  );
};

export default StatsSection;