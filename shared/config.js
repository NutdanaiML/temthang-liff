/**
 * TemThang LIFF config — ค่า public เท่านั้น ห้ามใส่ secret ในไฟล์นี้
 * คัดลอก config.example.js → config.local.js สำหรับ override ตอน dev
 */
const TEMTHANG_CONFIG = {
  GAS_ENDPOINT: "https://temthang-webhook.nutdanai-m-work.workers.dev/api",
  PAGES_BASE: "https://nutdanaiml.github.io/temthang-liff",
  LIFF_IDS: {
    refuel: "2010453372-c4x9TzuO",
    dashboard: "2010453372-HgQ4dLUh",
    vehicles: "2010453372-BgKAjd7X",
  },
};
