import { AxiosError } from "axios";
import toast from "react-hot-toast";

const AxiosToastError = (error: unknown) => {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const err = error as AxiosError<any>;
    toast.error(
      err?.response?.data?.message || "Something went wrong"
    );
  } else {
    toast.error("Something went wrong");
  }
};

export default AxiosToastError;
