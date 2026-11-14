import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";

import { supabase } from "../../utils/supabaseClient";
import { ACADEMY_ID } from "../../config/academy";
import "./Hero.css";

// const countries = [
//   { code: "+20", label: "🇪🇬 +20" },
//   { code: "+966", label: "🇸🇦 +966" },
//   { code: "+971", label: "🇦🇪 +971" },
//   { code: "+965", label: "🇰🇼 +965" },
//   { code: "+973", label: "🇧🇭 +973" },
//   { code: "+974", label: "🇶🇦 +974" },
//   { code: "+968", label: "🇴🇲 +968" },
//   { code: "+962", label: "🇯🇴 +962" },
//   { code: "+961", label: "🇱🇧 +961" },
//   { code: "+964", label: "🇮🇶 +964" },
//   { code: "+970", label: "🇵🇸 +970" },
//   { code: "+218", label: "🇱🇾 +218" },
//   { code: "+216", label: "🇹🇳 +216" },
//   { code: "+213", label: "🇩🇿 +213" },
//   { code: "+212", label: "🇲🇦 +212" },
//   { code: "+249", label: "🇸🇩 +249" },
//   { code: "+967", label: "🇾🇪 +967" },
// ];

const positionKeys = [
  "goalkeeper",
  "centerBack",
  "rightBack",
  "leftBack",
  "defensiveMidfielder",
  "centralMidfielder",
  "attackingMidfielder",
  "rightWinger",
  "leftWinger",
  "secondStriker",
  "striker",
];

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });

const createRegistrationFormTemplate = (branches, t, isArabic) => {
  const positions = positionKeys.map((key) => ({
    value: t(`hero.registration.positions.${key}`),
    label: t(`hero.registration.positions.${key}`),
  }));

  return `
    <div class="swal-player-form" dir="${isArabic ? "rtl" : "ltr"}">
      <div class="swal-image-wrapper">
        <div id="imagePicker" class="swal-image-picker">
          <img
            id="preview"
            class="swal-preview"
            style="display:none"
            alt="${escapeHtml(t("hero.registration.image"))}"
          />
          <div id="placeholderIcon" class="swal-placeholder">
            👤
          </div>
          <div class="swal-plus">+</div>
        </div>
        <input
          type="file"
          id="fileInput"
          accept="image/jpeg,image/png,image/webp"
          hidden
        />
        <p class="swal-hint">
          ${escapeHtml(t("hero.registration.imageHint"))} *
        </p>
      </div>
      <div class="swal-grid">
        <input
          id="player-name"
          type="text"
          maxlength="100"
          placeholder="${escapeHtml(t("hero.registration.playerName"))} *"
        />
        <input
          id="birth-date"
          type="date"
          aria-label="${escapeHtml(t("hero.registration.birthDate"))}"
        />
        <select id="player-position">
          <option value="">
            ${escapeHtml(t("hero.registration.selectPosition"))} *
          </option>
          ${positions
            .map(
              (position) => `
                <option value="${escapeHtml(position.value)}">
                  ${escapeHtml(position.label)}
                </option>
              `
            )
            .join("")}
        </select>
        <select id="player-branch">
          <option value="">
            ${escapeHtml(t("hero.registration.selectBranch"))} *
          </option>
          ${branches
            .map(
              (branch) => `
                <option value="${escapeHtml(branch.id)}">
                  ${escapeHtml(branch.branch_name)}
                </option>
              `
            )
            .join("")}
        </select>
        <input
          id="parent-phone"
          type="tel"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="11"
          oninput="this.value = this.value.replace(/[^0-9]/g, '')"
          placeholder="${escapeHtml(t("hero.registration.phone"))} *"
        />
        <textarea
          id="medical-notes"
          placeholder="${escapeHtml(t("hero.registration.medicalNotes"))}"
          rows="3"
          maxlength="1000"
        ></textarea>
        <div class="swal-declaration">
          <p>
            <strong>
              ${escapeHtml(t("hero.registration.declarationTitle"))}:
            </strong>
            <br>
            ${escapeHtml(t("hero.registration.declaration"))}
          </p>
        </div>
      </div>
    </div>
  `;
};

const compressImage = async (file, t) => {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error(t("hero.registration.invalidImage"));
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error(t("hero.registration.largeImage"));
  }

  return imageCompression(file, {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1000,
    useWebWorker: true,
    fileType: "image/jpeg",
    initialQuality: 0.7,
  });
};

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateYearsAgo = (years) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);

  return formatLocalDate(date);
};

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const normalizePhone = (phoneValue, parentPhone) => {
  let phone = String(phoneValue || "").replace(/\D/g, "");
  const dialCode = String(parentPhone || "").replace(/\D/g, "");

  if (!phone) return null;

  if (dialCode && phone.startsWith(dialCode)) {
    phone = phone.slice(dialCode.length);
  }

  if (phone.startsWith("0")) {
    phone = phone.slice(1);
  }

  if (phone.length < 7 || phone.length > 15) {
    return null;
  }

  const internationalPhone = `${parentPhone}${phone}`;
  const totalDigits = internationalPhone.replace(/\D/g, "");

  if (totalDigits.length > 15) {
    return null;
  }

  return internationalPhone;
};

