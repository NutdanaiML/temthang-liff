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

  function showSuccessCheckmark(message = "บันทึกสำเร็จ", duration = 1600, subtitle) {
    return new Promise((resolve) => {
      const el = document.createElement("div");
      el.className = "tt-overlay tt-overlay--success is-visible";
      el.innerHTML = `
        <div class="tt-checkmark">
          <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p style="font-weight:600;font-size:1.0625rem">${message}</p>
        ${subtitle ? `<p class="tt-success-amount">${subtitle}</p>` : ""}
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

  function openLogEditSheet(log, context, callbacks) {
    closeBottomSheet();

    const backdrop = document.createElement("div");
    backdrop.className = "tt-sheet-backdrop";
    backdrop.id = "tt-sheet-backdrop";

    const unit = log.quantity_unit || "L";
    const sheet = document.createElement("div");
    sheet.className = "tt-bottom-sheet tt-bottom-sheet--form";
    sheet.id = "tt-bottom-sheet";
    sheet.innerHTML = `
      <div class="tt-sheet-handle"></div>
      <div class="tt-sheet-title">แก้ไขรายการ ${log.date || ""}</div>
      <form id="tt-edit-log-form" class="tt-sheet-form">
        <div class="tt-form-group">
          <label>เลขไมล์ (km)</label>
          <input type="number" name="odometer" inputmode="numeric" value="${log.odometer || ""}" required>
          <div class="tt-field-error" data-error="odometer" hidden></div>
        </div>
        <div class="tt-form-group">
          <label>จำนวน (${unit})</label>
          <input type="number" name="quantity" inputmode="decimal" step="0.01" value="${log.quantity || ""}" required>
          <div class="tt-field-error" data-error="quantity" hidden></div>
        </div>
        <div class="tt-form-group">
          <label>ราคาต่อหน่วย</label>
          <input type="number" name="price_per_unit" inputmode="decimal" step="0.01" value="${log.price_per_unit || ""}" required>
          <div class="tt-field-error" data-error="price_per_unit" hidden></div>
        </div>
        <div class="tt-form-group">
          <label>ยอดรวม (บาท)</label>
          <input type="number" name="total_price" inputmode="decimal" step="0.01" value="${log.total_price || ""}" required>
          <div class="tt-field-error" data-error="total_price" hidden></div>
        </div>
        <div class="tt-form-group">
          <label>ปั๊ม / สถานี</label>
          <input type="text" name="station" value="${(log.station || "").replace(/"/g, "&quot;")}">
        </div>
        <label class="tt-checkbox">
          <input type="checkbox" name="is_full_tank" ${log.is_full_tank ? "checked" : ""}>
          <span>${log.fuel_category === "ELECTRIC" ? "ชาร์จเต็ม" : "เติมเต็มถัง"}</span>
        </label>
        <button type="submit" class="tt-btn tt-btn--primary" style="margin-top:1rem">บันทึกการแก้ไข</button>
        <button type="button" class="tt-btn tt-btn--danger" id="tt-delete-log" style="margin-top:0.5rem">ลบรายการนี้</button>
      </form>
    `;

    backdrop.addEventListener("click", closeBottomSheet);
    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);

    const form = sheet.querySelector("#tt-edit-log-form");
    const qInput = form.querySelector('[name="quantity"]');
    const pInput = form.querySelector('[name="price_per_unit"]');
    const tInput = form.querySelector('[name="total_price"]');
    const recalc = () => {
      const q = Number(qInput.value);
      const p = Number(pInput.value);
      if (q > 0 && p > 0) tInput.value = (q * p).toFixed(2);
    };
    qInput.addEventListener("input", recalc);
    pInput.addEventListener("input", recalc);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      const payload = {
        log_id: log.log_id,
        date: log.date,
        fuel_category: log.fuel_category,
        odometer: Number(form.odometer.value),
        quantity: Number(form.quantity.value),
        price_per_unit: Number(form.price_per_unit.value),
        total_price: Number(form.total_price.value),
        station: form.station.value,
        is_full_tank: form.is_full_tank.checked,
      };
      const result = TemThangValidate.validateLogUpdateForm(
        payload,
        context.prevOdometer,
        context.nextOdometer
      );
      if (!result.valid) {
        renderFieldErrors(result.errors);
        btn.disabled = false;
        return;
      }
      try {
        await callbacks.onSave(payload);
        closeBottomSheet();
      } catch (err) {
        showError(err.message);
        btn.disabled = false;
      }
    });

    sheet.querySelector("#tt-delete-log").addEventListener("click", async () => {
      if (!confirm("ลบรายการนี้? ระบบจะคำนวณอัตราสิ้นเปลืองใหม่ให้อัตโนมัติ")) return;
      try {
        await callbacks.onDelete(log.log_id);
        closeBottomSheet();
      } catch (err) {
        showError(err.message);
      }
    });

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
    openLogEditSheet,
    showFatal,
    bindSubmitButton,
    renderFieldErrors,
  };
})();
