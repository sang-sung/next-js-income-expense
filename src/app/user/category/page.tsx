"use client";

import { useEffect, useState } from "react";
import ModalCategory from "./modalCategory";
import apiService from "@/services/apiService";
import { CategoryType } from "@/types/category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAnglesDown,
  faAnglesUp,
  faAngleUp,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "@/components/SweetAlert";
import functionService from "@/services/functionService";
import "./category.css";

export default function Category() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [modalType, setModalType] = useState<"add" | "update">("add");
  const [editId, setEditId] = useState<number>(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiService.get({ url: "/api/category" });
      const data = await res.json();

      const categoryArr = JSON.parse(data.data.cate_name);
      setCategories(categoryArr);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const [onSortCate, setOnSortCate] = useState(false);
  const moveCategory = (index: number, direction: number) => {
    setOnSortCate(true);
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const updated = [...categories];
    const movedItem = updated.splice(index, 1)[0]; // ลบ item ที่ตำแหน่ง index
    updated.splice(newIndex, 0, movedItem); // แทรก item ที่ตำแหน่งใหม่

    setCategories(updated);
  };

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };
  const handleDragEnter = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;

    setOnSortCate(true);
    const updated = [...categories];
    const draggedItem = updated[dragIndex];
    updated.splice(dragIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    setDragIndex(targetIndex);
    setCategories(updated);
  };
  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const submitCategory = async () => {
    try {
      const cate_name = JSON.stringify(categories);
      const res = await apiService.post({
        url: "/api/category",
        body: { cate_name },
      });

      const data = await res.json();
      toast.success(data.message);

      if (data.success) {
        setOnSortCate(false);
      }
    } catch (err) {
      toast.error("ผิดผลาด");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="p-5">
      <button
        onClick={() => {
          setModalType("add");
          setShowModal(true);
        }}
        className="py-2 px-4 rounded-xl bg-green-600 text-white hover:bg-green-200 hover:text-green-700 cursor-pointer duration-300"
      >
        เพิ่มหมวดหมู่
      </button>
      {showModal && (
        <ModalCategory
          showModal={showModal}
          setShowModal={setShowModal}
          categoriesArr={categories}
          setCategories={setCategories}
          type={modalType}
          id={editId}
          setOnSortCate={setOnSortCate}
        />
      )}

      <div className="flex justify-between mt-4 mb-3">
        <h2 className="text-xl font-bold py-2">รายการหมวดหมู่</h2>
        {onSortCate && (
          <button
            onClick={submitCategory}
            className="py-2 px-4 rounded-xl bg-yellow-600 text-white hover:bg-yellow-200 hover:text-yellow-700 cursor-pointer duration-300"
          >
            บันทึกการแก้ไข
          </button>
        )}
      </div>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : categories.length === 0 ? (
        <p>ไม่มีหมวดหมู่</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--gray)]">
              <th className="border px-4 py-2 w-[100px]">#</th>
              <th className="border px-4 py-2">ชื่อหมวดหมู่</th>
              <th className="border px-4 py-2 w-[150px]">แก้ไข</th>
              <th className="border px-4 py-2 w-[150px]"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cate, index) => (
              <tr
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                className={`hover:bg-[var(--bg-hover-row)] cursor-move ${
                  dragIndex === index ? "bg-[var(--bg-on-drag)]" : ""
                }`}
              >
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2 flex justify-center">
                  <p
                    style={{ backgroundColor: cate.color }}
                    className={`px-5 py-1 rounded-lg ${
                      functionService.isLightColor(cate.color)
                        ? "text-black"
                        : "text-white"
                    }`}
                  >
                    {cate.name}
                  </p>
                </td>
                <td className="border px-4 py-2">
                  <div className="w-full flex justify-center">
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={(e) => {
                        setModalType("update");
                        setEditId(cate.id);
                        setShowModal(true);
                      }}
                      className="text-yellow-500 text-lg w-5 h-5 cursor-pointer hover:text-yellow-800"
                    />
                  </div>
                </td>
                <td className="border px-4 py-2">
                  <div className="flex justify-center gap-x-2">
                    {[
                      {
                        action: "top",
                        direction: -index,
                        disabled: index === 0,
                        icon: faAnglesUp,
                      },
                      {
                        action: "up",
                        direction: -1,
                        disabled: index === 0,
                        icon: faAngleUp,
                      },
                      {
                        action: "down",
                        direction: 1,
                        disabled: index === categories.length - 1,
                        icon: faAngleDown,
                      },
                      {
                        action: "bottom",
                        direction: categories.length - index - 1,
                        disabled: index === categories.length - 1,
                        icon: faAnglesDown,
                      },
                    ].map((item, i) => {
                      return (
                        <button
                          key={i}
                          onClick={() => moveCategory(index, item.direction)}
                          disabled={item.disabled}
                          className="w-5 h-5 disabled:opacity-50 hover:animate-bounce cursor-pointer disabled:animate-none disabled:cursor-not-allowed"
                        >
                          <FontAwesomeIcon icon={item.icon} className="" />
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
