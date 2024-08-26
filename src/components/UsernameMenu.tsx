import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent, DropdownMenuItem} from "./ui/dropdown-menu";
import {CircleUserRound} from "lucide-react"
import {useAuth0} from "@auth0/auth0-react"
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const UsernameMenu = ( ) => {
    const {user, logout} = useAuth0();
    return(
        <DropdownMenu>
            <DropdownMenuTrigger className= " flex items-center px-3 font-bold hover:text-blue-500 gap-2 ">
                <CircleUserRound className=" text-Orange-500 "/>
                {user?.email}
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

            <Separator/>

            <DropdownMenuItem>
                <Button 
                onClick={()=> logout()}
                className="font-bold flex flex-1 bg-blue-500"> Log Out </Button>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}

export default UsernameMenu;