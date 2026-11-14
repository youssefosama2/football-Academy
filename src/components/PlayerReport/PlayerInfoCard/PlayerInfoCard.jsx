import React from "react";
import { useTranslation } from "react-i18next";
import { useReport } from "../../../Context/ReportContext";
import "./PlayerInfoCard.css";

const POSITION_TRANSLATION_KEYS = {
  "حارس مرمى (GK)": "goalkeeper",
  "قلب دفاع (CB)": "centerBack",
  "ظهير أيمن (RB)": "rightBack",
  "ظهير أيسر (LB)": "leftBack",
  "وسط مدافع (CDM)": "defensiveMidfielder",
  "وسط ملعب (CM)": "centralMidfielder",
  "وسط مهاجم (AM)": "attackingMidfielder",
  "جناح أيمن (RW/RM)": "rightWinger",
  "جناح أيسر (LW/LM)": "leftWinger",
  "مهاجم متأخر (SS)": "secondStriker",
  "رأس حربة (ST)": "striker",
};
const PlayerInfoCard = () => {
  const { t } = useTranslation();
  const { playerData, currentEvaluation, loading } = useReport();
  if (loading) {
    return (
      <div className="row mb-4">
        <div className="col-12">
          <section className="player-info-card" style={{ minHeight: "160px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontWeight: "600" }}>
            {t("ReportPage.playerInfoCard.loading")}
          </section>
        </div>
      </div>
    );
  }
  if (!playerData) {
    return (
      <div className="row mb-4">
        <div className="col-12">
          <section className="player-info-card" style={{ minHeight: "160px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", fontWeight: "600" }}>
            {t("ReportPage.playerInfoCard.notFound")}
          </section>
        </div>
      </div>
    );
  }
  const coachName = currentEvaluation?.coach_name || "---";
  const dataFields = [
    { label: t("ReportPage.playerInfoCard.coach"), value: coachName },
    { label: t("ReportPage.playerInfoCard.ageCategory"), value: playerData.age_category ? t("ReportPage.playerInfoCard.ageYears", { age: playerData.age_category }) : "---" },
    {
      label: t("ReportPage.playerInfoCard.position"),
      value: playerData.position
        ? t(`ReportPage.playerInfoCard.positions.${POSITION_TRANSLATION_KEYS[playerData.position]}`, { defaultValue: playerData.position })
        : "---"
    },
    { label: t("ReportPage.playerInfoCard.playerCode"), value: playerData.player_code || "---" }
  ];
  return (
    <div className="row mb-4">
      <div className="col-12">
        <section className="player-info-card">
          <div className="player-profile">
            <img
              src={playerData.avatar_url || "/assets/default-player.png"}
              alt={playerData.full_name || t("ReportPage.playerInfoCard.player")}
              onError={(e) => { e.target.src = "/assets/default-player.png"; }}
            />
            <div>
              <h3>{playerData.full_name || playerData.name || t("ReportPage.playerInfoCard.player")}</h3>
            </div>
          </div>
          <div className="player-data">
            {dataFields.map((item, index) => (
              <DataField key={index} label={item.label} value={item.value} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
const DataField = ({ label, value }) => (
  <div className="data-item">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);
export default PlayerInfoCard;