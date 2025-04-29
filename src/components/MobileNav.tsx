import { CircleUserRound, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Separator } from '@radix-ui/react-separator';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MobileNavLinks from './MobileNavLinks';
import { RootState } from "@/store/store";

 const MobileNav = () => {
    const navigate = useNavigate();
      const user = useSelector((state: RootState) => state.user);

      const handleLoginRedirect = () => {
        navigate("/Login-Page");
      };

      const isRestaurantOwner = user.role === 'RESTAURANT OWNER';
      const isAdmin = user.role === 'ADMIN';
      const isAuthenticated = !!user._id;

  return (
    <Sheet>
        <SheetTrigger>
            <Menu className='text-blue-500'/>
        </SheetTrigger>
        <SheetContent className='space-y-3'>
            <SheetTitle>
                {isAuthenticated ?(   
                <span className="flex items-center font-bold gap-2">
                    <img alt={user.name}
                 src={user.avatar}
                 className='w-12 h-12 rounded-full object-cover' />
                        {user?.name}
                </span> ) : (
                <span> Soo dhawoow macmiil</span>
                )}
                
            </SheetTitle>
            <Separator />
            <SheetDescription className='flex flex-col gap-4'>
                {isAuthenticated ?( <MobileNavLinks/>
                 ) : (
                    <Button className='flex-1 font-bold bg-blue-500'
                    onClick={handleLoginRedirect}
                >Log In</Button> 
                )}

                
            </SheetDescription>
        </SheetContent>
    </Sheet>
  )
}
export default MobileNav;