export type ChangPassForm = {
  fname?: string;
  lname?: string;
  age?: string;
  sex?: number;
  address?: string;
};

export const validateUserInfo = (form: ChangPassForm): string | null => {
  const { fname, lname, age, sex, address } = form;

  if (fname !== undefined && typeof fname !== "string") {
    return "ชื่อควรเป็นตัวอักษร";
  }

  if (lname !== undefined && typeof lname !== "string") {
    return "นามสกุลควรเป็นตัวอักษร";
  }

  if (age !== undefined && age != "") {
    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      return "อายุต้องเป็นตัวเลขและมากกว่า 0";
    }
  }

  if (sex !== undefined && typeof sex !== "number" && sex != "0") {
    return "เลือกเพศชายหรือหญิง";
  }

  if (address !== undefined && typeof address !== "string") {
    return "ที่อยู่ควรเป็นตัวอักษร";
  }

  return null; // ✅ ไม่มีปัญหา
};
