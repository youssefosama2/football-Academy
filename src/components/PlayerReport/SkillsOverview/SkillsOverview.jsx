import React, { useMemo, useState } from "react";
import { faFutbol, faDumbbell, faBrain, faStar, faEye, faPersonRunning, faShieldHalved, faBolt, faFire, faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useReport } from "../../../Context/ReportContext";
import "./SkillsOverview.css";

const SkillsOverview = () => {
  const { t, i18n } = useTranslation();
  const { currentEvaluation, loading } = useReport();
  const [activeTab, setActiveTab] = useState("technical");
  const [showAllSkills, setShowAllSkills] = useState(false);

  const skillsScores = currentEvaluation?.skills_scores || {};
  const getScore = (key) => Number(skillsScores?.[key]) || 0;

  const technicalSkills = useMemo(() => [
    { title: t("ReportPage.skillsOverview.skills.ballControl"), score: getScore("الاستلام والتسليم"), color: "#2563ff", icon: faFutbol },
    { title: t("ReportPage.skillsOverview.skills.passing"), score: getScore("التمرير"), color: "#22c55e", icon: faPersonRunning },
    { title: t("ReportPage.skillsOverview.skills.shooting"), score: getScore("التصويب"), color: "#9333ea", icon: faShieldHalved },
    { title: t("ReportPage.skillsOverview.skills.dribbling"), score: getScore("المراوغة"), color: "#f59e0b", icon: faBolt },
    { title: t("ReportPage.skillsOverview.skills.visionLongPassing"), score: getScore("الرؤية والتمرير الطويل"), color: "#14b8a6", icon: faEye },
    { title: t("ReportPage.skillsOverview.skills.technicalPerformance"), score: getScore("الأداء المهاري"), color: "#ec4899", icon: faFire }
  ], [skillsScores, i18n.language, t]);

  const fitnessSkills = useMemo(() => [
    { title: t("ReportPage.skillsOverview.skills.strength"), score: getScore("القوة"), color: "#f97316", icon: faDumbbell },
    { title: t("ReportPage.skillsOverview.skills.stamina"), score: getScore("التحمل"), color: "#22c55e", icon: faMedal },
    { title: t("ReportPage.skillsOverview.skills.speed"), score: getScore("السرعة"), color: "#2563ff", icon: faBolt },
    { title: t("ReportPage.skillsOverview.skills.agility"), score: getScore("الرشاقة"), color: "#9333ea", icon: faPersonRunning },
    { title: t("ReportPage.skillsOverview.skills.balanceCoordination"), score: getScore("الاتزان والتناسق"), color: "#14b8a6", icon: faShieldHalved },
    { title: t("ReportPage.skillsOverview.skills.coordinatedMotorPerformance"), score: getScore("الأداء الحركي التوافقي"), color: "#f59e0b", icon: faFire }
  ], [skillsScores, i18n.language, t]);

  const mentalSkills = useMemo(() => [
    { title: t("ReportPage.skillsOverview.skills.teamwork"), score: getScore("العمل الجماعي"), color: "#22c55e", icon: faBrain },
    { title: t("ReportPage.skillsOverview.skills.decisionMaking"), score: getScore("اتخاذ القرار"), color: "#10b981", icon: faStar },
    { title: t("ReportPage.skillsOverview.skills.focus"), score: getScore("التركيز"), color: "#ef4444", icon: faEye },
    { title: t("ReportPage.skillsOverview.skills.footballIntelligence"), score: getScore("الذكاء الكروي"), color: "#9333ea", icon: faBrain },
    { title: t("ReportPage.skillsOverview.skills.commitmentDiscipline"), score: getScore("الالتزام والانضباط"), color: "#2563ff", icon: faShieldHalved },
    { title: t("ReportPage.skillsOverview.skills.personalityLeadership"), score: getScore("الشخصية والقيادة"), color: "#ec4899", icon: faMedal }
  ], [skillsScores, i18n.language, t]);

  const tabs = useMemo(() => [
    { key: "technical", title: t("ReportPage.skillsOverview.categories.technical"), icon: faFutbol, data: technicalSkills },
    { key: "fitness", title: t("ReportPage.skillsOverview.categories.fitness"), icon: faDumbbell, data: fitnessSkills },
    { key: "mental", title: t("ReportPage.skillsOverview.categories.mental"), icon: faBrain, data: mentalSkills }
  ], [technicalSkills, fitnessSkills, mentalSkills, i18n.language, t]);

  const allSkills = useMemo(() => [...technicalSkills, ...fitnessSkills, ...mentalSkills], [technicalSkills, fitnessSkills, mentalSkills]);

  const currentSkills = useMemo(
    () => showAllSkills ? allSkills : tabs.find((tab) => tab.key === activeTab)?.data || [],
    [activeTab, showAllSkills, allSkills, tabs]
  );

  const averages = useMemo(() => {
    const calcAvg = (skills) => skills.length
      ? Math.round(skills.reduce((acc, skill) => acc + skill.score, 0) / skills.length)
      : 0;

    return {
      technical: calcAvg(technicalSkills),
      fitness: calcAvg(fitnessSkills),
      mental: calcAvg(mentalSkills)
    };
  }, [technicalSkills, fitnessSkills, mentalSkills]);

  const getLevel = (score) => (
    score >= 90 ? t("ReportPage.skillsOverview.levels.excellent")
      : score >= 80 ? t("ReportPage.skillsOverview.levels.veryGood")
        : score >= 65 ? t("ReportPage.skillsOverview.levels.good")
          : score >= 50 ? t("ReportPage.skillsOverview.levels.acceptable")
            : t("ReportPage.skillsOverview.levels.weak")
  );

  const getLevelClass = (score) => (
    score >= 90 ? "excellent"
      : score >= 80 ? "very-good"
        : score >= 65 ? "good"
          : score >= 50 ? "acceptable"
            : "weak"
  );

  const renderStars = (score) => Array.from({
    length: score >= 90 ? 5 : score >= 80 ? 4 : score >= 65 ? 3 : score >= 50 ? 2 : 1
  }).map((_, i) => (
    <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
  ));

  const { topSkills, weakSkills } = useMemo(() => {
    const sorted = [...allSkills].sort((a, b) => b.score - a.score);
    return {
      topSkills: sorted.slice(0, 3),
      weakSkills: [...sorted].reverse().slice(0, 3)
    };
  }, [allSkills]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#64748b", fontWeight: "600" }}>
        {t("ReportPage.skillsOverview.loading")}
      </div>
    );
  }

  return (
    <>
      <div className="skills-overview-section">
        <div className="skills-overview-header">
          <div className="header-title">
            <h2>{t("ReportPage.skillsOverview.title")}</h2>
            <p>{t("ReportPage.skillsOverview.subtitle")}</p>
          </div>
          <div className="skills-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`skills-tab ${activeTab === tab.key && !showAllSkills ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.key);
                  setShowAllSkills(false);
                }}
              >
                <FontAwesomeIcon icon={tab.icon} />
                <span>{tab.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="skills-grid-overview">
          {currentSkills.map((skill, i) => (
            <div className="skill-card-overview" key={i}>
              <div className="skill-card-header">
                <div className="skill-icon-box" style={{ background: `${skill.color}15`, color: skill.color }}>
                  <FontAwesomeIcon icon={skill.icon} />
                </div>
                <div className="skill-data">
                  <h4>{skill.title}</h4>
                  <strong>{skill.score}%</strong>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${skill.score}%`, background: skill.color }} />
              </div>
              <div className="skill-footer-overview">
                <span className={`skill-level ${getLevelClass(skill.score)}`}>{getLevel(skill.score)}</span>
                <div className="stars-wrapper">{renderStars(skill.score)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="show-all-wrapper">
          <button className="show-all-button" onClick={() => setShowAllSkills(!showAllSkills)}>
            {showAllSkills
              ? t("ReportPage.skillsOverview.showLess")
              : t("ReportPage.skillsOverview.showAll", { count: allSkills.length })}
          </button>
        </div>
      </div>

      <div className="performance-analysis-section">
        <div className="analysis-card strengths-card">
          <div className="analysis-header strengths">
            <h3>{t("ReportPage.skillsOverview.strengths")}</h3>
            <FontAwesomeIcon icon={faMedal} />
          </div>
          <div className="analysis-list">
            {topSkills.map((skill, i) => (
              <div className="analysis-item" key={i}>
                <div className="analysis-info">
                  <span>{skill.title}</span>
                  <strong>{skill.score}%</strong>
                </div>
                <div className="analysis-progress">
                  <div className="analysis-progress-fill strengths-fill" style={{ width: `${skill.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analysis-card weakness-card">
          <div className="analysis-header weakness">
            <h3>{t("ReportPage.skillsOverview.needsImprovement")}</h3>
            <FontAwesomeIcon icon={faFire} />
          </div>
          <div className="analysis-list">
            {weakSkills.map((skill, i) => (
              <div className="analysis-item" key={i}>
                <div className="analysis-info">
                  <span>{skill.title}</span>
                  <strong>{skill.score}%</strong>
                </div>
                <div className="analysis-progress">
                  <div className="analysis-progress-fill weakness-fill" style={{ width: `${skill.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analysis-card overall-skills-card">
          <div className="analysis-header overall">
            <h3>{t("ReportPage.skillsOverview.skillsSummary")}</h3>
            <FontAwesomeIcon icon={faFire} />
          </div>
          <div className="analysis-list">
            <div className="analysis-item">
              <div className="analysis-info">
                <span className="overall-label">{t("ReportPage.skillsOverview.categories.technical")}</span>
                <strong>{averages.technical}%</strong>
              </div>
              <div className="analysis-progress">
                <div className="analysis-progress-fill overall-fill" style={{ width: `${averages.technical}%` }} />
              </div>
            </div>
            <div className="analysis-item">
              <div className="analysis-info">
                <span className="overall-label">{t("ReportPage.skillsOverview.categories.fitness")}</span>
                <strong>{averages.fitness}%</strong>
              </div>
              <div className="analysis-progress">
                <div className="analysis-progress-fill overall-fill" style={{ width: `${averages.fitness}%` }} />
              </div>
            </div>
            <div className="analysis-item">
              <div className="analysis-info">
                <span className="overall-label">{t("ReportPage.skillsOverview.categories.mental")}</span>
                <strong>{averages.mental}%</strong>
              </div>
              <div className="analysis-progress">
                <div className="analysis-progress-fill overall-fill" style={{ width: `${averages.mental}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SkillsOverview;