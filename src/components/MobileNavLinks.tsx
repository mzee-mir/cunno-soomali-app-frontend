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
import { useTranslation } from 'react-i18next';

const MobileNavLinks = () => {
  const { t } = useTranslation();
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
      <Link 
        to="/order-status" 
        className="flex bg-card items-center font-bold hover:text-blue-500"
      >
        {t('mobileNav.orderStatus')}
      </Link>

      <Link 
        to="/user-profile" 
        className="flex bg-card items-center font-bold hover:text-blue-500"
      >
        {t('mobileNav.userProfile')}
      </Link>

      {isRestaurantOwner && (
        <Link 
          to="/manage-restaurant" 
          className="flex bg-card items-center font-bold hover:text-blue-500"
        >
          {t('mobileMenuItems.myRestaurant')}
        </Link>
      )}

      <Link 
        to="/user-address" 
        className="flex bg-card items-center font-bold hover:text-blue-500"
      >
        {t('mobileNav.address')}
      </Link>

      <Button 
        className="flex items-center px-3 font-bold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-400 hover:to-blue-600 transition-all duration-300"
        onClick={handleLogout}
      >
        {t('mobileNav.logout')}
      </Button>
    </>
  );
};

export default MobileNavLinks;