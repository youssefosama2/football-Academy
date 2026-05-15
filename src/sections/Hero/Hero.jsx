import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Hero.css";
import { handleJoin } from "../../utils/joinHandler.js";

export default function HeroSection() {

  const { t } = useTranslation();

  const [players, setPlayers] = useState(0);
  const [coaches, setCoaches] = useState(0);
  const [championships, setChampionships] = useState(0);
  const counter = (target, setState) => {
    let count = 0;
    const speed = 20;
    const increment = target / 100;
    const update = () => {
      count += increment;
      if (count < target) {
        setState(Math.ceil(count));
        setTimeout(update, speed);
      } else {
        setState(target);
      }
    };
    update();
  };
  useEffect(() => {
    counter(170, setPlayers);
    counter(16, setCoaches);
    counter(12, setChampionships);
  }, []);

  return (
    <section className="hero d-flex align-items-center">
      <div className="container text-white text-center">
        <span className="badge bg-primary mb-3"> {t("hero.badge")} ⚽</span>      
        <h1 className="fw-bold mb-3">{t("hero.title")}</h1>
        <p className="mb-4">{t("hero.desc")}</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            className="btn btn-primary px-4 join-btn" 
            onClick={() => handleJoin({type: "info",plan: t("hero.plan"),})}>
            {t("hero.join")}
          </button>
          <a href="https://wa.me/201091654379" className="btn btn-outline-light px-4">{t("hero.whatsapp")} </a>
        </div>
        <div className="stats hero-stats mt-5 d-flex justify-content-center gap-4 flex-wrap">
          <div>
            <h4> {players} <span className="text-primary"> +</span></h4>
            <span>{t("hero.players")}</span>
          </div>
          <div>
            <h4>{coaches}</h4>
            <span>{t("hero.coaches")}</span>
          </div>
          <div>
            <h4> {championships} <span className="text-primary"> +</span></h4>
            <span>{t("hero.championships")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}