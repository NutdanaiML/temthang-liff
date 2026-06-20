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
      liff.login();
      return null;
    }

    const profile = await liff.getProfile();
    TemThangApi.setLineUserId(profile.userId);
    return profile;
  }

  function close() {
    if (liff.isInClient()) liff.closeWindow();
  }

  return { init, close };
})();
