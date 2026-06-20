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

  return { init, close };
})();
