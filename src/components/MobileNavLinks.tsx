import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"


const MobileNavLinks=() => {
    const{logout} = useAuth0();
  return (
    <>
        <Link to = "/user-progile" className="flex bg-white items-center font-bold hover:text-blue-500">
            User Profile
        </Link>
        <Button className="flex items-center px-3 font-bold hover:bg-gray-500"
        onClick={() => logout()}>
            Log Out
        </Button>
    </>
  )
}



export default MobileNavLinks;
