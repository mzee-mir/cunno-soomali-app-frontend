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

const UsernameMenu = ( ) => {
    const user = useSelector((state: RootState)=> state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
 
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

            <Link to= "/manage-restaurant" className="font-bold hover:text-blue-500"> 
                Manage Restaurant
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>

            <Link to= "/user-profile" className="font-bold hover:text-blue-500"> 
                User Profile
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>

            <Link to= "/address" className="font-bold hover:text-blue-500"> 
                Address
                </Link>
            </DropdownMenuItem>

            <Separator/>

            <DropdownMenuItem>
                <Button 
                onClick={handleLogout}
                className="font-bold flex flex-1 bg-blue-500"> Log Out </Button>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}

export default UsernameMenu;