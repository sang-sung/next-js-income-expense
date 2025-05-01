"use client";

import { Modal } from "@/components/Modal";
import { SwalAlert, toast } from "@/components/SweetAlert";
import { validateChangPass } from "@/lib/validates/validateChangPass";
import apiService from "@/services/apiService";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type ModalChangPassProps = {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
};
type FormFields = {
  password_old: string;
  password_new: string;
  password_confirm: string;
};

export default function ModalChangPass({
  showModal = false,
  setShowModal,
}: ModalChangPassProps) {
  const initalForm: FormFields = {
    password_old: "",
    password_new: "",
    password_confirm: "",
  };
  const [form, setForm] = useState(initalForm);
  const [onSend, setOnSend] = useState(false);

  const [showPass, setShowPass] = useState<Record<keyof FormFields, boolean>>({
    password_old: false,
    password_new: false,
    password_confirm: false,
  });

  const initalSetState = () => {
    setForm(initalForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnSend(true);

    const errorMessage = validateChangPass(form);
    if (errorMessage) {
      SwalAlert.warning({ title: "แจ้งเตือน", text: errorMessage });
      setOnSend(false);
      return;
    }
    submitChangPass();
  };

  const submitChangPass = async () => {
    try {
      const res = await apiService.put({
        url: "/api/users",
        body: { password: form.password_new, password_old: form.password_old },
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          initalSetState();
          setShowModal(false);
        }, 1000);
      } else {
        toast.error(data.message);
        setOnSend(false);
      }
    } catch (err) {
      toast.error("ผิดผลาด");
      console.error("Login error:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fields: { title: string; name: keyof FormFields }[] = [
    { title: "รหัสผ่านเดิม", name: "password_old" },
    { title: "รหัสผ่านใหม่", name: "password_new" },
    { title: "ยืนยันรหัสผ่านใหม่", name: "password_confirm" },
  ];

  return (
    <Modal
      stateModal={showModal}
      setStateModal={setShowModal}
      closeOutArea={false}
    >
      <div className="flex flex-col items-center py-10 w-full max-w-[500px] select-none">
        <p className="text-xl font-medium">เปลี่ยนรหัสผ่าน</p>

        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col items-center gap-y-3 w-full"
        >
          {fields.map((val, i) => {
            return (
              <div key={i} className="relative w-full">
                <input
                  type={showPass[val.name] ? "text" : "password"}
                  name={val.name}
                  value={form[val.name]}
                  placeholder={val.title}
                  onChange={handleChange}
                  className="input-style pr-10"
                />
                <FontAwesomeIcon
                  icon={showPass[val.name] ? faEye : faEyeSlash}
                  onClick={() =>
                    setShowPass((prev) => ({
                      ...prev,
                      [val.name]: !prev[val.name],
                    }))
                  }
                  className="absolute top-2 right-3 text-gray-700 cursor-pointer w-5 h-5"
                />
              </div>
            );
          })}

          <div className="w-full flex justify-center gap-10 items-center mt-5">
            <button
              type="submit"
              className={`bg-green-600 hover:bg-green-300 text-white hover:text-green-900 duration-300 
              py-2 px-5 w-10/12 md:max-w-[200px] rounded-2xl cursor-pointer
              disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-600`}
              disabled={onSend}
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
