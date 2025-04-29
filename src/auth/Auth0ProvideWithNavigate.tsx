import { setUserDetails, logout, setLoading } from "@/store/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import fetchUserDetails from "@/lib/fetchUserDetails";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const userData = await fetchUserDetails();
        if (userData?._id) {
          dispatch(setUserDetails(userData));
        } else {
          dispatch(logout());
          localStorage.clear();
        }
      } catch (err) {
        console.error("Failed to fetch user details", err);
        dispatch(logout());
        localStorage.clear();
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (accessToken && !user._id) {
      fetchUser();
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch, user._id]);

  if (user.loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <motion.div
          className="w-20 h-20 bg-blue-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
