"use client"; // ต้องเปิดเพราะใช้ client-side navigation

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/user");
  }, [router]);

  return <></>;
}
