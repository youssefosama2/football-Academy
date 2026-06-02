import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import { supabase } from "../../utils/supabaseClient";
import { ACADEMY_ID } from "../../config/academy";
import { handleJoin } from "../../utils/joinHandler.js";
import "./Hero.css";

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [players, setPlayers] = useState(0);
  const [coaches, setCoaches] = useState(0);
  const [championships, setChampionships] = useState(0);
  const [playerCode, setPlayerCode] = useState("");

  const handleSearch = async () => {
    const trimmedCode = playerCode.trim();
    if (!trimmedCode) {
      Swal.fire({
        icon: "warning",
        title: t("hero.search.enterCode"),
        scrollbarPadding: false,
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("players")
        .select("new_id, player_code")
        .eq("academy_id", ACADEMY_ID)
        .eq("player_code", trimmedCode)
        .single();

      if (error || !data) {
        Swal.fire({
          icon: "error",
          title: t("hero.search.notFound"),
          text: t("hero.search.checkCode"),
          scrollbarPadding: false,
        });
        return;
      }

      navigate(`/report/${trimmedCode}`);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: t("hero.search.error"),
        text: t("hero.search.failed"),
        scrollbarPadding: false,
      });
    }
  };

  const startCounter = (target, setState) => {
    let count = 0;
    const speed = 20;
    const increment = target / 50; // تحسين سرعة العداد

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
    startCounter(170, setPlayers);
    startCounter(16, setCoaches);
    startCounter(12, setChampionships);
  }, []);

  return (
    <section className="hero d-flex align-items-center">
      <div className="container text-white text-center">
        <span className="badge bg-primary mb-3">
          {t("hero.badge")} ⚽
        </span>

        <h1 className="fw-bold mb-3">{t("hero.title")}</h1>
        <p className="mb-4">{t("hero.desc")}</p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            className="btn btn-primary px-4 join-btn"
            onClick={() => handleJoin({ type: "info", plan: t("hero.plan") })}
          >
            {t("hero.join")}
          </button>

          <a href="https://wa.me/201091654379" className="btn btn-outline-light px-4">
            {t("hero.whatsapp")}
          </a>
        </div>

        <div className="player-search-box mt-4">
          <h5 className="mb-3">{t("hero.search.title")}</h5>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <input
              type="text"
              className="form-control search-input"
              placeholder={t("hero.search.placeholder")}
              value={playerCode}
              onChange={(e) => setPlayerCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-primary btn-search-custom" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        <div className="stats hero-stats mt-5 d-flex justify-content-center gap-4 flex-wrap">
          <StatItem value={players} label={t("hero.players")} plus />
          <StatItem value={coaches} label={t("hero.coaches")} />
          <StatItem value={championships} label={t("hero.championships")} plus />
        </div>
      </div>
    </section>
  );
}

const StatItem = ({ value, label, plus }) => (
  <div>
    <h4>
      {value}
      {plus && <span className="text-primary"> +</span>}
    </h4>
    <span>{label}</span>
  </div>
);