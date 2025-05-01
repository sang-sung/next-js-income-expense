const functionService = {
  isLightColor: (hex: string): boolean => {
    if (!hex) return true;

    hex = hex.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128;
  },

  validatePassword: (pass: string): boolean => {
    const isTooShort = pass.length < 6;
    const isNotEnglish = !/^[\x20-\x7E]+$/.test(pass);

    return isTooShort || isNotEnglish;
  },

  formatAmount(amount: number | string) {
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },
};

export default functionService;
