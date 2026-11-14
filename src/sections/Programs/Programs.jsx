import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";

import "./Programs.css";
import { handleJoin } from "../../utils/joinHandler.js";

const Programs = () => {
  const { t, i18n } = useTranslation();

  const isAr = i18n.language.startsWith("ar");

  const programs = [
    {
      title: t("programs.program1.title"),
      desc: t("programs.program1.desc"),
      image: "/assets/img/full-shot-kid-training-football_23-2149270946.webp",
      btn: t("programs.program1.btn"),
      reverse: false,
      points: t("programs.program1.points", {
        returnObjects: true,
      }),
    },
    {
      title: t("programs.program2.title"),
      desc: t("programs.program2.desc"),
      image: "/assets/img/football-trainer-teaching-kid-side-view_23-2149742035.webp",
      btn: t("programs.program2.btn"),
      reverse: true,
      points: t("programs.program2.points", {
        returnObjects: true,
      }),
    },
    {
      title: t("programs.program3.title"),
      desc: t("programs.program3.desc"),
      image: "/assets/img/boy-training-football-field_141188-5743.webp",
      btn: t("programs.program3.btn"),
      reverse: false,
      points: t("programs.program3.points", {
        returnObjects: true,
      }),
    },
  ];

  return (
    <section className="programs-section" id="programs">
      <Container>
        <div className="programs-list">
          {programs.map((item, index) => {
            const points = Array.isArray(item.points)
              ? item.points
              : [];

            return (
              <article
                key={index}
                className={`program-item ${
                  item.reverse ? "program-item-reverse" : ""
                }`}
              >
                <Row className="align-items-stretch g-0">
                  <Col
                    lg={6}
                    className={`program-content-column ${
                      item.reverse ? "program-content-first" : ""
                    }`}
                  >
                    <div
                      className={`program-content ${
                        isAr ? "program-content-rtl" : "program-content-ltr"
                      }`}
                    >
                      <div className="program-number">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span className="program-number-line"></span>
                      </div>

                      <h2 className="program-title">
                        {item.title}
                      </h2>

                      <p className="program-description">
                        {item.desc}
                      </p>

                      <ul className="program-points">
                        {points.map((point, pointIndex) => (
                          <li key={pointIndex}>
                            <span className="program-point-icon">
                              <FontAwesomeIcon icon={faCheck} />
                            </span>

                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="program-btn"
                        onClick={() =>
                          handleJoin({
                            type: "info",
                            plan: isAr ? "استفسار" : "Inquiry",
                          })
                        }
                      >
                        <span>{item.btn}</span>

                        <FontAwesomeIcon
                          icon={isAr ? faArrowLeft : faArrowRight}
                        />
                      </Button>
                    </div>
                  </Col>

                  <Col lg={6} className="program-image-column">
                    <div className="program-image-wrapper">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="program-image"
                        loading="lazy"
                      />

                      <div className="program-image-shade"></div>

                      <span className="program-image-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </Col>
                </Row>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Programs;