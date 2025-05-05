"use client";
import { useEffect, useState } from "react";
import ModalTransaction from "./ModalTransaction";
import apiService from "@/services/apiService";
import { transactionsType } from "@/types/transactions";
import { CategoryType } from "@/types/category";
import functionService from "@/services/functionService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "@/components/Pagination";

export default function Data() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [dataArr, setDataArr] = useState<transactionsType[]>([]);

  const [modalType, setModalType] = useState<"add" | "update">("add");
  const [dataEdit, setDataEdit] = useState<any>();

  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มที่ 0
  const firstDay = `${y}-${m}-01`;
  const lastDay = new Date(y, today.getMonth() + 1, 1)
    .toISOString()
    .slice(0, 10); // yyyy-mm-dd
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const [postPerPage, setPostPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  useEffect(() => {
    loadCategoriesAndTransactions();
  }, []);

  useEffect(() => {
    if (!loading) {
      const handler = setTimeout(() => {
        setLoading(true);
        fetchTransaction(categories);
      }, 1000); // รอ 1 วินาที

      return () => {
        clearTimeout(handler);
      };
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!loading) {
      const handler = setTimeout(() => {
        setLoading(true);
        fetchTransaction(categories);
      }, 500); // รอ 1 วินาที

      return () => {
        clearTimeout(handler);
      };
    }
  }, [postPerPage, currentPage]);

  const loadCategoriesAndTransactions = async () => {
    try {
      const categoriesData = await fetchCategories();
      const transactionsData = await fetchTransaction(categoriesData);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const fetchCategories = async (): Promise<CategoryType[]> => {
    try {
      const res = await apiService.get({
        url: "/api/category",
      });
      const data = await res.json();
      const categoryArr: CategoryType[] = JSON.parse(data.data.cate_name);
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
      const res = await apiService.get({
        url:
          "/api/transaction" +
          `?startDate=${startDate}&endDate=${endDate}&page=${currentPage}&itemPerPage=${postPerPage}`,
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

      setDataArr(transArr);
      setTotalPosts(data.total);
      setLoading(false);
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

      <div className="mt-5 flex gap-3 items-center">
        <label className="mr-2 font-medium">ช่วงวันที่</label>
        {[
          { name: "startDate", value: startDate ?? "", max: endDate },
          { name: "endDate", value: endDate ?? "", min: startDate },
        ].map((item, i) => {
          return (
            <input
              key={i}
              type="date"
              name={item.name}
              value={item.value}
              max={item.max}
              min={item.min}
              onChange={(e) => {
                const { value } = e.target;
                if (item.name === "startDate") {
                  setStartDate(value);
                } else if (item.name === "endDate") {
                  setEndDate(value);
                }
              }}
              className="border rounded-sm py-1 px-2"
            />
          );
        })}
      </div>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : dataArr.length === 0 ? (
        <p>ไม่มีข้อมูล</p>
      ) : (
        <div className="">
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
                  <td className="border px-4 py-2 text-end">
                    {item.type == 1 &&
                      functionService.formatAmount(item.amount)}
                  </td>
                  <td className="border px-4 py-2 text-end">
                    {item.type == 2 &&
                      functionService.formatAmount(item.amount)}
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
          <div className="mt-5">
            <Pagination
              postPerPage={postPerPage}
              currentPage={currentPage}
              totalPosts={totalPosts}
              setPostsPerPage={setPostPerPage}
              paginate={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
