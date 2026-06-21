/**
 * TemThang LIFF bootstrap
 */
const TemThangLiff = (() => {
  function ensureAuthTokens_() {
    if (!liff.getIDToken() && !liff.getAccessToken()) {
      throw new Error("กรุณาเพิ่ม scope openid ใน LIFF App แล้วปิดเปิดใหม่");
    }
  }

  async function init(liffId) {
    if (!liffId || liffId.startsWith("YOUR_")) {
      throw new Error("กรุณาตั้งค่า LIFF ID ใน shared/config.js");
    }

    await liff.init({ liffId });

    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href });
      return null;
    }

    ensureAuthTokens_();
    return liff.getProfile();
  }

  function close() {
    if (liff.isInClient()) liff.closeWindow();
  }

  function openApp(appKey) {
    const liffId = TEMTHANG_CONFIG.LIFF_IDS[appKey];
    if (!liffId) return;
    const liffUrl = "https://liff.line.me/" + liffId;
    if (liff.isInClient()) {
      liff.openWindow({ url: liffUrl, external: false });
    } else {
      window.location.href = TEMTHANG_CONFIG.PAGES_BASE + "/" + appKey + "/";
    }
  }

  return { init, close, openApp };
})();
