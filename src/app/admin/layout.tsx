"use client";

import LayoutWrapper from "@/components/LayoutWrapper";
import { faGear, faUsersGear } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const menuBar = [
    { name: "Users", link: "/admin/users", icon: faUsersGear },
    { name: "Setting", link: "/admin/setting", icon: faGear },
  ];

  return (
    <>
      {pathname == "/admin/login" ? (
        children
      ) : (
        <LayoutWrapper menuBar={menuBar}>{children}</LayoutWrapper>
      )}
    </>
  );
}
