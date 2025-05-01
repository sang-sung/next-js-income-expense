"use client";
import { SwalAlert } from "@/components/SweetAlert";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ModalChangPass from "./modalChangPass";

export default function Admin() {
  const router = useRouter();

    const [showModalChangPass, setShowModalChangPass] = useState(false);
  
  return (
    <>
      <div className="flex flex-col items-center gap-y-5 w-full justify-center mt-10">
        <button
          onClick={() => {
            setShowModalChangPass(true);
          }}
          className="py-2 px-4 w-fit rounded-xl text-white bg-green-600 hover:bg-green-200 hover:text-green-700 cursor-pointer duration-300"
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
              router.push("/admin/login");
            }
          }}
          className="py-2 px-10 w-fit rounded-xl bg-red-500 text-white hover:bg-red-200 hover:text-red-700 cursor-pointer duration-300"
        >
          ลงชื่อออก
        </button>
      </div>
    </>
  );
}
