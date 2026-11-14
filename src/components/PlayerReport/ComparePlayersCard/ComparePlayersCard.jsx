import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useReport } from "../../../Context/ReportContext";
import "./ComparePlayersCard.css";

const ComparePlayersCard = ({ compareInView }) => {
  const { t } = useTranslation();

  const {
    currentEvaluation,
    academyStats,
    loading: contextLoading,
  } = useReport();

  const compareData = useMemo(() => {
    const playerScore = Number(currentEvaluation?.total_score) || 0;

    const academyAverage = Math.round(
      Number(academyStats?.averageScore) || 0
    );

    const bestPlayer = Number(academyStats?.bestScore) || 0;
    const lowestPlayer = Number(academyStats?.lowestScore) || 0;

    return [
      {
        label:
          currentEvaluation?.player_name ||
          t("report.compare.player"),
        value: playerScore,
        color: "#2563ff",
      },
      {
        label: t("report.compare.academyAverage"),
        value: academyAverage,
        color: "#22c55e",
      },
      {
        label: t("report.compare.bestScore"),
        value: bestPlayer,
        color: "#9333ea",
      },
      {
        label: t("report.compare.lowestScore"),
        value: lowestPlayer,
        color: "#ef4444",
      },
    ];
  }, [currentEvaluation, academyStats, t]);

  return (
    <div className="compare-card h-100">
      <h3>{t("report.compare.title")}</h3>

      {contextLoading ? (
        <div
          style={{
            height: "250px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
            fontWeight: "600",
          }}
        >
          {t("report.compare.loading")}
        </div>
      ) : (
        compareData.map((item, index) => (
          <CompareBar
            key={index}
            label={item.label}
            value={item.value}
            color={item.color}
            isVisible={compareInView}
          />
        ))
      )}
    </div>
  );
};

const CompareBar = ({ label, value, color, isVisible }) => {
  const [currentWidth, setCurrentWidth] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentWidth(0);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentWidth(Math.min(100, Math.max(0, Number(value) || 0)));
    }, 100);

    return () => clearTimeout(timer);
  }, [value, isVisible]);

  return (
    <div className="compare-item">
      <div className="compare-top">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="compare-progress">
        <div
          style={{
            width: `${currentWidth}%`,
            background: color,
            transition: "width 1.5s ease-out",
          }}
        />
      </div>
    </div>
  );
};

export default ComparePlayersCard;