import React, { useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { useReport } from "../../../Context/ReportContext";
import { useTranslation } from "react-i18next";
import "./EvolutionPerformanceChart.css";

const EvolutionPerformanceChart = ({ evolutionInView }) => {
  const { t, i18n } = useTranslation();
  const { allEvaluations, currentEvaluation, loading } = useReport();

  const calculateAverage = (skills, keys) => {
    const values = keys.map(key => Number(skills?.[key] || 0));
    if (!values.length) return 0;
    const total = values.reduce((acc, value) => acc + value, 0);
    return Math.round(total / values.length);
  };

  const evolutionData = useMemo(() => {
    if (!allEvaluations || allEvaluations.length === 0) return [];

    let filteredEvals = [...allEvaluations];
    if (currentEvaluation?.created_at) {
      const targetDate = new Date(currentEvaluation.created_at);
      filteredEvals = allEvaluations.filter(item => new Date(item.created_at) <= targetDate);
    }

    filteredEvals.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const groupedMonths = {};
    filteredEvals.forEach(item => {
      const skills = item.skills_scores || {};
      const technical = calculateAverage(skills, ["الاستلام والتسليم", "التمرير", "التصويب", "المراوغة", "الرؤية والتمرير الطويل", "الأداء المهاري"]);
      const fitness = calculateAverage(skills, ["القوة", "التحمل", "السرعة", "الرشاقة", "الاتزان والتناسق", "الأداء الحركي التوافقي"]);
      const mental = calculateAverage(skills, ["العمل الجماعي", "اتخاذ القرار", "التركيز", "الذكاء الكروي", "الالتزام والانضباط", "الشخصية والقيادة"]);

      const date = new Date(item.created_at);
      const monthKey = `${date.getMonth()}-${date.getFullYear()}`;

      if (!groupedMonths[monthKey]) {
        groupedMonths[monthKey] = {
          month: date.toLocaleDateString(i18n.language?.startsWith("ar") ? "ar-EG" : "en-US", { month: "long", year: "numeric" }),
          technicalTotal: 0,
          fitnessTotal: 0,
          mentalTotal: 0,
          count: 0
        };
      }

      groupedMonths[monthKey].technicalTotal += technical;
      groupedMonths[monthKey].fitnessTotal += fitness;
      groupedMonths[monthKey].mentalTotal += mental;
      groupedMonths[monthKey].count += 1;
    });

    return Object.values(groupedMonths).map(item => ({
      month: item.month,
      [t("ReportPage.evolutionPerformanceChart.technicalSkills")]: Math.round(item.technicalTotal / item.count),
      [t("ReportPage.evolutionPerformanceChart.physicalFitness")]: Math.round(item.fitnessTotal / item.count),
      [t("ReportPage.evolutionPerformanceChart.intelligenceDiscipline")]: Math.round(item.mentalTotal / item.count),
    }));
  }, [allEvaluations, currentEvaluation, i18n.language, t]);

  return (
    <div className="chart-card evolution-card">
      <h3>{t("ReportPage.evolutionPerformanceChart.title")}</h3>

      <div className="evolution-chart-body">
        {loading ? (
          <div className="evolution-chart-status">
            {t("ReportPage.evolutionPerformanceChart.loading")}
          </div>
        ) : evolutionData.length === 0 ? (
          <div className="evolution-chart-status">
            {t("ReportPage.evolutionPerformanceChart.noData")}
          </div>
        ) : evolutionInView ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={evolutionData}
              margin={{
                top: 25,
                right: 25,
                left: -25,
                bottom: 20,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--evolution-grid)"
              />

              <XAxis
                dataKey="month"
                padding={{ left: 20, right: 20 }}
                tick={{
                  fill: "var(--evolution-axis)",
                  fontSize: 12,
                }}
              />

              <YAxis
                domain={[0, 100]}
                padding={{ top: 20, bottom: 10 }}
                tick={{
                  fill: "var(--evolution-axis)",
                  fontSize: 12,
                }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;

                  return (
                    <div className="evolution-custom-tooltip">
                      <div className="evolution-tooltip-label">
                        {label}
                      </div>

                      {payload.map((entry, index) => (
                        <div
                          className="evolution-tooltip-row"
                          key={`${entry.dataKey}-${index}`}
                        >
                          <span
                            className="evolution-tooltip-dot"
                            style={{ backgroundColor: entry.color }}
                          />

                          <span className="evolution-tooltip-name">
                            {entry.name}
                          </span>

                          <strong style={{ color: entry.color }}>
                            {entry.value}
                          </strong>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                height={40}
                formatter={(value, entry) => (
                  <span
                    style={{
                      color: entry.color,
                      fontWeight: 700,
                      fontSize: "11px",
                      fontFamily: "Cairo, sans-serif",
                    }}
                  >
                    {value}
                  </span>
                )}
                wrapperStyle={{ direction: "rtl" }}
              />

              <Line
                type="monotone"
                dataKey={t("ReportPage.evolutionPerformanceChart.technicalSkills")}
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey={t("ReportPage.evolutionPerformanceChart.physicalFitness")}
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey={t("ReportPage.evolutionPerformanceChart.intelligenceDiscipline")}
                stroke="#9333ea"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="evolution-chart-empty" />
        )}
      </div>
    </div>
  );
};

export default EvolutionPerformanceChart;