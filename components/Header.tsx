import { menuBarType } from "@/types/menuBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import ToggleTheame from "./ToggleTheame";

type HeaderType = {
  menuBar: menuBarType[];
};

export default function Header({ menuBar = [] }: HeaderType) {
  return (
    <div className="p-5 flex flex-col items-center border-b-2 border-gray-600 relative">
      <ToggleTheame />

      <p className="text-3xl text-center">
        เว็บบันทึกรายรับรายจ่ายของ <strong>sang-sung</strong>
      </p>
      <div className="flex gap-x-10 mt-10">
        {menuBar.map((item, i) => {
          return (
            <Link
              key={i}
              href={item.link}
              className="border-b-2 border-transparent hover:border-[var(--foreground)] duration-300 px-2"
            >
              <FontAwesomeIcon icon={item.icon} /> {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
