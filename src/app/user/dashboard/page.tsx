"use client"; // ถ้าใช้ Next.js App Router

import { useEffect, useState } from "react";
import SecChart from "./secChart";
import { CategoryType } from "@/types/category";
import { transactionsType } from "@/types/transactions";
import apiService from "@/service/apiService";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [transactions, setTransactions] = useState<transactionsType[]>([]);

  const [data, setData] = useState<any>();
  const [dataCate, setdataCate] = useState<any>();

  useEffect(() => {
    loadCategoriesAndTransactions();
  }, []);

  useEffect(() => {
    const labels = Array.from(new Set(transactions.map((tx) => tx.date)))
      .sort()
      .reverse();

    const datasetsInEx = [
      { name: "รายรับ", type: 1, color: "#4CAF50" }, //#2196F3 #4CAF50
      { name: "รายจ่าย", type: 2, color: "#F44336" },//#FF9800 #F44336
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

    const datasetsCate = categories.map((cat) => {
      // เตรียม array สำหรับเก็บยอดของแต่ละวัน
      const data = labels.map((labelDate) => {
        // กรองเฉพาะรายการที่เป็นรายจ่ายในวันนั้น
        const txsInDate = transactions.filter(
          (tx) => tx.date === labelDate && tx.type === 2
        );

        // รวมยอดเฉพาะรายการที่มี category ตรงกับ cat.id
        const total = txsInDate.reduce((sum, tx: any) => {
          const hasCat = tx.cate.some((c: any) => c.id === cat.id);
          return hasCat ? sum + parseFloat(tx.amount) : sum;
        }, 0);

        return total;
      });

      return {
        label: cat.name,
        backgroundColor: cat.color,
        borderColor: "#fff",
        borderWidth: 0.8,
        data,
      };
    });

    const chartDataInEx = {
      labels: labels,
      datasets: datasetsInEx,
    };
    const chartDataCate = {
      labels: labels,
      datasets: datasetsCate,
    };
    console.log(chartDataCate);

    setData(chartDataInEx);
    setdataCate(chartDataCate);
  }, [transactions]);

  const loadCategoriesAndTransactions = async () => {
    try {
      const categoriesData = await fetchCategories();
      const transactionsData = await fetchTransaction(categoriesData);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (): Promise<CategoryType[]> => {
    try {
      const res = await apiService.get({ url: "/api/category" });
      const data = await res.json();
      const categoryArr: CategoryType[] = JSON.parse(data.data[0].cate_name);
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
    categoriesData: CategoryType[]
  ): Promise<void> => {
    try {
      const res = await apiService.get({ url: "/api/transaction" });
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
      {data && <SecChart data={data} />}
      <div className="h-5"></div>
      {dataCate && <SecChart data={dataCate} />}
    </div>
  );
}
