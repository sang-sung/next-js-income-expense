import LayoutWrapper from "@/components/LayoutWrapper";
import {
  faChartLine,
  faLayerGroup,
  faTableList,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuBar = [
    { name: "Dashboard", link: "/user/dashboard", icon: faChartLine },
    { name: "ข้อมูล", link: "/user/transaction", icon: faTableList },
    { name: "หมวดหมู่", link: "/user/category", icon: faLayerGroup },
    { name: "ข้อมูลผู้ใช้บัญชี", link: "/user/user", icon: faUser },
  ];

  return (
    <>
      <LayoutWrapper menuBar={menuBar}>{children}</LayoutWrapper>
    </>
  );
}
