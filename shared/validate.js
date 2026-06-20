/**
 * TemThang validation rules — UI validation เท่านั้น (ไม่คำนวณ km/L)
 */
const TemThangValidate = (() => {
  const RULES = {
    LIQUID: { quantityMax: 200, priceMin: 20, priceMax: 100 },
    GAS: { quantityMax: 200, priceMin: 20, priceMax: 100 },
    ELECTRIC: { quantityMax: 150, priceMin: 2, priceMax: 15 },
  };

  function validateOdometer(current, previous) {
    if (previous == null) return null;
    const cur = Number(current);
    const prev = Number(previous);
    if (Number.isNaN(cur) || Number.isNaN(prev)) return "เลขไมล์ต้องเป็นตัวเลข";
    if (cur <= prev) return "เลขไมล์ต้องมากกว่าครั้งก่อน";
    if (cur - prev > 2000) return "เลขไมล์เพิ่มขึ้นเกิน 2,000 km ต่อครั้ง";
    return null;
  }

  function validateQuantity(quantity, category) {
    const q = Number(quantity);
    if (Number.isNaN(q) || q <= 0) return "จำนวนต้องมากกว่า 0";
    const max = RULES[category]?.quantityMax || 200;
    if (q > max) return `จำนวนต้องไม่เกิน ${max}`;
    return null;
  }

  function validatePricePerUnit(price, category) {
    const p = Number(price);
    const rule = RULES[category] || RULES.LIQUID;
    if (Number.isNaN(p) || p < rule.priceMin || p > rule.priceMax) {
      return `ราคาต่อหน่วยต้องอยู่ระหว่าง ${rule.priceMin}–${rule.priceMax} บาท`;
    }
    return null;
  }

  function validateTotalPrice(total) {
    const t = Number(total);
    if (Number.isNaN(t) || t <= 0) return "ยอดรวมต้องมากกว่า 0";
    return null;
  }

  function validateRefuelForm(data, previousOdometer) {
    const errors = {};

    const odometerErr = validateOdometer(data.odometer, previousOdometer);
    if (odometerErr) errors.odometer = odometerErr;

    const quantityErr = validateQuantity(data.quantity, data.fuel_category);
    if (quantityErr) errors.quantity = quantityErr;

    const priceErr = validatePricePerUnit(data.price_per_unit, data.fuel_category);
    if (priceErr) errors.price_per_unit = priceErr;

    const totalErr = validateTotalPrice(data.total_price);
    if (totalErr) errors.total_price = totalErr;

    if (!data.vehicle_id) errors.vehicle_id = "กรุณาเลือกรถ";
    if (!data.fuel_type) errors.fuel_type = "กรุณาเลือกชนิดเชื้อเพลิง";

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  function validateVehicleForm(data) {
    const errors = {};
    if (!data.name?.trim()) errors.name = "กรุณากรอกชื่อรถ";
    if (!data.fuel_type) errors.fuel_type = "กรุณาเลือกชนิดเชื้อเพลิง";
    return { valid: Object.keys(errors).length === 0, errors };
  }

  return {
    validateRefuelForm,
    validateVehicleForm,
    validateOdometer,
    validateQuantity,
    validatePricePerUnit,
    validateTotalPrice,
  };
})();
