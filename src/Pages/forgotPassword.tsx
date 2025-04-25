import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/Axios"; // ✅ Import Axios client
import SummaryApi from "@/api/Userauth"; // ✅ Use structured API endpoints
import AxiosToastError from "@/lib/AxiosTost"; // ✅ Handle errors with toast
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle forgot password form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Make API call using Axios and SummaryApi
      const response = await Axios.post(SummaryApi.password.forgotPassword.url, { email });

      // ✅ Store email and reset token for later use
      localStorage.setItem("userEmail", email);
      localStorage.setItem("resetToken", response.data?.resetToken);

      toast.success("OTP sent! Check your email.");
      navigate("/resetPassword-Otp"); // ✅ Navigate to OTP verification page
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gradient-to-r from-blue-600 to-blue-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-100 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:bg-gradient-to-l 
             from-blue-600 to-blue-800 hover:transition-all hover:duration-300 hover:scale-105
             focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Sending OTP..." : "Reset Password"}
            </Button>
          </form>

          {/* Back to Login Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <a href="/Login-Page" className="text-blue-100 hover:text-blue-200">
              Login here
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
