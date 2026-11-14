import React, { useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import "./Player.css";
import "swiper/css";

export default function Players() {
  const swiperRef = useRef(null);
  const { t, i18n } = useTranslation();

  const isAr = i18n.language.startsWith("ar");

  const players = [
    {
      name: t("players.cards.player1.name"),
      role: t("players.cards.player1.role"),
      img: "/assets/img/little-boy-playing-soccer-sport-kid-child-with-ball_792372-354.webp",
    },
    {
      name: t("players.cards.player2.name"),
      role: t("players.cards.player2.role"),
      img: "/assets/img/young-football-player-white-uniform-posing-football-field-school-sports-club_216821-2617.webp",
    },
    {
      name: t("players.cards.player3.name"),
      role: t("players.cards.player3.role"),
      img: "/assets/img/portrait-young-boy-play-grass-football-field-stadium-match-cold-weather_709963-241.webp",
    },
    {
      name: t("players.cards.player4.name"),
      role: t("players.cards.player4.role"),
      img: "/assets/img/football-player-playing-field_1303-24539.webp",
    },
    {
      name: t("players.cards.player5.name"),
      role: t("players.cards.player5.role"),
      img: "/assets/img/football-trainer-teaching-his-pupils_23-2149708014.webp",
    },
    {
      name: t("players.cards.player6.name"),
      role: t("players.cards.player6.role"),
      img: "/assets/img/pexels-photo-10347859.webp",
    },
    {
      name: t("players.cards.player7.name"),
      role: t("players.cards.player7.role"),
      img: "/assets/img/soccer-player-training-with-ball_141188-5657.webp",
    },
    {
      name: t("players.cards.player8.name"),
      role: t("players.cards.player8.role"),
      img: "/assets/img/full-shot-child-football-field_23-2149270917.webp",
    },
  ];

  return (
    <section id="player" className="players-section">
      <Container>
        {/* Section Header */}
        <div className="players-header">
          <Row className="align-items-end gy-4">
            <Col lg={8}>
              <span className="players-eyebrow">
                {t("players.eyebrow")}
              </span>

              <h2 className="players-title">
                {t("players.title")}
              </h2>

              <p className="players-subtitle">
                {t("players.subtitle")}
              </p>
            </Col>

            <Col lg={4}>
              <div className="players-navigation">
                <Button
                  type="button"
                  className="players-nav-btn"
                  aria-label={t("players.previous")}
                  onClick={() => swiperRef.current?.slidePrev()}
                >
                  <FontAwesomeIcon
                    icon={isAr ? faArrowRight : faArrowLeft}
                  />
                </Button>

                <Button
                  type="button"
                  className="players-nav-btn players-nav-next"
                  aria-label={t("players.next")}
                  onClick={() => swiperRef.current?.slideNext()}
                >
                  <FontAwesomeIcon
                    icon={isAr ? faArrowLeft : faArrowRight}
                  />
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Players Slider */}
        <div className="players-slider-wrapper">
          <Swiper
            key={i18n.language}
            dir={isAr ? "rtl" : "ltr"}
            spaceBetween={20}
            slidesPerView={1.15}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
              576: {
                slidesPerView: 2,
                spaceBetween: 18,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              992: {
                slidesPerView: 4,
                spaceBetween: 22,
              },
            }}
          >
            {players.map((player, index) => (
              <SwiperSlide key={index}>
                <article className="player-card">
                  <div className="player-image-wrapper">
                    <img
                      src={player.img}
                      alt={player.name}
                      className="player-image"
                      loading="lazy"
                    />

                    <span className="player-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="player-image-overlay">
                      <div className="player-info">
                        <span className="player-role">
                          {player.role}
                        </span>

                        <h3 className="player-name">
                          {player.name}
                        </h3>
                      </div>

                      <span className="player-card-line"></span>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="players-bottom-line"></div>
      </Container>
    </section>
  );
}