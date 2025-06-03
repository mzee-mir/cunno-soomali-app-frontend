import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent, DropdownMenuItem} from "./ui/dropdown-menu";
import {CircleUserRound} from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SummaryApi from "@/api/Userauth";
import toast from "react-hot-toast";
import AxiosToastError from "@/lib/AxiosTost";
import { logout } from "@/store/userSlice";
import Axios from "@/lib/Axios";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from 'react-i18next';


const UsernameMenu = ( ) => {
    const user = useSelector((state: RootState)=> state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
 
    const handleLogout = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.auth.logout
        });
        
        if (response.data.success) {
          dispatch(logout());
          localStorage.clear();
          toast.success(response.data.message);
          navigate("/");
          window.location.reload(); // Add this to fully reset the app state
        }
      } catch (error) {
        console.log(error);
        AxiosToastError(error);
      }
    };

    const isRestaurantOwner = user.role === "RESTAURANT OWNER";
    
    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-blue-500 gap-2">
              {user.avatar ? (
                <img alt={user.name}
                src={user.avatar}
                className='w-14 h-14 rounded-full object-cover' />
              ) : (
                <CircleUserRound className="text-orange-500 w-8 h-8" />
              )}
          </DropdownMenuTrigger>
            <DropdownMenuContent >

            <DropdownMenuItem>

            {isRestaurantOwner && (
              <Link to="/manage-restaurant" className="flex bg-card items-center font-bold hover:text-blue-500">
                {t('mobileMenuItems.myRestaurant')}
              </Link>
            )}
            </DropdownMenuItem>

            <DropdownMenuItem>

            <Link to= "/user-profile" className="font-bold hover:text-blue-500"> 
            {t('mobileNav.userProfile')}
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>

            <Link to= "/user-address" className="font-bold hover:text-blue-500"> 
            {t('mobileNav.address')}
                </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
            <Link to= "/order-status" className="font-bold hover:text-blue-500"> 
              {t('mobileNav.orderStatus')}
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <LanguageSelector />
            </DropdownMenuItem>

            <Separator/>

            <DropdownMenuItem>
                <Button 
                onClick={handleLogout}
                className="font-bold flex flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-400 hover:to-blue-600 transition-all duration-300"> Log Out </Button>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}

export default UsernameMenu;