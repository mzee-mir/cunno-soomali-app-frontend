import { AxiosError } from "axios";
import toast from "react-hot-toast";

const AxiosToastError = (error: AxiosError<any>) => {
  toast.error(
    error?.response?.data?.message || "Something went wrong"
  );
};

export default AxiosToastError;
