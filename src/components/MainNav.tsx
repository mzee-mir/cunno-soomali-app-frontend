import { Button } from "./ui/button";
import UsernameMenu from "./UsernameMenu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import CartSidebar from "./displaycartmenuItem";
import { useGlobalContext } from "@/Provider/Global";
import NotificationBell from "./NotificationBell";

const MainNav = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const { totalQty } = useGlobalContext();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLoginRedirect = () => {
    navigate("/Login-Page");
  };

  return (
    <div className="flex items-center gap-4">
      {/* Cart Icon with Badge */}
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

      {/* User/Auth Section */}
      <span className="flex space-x-2 items-center">
        {user._id ? (
          <>
          {/* Order status */}

            <Link
              to="/order-status"
              className="font-bold hover:text-blue-500"
            >
              Order Status
            </Link>

          {/*  User Feature */}

            <UsernameMenu />

          {/* Notification Bell */}

            <NotificationBell />

          </>
        ) : (
          <Button
            variant="ghost"
            className="font-bold hover:text-blue-500 hover:bg-white"
            onClick={handleLoginRedirect}
          >
            Log in
          </Button>
        )}
      </span>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
      />
      
      

    </div>
  );
};

export default MainNav;