/**
 * TemThang API wrapper — ส่ง id_token/access_token ผ่าน POST
 */
const TemThangApi = (() => {
  const TIMEOUT_MS = 20000;
  const FUEL_TYPES_CACHE_KEY = "tt_fuel_types_v1";

  function appendAuth_(params) {
    if (typeof liff === "undefined" || !liff.isLoggedIn()) {
      throw new Error("กรุณาเปิดจาก LINE");
    }

    const idToken = liff.getIDToken();
    const accessToken = liff.getAccessToken();

    if (idToken) {
      params.set("id_token", idToken);
      return;
    }
    if (accessToken) {
      params.set("access_token", accessToken);
      return;
    }

    throw new Error("กรุณาเพิ่ม scope openid ใน LIFF App");
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(TEMTHANG_CONFIG.GAS_ENDPOINT, {
        method: "POST",
        body: params,
        signal: controller.signal,
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (err) {
        throw new Error("Server ตอบกลับไม่ถูกต้อง");
      }

      if (!json.success) throw new Error(json.error || "เกิดข้อผิดพลาด");
      return json.data;
    } catch (err) {
      if (err.name === "AbortError") {
        throw new Error("เชื่อมต่อ server ไม่สำเร็จ (timeout)");
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    getProfile: () => call("getProfile"),
    getVehicles: () => call("getVehicles"),
    getFuelTypes: async () => {
      try {
        const cached = sessionStorage.getItem(FUEL_TYPES_CACHE_KEY);
        if (cached) return JSON.parse(cached);
      } catch (err) {
        /* ignore cache errors */
      }
      const data = await call("getFuelTypes");
      try {
        sessionStorage.setItem(FUEL_TYPES_CACHE_KEY, JSON.stringify(data));
      } catch (err) {
        /* ignore cache errors */
      }
      return data;
    },
    getFuelPrices: () => call("getFuelPrices"),
    getLogs: (vehicleId) => call("getLogs", { vehicle_id: vehicleId }),
    getDashboard: (vehicleId) => call("getDashboard", { vehicle_id: vehicleId }),
    saveLog: (payload) => call("saveLog", payload),
    saveVehicle: (payload) => call("saveVehicle", payload),
    deleteVehicle: (vehicleId) => call("deleteVehicle", { vehicle_id: vehicleId }),
  };
})();
