"use client"; // ถ้าใช้ Next.js App Router

import { useEffect, useState } from "react";
import SecChart from "./secChart";
import { CategoryType } from "@/types/category";
import { transactionsType } from "@/types/transactions";
import apiService from "@/services/apiService";
import SecCate from "./secCate";
import { monthLong } from "@/src/constants/date";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [transactions, setTransactions] = useState<transactionsType[]>([]);

  const [data, setData] = useState<any>();

  const [filterDate, setFilterDate] = useState<{
    year?: number;
    month?: number;
  }>({});
  const options: { year: number; month: number }[] = [];
  const currentDate = new Date();
  for (
    let y = currentDate.getFullYear();
    y >= currentDate.getFullYear() - 5;
    y--
  ) {
    for (let m = 12; m >= 1; m--) {
      if (y === currentDate.getFullYear() && m > currentDate.getMonth() + 1)
        continue;
      options.push({ year: y, month: m });
    }
  }

  useEffect(() => {
    loadCategoriesAndTransactions();
  }, []);

  useEffect(() => {
    const labels = Array.from(new Set(transactions.map((tx) => tx.date)))
      .sort()
      .reverse();

    const datasetsInEx = [
      { name: "รายรับ", type: 1, color: "#4CAF50" }, //#2196F3 #4CAF50
      { name: "รายจ่าย", type: 2, color: "#F44336" }, //#FF9800 #F44336
    ].map((type) => {
      // รวมยอดตามวันที่
      const sumsByDate: Record<string, number> = {};

      transactions.forEach((tx: any) => {
        if (tx.type === type.type) {
          const date = tx.date;
          sumsByDate[date] = (sumsByDate[date] || 0) + parseFloat(tx.amount);
        }
      });

      // สร้าง array ที่ตรงกับลำดับ label
      const data = labels.map((date: any) => sumsByDate[date] || 0);

      return {
        label: type.name,
        backgroundColor: type.color,
        borderColor: type.color,
        data,
      };
    });

    const chartDataInEx = {
      labels: labels,
      datasets: datasetsInEx,
    };

    setData(chartDataInEx);
  }, [transactions]);

  const loadCategoriesAndTransactions = async () => {
    try {
      const now = new Date();
      setFilterDate({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });

      const categoriesData = await fetchCategories();
      const transactionsData = await fetchTransaction(categoriesData, {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (): Promise<CategoryType[]> => {
    try {
      const res = await apiService.get({
        url: "/api/category",
      });
      const data = await res.json();
      const categoryArr: CategoryType[] = JSON.parse(data.data.cate_name);
      categoryArr.push({
        id: 0,
        name: "ไม่ระบุ",
        color: "#000",
      });
      setCategories(categoryArr);
      return categoryArr;
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  };

  const fetchTransaction = async (
    categoriesData: CategoryType[],
    dateFilter?: { year?: number; month?: number }
  ): Promise<void> => {
    try {
      const year = dateFilter?.year ?? filterDate.year;
      const month = dateFilter?.month ?? filterDate.month;

      const res = await apiService.get({
        url: "/api/transaction" + `?year=${year}&month=${month}`,
      });
      const data = await res.json();

      const transArr = data.data.map((transaction: any) => {
        const cateArray: CategoryType[] = [];
        const ids = transaction.cate.split(",").map(Number);

        ids.forEach((id: number) => {
          const category = categoriesData.find((cat) => cat.id === id);
          if (category) {
            cateArray.push(category);
          } else {
            const hasDefault = cateArray.some((cat) => cat.id === 0);
            if (!hasDefault) {
              cateArray.push({
                id: 0,
                name: "ไม่ระบุ",
                color: "#000",
              });
            }
          }
        });

        return {
          ...transaction,
          cate: cateArray,
        } as transactionsType;
      });

      setTransactions(transArr);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      return;
    }
  };
  return (
    <div className="p-5">
      <div className="mb-5">
        <label className="mr-2 font-medium">เลือกเดือน/ปี</label>
        <select
          value={`${filterDate.year}-${filterDate.month}`}
          onChange={(e) => {
            const [year, month] = e.target.value.split("-").map(Number);
            setFilterDate({ year, month });
            fetchTransaction(categories, { year, month });
          }}
          className="border px-3 py-1 rounded bg-[#06402B] text-white"
        >
          {options.map(({ year, month }) => (
            <option key={`${year}-${month}`} value={`${year}-${month}`}>
              {monthLong[month - 1]} {year + 543}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : transactions.length === 0 ? (
        <p>ไม่มีข้อมูล</p>
      ) : (
        <>
          {data && (
            <>
              <div className="mb-5">
                <p className="text-3xl font-bold">แบ่งตามรายรับ - รายจ่าย</p>
              </div>
              <SecChart data={data} />
            </>
          )}
          <div className="h-5"></div>
          {transactions.length > 0 && categories.length > 0 && (
            <SecCate data={transactions} cateAll={categories} />
          )}
        </>
      )}
    </div>
  );
}
