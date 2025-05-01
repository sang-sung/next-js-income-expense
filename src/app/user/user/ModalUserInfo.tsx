"use client";

import { Modal } from "@/components/Modal";
import { SwalAlert, toast } from "@/components/SweetAlert";
import apiService from "@/services/apiService";
import { useEffect, useState } from "react";
import { validateUserInfo } from "@/lib/validates/validateUserInfo";

type ModalUserInfo = {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
  dataUserInfo: any;
  onFetchUserInfo?: () => Promise<void>;
};
type FormFields = {
  fname: string;
  lname: string;
  age: string;
  sex: number;
  address: string;
};

export default function ModalUserInfo({
  showModal = false,
  setShowModal,
  dataUserInfo,
  onFetchUserInfo,
}: ModalUserInfo) {
  const initalForm: FormFields = {
    fname: "",
    lname: "",
    age: "",
    sex: 0, // 1 = ชาย, 2 = หญิง
    address: "",
  };
  const [form, setForm] = useState(initalForm);
  const [onSend, setOnSend] = useState(false);

  const initalSetState = () => {
    setForm(initalForm);
  };

  useEffect(() => {
    if (dataUserInfo) {
      setForm({
        fname: dataUserInfo.fname,
        lname: dataUserInfo.lname,
        age: dataUserInfo.age,
        sex: parseInt(dataUserInfo.sex),
        address: dataUserInfo.address,
      });
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const parsedValue = name === "sex" ? Number(value) : value;

    const decimalNumber = /^$|^\d+$/;
    if (name == "age" && !decimalNumber.test(value)) {
      SwalAlert.warning({
        title: "แจ้งเตือน",
        text: "กรุณาป้อนตัวเลขเท่านั้น",
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnSend(true);

    const errorMessage = validateUserInfo(form);
    if (errorMessage) {
      SwalAlert.warning({ title: "แจ้งเตือน", text: errorMessage });
      setOnSend(false);
      return;
    }

    submitTransactions();
  };

  const submitTransactions = async () => {
    try {
      const body = {
        fname: form.fname,
        lname: form.lname,
        age: form.age != "" ? parseInt(form.age) : null,
        sex: form.sex.toString(),
        address: form.address,
      };

      const res = await apiService.post({
        url: "/api/userinfo",
        body,
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        onFetchUserInfo?.();
        setTimeout(() => {
          setShowModal(false);
        }, 1000);
      } else {
        toast.error(data.message);
        setOnSend(false);
      }
    } catch (err) {
      toast.error("ผิดพลาด");
      console.error("Transaction error:", err);
    }
  };

  const fields: {
    title: string;
    name: keyof FormFields;
    maxLength?: number;
  }[] = [
    { title: "ชื่อ", name: "fname" },
    { title: "นามสกุล", name: "lname" },
    { title: "อายุ (ปี)", name: "age", maxLength: 2 },
    { title: "ที่อยู่", name: "address" },
  ];

  return (
    <Modal
      stateModal={showModal}
      setStateModal={setShowModal}
      closeOutArea={false}
    >
      <div className="flex flex-col items-center py-10 w-full max-w-[500px] select-none">
        <p className="text-2xl font-medium">แก้ไขข้อมูลส่วนตัว</p>

        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col items-center gap-y-3 w-full"
        >
          {fields.map((val, i) => {
            return (
              <input
                key={i}
                type="text"
                name={val.name}
                value={form[val.name]}
                placeholder={val.title}
                onChange={handleChange}
                maxLength={val.maxLength}
                className="input-style pr-10"
              />
            );
          })}

          <div className="flex items-center w-full justify-start gap-20">
            <p>เพศ :</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sex"
                value={1}
                checked={form.sex === 1}
                onChange={handleChange}
              />
              ชาย
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sex"
                value={2}
                checked={form.sex === 2}
                onChange={handleChange}
              />
              หญิง
            </label>
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
          </div>
        </form>
      </div>
    </Modal>
  );
}
