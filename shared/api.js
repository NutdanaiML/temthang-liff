/**
 * TemThang API wrapper — ส่ง id_token/access_token ผ่าน POST เท่านั้น
 */
const TemThangApi = (() => {
  function appendAuth_(params) {
    if (typeof liff === "undefined" || !liff.isLoggedIn()) {
      throw new Error("กรุณาเปิดจาก LINE");
    }

    const accessToken = liff.getAccessToken();
    const idToken = liff.getIDToken();

    if (accessToken) {
      params.set("access_token", accessToken);
      return;
    }
    if (idToken) {
      params.set("id_token", idToken);
      return;
    }

    throw new Error("กรุณาเพิ่ม scope openid ใน LIFF App (LINE Developers Console)");
  }

  async function call(action, data = {}) {
    const params = new URLSearchParams();
    params.set("action", action);
    appendAuth_(params);

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    const res = await fetch(TEMTHANG_CONFIG.GAS_ENDPOINT, {
      method: "POST",
      body: params,
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error || "เกิดข้อผิดพลาด");
    return json.data;
  }

  return {
    getProfile: () => call("getProfile"),
    getVehicles: () => call("getVehicles"),
    getFuelTypes: () => call("getFuelTypes"),
    getFuelPrices: () => call("getFuelPrices"),
    getLogs: (vehicleId) => call("getLogs", { vehicle_id: vehicleId }),
    getDashboard: (vehicleId) => call("getDashboard", { vehicle_id: vehicleId }),
    saveLog: (payload) => call("saveLog", payload),
    saveVehicle: (payload) => call("saveVehicle", payload),
    deleteVehicle: (vehicleId) => call("deleteVehicle", { vehicle_id: vehicleId }),
  };
})();
