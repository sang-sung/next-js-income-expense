import functionService from "@/services/functionService";
import { CategoryType } from "@/types/category";
import React, { useState } from "react";

export default function ForSelectMainCate({
  mainCate,
  setMainCate,
  cateAll,
  onGenerateSummary,
}: {
  mainCate: number[];
  setMainCate: React.Dispatch<React.SetStateAction<number[]>>;
  cateAll: CategoryType[];
  onGenerateSummary: (mainCate: number[]) => void;
}) {
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const handleDropToMain = () => {
    if (draggedId !== null && !mainCate.includes(draggedId)) {
      let orderCate = [...mainCate, draggedId];
      orderCate = cateAll
        .filter((cat) => orderCate.includes(cat.id))
        .map((cat) => cat.id);

      setMainCate(orderCate);
    }
  };

  const handleDropToAll = () => {
    if (draggedId !== null && mainCate.includes(draggedId)) {
      setMainCate((prev) => prev.filter((id) => id !== draggedId));
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 w-full h-50 select-none">
      {/* กล่องทั้งหมด */}
      <div
        className="w-full h-full border-2 rounded-2xl p-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropToAll}
      >
        <h3 className="mb-2">หมวดหมู่รอง</h3>
        <div className="flex flex-wrap gap-3">
          {cateAll
            .filter((item) => !mainCate.includes(item.id) && item.id != 0)
            .map((item) => (
              <p
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onDragEnd={handleDragEnd}
                style={{ backgroundColor: item.color }}
                className={`px-5 py-1 rounded-lg cursor-move ${
                  functionService.isLightColor(item.color)
                    ? "text-black"
                    : "text-white"
                }`}
              >
                {item.name}
              </p>
            ))}
        </div>
      </div>

      {/* กล่องที่เลือก */}
      <div
        className="w-full h-full border-2 rounded-2xl p-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropToMain}
      >
        <h3 className="mb-2">หมวดหมู่หลัก</h3>
        <div className="flex flex-wrap gap-3 w-full">
          {mainCate.length <= 0 ? (
            <p className="w-full text-center">
              ลากเลือกหมวดหมู่หลักมามาวางที่นี่
            </p>
          ) : (
            mainCate.map((id) => {
              const item = cateAll.find((c) => c.id === id);
              if (!item) return null;
              return (
                <p
                  key={id}
                  draggable
                  onDragStart={() => handleDragStart(id)}
                  onDragEnd={handleDragEnd}
                  style={{ backgroundColor: item.color }}
                  className={`px-5 py-1 rounded-lg cursor-move ${
                    functionService.isLightColor(item.color)
                      ? "text-black"
                      : "text-white"
                  }`}
                >
                  {item.name}
                </p>
              );
            })
          )}
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <button
          onClick={(e) => {
            e.preventDefault;

            localStorage.setItem("mainCate", JSON.stringify(mainCate));
            onGenerateSummary(mainCate);
          }}
          className="py-2 px-4 rounded-xl bg-green-600 text-white hover:bg-green-200 hover:text-green-700 cursor-pointer duration-300"
        >
          จัดการข้อมูลตาราง
        </button>
      </div>
    </div>
  );
}
