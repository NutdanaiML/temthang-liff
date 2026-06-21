/**
 * TemThang UI helpers — loading, error, success, bottom sheet
 */
const TemThangUI = (() => {
  const FUEL_CHART_COLORS = {
    LIQUID: "#f97316",
    ELECTRIC: "#0ea5e9",
    GAS: "#8b5cf6",
    DEFAULT: "#06c755",
  };

  function setFuelTheme(category) {
    if (category) document.body.dataset.fuel = category;
  }

  function getChartColor(category) {
    return FUEL_CHART_COLORS[category] || FUEL_CHART_COLORS.DEFAULT;
  }

  function showLoading(message = "กำลังโหลด...") {
    let el = document.getElementById("tt-loading");
    if (!el) {
      el = document.createElement("div");
      el.id = "tt-loading";
      el.className = "tt-overlay";
      document.body.appendChild(el);
    }
    el.innerHTML = `<div class="tt-spinner"></div><p style="color:var(--tt-muted);font-size:0.9rem">${message}</p>`;
    el.classList.add("is-visible");
  }

  function hideLoading() {
    const el = document.getElementById("tt-loading");
    if (el) el.classList.remove("is-visible");
  }

  function showError(message) {
    showToast(message, "error");
  }

  function showSuccess(message) {
    showToast(message, "success");
  }

  function showToast(message, type = "info") {
    let el = document.getElementById("tt-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "tt-toast";
      document.body.appendChild(el);
    }
    el.className = `tt-toast tt-toast--${type}`;
    el.textContent = message;
    el.hidden = false;
    setTimeout(() => { el.hidden = true; }, 4000);
  }

  function showSuccessCheckmark(message = "บันทึกสำเร็จ", duration = 1400) {
    return new Promise((resolve) => {
      const el = document.createElement("div");
      el.className = "tt-overlay tt-overlay--success is-visible";
      el.innerHTML = `
        <div class="tt-checkmark">
          <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p style="font-weight:600;font-size:1.0625rem">${message}</p>
      `;
      document.body.appendChild(el);
      setTimeout(() => {
        el.classList.remove("is-visible");
        setTimeout(() => {
          el.remove();
          resolve();
        }, 280);
      }, duration);
    });
  }

  function openBottomSheet(title, options, selectedValue, onSelect) {
    closeBottomSheet();

    const backdrop = document.createElement("div");
    backdrop.className = "tt-sheet-backdrop";
    backdrop.id = "tt-sheet-backdrop";

    const sheet = document.createElement("div");
    sheet.className = "tt-bottom-sheet";
    sheet.id = "tt-bottom-sheet";
    sheet.innerHTML = `
      <div class="tt-sheet-handle"></div>
      <div class="tt-sheet-title">${title}</div>
      <ul class="tt-sheet-list" id="tt-sheet-list"></ul>
    `;

    const list = sheet.querySelector("#tt-sheet-list");
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tt-sheet-option" + (opt.value === selectedValue ? " is-selected" : "");
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        onSelect(opt.value, opt);
        closeBottomSheet();
      });
      list.appendChild(btn);
    });

    const close = () => closeBottomSheet();
    backdrop.addEventListener("click", close);

    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);
    requestAnimationFrame(() => {
      backdrop.classList.add("is-visible");
      sheet.classList.add("is-visible");
    });
  }

  function closeBottomSheet() {
    document.getElementById("tt-sheet-backdrop")?.remove();
    document.getElementById("tt-bottom-sheet")?.remove();
  }

  function bindSubmitButton(form, handler) {
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (btn.disabled) return;

      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = "กำลังบันทึก...";
      let keepDisabled = false;

      try {
        const outcome = await handler(new FormData(form));
        if (outcome?.keepDisabled) keepDisabled = true;
      } catch (err) {
        showError(`เกิดข้อผิดพลาด: ${err.message}`);
      } finally {
        if (!keepDisabled) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      }
    });
  }

  function renderFieldErrors(errors) {
    document.querySelectorAll(".tt-field-error").forEach((el) => {
      el.textContent = "";
      el.hidden = true;
    });

    Object.entries(errors).forEach(([field, message]) => {
      const el = document.querySelector(`[data-error="${field}"]`);
      if (el) {
        el.textContent = message;
        el.hidden = false;
      }
    });
  }

  function showFatal(message) {
    hideLoading();
    let el = document.getElementById("tt-fatal");
    if (!el) {
      el = document.createElement("div");
      el.id = "tt-fatal";
      el.className = "tt-card";
      el.style.margin = "1rem";
      el.style.color = "var(--tt-error)";
      document.querySelector(".tt-main")?.prepend(el);
    }
    el.textContent = message;
  }

  return {
    setFuelTheme,
    getChartColor,
    showLoading,
    hideLoading,
    showError,
    showSuccess,
    showSuccessCheckmark,
    openBottomSheet,
    closeBottomSheet,
    showFatal,
    bindSubmitButton,
    renderFieldErrors,
  };
})();
