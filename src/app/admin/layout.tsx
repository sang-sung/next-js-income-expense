"use client";

import LayoutWrapper from "@/components/LayoutWrapper";
import { faGear, faUsersGear, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const menuBar = [
    { name: "Users", link: "/admin/users", icon: faUsersGear },
    { name: "Admin", link: "/admin/usersadmin", icon: faUserShield },
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
