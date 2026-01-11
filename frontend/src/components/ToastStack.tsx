import { FiCheckCircle, FiInfo, FiXCircle } from "react-icons/fi";
import { useToast } from "../store/toast";

const ToastStack = () => {
  const { toasts, remove } = useToast();

  return (
    <div className="toast-stack">
      {toasts.map((toast) => {
        const tone = toast.tone ?? "info";
        const Icon = tone === "success" ? FiCheckCircle : tone === "error" ? FiXCircle : FiInfo;
        return (
          <div key={toast.id} className={`toast toast--${tone}`} onClick={() => remove(toast.id)}>
            <Icon />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ToastStack;
