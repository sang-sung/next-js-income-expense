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
    firstProgresss();
  }, []);

  useEffect(() => {
    generateSummary(mainCate);
  }, [data]);

  const firstProgresss = async () => {
    const mainCateFrLocal = await loadMainCate();

    setMainCate(mainCateFrLocal);
    generateSummary(mainCateFrLocal);
  };
  const loadMainCate = () => {
    const stored = localStorage.getItem("mainCate");
    const mainCateFrLocal = stored ? JSON.parse(stored) : [];

    return mainCateFrLocal;
  };

  const generateSummary = (mainCateLs: number[]) => {
    const summaryObj: {
      [key: number]: { subId: number; income: number; expense: number }[];
    } = {};

    data.forEach((item: any) => {
      // เฉพาะที่มีหมวดหมู่เดียว
      if (item.cate.length === 1) {
        const ctId = item.cate[0].id;

        // เป็นหมวดหมู่หลัก
        if (mainCateLs.includes(ctId)) {
          if (!summaryObj[ctId]) {
            summaryObj[ctId] = [];
          }

          let summaryEntry = summaryObj[ctId].find(
            (entry) => entry.subId === 0
          );
          if (!summaryEntry) {
            summaryEntry = { subId: 0, income: 0, expense: 0 };
            summaryObj[ctId].push(summaryEntry);
          }

          if (item.type === 1) {
            summaryEntry.income += parseFloat(item.amount);
          } else if (item.type === 2) {
            summaryEntry.expense += parseFloat(item.amount);
          }
          // ไม่เป็นหมวดหมู่หลัก
        } else {
          if (!summaryObj[0]) {
            summaryObj[0] = [];
          }

          let summaryEntry = summaryObj[0].find(
            (entry) => entry.subId === ctId
          );
          if (!summaryEntry) {
            summaryEntry = { subId: ctId, income: 0, expense: 0 };
            summaryObj[0].push(summaryEntry);
          }

          if (item.type === 1) {
            summaryEntry.income += parseFloat(item.amount);
          } else if (item.type === 2) {
            summaryEntry.expense += parseFloat(item.amount);
          }
        }
        // มีหลายหมวดหมู่
      } else {
        const ctMans = item.cate
          .filter((c: any) => mainCateLs.includes(c.id))
          .map((c: any) => c.id);
        const ctSubs = item.cate
          .filter((c: any) => !mainCateLs.includes(c.id))
          .map((c: any) => c.id);

        // มีหมวดหมู่หลักในนั้น
        if (ctMans.length > 0) {
          ctMans.map((mainId: any) => {
            if (!summaryObj[mainId]) {
              summaryObj[mainId] = [];
            }

            ctSubs.map((subId: any) => {
              let summaryEntry = summaryObj[mainId].find(
                (entry) => entry.subId === subId
              );
              if (!summaryEntry) {
                summaryEntry = { subId: subId, income: 0, expense: 0 };
                summaryObj[mainId].push(summaryEntry);
              }

              if (item.type === 1) {
                summaryEntry.income += parseFloat(item.amount);
              } else if (item.type === 2) {
                summaryEntry.expense += parseFloat(item.amount);
              }
            });
          });
          // ไม่มีหมวดหมู่หลักในนั้น
        } else {
          if (!summaryObj[0]) {
            summaryObj[0] = [];
          }

          ctSubs.map((subId: any) => {
            let summaryEntry = summaryObj[0].find(
              (entry) => entry.subId === subId
            );
            if (!summaryEntry) {
              summaryEntry = { subId: subId, income: 0, expense: 0 };
              summaryObj[0].push(summaryEntry);
            }

            if (item.type === 1) {
              summaryEntry.income += parseFloat(item.amount);
            } else if (item.type === 2) {
              summaryEntry.expense += parseFloat(item.amount);
            }
          });
        }
      }
    });

    const transformedSummary = Object.entries(summaryObj).map(
      ([mainId, entries]) => {
        const mainCategory = cateAll.find((cate) => cate.id === Number(mainId));

        const transformedMainCategory = {
          id: Number(mainId),
          name: mainCategory?.name ?? "ไม่ระบุในทั้งหมด",
          color: mainCategory?.color ?? "#000",
          subs: entries.map((entry) => {
            const subCategory = cateAll.find((cate) => cate.id === entry.subId);

            return {
              id: entry.subId,
              name: subCategory?.name ?? "ไม่ระบุในทั้งหมด",
              color: subCategory?.color ?? "#000",
              income: entry.income,
              expense: entry.expense,
            };
          }),
        };
        return transformedMainCategory;
      }
    );

    const cateOrderMap = new Map<number, number>();
    cateAll.forEach((c, idx) => {
      cateOrderMap.set(c.id, idx);
    });

    // เรียง subs (subId)
    transformedSummary.forEach((main) => {
      main.subs.sort((a, b) => {
        if (a.id === 0) return 1;
        if (b.id === 0) return -1;
        return (
          (cateOrderMap.get(a.id) ?? Infinity) -
          (cateOrderMap.get(b.id) ?? Infinity)
        );
      });
    });

    // เรียง main (mainId)
    const sortedSummary = transformedSummary.sort((a, b) => {
      if (a.id === 0) return 1;
      if (b.id === 0) return -1;
      return (
        (cateOrderMap.get(a.id) ?? Infinity) -
        (cateOrderMap.get(b.id) ?? Infinity)
      );
    });

    setSummary(sortedSummary);
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
