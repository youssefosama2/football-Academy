import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { faStar, faChartLine, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReport } from "../../../Context/ReportContext";
import "./QuickStatsCards.css";

const QuickStatsCards = () => {
  const { t, i18n } = useTranslation();
  const { allEvaluations, loading } = useReport();

  const statsData = useMemo(() => {
    if (!allEvaluations || allEvaluations.length === 0) {
      return [
        { title: t("ReportPage.quickStatsCards.performanceGrowth"), value: "0%", desc: t("ReportPage.quickStatsCards.noData"), colorClass: "", icon: faChartLine },
        { title: t("ReportPage.quickStatsCards.latestEvaluation"), value: "0", desc: "---", colorClass: "", icon: faStar },
        { title: t("ReportPage.quickStatsCards.bestEvaluation"), value: "0", desc: "---", colorClass: "", icon: faStar },
        { title: t("ReportPage.quickStatsCards.totalEvaluations"), value: "0", desc: t("ReportPage.quickStatsCards.evaluations"), colorClass: "", icon: faFileAlt },
      ];
    }

    const sortedEvaluations = [...allEvaluations].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const lastEvaluation = sortedEvaluations[sortedEvaluations.length - 1];
    const bestEvaluation = [...sortedEvaluations].sort((a, b) => (b.total_score || 0) - (a.total_score || 0))[0];
    const firstScore = Number(sortedEvaluations[0]?.total_score) || 0;
    const lastScore = Number(lastEvaluation?.total_score) || 0;
    const improvement = firstScore > 0 ? Math.round(((lastScore - firstScore) / firstScore) * 100) : 0;

    const formatDate = (date) => {
      if (!date) return "---";
      const locale = i18n.language?.startsWith("ar") ? "ar-EG" : "en-US";
      return new Date(date).toLocaleDateString(locale, { month: "long", year: "numeric" });
    };

    return [
      {
        title: t("ReportPage.quickStatsCards.performanceGrowth"),
        value: `${improvement > 0 ? "+" : ""}${improvement}%`,
        desc: improvement >= 0
          ? t("ReportPage.quickStatsCards.generalImprovement")
          : t("ReportPage.quickStatsCards.performanceDecline"),
        colorClass: improvement > 0 ? "green-text" : improvement < 0 ? "red-text" : "",
        icon: faChartLine,
      },
      {
        title: t("ReportPage.quickStatsCards.latestEvaluation"),
        value: lastEvaluation?.total_score || 0,
        desc: formatDate(lastEvaluation?.created_at),
        colorClass: "",
        icon: faStar,
      },
      {
        title: t("ReportPage.quickStatsCards.bestEvaluation"),
        value: bestEvaluation?.total_score || 0,
        desc: formatDate(bestEvaluation?.created_at),
        colorClass: "",
        icon: faStar,
      },
      {
        title: t("ReportPage.quickStatsCards.totalEvaluations"),
        value: sortedEvaluations.length,
        desc: t("ReportPage.quickStatsCards.evaluations"),
        colorClass: "",
        icon: faFileAlt,
      },
    ];
  }, [allEvaluations, t, i18n.language]);

  if (loading) {
    return (
      <div className="row g-3 mb-4">
        <div style={{ textAlign: "center", padding: "20px", color: "#64748b", fontWeight: "600" }}>
          {t("ReportPage.quickStatsCards.loading")}
        </div>
      </div>
    );
  }

return (
  <div className="row g-3 mb-4 stats-grid">
    {statsData.map((item, index) => (
      <div className="col-6 col-md-4 col-lg-3" key={index}>
        <StatCard
          title={item.title}
          value={item.value}
          desc={item.desc}
          colorClass={item.colorClass}
          icon={item.icon}
          cardColor={`stat-card-color-${index + 1}`}
        />
      </div>
    ))}
  </div>
);
};

const StatCard = ({ title, value, desc, colorClass, icon, cardColor }) => (
  <div className={`Quick-stat-card ${cardColor}`}>
    <div className="stat-card-header">
      <div className="stat-icon">
        <FontAwesomeIcon icon={icon} />
      </div>

      <span className="stat-card-label">{title}</span>
    </div>

    <div className="stat-card-body">
      <h2 className={`stat-value ${colorClass}`}>{value}</h2>
      <p className="stat-description">{desc}</p>
    </div>

    <div className="stat-card-decoration" />
  </div>
);

export default QuickStatsCards;