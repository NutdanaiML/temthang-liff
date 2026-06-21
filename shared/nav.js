/**
 * TemThang bottom tab bar — ปุ่ม CTA กลางแบบเป๋าตัง
 */
const TemThangNav = (() => {
  const FUEL_ICON = { LIQUID: "⛽", ELECTRIC: "⚡", GAS: "🔵" };

  function vehicleIcon(category) {
    return FUEL_ICON[category] || "🚗";
  }

  function mount(currentPage) {
    if (document.getElementById("tt-tabbar")) return;

    const nav = document.createElement("nav");
    nav.id = "tt-tabbar";
    nav.className = "tt-tabbar";
    nav.setAttribute("aria-label", "เมนูหลัก");
    nav.innerHTML = `
      <button type="button" class="tt-tabbar__item${currentPage === "dashboard" ? " is-active" : ""}" data-app="dashboard">
        <span class="tt-tabbar__icon">📊</span>
        <span class="tt-tabbar__label">รายงาน</span>
      </button>
      <button type="button" class="tt-tabbar__cta${currentPage === "refuel" ? " is-active" : ""}" data-app="refuel" aria-label="บันทึกเติมน้ำมัน">
        <span>⛽</span>
        <small>บันทึก</small>
      </button>
      <button type="button" class="tt-tabbar__item${currentPage === "vehicles" ? " is-active" : ""}" data-app="vehicles">
        <span class="tt-tabbar__icon">🚗</span>
        <span class="tt-tabbar__label">รถของฉัน</span>
      </button>
    `;

    nav.querySelectorAll("[data-app]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const app = btn.dataset.app;
        if (app === currentPage && app !== "refuel") return;
        if (app === "refuel" && currentPage === "refuel") {
          document.getElementById("refuel-form")?.requestSubmit();
          return;
        }
        TemThangLiff.openApp(app);
      });
    });

    document.body.classList.add("tt-has-tabbar");
    document.body.appendChild(nav);
  }

  function renderVehiclePicker(container, vehicles, selectedId, onSelect) {
    if (!vehicles.length) {
      container.innerHTML = '<p class="tt-empty" style="padding:1rem 0">ยังไม่มีรถ — เพิ่มที่เมนู "รถของฉัน"</p>';
      return;
    }

    container.innerHTML = vehicles.map((v) => {
      const selected = v.vehicle_id === selectedId ? " is-selected" : "";
      const odo = v.odometer_latest
        ? Number(v.odometer_latest).toLocaleString("th-TH") + " km"
        : "ยังไม่มีเลขไมล์";
      return `
        <button type="button" class="tt-vehicle-card${selected}" data-category="${v.fuel_category}"
          data-id="${v.vehicle_id}" data-odometer="${v.odometer_latest || ""}">
          <div class="tt-vehicle-card__icon tt-vehicle-card__icon--${v.fuel_category}">${vehicleIcon(v.fuel_category)}</div>
          <div class="tt-vehicle-card__name">${v.name}</div>
          <div class="tt-vehicle-card__plate">${v.license_plate || "ไม่มีทะเบียน"}</div>
          <div class="tt-vehicle-card__odo">${odo}</div>
        </button>
      `;
    }).join("");

    container.querySelectorAll(".tt-vehicle-card").forEach((card) => {
      card.addEventListener("click", () => onSelect(card.dataset.id, card));
    });
  }

  return { mount, renderVehiclePicker, vehicleIcon };
})();
