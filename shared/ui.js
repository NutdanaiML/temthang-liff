/**
 * TemThang UI helpers — loading, error, success
 */
const TemThangUI = (() => {
  function showLoading(message = "กำลังโหลด...") {
    let el = document.getElementById("tt-loading");
    if (!el) {
      el = document.createElement("div");
      el.id = "tt-loading";
      el.className = "tt-overlay";
      document.body.appendChild(el);
    }
    el.innerHTML = `<div class="tt-spinner"></div><p>${message}</p>`;
    el.hidden = false;
  }

  function hideLoading() {
    const el = document.getElementById("tt-loading");
    if (el) el.hidden = true;
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

  function bindSubmitButton(form, handler) {
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (btn.disabled) return;

      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = "กำลังบันทึก...";

      try {
        await handler(new FormData(form));
      } catch (err) {
        showError(`เกิดข้อผิดพลาด: ${err.message}`);
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
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

  return {
    showLoading,
    hideLoading,
    showError,
    showSuccess,
    bindSubmitButton,
    renderFieldErrors,
  };
})();
