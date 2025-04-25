import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/Axios"; // Import Axios client
import SummaryApi from "@/api/Userauth"; // Use structured API endpoints
import AxiosToastError from "@/lib/AxiosTost"; // Handle errors with toast
import { toast } from "sonner";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Get email from location state or localStorage
    const userEmail = location.state?.email || localStorage.getItem("userEmail");

    // ✅ Get reset token from localStorage
    const resetToken = localStorage.getItem("resetToken");

    // ✅ Redirect if no email or reset token is found
    useEffect(() => {
        if (!userEmail || !resetToken) {
            toast.error("Invalid request. Please start the password reset process again.");
            navigate("/forgotPassword");
        }
    }, [userEmail, resetToken, navigate]);

    // ✅ Handle reset password form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            // ✅ Make API call using Axios and SummaryApi
            await Axios.put(SummaryApi.password.resetPassword.url, {
                email: userEmail,
                newPassword,
                confirmPassword,
                resetToken,
            });

            toast.success("Password reset successfully! You can now login.");
            localStorage.removeItem("userEmail"); // ✅ Cleanup
            localStorage.removeItem("resetToken"); // ✅ Cleanup
            navigate("/Login-Page"); // ✅ Redirect to login
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
                        Reset Password
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password Input */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:bg-gradient-to-l hover:transition-all hover:duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {loading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPassword;
