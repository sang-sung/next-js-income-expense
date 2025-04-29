"use client"; // ต้องเปิดเพราะใช้ client-side navigation

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function User() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/dashboard");
  }, [router]);

  return <></>;
}
