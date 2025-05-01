"use client";

import { Modal } from "@/components/Modal";
import { SwalAlert, toast } from "@/components/SweetAlert";
import apiService from "@/services/apiService";
import functionService from "@/services/functionService";
import { faEye, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type ModalUserProps = {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
  type?: "add" | "update";
  user: string;
  setLoading: (state: boolean) => void;
  loadUser: () => Promise<void>;
};
type FormFields = {
  user: string;
  password: string;
};

export default function ModalUser({
  showModal = false,
  setShowModal,
  type = "add",
  user,
  setLoading,
  loadUser,
}: ModalUserProps) {
  const initalForm: FormFields = {
    user: "",
    password: "",
  };
  const [form, setForm] = useState(initalForm);
  const [onSend, setOnSend] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (type == "update") {
      setForm((prev) => ({
        ...prev,
        user: user,
      }));
    }
  }, []);

  const initalSetState = () => {
    setForm(initalForm);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.user == "" || form.password == "") {
      SwalAlert.warning({ title: "แจ้งเตือน", text: "กรุณาระบุข้อมูลให้ครบ" });
      return;
    }
    if (functionService.validatePassword(form.password)) {
      SwalAlert.warning({
        title: "แจ้งเตือน",
        text: "รหัสผ่านต้องเป็นภาษาอังกฤษและความยาว 6 ตัวขึ้นไป",
      });
      return;
    }

    successVali();
  };

  const deleteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await SwalAlert.question({
      title: "ยืนยันการลบ",
      text: "ต้องการลบ user " + form.user + " หรือไม่",
      bnCancle: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await apiService.delete({
          url: "/api/users",
          body: { user: form.user },
        });
        const data = await res.json();
        toast.success(data.message);

        if (data.success) {
          initalSetState();
          setLoading(true);
          loadUser();
          setShowModal(false);
        }
        setOnSend(false);
      } catch (err) {
        toast.error("ผิดผลาด");
        console.error("Login error:", err);
      }
    }
  };

  const successVali = async () => {
    try {
      let urlApi = "";
      if (type == "add") {
        urlApi = "/api/users";
      } else if (type == "update") {
        urlApi = "/api/admin/resetpass";
      }

      const res = await apiService.post({
        url: urlApi,
        body: { user: form.user, password: form.password },
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        initalSetState();
        if (type == "add") {
          setLoading(true);
          loadUser();
        }
        setShowModal(false);
      } else {
        toast.error(data.message);
      }
      setOnSend(false);
    } catch (err) {
      toast.error("ผิดผลาด");
      console.error("Login error:", err);
    }
  };

  return (
    <Modal
      stateModal={showModal}
      setStateModal={setShowModal}
      closeOutArea={false}
    >
      <div className="flex flex-col items-center py-10 w-full max-w-[500px] select-none">
        <form
          onSubmit={handleSubmit}
          className={`mt-7 flex flex-col items-center gap-y-3 w-full`}
        >
          <input
            type="text"
            name="user"
            value={form.user}
            placeholder="user"
            onChange={handleChange}
            readOnly={type == "update"}
            className={`input-style pr-10`}
          />

          <div className="w-full relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              id="password"
              placeholder="รหัสผ่าน"
              value={form.password}
              onChange={handleChange}
              className="input-style pr-10"
            />
            <FontAwesomeIcon
              icon={showPass ? faEye : faEyeSlash}
              onClick={(e) => setShowPass(!showPass)}
              className="absolute top-2 right-2 text-black text-sm w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="w-full flex justify-center gap-10 items-center mt-5">
            <button
              type="submit"
              className={`bg-green-600 hover:bg-green-300 text-white hover:text-green-900 duration-300 
              py-2 px-5 w-10/12 md:max-w-[200px] rounded-2xl cursor-pointer
              disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-600`}
              disabled={onSend}
            >
              {type == "update" ? "Reset รหัสผ่าน" : "เพิ่ม user"}
            </button>
            {type == "update" && (
              <button
                className={`flex justify-center items-center w-10 h-10 cursor-pointer rounded-2xl
                bg-red-500 hover:bg-red-200 text-white text-sm hover:text-red-500
                disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-600`}
                onClick={deleteUser}
                disabled={onSend}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
