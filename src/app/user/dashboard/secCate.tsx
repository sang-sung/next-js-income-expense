"use client";
import functionService from "@/services/functionService";
import { CategoryType } from "@/types/category";
import React, { useEffect, useState } from "react";
import ForSelectMainCate from "./forSelectMainCate";
import TableCate from "./tableCate";

export default function SecCate({
  data,
  cateAll,
}: {
  data: any;
  cateAll: CategoryType[];
}) {
  type SummaryNode = {
    id: number;
    name: string;
    color: string;
    income?: number;
    expense?: number;
    [key: string]: any; // รองรับ sub1, sub2, sub3, ...
  };

  const [summary, setSummary] = useState<SummaryNode[]>([]);

  const [mainCate, setMainCate] = useState<number[][]>([]);
  const [cateLevelCount, setCateLevelCount] = useState<number>(1);

  useEffect(() => {
    firstProgresss();
  }, []);

  useEffect(() => {
    generateSummary(mainCate);
  }, [data]);

  const firstProgresss = async () => {
    const { mainCateFrLocal, cateLevelCount } = await loadMainCate();

    setMainCate(mainCateFrLocal);
    setCateLevelCount(cateLevelCount);
    generateSummary(mainCateFrLocal);
  };
  const loadMainCate = () => {
    const stored = localStorage.getItem("mainCate");
    const data = stored ? JSON.parse(stored) : [];
    const mainCateFrLocal = data.mainCate ? data.mainCate : [];
    const cateLevelCount = data.cateLevelCount ? data.cateLevelCount : 1;

    return { mainCateFrLocal, cateLevelCount };
  };

  const generateSummary = (mainCateLs: number[][]) => {
    type SummaryLeaf = {
      id: number;
      name: string;
      color: string;
      income: number;
      expense: number;
    };

    type SummaryNode = {
      id: number;
      name: string;
      color: string;
      subs: SummaryTree[];
    };

    type SummaryTree = SummaryNode | SummaryLeaf;

    // ตัวช่วย: แปลง id → level
    const cateLevelMap = new Map<number, number>();
    mainCateLs.forEach((level, idx) => {
      level.forEach((id) => {
        cateLevelMap.set(id, idx);
      });
    });

    type Node = any;

    const mergeEntry = (
      tree: Node[],
      path: number[],
      type: number,
      amount: number
    ) => {
      let currentLevel = tree;

      for (let i = 0; i < path.length; i++) {
        const id = path[i];
        let node = currentLevel.find((n: any) => n.id == id);

        if (!node) {
          const cateInfo = cateAll.find((c) => c.id == id);
          node = {
            id,
            name: cateInfo?.name ?? "ไม่ระบุในทั้งหมด",
            color: cateInfo?.color ?? "#000",
          };
          if (i < path.length - 1) {
            node[`sub${i + 1}`] = [];
          } else {
            node.income = 0;
            node.expense = 0;
          }
          currentLevel.push(node);
        }

        if (i === path.length - 1) {
          if (type == 1) node.income += amount;
          else node.expense += amount;
        } else {
          currentLevel = node[`sub${i + 1}`];
        }
      }
    };

    const result: Node[] = [];

    for (const item of data) {
      const path: number[] = [];
      const cate = item.cate.map((c: any) => c.id); //to [1,2,3,...]

      // ระบุ path แต่ละ level
      for (let level = 0; level < mainCateLs.length; level++) {
        const found = cate.find((id: any) => cateLevelMap.get(id) == level);
        path.push(found ?? 0);
      }

      mergeEntry(result, path, item.type, parseFloat(item.amount));
    }

    const cateOrderMap = new Map<number, number>();
    cateAll.forEach((c, idx) => cateOrderMap.set(c.id, idx));

    // 2. ฟังก์ชันจัดเรียง tree
    const sortTreeByCateOrder = (tree: Node[], level: number = 0): void => {
      tree.sort((a, b) => {
        return (
          (cateOrderMap.get(a.id) ?? Infinity) -
          (cateOrderMap.get(b.id) ?? Infinity)
        );
      });

      for (const node of tree) {
        const subKey = `sub${level + 1}`;
        if (Array.isArray(node[subKey])) {
          sortTreeByCateOrder(node[subKey], level + 1);
        }
      }
    };

    sortTreeByCateOrder(result);

    setSummary(result);
  };

  return (
    <div className="border-t-2 border-[var(--gray)]">
      <div className="my-5">
        <p className="text-3xl font-bold">แบ่งตามหมวดหมู่</p>
      </div>

      <ForSelectMainCate
        mainCate={mainCate}
        setMainCate={setMainCate}
        cateLevelCount={cateLevelCount}
        setCateLevelCount={setCateLevelCount}
        cateAll={cateAll}
        onGenerateSummary={generateSummary}
      />

      <TableCate mainCate={mainCate} summary={summary} />
    </div>
  );
}
