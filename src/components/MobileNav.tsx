import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Separator } from '@radix-ui/react-separator';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MobileNavLinks from './MobileNavLinks';
import { RootState } from "@/store/store";
import { FaShoppingCart } from 'react-icons/fa';
import CartSidebar from './displaycartmenuItem';
import { useGlobalContext } from '@/Provider/Global';
import { useState } from 'react';
import NotificationBell from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';

const MobileNav = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const { totalQty } = useGlobalContext();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const isRestaurantOwner = user.role === 'RESTAURANT OWNER';
    const isAdmin = user.role === 'ADMIN';
    const isAuthenticated = !!user._id;

    const handleLoginRedirect = () => {
        navigate("/Login-Page");
    };

    return (
        <div className='flex items-center gap-4'>
          <ThemeToggle />
            {isAuthenticated && (
                <>
                    <button 
                        className="relative hover:text-primary-500 transition-colors"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <FaShoppingCart className="h-6 w-6" />
                        {totalQty > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {totalQty}
                            </span>
                        )}
                    </button>

                    <CartSidebar 
                        isOpen={isCartOpen} 
                        onClose={() => setIsCartOpen(false)}
                    />

                    <NotificationBell />
                </>
            )}

            <Sheet>
                <SheetTrigger>
                    <Menu className='text-blue-500'/>
                </SheetTrigger>
                <SheetContent className='space-y-3'>
                    <SheetTitle>
                        {isAuthenticated ? (   
                            <span className="flex items-center font-bold gap-2">
                                <img 
                                    alt={user.name}
                                    src={user.avatar}
                                    className='w-12 h-12 rounded-full object-cover' 
                                />
                                {user?.name}
                            </span> 
                        ) : (
                            <span>Soo dhawoow macmiil</span>
                        )}
                    </SheetTitle>
                    <Separator />
                    <SheetDescription className='flex flex-col gap-4'>
                        {isAuthenticated ? (
                            <MobileNavLinks/>
                        ) : (
                            <Button 
                                className='flex-1 font-bold bg-blue-500'
                                onClick={handleLoginRedirect}
                            >
                                Log In
                            </Button> 
                        )}
                    </SheetDescription>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MobileNav;