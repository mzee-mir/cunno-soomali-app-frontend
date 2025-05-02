import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SummaryApi from "@/api/Userauth";
import toast from "react-hot-toast";
import AxiosToastError from "@/lib/AxiosTost";
import { logout } from "@/store/userSlice";
import Axios from "@/lib/Axios";
import { useNavigate } from "react-router-dom";

const MobileNavLinks = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.auth.logout,
      });

      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
        window.location.reload(); // fully reset the app state
      }
    } catch (error) {
      console.log(error);
      AxiosToastError(error);
    }
  };

  const isRestaurantOwner = user.role === "RESTAURANT OWNER";

  return (
    <>
      <Link to="/order-status" className="flex bg-card items-center font-bold hover:text-blue-500">
        Order Status
      </Link>

      <Link to="/user-profile" className="flex bg-card items-center font-bold hover:text-blue-500">
        User Profile
      </Link>

      {isRestaurantOwner && (
        <Link to="/manage-restaurant" className="flex bg-card items-center font-bold hover:text-blue-500">
          My Restaurant
        </Link>
      )}

      <Link to="/user-address" className="flex bg-card items-center font-bold hover:text-blue-500">
        Address
      </Link>

      <Button className="flex items-center px-3 font-bold hover:bg-gray-500" onClick={handleLogout}>
        Log Out
      </Button>
    </>
  );
};

export default MobileNavLinks;
