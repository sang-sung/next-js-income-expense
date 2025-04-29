"use client";
import { useEffect, useState } from "react";
import ModalTransaction from "./ModalTransaction";
import apiService from "@/service/apiService";
import { transactionsType } from "@/types/transactions";
import { CategoryType } from "@/types/category";
import functionService from "@/service/functionService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export default function Data() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [dataArr, setDataArr] = useState<transactionsType[]>([]);

  const [modalType, setModalType] = useState<"add" | "update">("add");
  const [dataEdit, setDataEdit] = useState<any>();

  useEffect(() => {
    loadCategoriesAndTransactions();
  }, []);

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

      setDataArr(transArr);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      return;
    }
  };

  return (
    <div className="p-5">
      <button
        onClick={() => {
          setShowModal(true);
          setModalType("add");
        }}
        className="py-2 px-4 rounded-xl text-white bg-green-600 hover:bg-green-200 hover:text-green-700 cursor-pointer duration-300"
      >
        เพิ่มรายการ
      </button>
      {showModal && (
        <ModalTransaction
          showModal={showModal}
          setShowModal={setShowModal}
          type={modalType}
          dataEdit={dataEdit}
          categories={categories}
          onFetchTransaction={fetchTransaction}
        />
      )}

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : dataArr.length === 0 ? (
        <p>ไม่มีข้อมูล</p>
      ) : (
        <table className="w-full text-left border-collapse mt-5">
          <thead>
            <tr className="bg-[var(--gray)]">
              <th className="border px-4 py-2 w-[100px]">#</th>
              <th className="border px-4 py-2">วันที่</th>
              <th className="border px-4 py-2">รายการ</th>
              <th className="border px-4 py-2">รายรับ</th>
              <th className="border px-4 py-2">รายจ่าย</th>
              <th className="border px-4 py-2">หมวดหมู่</th>
              <th className="border px-4 py-2">แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {dataArr.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  {new Date(item.date).toLocaleDateString("th-TH")}
                </td>
                <td className="border px-4 py-2">{item.desc}</td>
                <td className="border px-4 py-2">
                  {item.type == 1 && item.amount}
                </td>
                <td className="border px-4 py-2">
                  {item.type == 2 && item.amount}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex gap-2 flex-wrap">
                    {item.cate.map((cate: any, i) => {
                      return (
                        <p
                          key={i}
                          style={{ backgroundColor: cate.color }}
                          className={`px-5 py-1 rounded-lg ${
                            functionService.isLightColor(cate.color)
                              ? "text-black"
                              : "text-white"
                          }`}
                        >
                          {cate.name}
                        </p>
                      );
                    })}
                  </div>
                </td>
                <td className="border px-4 py-2">
                  <div className="w-full flex justify-center">
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={(e) => {
                        setModalType("update");
                        setDataEdit(item);
                        setShowModal(true);
                      }}
                      className="text-yellow-500 text-lg w-5 h-5 cursor-pointer hover:text-yellow-800"
                    />
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
