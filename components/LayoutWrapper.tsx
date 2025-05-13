"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import { menuBarType } from "@/types/menuBar";

export default function LayoutWrapper({
  children,
  menuBar = [],
}: {
  children: React.ReactNode;
  menuBar: menuBarType[];
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  return (
    <div className="pb-5">
      {!isLoginPage && <Header menuBar={menuBar} />}
      <main>{children}</main>
    </div>
  );
}
