/**
 * TemThang LIFF config — ค่า public เท่านั้น ห้ามใส่ secret ในไฟล์นี้
 * คัดลอก config.example.js → config.local.js สำหรับ override ตอน dev
 */
const TEMTHANG_CONFIG = {
  GAS_ENDPOINT: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  LIFF_IDS: {
    refuel: "YOUR_LIFF_ID_REFUEL",
    dashboard: "YOUR_LIFF_ID_DASHBOARD",
    vehicles: "YOUR_LIFF_ID_VEHICLES",
  },
};
