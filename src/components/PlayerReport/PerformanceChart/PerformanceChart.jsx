import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useReport } from "../../../Context/ReportContext";
import "./PerformanceChart.css";

const PerformanceChart = ({ performanceInView }) => {
  const { t, i18n } = useTranslation();
  const { allEvaluations, currentEvaluation, loading } = useReport();

  const performanceData = useMemo(() => {
    if (!allEvaluations?.length) return [];

    let filteredEvals = [...allEvaluations];

    if (currentEvaluation?.created_at) {
      const targetDate = new Date(currentEvaluation.created_at);
      filteredEvals = allEvaluations.filter(
        (item) => new Date(item.created_at) <= targetDate
      );
    }

    const grouped = {};
    const locale = i18n.language?.startsWith("ar") ? "ar-EG" : "en-US";

    filteredEvals.forEach((item) => {
      if (!item.created_at) return;

      const date = new Date(item.created_at);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${monthIndex}`;

      if (!grouped[key]) {
        grouped[key] = {
          month: date.toLocaleDateString(locale, { month: "long" }),
          year,
          scores: [],
          sortDate: new Date(year, monthIndex),
        };
      }

      grouped[key].scores.push(Number(item.total_score) || 0);
    });

    return Object.values(grouped)
      .sort((a, b) => a.sortDate - b.sortDate)
      .slice(-6)
      .map((item) => ({
        month: item.month,
        value: Math.round(
          item.scores.reduce((sum, score) => sum + score, 0) /
            item.scores.length
        ),
      }));
  }, [allEvaluations, currentEvaluation, i18n.language]);

  return (
    <div className="chart-card performance-chart-card">
      <h3>{t("ReportPage.performanceChart.title")}</h3>

      <div className="performance-chart-body">
        {loading ? (
          <div className="chart-status">
            {t("ReportPage.performanceChart.loading")}
          </div>
        ) : performanceData.length === 0 ? (
          <div className="chart-status">
            {t("ReportPage.performanceChart.noEvaluations")}
          </div>
        ) : performanceInView ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{
                top: 20,
                right: 20,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="colorValue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#4318ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4318ff" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                className="performance-grid"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                className="performance-x-axis"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                className="performance-y-axis"
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) => [
                  value,
                  t("ReportPage.performanceChart.evaluationScore"),
                ]}
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  textAlign: "right",
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                name={t("ReportPage.performanceChart.evaluationScore")}
                stroke="#4318ff"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: "#4318ff",
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 7,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty-space" />
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;