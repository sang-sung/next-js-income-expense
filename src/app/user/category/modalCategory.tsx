"use client";

import { Modal } from "@/components/Modal";
import { SwalAlert, toast } from "@/components/SweetAlert";
import apiService from "@/service/apiService";
import { CategoryType } from "@/types/category";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type ModalCategoryProps = {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
  categoriesArr: CategoryType[];
  type?: "add" | "update";
  id?: number;
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>;
  setOnSortCate: (state: boolean) => void;
};

export default function ModalCategory({
  showModal = false,
  setShowModal,
  categoriesArr,
  type = "add",
  id,
  setCategories,
  setOnSortCate,
}: ModalCategoryProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [onSend, setOnSend] = useState(false);

  useEffect(() => {
    if (type == "update") {
      const categoryToUpdate = categoriesArr.find((cate) => cate.id === id);
      if (categoryToUpdate) {
        setName(categoryToUpdate.name);
        setColor(categoryToUpdate.color);
      }
    }
  }, []);

  const initalSetState = () => {
    setName("");
    setColor("#000000");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim() === "") {
      toast.warning("กรุณาระบุข้อมูลให้ครบ");
      document.getElementById("name")?.focus();
      return;
    }
    let concatArr;

    if (type === "update") {
      concatArr = categoriesArr.map((cate) =>
        cate.id === id ? { ...cate, name, color } : cate
      );
    } else {
      const newId =
        categoriesArr.length > 0
          ? Math.max(...categoriesArr.map((c) => c.id)) + 1
          : 1;

      concatArr = [...categoriesArr, { id: newId, name, color }];
    }

    const cate_name = JSON.stringify(concatArr);

    submitCategory(cate_name, concatArr);
  };

  const deleteCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cate_delete = categoriesArr.filter((cate) => cate.id == id);
    const result = await SwalAlert.question({
      title: "ยืนยันการลบ",
      text: "ต้องการลบหมวดหมู่ " + cate_delete[0].name + " หรือไม่",
      bnCancle: true,
    });

    if (result.isConfirmed) {
      const concatArr = categoriesArr.filter((cate) => cate.id !== id);
      const cate_name = JSON.stringify(concatArr);

      submitCategory(cate_name, concatArr);
    }
  };

  const submitCategory = async (
    cate_name: string,
    concatArr: CategoryType[]
  ) => {
    try {
      const res = await apiService.post({
        url: "/api/category",
        body: { cate_name },
      });

      const data = await res.json();
      toast.success(data.message);
      setCategories(concatArr);
      initalSetState();
      setShowModal(false);

      if (data.success) {
        setOnSortCate(false);
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
      <div className="flex flex-col items-center py-10 w-full max-w-[500px]">
        <p className="text-xl font-medium">
          {type == "update" ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col items-center gap-y-3 w-full"
        >
          <input
            type="text"
            name="name"
            id="name"
            placeholder="ชื่อหมวดหมู่"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-cate-style w-full text-center"
          />
          <input
            type="color"
            name="color"
            id="color"
            placeholder="สี"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="input-cate-style w-[200px]"
          />

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
            {type == "update" && (
              <button
                className={`flex justify-center items-center w-10 h-10 cursor-pointer rounded-2xl
                bg-red-500 hover:bg-red-200 text-white text-sm hover:text-red-500
                disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-600`}
                onClick={deleteCategory}
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
