/**
 * TemThang API wrapper
 * ส่ง LINE access_token ทุก request — ห้ามส่ง line_user_id เอง (server verify ผ่าน LINE API)
 */
const TemThangApi = (() => {
  function getAccessToken() {
    if (typeof liff === "undefined" || !liff.isLoggedIn()) {
      throw new Error("Unauthorized");
    }
    const token = liff.getAccessToken();
    if (!token) throw new Error("Unauthorized");
    return token;
  }

  async function parseResponse(res) {
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "เกิดข้อผิดพลาด");
    return data.data;
  }

  async function request(action, params = {}) {
    const url = new URL(TEMTHANG_CONFIG.GAS_ENDPOINT);
    url.searchParams.set("action", action);
    url.searchParams.set("access_token", getAccessToken());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    const res = await fetch(url.toString(), { method: "GET" });
    return parseResponse(res);
  }

  async function post(action, body = {}) {
    const params = new URLSearchParams();
    params.set("action", action);
    params.set("access_token", getAccessToken());

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    const res = await fetch(TEMTHANG_CONFIG.GAS_ENDPOINT, {
      method: "POST",
      body: params,
    });

    return parseResponse(res);
  }

  return {
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
