import React, { useMemo } from "react";
import { faCalendarAlt, faEye, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useReport } from "../../../Context/ReportContext";
import "./EvaluationsTable.css";

const technicalKeys = ["الاستلام والتسليم", "التمرير", "التصويب", "المراوغة", "الرؤية والتمرير الطويل", "الأداء المهاري"];
const fitnessKeys = ["القوة", "التحمل", "السرعة", "الرشاقة", "الاتزان والتناسق", "الأداء الحركي التوافقي"];
const mentalKeys = ["العمل الجماعي", "اتخاذ القرار", "التركيز", "الذكاء الكروي", "الالتزام والانضباط", "الشخصية والقيادة"];

const EvaluationsTable = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { allEvaluations, loading } = useReport();

  const handleOpenReport = (playerCode, evaluationId) => {
    if (!playerCode || !evaluationId) return;
    navigate(`/player-report/${playerCode}/${evaluationId}`);
  };

  const calculateAverage = (skills, keys) => {
    if (!skills) return 0;
    const values = keys.map((k) => Number(skills[k]) || 0).filter((n) => n > 0);
    return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  };

  const formattedEvaluations = useMemo(() => {
    if (!allEvaluations?.length) return [];

    const locale = i18n.language?.startsWith("ar") ? "ar-EG" : "en-US";

    return allEvaluations.map((item) => {
      const skills = item.skills_scores || {};

      return {
        id: item.id,
        playerCode: item.player_code,
        date: new Date(item.created_at).toLocaleDateString(locale),
        coach: item.coach_name || "---",
        total: `${item.total_score || 0}%`,
        skills: `${calculateAverage(skills, technicalKeys)}%`,
        fitness: `${calculateAverage(skills, fitnessKeys)}%`,
        intelligence: `${calculateAverage(skills, mentalKeys)}%`,
      };
    });
  }, [allEvaluations, i18n.language]);

  if (loading) {
    return (
      <div className="evaluations-container">
        <div style={{ padding: "40px", textAlign: "center", fontWeight: "600" }}>
          {t("ReportPage.evaluationsTable.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="evaluations-container">
      <div className="table-header">
        <div className="title-wrapper">
          <FontAwesomeIcon icon={faCalendarAlt} className="header-icon" />
          <h3>{t("ReportPage.evaluationsTable.title")}</h3>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>{t("ReportPage.evaluationsTable.columns.date")}</th>
              <th>{t("ReportPage.evaluationsTable.columns.coach")}</th>
              <th>{t("ReportPage.evaluationsTable.columns.overallRating")}</th>
              <th>{t("ReportPage.evaluationsTable.columns.technicalSkills")}</th>
              <th>{t("ReportPage.evaluationsTable.columns.physicalFitness")}</th>
              <th>{t("ReportPage.evaluationsTable.columns.intelligenceDiscipline")}</th>
              <th>{t("ReportPage.evaluationsTable.columns.viewReport")}</th>
            </tr>
          </thead>
          <tbody>
            {formattedEvaluations.length > 0 ? (
              formattedEvaluations.map((row) => (
                <tr key={row.id}>
                  <td data-label={t("ReportPage.evaluationsTable.columns.date")}>{row.date}</td>
                  <td data-label={t("ReportPage.evaluationsTable.columns.coach")}>{row.coach}</td>
                  <td data-label={t("ReportPage.evaluationsTable.columns.overallRating")}>{row.total}</td>
                  <td data-label={t("ReportPage.evaluationsTable.columns.technicalSkills")}>{row.skills}</td>
                  <td data-label={t("ReportPage.evaluationsTable.columns.physicalFitness")}>{row.fitness}</td>
                  <td data-label={t("ReportPage.evaluationsTable.columns.intelligenceDiscipline")}>{row.intelligence}</td>
                  <td className="action-cell">
                    <button className="view-report-btn" onClick={() => handleOpenReport(row.playerCode, row.id)}>
                      <FontAwesomeIcon icon={faEye} />
                      <span>{t("ReportPage.evaluationsTable.viewReport")}</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px", fontWeight: "600" }}>
                  {t("ReportPage.evaluationsTable.noEvaluations")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
        <p>
          <span className="tip-label">{t("ReportPage.evaluationsTable.tipLabel")}</span>
          {t("ReportPage.evaluationsTable.tip")}
        </p>
      </div>
    </div>
  );
};

export default EvaluationsTable;