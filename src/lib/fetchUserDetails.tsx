import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import AxiosToastError from "@/lib/AxiosTost";
import toast from 'react-hot-toast'

// fetchUserDetails.tsx
const fetchUserDetails = async () => {
  try {
    const response = await Axios(SummaryApi.user.userDetails);
    
    if (response.data?.success) {
      return {
        ...response.data.data,
        // Ensure role is properly typed
        role: response.data.data.role || 'USER'
      };
    }
    
    throw new Error(response.data.message);
    
  } catch (error) {
    AxiosToastError(error);
    return null;
  }
};

export default fetchUserDetails;