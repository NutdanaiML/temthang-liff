/**
 * TemThang API wrapper — ทุก call ผ่าน GAS เท่านั้น
 * ใช้ JSONP (GET) + form POST เพื่อหลีกเลี่ยง CORS จาก GitHub Pages
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

  function jsonpRequest(url) {
    return new Promise((resolve, reject) => {
      const callbackName = `ttCb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement("script");
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Request timeout"));
      }, 30000);

      function cleanup() {
        clearTimeout(timeout);
        delete window[callbackName];
        script.remove();
      }

      window[callbackName] = (data) => {
        cleanup();
        if (!data.success) reject(new Error(data.error || "เกิดข้อผิดพลาด"));
        else resolve(data.data);
      };

      script.src = `${url}${url.includes("?") ? "&" : "?"}callback=${callbackName}`;
      script.onerror = () => {
        cleanup();
        reject(new Error("Network error"));
      };
      document.body.appendChild(script);
    });
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

    return jsonpRequest(url.toString());
  }

  async function post(action, body = {}) {
    const params = new URLSearchParams();
    params.set("action", action);
    params.set("line_user_id", getLineUserId());

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    const res = await fetch(TEMTHANG_CONFIG.GAS_ENDPOINT, {
      method: "POST",
      body: params,
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "เกิดข้อผิดพลาด");
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
