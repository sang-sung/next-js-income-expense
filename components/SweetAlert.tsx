import Swal from "sweetalert2";
import "./sweetAlert.css";

const baseToast = Swal.mixin({
  toast: true,
  position: "top-end",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const toast = {
  success: (title: string) => baseToast.fire({ icon: "success", title }),
  error: (title: string) => baseToast.fire({ icon: "error", title }),
  warning: (title: string) => baseToast.fire({ icon: "warning", title }),
  info: (title: string) => baseToast.fire({ icon: "info", title }),
  question: (title: string) => baseToast.fire({ icon: "question", title }),
};

const baseAlert = Swal.mixin({
  color: "var(--foreground)",
  background: "var(--gray)",
  confirmButtonColor: "#03A300",
  customClass: {
    popup: 'my-swal-popup',
  },
});

const SwalAlert = {
  success: ({ title, text }: { title: string; text?: string }) =>
    baseAlert.fire({ icon: "success", title, text }),

  error: ({ title, text }: { title: string; text?: string }) =>
    baseAlert.fire({ icon: "error", title, text }),

  warning: ({ title, text }: { title: string; text?: string }) =>
    baseAlert.fire({ icon: "warning", title, text }),

  info: ({ title, text }: { title: string; text?: string }) =>
    baseAlert.fire({ icon: "info", title, text }),

  question: ({
    title,
    text,
    bnCancle = false,
  }: {
    title: string;
    text?: string;
    bnCancle?: boolean;
  }) =>
    baseAlert.fire({
      icon: "question",
      title,
      text,
      showCancelButton: bnCancle,
    }),
};

export { toast, SwalAlert };
