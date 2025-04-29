"use client"; // ถ้าใช้ Next.js App Router

import { toast } from "@/components/SweetAlert";
import apiService from "@/service/apiService";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [onSend, setOnSend] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnSend(true);

    try {
      const res = await apiService.post({
        url: "/api/admin/login",
        body: { user, password },
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        setTimeout(() => {
          router.push("/admin/users");
        }, 1500);
      } else {
        toast.error(data.message || "Login failed");
        setOnSend(false);
      }
    } catch (err) {
      toast.error("ผิดผลาด");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center select-none">
      <div className="w-[90vw] max-w-[500px] min-h-[80vh] py-20 px-5 bg-gray-600 rounded-2xl flex flex-col items-center justify-center">
        <p className="mb-16 text-4xl font-semibold">Admin Login</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-y-5 w-full"
        >
          <input
            type="text"
            name="username"
            id="username"
            placeholder="User name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="bg-white rounded-lg text-gray-900 px-3 py-1 text-center w-10/12"
          />
          <div className="w-10/12 relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white rounded-lg text-gray-900 px-3 py-1 text-center w-full"
            />
            <FontAwesomeIcon
              icon={showPass ? faEye : faEyeSlash}
              onClick={(e) => setShowPass(!showPass)}
              className="absolute top-2 right-2 text-black text-sm w-5 h-5 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className={`bg-green-600 hover:bg-green-300 text-white hover:text-green-900 duration-300 
              py-2 px-5 w-10/12 rounded-2xl mt-5 cursor-pointer
              disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-600`}
            disabled={onSend}
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
