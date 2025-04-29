"use client"; // ถ้าใช้ Next.js App Router

import { useRouter } from "next/navigation";
import ModalChangPass from "./modalChangPass";
import { useEffect, useState } from "react";
import { SwalAlert } from "@/components/SweetAlert";
import ModalUserInfo from "./ModalUserInfo";
import apiService from "@/service/apiService";

type UserInfo = {
  fname?: string;
  lname?: string;
  age?: number;
  sex?: number;
  address?: string;
};

export default function User() {
  const router = useRouter();

  const [showModalChangPass, setShowModalChangPass] = useState(false);
  const [showModalUserInfo, setShowModalUserInfo] = useState(false);

  const [loading, setLoading] = useState(true);
  const [dataUserInfo, setdataUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await apiService.get({ url: "/api/userinfo" });
      const data = await res.json();

      setdataUserInfo(data.data[0]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 w-full flex justify-center">
      <div className="flex flex-col gap-3">
        <p className="text-xl font-medium text-center">ข้อมูลส่วนตัว</p>

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : (
          <div className="flex flex-col gap-3 items-center e">
            <button
              onClick={() => {
                setShowModalUserInfo(true);
              }}
              className="py-2 px-4 rounded-xl w-fit text-white bg-yellow-600 hover:bg-yellow-200 hover:text-yellow-700 cursor-pointer duration-300"
            >
              แก้ไขข้อมูลส่วนตัว
            </button>
            {showModalUserInfo && (
              <ModalUserInfo
                showModal={showModalUserInfo}
                setShowModal={setShowModalUserInfo}
                dataUserInfo={dataUserInfo}
                onFetchUserInfo={fetchUserInfo}
              />
            )}
            <div className="">
              {[
                {
                  title: "ชื่อ - สกุล :",
                  content: `${dataUserInfo?.fname ?? ""} ${
                    dataUserInfo?.lname ?? ""
                  }`,
                },
                { title: "อายุ :", content: dataUserInfo?.age ?? "" },
                { title: "ที่อยู่ :", content: dataUserInfo?.address ?? "" },
                {
                  title: "เพศ :",
                  content:
                    dataUserInfo?.sex == 1
                      ? "ชาย"
                      : dataUserInfo?.sex == 2
                      ? "หญิง"
                      : "ไม่ระบุ",
                },
              ].map((val, i) => {
                return (
                  <div key={i} className="grid grid-cols-3 gap-x-10">
                    <div className="col-span-1">
                      <p className="font-medium">{val.title}</p>
                    </div>
                    <div className="col-span-2">
                      {val.content != "" ? val.content : "ไม่ระบุ"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-5">
          <button
            onClick={() => {
              setShowModalChangPass(true);
            }}
            className="py-2 px-4 rounded-xl text-white bg-green-600 hover:bg-green-200 hover:text-green-700 cursor-pointer duration-300"
          >
            เปลี่ยนรหัสผ่าน
          </button>
          {showModalChangPass && (
            <ModalChangPass
              showModal={showModalChangPass}
              setShowModal={setShowModalChangPass}
            />
          )}
          <button
            onClick={async () => {
              const result = await SwalAlert.question({
                title: "ยืนยัน",
                text: "ต้องการลงชื่อออกหรือไหม",
                bnCancle: true,
              });

              if (result.isConfirmed) {
                router.push("/");
              }
            }}
            className="py-2 px-2 rounded-xl bg-red-500 text-white hover:bg-red-200 hover:text-red-700 cursor-pointer duration-300"
          >
            ลงชื่อออก
          </button>
        </div>
      </div>
    </div>
  );
}
