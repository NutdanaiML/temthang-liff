/**
 * TemThang LIFF bootstrap
 */
const TemThangLiff = (() => {
  async function init(liffId) {
    if (!liffId || liffId.startsWith("YOUR_")) {
      throw new Error("กรุณาตั้งค่า LIFF ID ใน shared/config.js");
    }

    await liff.init({ liffId });

    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href });
      return null;
    }

    if (!liff.getAccessToken()) {
      throw new Error("ไม่พบ LINE access token");
    }

    const profile = await liff.getProfile();
    await TemThangApi.getProfile();
    return profile;
  }

  function close() {
    if (liff.isInClient()) liff.closeWindow();
  }

  return { init, close };
})();
