import functionService from "@/services/functionService";
import { CategoryType } from "@/types/category";
import React, { useState } from "react";

export default function ForSelectMainCate({
  mainCate,
  setMainCate,
  cateLevelCount,
  setCateLevelCount,
  cateAll,
  onGenerateSummary,
}: {
  mainCate: number[][];
  setMainCate: React.Dispatch<React.SetStateAction<number[][]>>;
  cateLevelCount: number;
  setCateLevelCount: React.Dispatch<React.SetStateAction<number>>;
  cateAll: CategoryType[];
  onGenerateSummary: (mainCate: number[][]) => void;
}) {
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const handleDropToDiv = (i: number) => {
    setMainCate((prev) => {
      let updated = [...prev];

      // ถ้ายังไม่มี index ถึง i ให้เพิ่ม []
      while (updated.length <= cateLevelCount) {
        updated.push([]);
      }

      // ตัดความยาวให้ไม่เกิน cateLevelCount
      if (updated.length > cateLevelCount) {
        updated = updated.slice(0, cateLevelCount);
      }

      if (draggedId != null && !updated[i].includes(draggedId)) {
        updated[i] = [...updated[i], draggedId];
      }

      // เรียงตามลำดับใน categories
      updated = updated.map((item) =>
        cateAll.filter((cat) => item.includes(cat.id)).map((cat) => cat.id)
      );
      return updated;
    });
  };

  const handleRemoveFromDiv = (i: number) => {
    if (draggedId !== null) {
      setMainCate((prev) => {
        let updated = [...prev];
        // ถ้ายังไม่มี index ถึง i ให้เพิ่ม []
        while (updated.length <= cateLevelCount) {
          updated.push([]);
        }
        // ตัดความยาวให้ไม่เกิน cateLevelCount
        if (updated.length > cateLevelCount) {
          updated = updated.slice(0, cateLevelCount);
        }
        updated[i] = updated[i].filter((id) => id !== draggedId);
        return updated;
      });
    }
  };

  const handleChangeSelect = (e: any) => {
    const l = parseInt(e.target.value);
    let updated = mainCate;
    // ถ้ายังไม่มี index ถึง i ให้เพิ่ม []
    while (updated.length <= l) {
      updated.push([]);
    }
    // ตัดความยาวให้ไม่เกิน l
    if (updated.length > l) {
      updated = updated.slice(0, l);
    }

    setMainCate(updated);
    setCateLevelCount(l);
    onGenerateSummary(updated);
  };

  return (
    <div className="">
      <div className="mb-5 w-full flex gap-5">
        <div className="">
          <label className="mr-2 font-medium">จำนวนหมวดหมู่</label>
          <select
            value={cateLevelCount.toString()}
            onChange={handleChangeSelect}
            className="border px-3 py-1 rounded bg-[#06402B] text-white cursor-pointer"
          >
            {[1, 2, 3].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault;
            setMainCate((prev) => Array(prev.length).fill([]));
          }}
          className="py-1 px-4 rounded-sm bg-red-600 text-white hover:bg-red-200 hover:text-red-700 cursor-pointer duration-300"
        >
          ล้างหมวดหมู่
        </button>
      </div>
      {cateLevelCount > 0 && (
        <div
          className="grid gap-3 w-full h-50 select-none"
          style={{ gridTemplateColumns: `repeat(${cateLevelCount + 1}, 1fr)` }}
        >
          {/* กล่องทั้งหมด */}
          <div className="col-span-full ">
            <div className="flex flex-wrap gap-3">
              {cateAll
                .filter((item) => {
                  const usedIds = mainCate.flat();
                  return item.id !== 0 && !usedIds.includes(item.id);
                })
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

          {Array.from({ length: cateLevelCount }).map((_, i) => (
            <div
              key={i}
              className="w-full h-full border-2 rounded-2xl p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                handleDropToDiv(i);
              }}
              onDragLeave={() => {
                handleRemoveFromDiv(i);
              }}
            >
              <h3 className="mb-2">หมวดหมู่ {i + 1}</h3>
              <div className="flex flex-wrap gap-3">
                {mainCate[i] && mainCate[i].length <= 0 ? (
                  <p className="w-full text-center">
                    ลากเลือกหมวดหมู่หลักมามาวางที่นี่
                  </p>
                ) : (
                  mainCate[i] &&
                  mainCate[i].map((id) => {
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
          ))}

          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault;

                localStorage.setItem(
                  "mainCate",
                  JSON.stringify({ mainCate, cateLevelCount })
                );
                onGenerateSummary(mainCate);
              }}
              className="py-2 px-4 rounded-xl bg-green-600 text-white hover:bg-green-200 hover:text-green-700 cursor-pointer duration-300"
            >
              จัดการข้อมูลตาราง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
