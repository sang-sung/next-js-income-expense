"use client";

import { Modal } from "@/components/Modal";
import { SwalAlert, toast } from "@/components/SweetAlert";
import apiService from "@/services/apiService";
import { CategoryType } from "@/types/category";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import functionService from "@/services/functionService";
import { validateTransaction } from "@/lib/validates/validateTransaction";

type ModalTransaction = {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
  type?: "add" | "update";
  dataEdit?: any;
  categories: CategoryType[];
  onFetchTransaction: (categoriesData: CategoryType[]) => Promise<void>;
};

export default function ModalTransaction({
  showModal = false,
  setShowModal,
  type = "add",
  dataEdit,
  categories = [],
  onFetchTransaction,
}: ModalTransaction) {
  const initalForm = {
    id: 0,
    date: "",
    desc: "",
    amount: "",
    type: 0, // 1 = รายรับ, 2 = รายจ่าย
    cate: [] as number[],
  };
  const [form, setForm] = useState(initalForm);
  const [onSend, setOnSend] = useState(false);

  const initalSetState = () => {
    setForm(initalForm);
  };

  useEffect(() => {
    if (type == "update") {
      setForm({
        id: dataEdit.id,
        date: dataEdit.date.split("T")[0],
        desc: dataEdit.desc,
        amount: dataEdit.amount,
        type: dataEdit.type, // 1 = รายรับ, 2 = รายจ่าย
        cate: dataEdit.cate
          .filter((c: CategoryType) => c.id != 0)
          .map((c: CategoryType) => c.id),
      });
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const parsedValue = name === "type" ? Number(value) : value;

    setForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };
  const handleChangeAmount = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const decimalNumber = /^\d*\.?\d*$/;
    if (!decimalNumber.test(value)) {
      SwalAlert.warning({
        title: "แจ้งเตือน",
        text: "กรุณาป้อนตัวเลขเท่านั้น",
      });
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    return;
  };
  const handleCategoryChange = (id: number) => {
    setForm((prev) => {
      const isSelected = prev.cate.includes(id);
      let updatedCate = isSelected
        ? prev.cate.filter((item) => item !== id)
        : [...prev.cate, id];

      // เรียงตามลำดับใน categories
      updatedCate = categories
        .filter((cat) => updatedCate.includes(cat.id))
        .map((cat) => cat.id);

      return { ...prev, cate: updatedCate };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = validateTransaction(form);
    if (errorMessage) {
      SwalAlert.question({ title: "แจ้งเตือน", text: errorMessage });
      return;
    }

    const body = {
      id: form.id,
      date: form.date,
      desc: form.desc,
      amount: Number(form.amount),
      type: form.type,
      cate: form.cate.join(","),
    };
    submitTransactions(body);
  };

  const deleteCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await SwalAlert.question({
      title: "ยืนยันการลบ",
      text: "ต้องการลบรายการ " + dataEdit.desc + " หรือไม่",
      bnCancle: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await apiService.delete({
          url: "/api/transaction",
          body: { id: dataEdit.id },
        });
        const data = await res.json();

        toast.success(data.message);

        if (data.success) {
          initalSetState();
          onFetchTransaction(categories);
          setShowModal(false);
        }
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        console.error("Error deleting category:", err);
      }
    }
  };

  const submitTransactions = async (body: any) => {
    try {
      let data;

      if (type === "add") {
        const res = await apiService.post({
          url: "/api/transaction",
          body,
        });
        data = await res.json();
      } else if (type === "update") {
        const res = await apiService.put({
          url: "/api/transaction",
          body,
        });
        data = await res.json();
      } else {
        return;
      }

      toast.success(data.message);

      if (data.success) {
        initalSetState();
        onFetchTransaction(categories);
        setShowModal(false);
      }

      setOnSend(false);
    } catch (err) {
      toast.error("ผิดพลาด");
      console.error("Transaction error:", err);
    }
  };

  return (
    <Modal
      stateModal={showModal}
      setStateModal={setShowModal}
      closeOutArea={false}
    >
      <div className="flex flex-col items-center py-10 w-full max-w-[500px] select-none">
        <p className="text-2xl font-medium">
          {type == "update" ? "แก้ไขรายการ" : "เพิ่มรายการ"}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col items-center gap-y-3 w-full"
        >
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="input-style"
          />

          <input
            type="text"
            name="desc"
            placeholder="รายละเอียด"
            value={form.desc}
            onChange={handleChange}
            className="input-style"
          />

          <input
            type="text"
            name="amount"
            placeholder="จำนวนเงิน"
            value={form.amount}
            onChange={handleChangeAmount}
            className="input-style"
          />

          <div className="flex items-center w-full justify-start gap-20">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={1}
                checked={form.type === 1}
                onChange={handleChange}
              />
              รายรับ
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={2}
                checked={form.type === 2}
                onChange={handleChange}
              />
              รายจ่าย
            </label>
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="font-medium">เลือกหมวดหมู่:</p>
            <div className="grid grid-cols-2 md:grid-cols-3  gap-2">
              {categories.map((item) => (
                <label key={item.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.cate.includes(item.id)}
                    onChange={() => handleCategoryChange(item.id)}
                  />
                  <span
                    style={{ backgroundColor: item.color }}
                    className={`px-5 py-1 rounded-lg ${
                      functionService.isLightColor(item.color)
                        ? "text-black"
                        : "text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center gap-10 items-center mt-5">
            <button
              type="submit"
              className={`bg-green-600 hover:bg-green-300 text-white hover:text-green-900 duration-300 
              py-2 px-5 w-10/12 md:max-w-[200px] rounded-2xl cursor-pointer
              disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-600`}
              disabled={onSend}
            >
              บันทึก
            </button>
            <button
              className={`flex justify-center items-center w-10 h-10 cursor-pointer rounded-2xl
                bg-red-500 hover:bg-red-200 text-white text-sm hover:text-red-500
                disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-600`}
              onClick={deleteCategory}
              disabled={onSend}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
