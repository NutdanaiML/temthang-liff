/**
 * TemThang API wrapper — ทุก call ผ่าน GAS เท่านั้น
 */
const TemThangApi = (() => {
  let lineUserId = null;

  function setLineUserId(id) {
    lineUserId = id;
  }

  function getLineUserId() {
    if (!lineUserId) throw new Error("Unauthorized");
    return lineUserId;
  }

  async function request(action, params = {}) {
    const url = new URL(TEMTHANG_CONFIG.GAS_ENDPOINT);
    url.searchParams.set("action", action);
    url.searchParams.set("line_user_id", getLineUserId());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    const res = await fetch(url.toString(), { method: "GET" });
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "เกิดข้อผิดพลาด");
    }

    return data.data;
  }

  async function post(action, body = {}) {
    const res = await fetch(TEMTHANG_CONFIG.GAS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        line_user_id: getLineUserId(),
        ...body,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "เกิดข้อผิดพลาด");
    }

    return data.data;
  }

  return {
    setLineUserId,
    getLineUserId,
    getProfile: () => request("getProfile"),
    getVehicles: () => request("getVehicles"),
    getFuelTypes: () => request("getFuelTypes"),
    getFuelPrices: () => request("getFuelPrices"),
    getLogs: (vehicleId) => request("getLogs", { vehicle_id: vehicleId }),
    getDashboard: (vehicleId) => request("getDashboard", { vehicle_id: vehicleId }),
    saveLog: (payload) => post("saveLog", payload),
    saveVehicle: (payload) => post("saveVehicle", payload),
    deleteVehicle: (vehicleId) => post("deleteVehicle", { vehicle_id: vehicleId }),
  };
})();
