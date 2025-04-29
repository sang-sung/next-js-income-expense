export type ChangPassForm = {
  password_old: string;
  password_new: string;
  password_confirm: string;
};

export const validateChangPass = (form: ChangPassForm): string | null => {
  const { password_old, password_new, password_confirm } = form;

  if (password_old == "" || password_new == "" || password_confirm == "") {
    return "กรุณาระบุข้อมูลให้ครบ";
  }

  if (password_new.length < 6) {
    return "รหัสผ่านต้องมีความยาวตั้งแต่ 6 ตัวขึ้นไป";
  }

  if (password_new !== password_confirm) {
    return "ยืนยันรหัสผ่านไม่ตรงกับรหัสผ่านใหม่";
  }

  return null; // ✅ ผ่าน validation
};
