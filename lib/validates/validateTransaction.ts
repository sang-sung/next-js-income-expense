export type TransactionForm = {
  date: string;
  desc: string;
  amount: any;
  type: any;
  cate: any[];
};

export const validateTransaction = (form: TransactionForm): string | null => {
  const { date, desc, amount, type, cate } = form;

  //   if (!date || !desc || !amount || !type || !cate) {
  //     return "กรุณากรอกข้อมูลให้ครบถ้วน";
  //   }
  const parsedDate = new Date(date);
  if (!date || isNaN(parsedDate.getTime())) {
    return "กรุณาระบุวันที่";
  }

  if (desc == "") {
    return "กรุณาระบุรายละเอียด";
  }

  const amountValue = parseFloat(amount);
  if (isNaN(amountValue) || amountValue < 0) {
    return "จำนวนเงินต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0";
  }

  if (type !== 1 && type !== 2) {
    return "กรุณาระบุประเภท (รายรับหรือรายจ่าย)";
  }

  return null; // ✅ ผ่าน validation
};
