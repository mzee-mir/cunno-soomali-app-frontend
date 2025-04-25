import { setUserDetails, logout } from "@/store/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import fetchUserDetails from "@/lib/fetchUserDetails";

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
      try {
        const userData = await fetchUserDetails();
        if (userData?.data?._id) {
          dispatch(setUserDetails(userData.data));
        } else {
          // If no valid user data, log out
          dispatch(logout());
          localStorage.clear();
        }
      } catch (err) {
        console.error("Failed to fetch user details", err);
        dispatch(logout());
        localStorage.clear();
      }
    };

    // Only fetch user if there's an access token and no user ID in state
    if (accessToken && !user._id) {
      fetchUser();
    } else if (!accessToken && user._id) {
      // If no token but user in state, log out
      dispatch(logout());
    }
  }, [dispatch, user._id]);

  return <>{children}</>;
};

export default AuthProvider;