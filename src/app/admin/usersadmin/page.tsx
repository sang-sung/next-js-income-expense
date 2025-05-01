"use client";
import { useEffect, useState } from "react";
import apiService from "@/services/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import ModalUser from "./modalUserAdmin";
import { SwalAlert, toast } from "@/components/SweetAlert";

export default function AdminUser() {
  const [loading, setLoading] = useState(true);

  const [dataArr, setDataArr] = useState<any[]>([]);

  const [modalType, setModalType] = useState<"add" | "update">("add");
  const [showModal, setShowModal] = useState(false);

  const [user, setUser] = useState("");
  const [onSend, setOnSend] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await fetchUser();
      setDataArr(userData);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (): Promise<any> => {
    try {
      const res = await apiService.get({ url: "/api/admin/user" });
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  };

  const deleteUser = async (e: React.FormEvent, de_user: string) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await SwalAlert.question({
      title: "ยืนยันการลบ",
      text: "ต้องการลบ user " + de_user + " หรือไม่",
      bnCancle: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await apiService.delete({
          url: "/api/admin/user",
          body: { user: de_user },
        });
        const data = await res.json();

        if (data.success) {
          toast.success(data.message);
          setLoading(true);
          loadUser();
        } else {
          toast.error(data.message);
        }
        setOnSend(false);
      } catch (err) {
        toast.error("ผิดผลาด");
        console.error("Login error:", err);
      }
    }
  };

  return (
    <div className="p-5">
      <button
        onClick={() => {
          setModalType("add");
          setShowModal(true);
        }}
        className="py-2 px-4 rounded-xl bg-green-600 text-white hover:bg-green-200 hover:text-green-700 cursor-pointer duration-300"
      >
        เพิ่ม User
      </button>
      {showModal && (
        <ModalUser
          showModal={showModal}
          setShowModal={setShowModal}
          type={modalType}
          user={user}
          setLoading={setLoading}
          loadUser={loadUser}
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
              <th className="border px-4 py-2">User Admin</th>
              <th className="border px-4 py-2">แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {dataArr.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.user}</td>
                <td className="border px-4 py-2">
                  <div className="w-full flex justify-center">
                    <button
                      className={`text-red-500 text-lg w-5 h-5 cursor-pointer hover:text-red-800`}
                      onClick={(e) => deleteUser(e, item.user)}
                      disabled={onSend}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
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
