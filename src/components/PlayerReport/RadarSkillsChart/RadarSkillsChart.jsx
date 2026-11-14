import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFutbol,
  faStar,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

import { useReport } from "../../../Context/ReportContext";
import "./RadarSkillsChart.css";

const SKILL_MAPPINGS = {
  مهاجم: [
    ["shooting", "التصويب"],
    ["dribbling", "المراوغة"],
    ["speed", "السرعة"],
    ["footballIntelligence", "الذكاء الكروي"],
    ["agility", "الرشاقة"],
    ["technicalPerformance", "الأداء المهاري"],
  ],

  وسط: [
    ["passing", "التمرير"],
    ["visionLongPassing", "الرؤية والتمرير الطويل"],
    ["stamina", "التحمل"],
    ["footballIntelligence", "الذكاء الكروي"],
    ["decisionMaking", "اتخاذ القرار"],
    ["teamwork", "العمل الجماعي"],
  ],

  مدافع: [
    ["strength", "القوة"],
    ["speed", "السرعة"],
    ["focus", "التركيز"],
    ["footballIntelligence", "الذكاء الكروي"],
    ["commitmentDiscipline", "الالتزام والانضباط"],
    ["balanceCoordination", "الاتزان والتناسق"],
  ],

  حارس: [
    ["focus", "التركيز"],
    ["agility", "الرشاقة"],
    ["strength", "القوة"],
    ["personalityLeadership", "الشخصية والقيادة"],
    ["decisionMaking", "اتخاذ القرار"],
    ["footballIntelligence", "الذكاء الكروي"],
  ],

  default: [
    ["technicalPerformance", "الأداء المهاري"],
    ["stamina", "التحمل"],
    ["footballIntelligence", "الذكاء الكروي"],
    ["speed", "السرعة"],
    ["passing", "التمرير"],
    ["shooting", "التصويب"],
  ],
};

const RadarSkillsChart = ({ radarInView }) => {
  const { t, i18n } = useTranslation();

  const {
    playerData,
    currentEvaluation,
    loading,
  } = useReport();

  const isRTL = i18n.dir() === "rtl";

  const radarData = useMemo(() => {
    const scores = currentEvaluation?.skills_scores || {};
    const position = currentEvaluation?.position || "";

    let selectedSkills = SKILL_MAPPINGS.default;

    if (position.includes("مهاجم")) {
      selectedSkills = SKILL_MAPPINGS["مهاجم"];
    } else if (position.includes("وسط")) {
      selectedSkills = SKILL_MAPPINGS["وسط"];
    } else if (position.includes("مدافع")) {
      selectedSkills = SKILL_MAPPINGS["مدافع"];
    } else if (position.includes("حارس")) {
      selectedSkills = SKILL_MAPPINGS["حارس"];
    }

    return selectedSkills.map(([translationKey, dbKey]) => ({
      key: translationKey,
      subject: t(
        `ReportPage.radarSkillsChart.skills.${translationKey}`
      ),
      A: Number(scores[dbKey]) || 0,
    }));
  }, [currentEvaluation, t, i18n.language]);

  const overallRating =
    currentEvaluation?.total_score != null
      ? Math.round(Number(currentEvaluation.total_score))
      : "--";

    const playerName =
      playerData?.full_name ||
      playerData?.name ||
      t("ReportPage.playerInfoCard.player");

    const playerPosition =
      currentEvaluation?.position ||
      playerData?.position ||
      "---";

    if (loading) {
      return (
        <div className="radar-skills-card radar-loading">
          {t("ReportPage.radarSkillsChart.loading")}
        </div>
      );
    }

  return (
    <section
      className={`radar-skills-card ${isRTL ? "is-rtl" : "is-ltr"}`}
    >
      {/* Player Header */}
      <div className="fifa-player-header">
        <div className="fifa-player-profile">
          <div className="fifa-player-avatar">
            <img
              src={playerData?.avatar_url || "/assets/default-player.png"}
              alt={playerName}
              onError={(e) => {
                e.currentTarget.src = "/assets/default-player.png";
              }}
            />
          </div>

          <div className="fifa-player-details">
            <span className="fifa-player-label">
              <FontAwesomeIcon icon={faFutbol} />
              {t("ReportPage.radarSkillsChart.title")}
            </span>

            <h3>{playerName}</h3>

            <span className="fifa-player-position">
              {playerPosition}
            </span>
          </div>
        </div>

        <div className="fifa-overall">
          <span>OVR</span>
          <strong>{overallRating}</strong>
          <small>
            <FontAwesomeIcon icon={faStar} />
            {t("ReportPage.radarSkillsChart.overall")}
          </small>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="fifa-chart-area">
        <div className="fifa-section-heading">
          <span>
            <FontAwesomeIcon icon={faBolt} />
            {t("ReportPage.radarSkillsChart.skillsTitle")}
          </span>
        </div>

        <div className="fifa-radar-wrapper">
          {radarInView ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="72%"
                data={radarData}
              >
                <PolarGrid
                  stroke="var(--fifa-grid-color)"
                  gridType="polygon"
                />

                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fill: "var(--fifa-axis-color)",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />

                <Radar
                  dataKey="A"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.25}
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: "#22c55e",
                    stroke: "#fff",
                    strokeWidth: 1,
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}`,
                    t("ReportPage.radarSkillsChart.rating"),
                  ]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid var(--performance-tooltip-border)",
                    backgroundColor: "var(--performance-tooltip-bg)",
                    boxShadow: "0 4px 12px var(--performance-tooltip-shadow)",
                    textAlign: isRTL ? "right" : "left",
                  }}
                  labelStyle={{
                    color: "var(--performance-tooltip-text)",
                    fontWeight: 600,
                  }}
                  itemStyle={{
                    color: "var(--performance-tooltip-text)",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="fifa-radar-placeholder" />
          )}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="fifa-skills-grid">
        {radarData.map((skill) => (
          <div className="fifa-skill-item" key={skill.key}>
            <div className="fifa-skill-info">
              <span>{skill.subject}</span>
              <strong>{skill.A}</strong>
            </div>

            <div className="fifa-skill-track">
              <div
                className="fifa-skill-progress"
                style={{
                  width: `${Math.min(Math.max(skill.A, 0), 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RadarSkillsChart;