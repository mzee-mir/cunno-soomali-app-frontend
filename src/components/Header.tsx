import { Link } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import { useMediaQuery } from "@/utils/useMediaQuery";

const Header = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="border-b-2 border-b-primary py-6 bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/"
          className={`${isMobile ? 'text-3xl' : 'text-2xl'} font-bold tracking-tight text-primary hover:text-input`}
        >
          CunnoSomali.com
        </Link>
        <div className="md:hidden">
          <MobileNav />
        </div>
        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>
    </div>
  );
};

export default Header;