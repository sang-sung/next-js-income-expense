import { SwalAlert } from "@/components/SweetAlert";

type RequestOptions = {
  url: string;
  body?: any;
  header?: Record<string, string>;
};

const getDefaultHeader = (): Record<string, string> => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || "";
    return { token };
  }
  return {}; // fallback สำหรับ SSR
};

const handleUnauthorized = async (res: Response) => {
  if (res.status === 401) {
    try {
      const data = await res.clone().json(); // ใช้ .clone() เพราะ response ถูกอ่านได้ครั้งเดียว
      if (data.message === "Expired token") {
        if (typeof window !== "undefined") {
          const result = await SwalAlert.error({
            title: "แจ้งเตือน",
            text: "Session หมดอายุ",
          });

          if (result.isConfirmed || result.isDismissed) {
            localStorage.removeItem("token"); // เคลียร์ token (ถ้าต้องการ)
            window.location.href = "/";
          }
        }
      }
    } catch (e) {
      console.error("Error parsing response JSON", e);
    }
  }
};

const apiService = {
  get: async ({ url, header = {} }: RequestOptions) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...getDefaultHeader(),
        ...header,
      },
    });

    await handleUnauthorized(res);
    return res;
  },

  post: async ({ url, body, header = {} }: RequestOptions) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getDefaultHeader(),
        ...header,
      },
      body: JSON.stringify(body),
    });

    await handleUnauthorized(res);
    return res;
  },

  put: async ({ url, body, header = {} }: RequestOptions) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getDefaultHeader(),
        ...header,
      },
      body: JSON.stringify(body),
    });

    await handleUnauthorized(res);
    return res;
  },

  delete: async ({ url, body, header = {} }: RequestOptions) => {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getDefaultHeader(),
        ...header,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    await handleUnauthorized(res);
    return res;
  },
};

export default apiService;
