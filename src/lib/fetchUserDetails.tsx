import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import AxiosToastError from "@/lib/AxiosTost";
import toast from 'react-hot-toast'

const fetchUserDetails = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.user.userDetails,
    });

    const { data: responseData } = response;

    if (responseData.success && responseData.data?._id) {
      return responseData; // This will contain .data with user info
    } else {
      toast.error(responseData.message || "Failed to fetch user details");
    }
  } catch (error) {
    AxiosToastError(error);
    return { data: null };
  }
};

export default fetchUserDetails;