const getStorageFileName = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${crypto.randomUUID()}.jpg`;
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
};

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isArabic = i18n.language?.startsWith("ar");

  const [players, setPlayers] = useState(0);
  const [coaches, setCoaches] = useState(0);
  const [championships, setChampionships] = useState(0);
  const [playerCode, setPlayerCode] = useState("");

  const registrationText = (key) =>
    t(`hero.registration.${key}`);

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
      const { data, error } = await supabase.rpc(
        "get_public_player_report",
        {
          p_academy_id: ACADEMY_ID,
          p_player_code: trimmedCode,
        }
      );

      if (error) {
        console.error("Player report search error:", error);
        throw error;
      }

      // التأكد من وجود اللاعب
      if (!data?.player) {
        Swal.fire({
          icon: "error",
          title: t("hero.search.notFound"),
          text: t("hero.search.checkCode"),
          scrollbarPadding: false,
        });

        return;
      }

      navigate(`/report/${trimmedCode}`, {
        state: {
          reportData: data,
        },
      });
    } catch (error) {
      console.error("Hero search error:", error);

      Swal.fire({
        icon: "error",
        title: t("hero.search.error"),
        text: t("hero.search.failed"),
        scrollbarPadding: false,
      });
    }
  };

  const handleRegistration = async () => {
    let imageFile = null;
    let previewUrl = null;

    try {
      const { data: branches, error: branchesError } = await supabase.rpc(
        "get_public_registration_branches",
        {
          p_academy_id: ACADEMY_ID,
        }
      );

      if (branchesError) {
        throw branchesError;
      }

      const availableBranches = Array.isArray(branches)
        ? branches.filter(
            (branch) =>
              branch?.id !== null &&
              branch?.id !== undefined &&
              branch?.branch_name
          )
        : [];

      if (availableBranches.length === 0) {
        Swal.fire({
          icon: "warning",
          title: registrationText("noBranches"),
          text: registrationText("noBranchesMessage"),
          scrollbarPadding: false,
        });
        return;
      }

      const handleImageClick = () => {
        document.getElementById("fileInput")?.click();
      };

      const handleImageChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
          const compressed = await compressImage(file, t);

          imageFile = compressed;

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }

          previewUrl = URL.createObjectURL(compressed);

          const preview = document.getElementById("preview");
          const placeholder = document.getElementById("placeholderIcon");

          if (preview) {
            preview.src = previewUrl;
            preview.style.display = "block";
          }

          if (placeholder) {
            placeholder.style.display = "none";
          }

          const picker = document.getElementById("imagePicker");

          if (picker) {
            picker.style.border = "";
          }
        } catch (error) {
          imageFile = null;

          Swal.showValidationMessage(
            error.message || registrationText("imageProcessingError")
          );
        }
      };

      const result = await Swal.fire({
        title: registrationText("title"),
        html: createRegistrationFormTemplate(
          availableBranches,
          t,
          isArabic
        ),
        showCancelButton: true,
        confirmButtonText: registrationText("submit"),
        cancelButtonText: registrationText("cancel"),
        scrollbarPadding: false,
        focusConfirm: false,

        didOpen: () => {
          document
            .getElementById("imagePicker")
            ?.addEventListener("click", handleImageClick);

          document
            .getElementById("fileInput")
            ?.addEventListener("change", handleImageChange);

          const birthDateInput = document.getElementById("birth-date");

          if (birthDateInput) {
            birthDateInput.max = getDateYearsAgo(4);
            birthDateInput.min = getDateYearsAgo(20);
          }
        },

        willClose: () => {
          document
            .getElementById("imagePicker")
            ?.removeEventListener("click", handleImageClick);

          document
            .getElementById("fileInput")
            ?.removeEventListener("change", handleImageChange);

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
        },

        preConfirm: () => {
          const playerName = document
            .getElementById("player-name")
            ?.value.trim();

          const birthDate = document.getElementById("birth-date")?.value;

          const position = document.getElementById("player-position")?.value;

          const branchId = document.getElementById("player-branch")?.value;

          const phoneValue = document
            .getElementById("parent-phone")
            ?.value.trim();

          const phone = normalizePhone(phoneValue, "+20");

          const medicalNotes = document
            .getElementById("medical-notes")
            ?.value.trim();

          if (!imageFile) {
            const picker = document.getElementById("imagePicker");

            if (picker) {
              picker.style.border = "2px solid #dc3545";
            }

            return Swal.showValidationMessage(
              registrationText("imageRequired")
            );
          }

          if (
            !playerName ||
            !birthDate ||
            !position ||
            !branchId ||
            !phoneValue
          ) {
            return Swal.showValidationMessage(
              registrationText("completeFields")
            );
          }

          if (!isValidDate(birthDate)) {
            return Swal.showValidationMessage(
              registrationText("invalidDate")
            );
          }

          const minDate = getDateYearsAgo(20);
          const maxDate = getDateYearsAgo(4);

          if (birthDate < minDate || birthDate > maxDate) {
            return Swal.showValidationMessage(
              registrationText("invalidAge")
            );
          }

          const selectedBranch = availableBranches.find(
            (branch) => String(branch.id) === String(branchId)
          );

          if (!selectedBranch) {
            return Swal.showValidationMessage(
              registrationText("invalidBranch")
            );
          }

          if (!phone) {
            return Swal.showValidationMessage(
              registrationText("invalidPhone")
            );
          }

          return {
            playerName,
            birthDate,
            position,
            branchId: selectedBranch.id,
            phone,
            medicalNotes,
          };
        },
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: registrationText("loading"),
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      let uploadedFilePath = null;

      try {
        const fileName = getStorageFileName();

        uploadedFilePath =
          `academies/${ACADEMY_ID}/registration-requests/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(uploadedFilePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: "image/jpeg",
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(uploadedFilePath);

        const imageUrl = publicUrlData?.publicUrl;

        if (!imageUrl) {
          throw new Error(registrationText("imageUrlError"));
        }

        const { error: insertError } = await supabase
          .from("registration_requests")
          .insert([
            {
              academy_id: ACADEMY_ID,
              player_name: result.value.playerName,
              birth_date: result.value.birthDate,
              position: result.value.position,
              branch_id: result.value.branchId,
              parent_phone: result.value.phone,
              medical_notes: result.value.medicalNotes || null,
              player_image: imageUrl,
              status: "pending",
            },
          ]);

        if (insertError) {
          throw insertError;
        }

        Swal.fire({
          icon: "success",
          title: registrationText("success"),
          text: registrationText("successMessage"),
          scrollbarPadding: false,
        });
      } catch (error) {
        if (uploadedFilePath) {
          const { error: removeError } = await supabase.storage
            .from("avatars")
            .remove([uploadedFilePath]);

          if (removeError) {
            console.error("Failed to remove uploaded image:", removeError);
          }
        }

        throw error;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: registrationText("error"),
        text: error.message || registrationText("failed"),
        scrollbarPadding: false,
      });
    }
  };

  useEffect(() => {
    const timers = [];

    const startCounter = (target, setState) => {
      let count = 0;
      const increment = target / 50;

      const timer = window.setInterval(() => {
        count += increment;

        if (count >= target) {
          setState(target);
          window.clearInterval(timer);
        } else {
          setState(Math.ceil(count));
        }
      }, 20);

      timers.push(timer);
    };

    startCounter(170, setPlayers);
    startCounter(16, setCoaches);
    startCounter(12, setChampionships);

    return () => {
      timers.forEach((timer) => window.clearInterval(timer));
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-main">
          {/* Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-icon">⚽</span>
              <span>{t("hero.badge")}</span>
            </div>

            <h1 className="hero-title">
              {t("hero.title")}
            </h1>

            <p className="hero-description">
              {t("hero.desc")}
            </p>

            <div className="hero-highlights">
              <div className="hero-highlight">
                <span className="highlight-icon">✓</span>
                <span>{t("hero.highlights.training")}</span>
              </div>
              <div className="hero-highlight">
                <span className="highlight-icon">✓</span>
                <span>{t("hero.highlights.followUp")}</span>
              </div>
              <div className="hero-highlight">
                <span className="highlight-icon">✓</span>
                <span>{t("hero.highlights.registration")}</span>
              </div>
            </div>

            <div className="hero-actions">
              <button
                type="button"
                className="hero-register-btn"
                onClick={handleRegistration}
              >
                <span>{registrationText("title")}</span>
                <span className="hero-btn-arrow">
                  {isArabic ? "←" : "→"}
                </span>
              </button>
            </div>

            {/* Player Search */}
            <div className="player-search-box">
              <div className="search-heading">
                <div className="search-icon">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <div>
                  <h5>{t("hero.search.title")}</h5>
                  <p>{t("hero.search.description")}</p>
                </div>
              </div>

              <div className="search-form">
                <input
                  type="text"
                  className="search-input"
                  placeholder={t("hero.search.placeholder")}
                  value={playerCode}
                  onChange={(event) => setPlayerCode(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSearch();
                  }}
                />
                <button
                  type="button"
                  className="btn-search-custom"
                  onClick={handleSearch}
                  aria-label={t("hero.search.title")}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="hero-visual">
            <div className="hero-image">
              <div className="hero-image-overlay"></div>
              <div className="hero-image-content">
                <span className="hero-image-line"></span>
                <p>{t("hero.imageCaption")}</p>
              </div>
            </div>

            <div className="hero-image-number">
              <span>01</span>
              <span className="number-line"></span>
              <span>03</span>
            </div>

            <div className="hero-championship-card">
              <div className="championship-icon">🏆</div>
              <div>
                <strong>{championships}+</strong>
                <span>{t("hero.championships")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="hero-stats">
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