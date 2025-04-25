import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/Login-Page");
    }, 2000); // Simulate redirect delay
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader className="w-10 h-10 text-blue-500 animate-spin" />
      <p className="mt-2 text-gray-600 text-sm">Verifying and redirecting...</p>
    </div>
  );
};

export default AuthCallback;


{/**
  import { useAuth } from "@/auth/Auth0ProvideWithNavigate";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react"; // import spinner icon

const AuthCallback = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.verified) {
          navigate("/");
        } else {
          navigate("/verification-email");
        }
      } else {
        navigate("/Login-Page");
      }
    }
  }, [user, navigate, isLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader className="w-10 h-10 text-blue-500 animate-spin" />
      <p className="mt-2 text-gray-600 text-sm">Checking your account...</p>
    </div>
  );
};

export default AuthCallback;

  */}