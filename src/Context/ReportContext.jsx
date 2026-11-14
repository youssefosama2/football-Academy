import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useLocation } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { ACADEMY_ID } from "../config/academy";

const ReportContext = createContext();

export const ReportProvider = ({
  playerCode,
  evaluationId,
  children,
}) => {
  const location = useLocation();

  // البيانات التي تم جلبها بالفعل من HeroSection
  const navigationReport = location.state?.reportData;

  const [playerData, setPlayerData] = useState(null);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [academyStats, setAcademyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReportData = useCallback(async () => {
    if (!playerCode) {
      setPlayerData(null);
      setCurrentEvaluation(null);
      setAllEvaluations([]);
      setAcademyStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      let reportData = null;

      // استخدام البيانات الموجودة في navigation state
      // بشرط أن تكون تخص نفس كود اللاعب
      if (
        navigationReport?.player &&
        String(navigationReport.player.player_code).trim() ===
          String(playerCode).trim()
      ) {
        reportData = navigationReport;
      } else {
        // تحميل التقرير عند فتح الرابط مباشرة
        const { data, error } = await supabase.rpc(
          "get_public_player_report",
          {
            p_academy_id: ACADEMY_ID,
            p_player_code: String(playerCode).trim(),
          }
        );

        if (error) {
          throw error;
        }

        reportData = data;
      }

      // التحقق من وجود اللاعب
      if (!reportData?.player) {
        setPlayerData(null);
        setCurrentEvaluation(null);
        setAllEvaluations([]);
        setAcademyStats(null);
        return;
      }

      const player = reportData.player;

      const playerEvaluations = Array.isArray(reportData.evaluations)
        ? reportData.evaluations
        : [];

      setPlayerData(player);
      setAllEvaluations(playerEvaluations);
      setAcademyStats(reportData.academyStats || null);

      // اختيار التقييم الحالي
      if (playerEvaluations.length > 0) {
        const selected = evaluationId
          ? playerEvaluations.find(
              (evaluation) =>
                String(evaluation.id) === String(evaluationId)
            )
          : playerEvaluations[0];

        setCurrentEvaluation(selected || playerEvaluations[0]);
      } else {
        setCurrentEvaluation(null);
      }

    } catch (error) {
      console.error("ReportContext Error:", error);

      setPlayerData(null);
      setCurrentEvaluation(null);
      setAllEvaluations([]);
      setAcademyStats(null);

    } finally {
      setLoading(false);
    }
  }, [playerCode, evaluationId, navigationReport]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  return (
    <ReportContext.Provider
      value={{
        playerData,
        currentEvaluation,
        allEvaluations,
        academyStats,
        loading,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);