"use client";
import functionService from "@/services/functionService";
import { CategoryType } from "@/types/category";
import React, { useEffect, useState } from "react";
import ForSelectMainCate from "./forSelectMainCate";

export default function SecCate({
  data,
  cateAll,
}: {
  data: any;
  cateAll: CategoryType[];
}) {
  const [summary, setSummary] = useState<
    {
      id: number;
      name: string;
      color: string;
      subs: {
        id: number;
        name: string;
        color: string;
        income: number;
        expense: number;
      }[];
    }[]
  >([]);

  const [mainCate, setMainCate] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("mainCate");
    const mainCateFrLocal = stored ? JSON.parse(stored) : [];

    setMainCate(mainCateFrLocal);
    generateSummary(mainCateFrLocal);
  }, []);

  const generateSummary = (mainCateLs: number[]) => {
    const newSummary: typeof summary = [];
    const updatedMainCate = [...mainCateLs, -1];

    updatedMainCate.forEach((mainId) => {
      const sumSubs: {
        id: number;
        name: string;
        color: string;
        income: number;
        expense: number;
      }[] = [];

      cateAll.forEach((sub) => {
        if (mainCateLs.includes(sub.id)) return;

        const filteredData = data.filter((item: any) => {
          const cateIds = item.cate.map((c: any) => c.id);
          if (mainId === -1) {
            const hasMain = item.cate.some((c: any) =>
              mainCateLs.includes(c.id)
            );
            return !hasMain && cateIds.includes(sub.id);
          }
          return cateIds.includes(mainId) && cateIds.includes(sub.id);
        });

        const income = filteredData
          .filter((item: any) => item.type === 1)
          .reduce((sum: number, item: any) => sum + parseFloat(item.amount), 0);

        const expense = filteredData
          .filter((item: any) => item.type === 2)
          .reduce((sum: number, item: any) => sum + parseFloat(item.amount), 0);

        if (income !== 0 || expense !== 0) {
          sumSubs.push({
            id: sub.id,
            name: sub.name,
            color: sub.color,
            income,
            expense,
          });
        }
      });

      const orderedSubs = [
        ...sumSubs.filter((s) => s.name !== "ไม่ระบุ"),
        ...sumSubs.filter((s) => s.name === "ไม่ระบุ"),
      ];

      const main = cateAll.find((c: any) => c.id === mainId);
      newSummary.push({
        id: mainId,
        name: main?.name ?? "ไม่ระบุ",
        color: main?.color ?? "#000",
        subs: orderedSubs,
      });
    });

    setSummary(newSummary);
  };

  return (
    <div className="border-t-2 border-[var(--gray)]">
      <div className="my-5">
        <p className="text-3xl font-bold">แบ่งตามหมวดหมู่</p>
      </div>

      <ForSelectMainCate
        mainCate={mainCate}
        setMainCate={setMainCate}
        cateAll={cateAll}
        onGenerateSummary={generateSummary}
      />

      <table className="w-full text-left border-collapse mt-5">
        <thead>
          <tr className="bg-[var(--gray)]">
            <th className="border px-4 py-2">หมวดหมู่หลัก</th>
            <th className="border px-4 py-2">หมวดหมู่รอง</th>
            <th className="border px-4 py-2">รายรับ</th>
            <th className="border px-4 py-2">รายจ่าย</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((mainData) => {
            return mainData.subs.map((subData, index) => (
              <tr key={`${mainData.id}-${subData.id}`}>
                {index === 0 && (
                  <td
                    className="border px-4 py-2"
                    rowSpan={mainData.subs.length}
                  >
                    <div className="flex w-full justify-start">
                      <p
                        style={{ backgroundColor: mainData.color }}
                        className={`px-5 py-1 rounded-lg ${
                          functionService.isLightColor(mainData.color)
                            ? "text-black"
                            : "text-white"
                        }`}
                      >
                        {mainData.name}
                      </p>
                    </div>
                  </td>
                )}
                <td className="border px-4 py-2">
                  <div className="flex w-full justify-start">
                    <p
                      style={{ backgroundColor: subData.color }}
                      className={`px-5 py-1 rounded-lg ${
                        functionService.isLightColor(subData.color)
                          ? "text-black"
                          : "text-white"
                      }`}
                    >
                      {subData.name}
                    </p>
                  </div>
                </td>
                <td className="border px-4 py-2 text-end">
                  {subData.income === 0
                    ? ""
                    : functionService.formatAmount(subData.income)}
                </td>
                <td className="border px-4 py-2 text-end">
                  {subData.expense === 0
                    ? ""
                    : functionService.formatAmount(subData.expense)}
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}
