import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import AxiosToastError from "@/lib/AxiosTost";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await Axios({
                method: SummaryApi.password.forgotPassword.method,
                url: SummaryApi.password.forgotPassword.url,
                data: { email },
            });
        
            localStorage.setItem("userEmail", email);
            localStorage.setItem("resetToken", response.data?.resetToken);
        
            toast.success(t("forgotPassword.success"));
            navigate("/resetPassword-Otp", { replace: true });
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
                        {t("forgotPassword.title")}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {t("Auth.signIn.email")}
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                placeholder={t("Auth.signIn.email")}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:bg-gradient-to-l 
                            from-blue-600 to-blue-800 hover:transition-all hover:duration-300 hover:scale-105
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {loading ? t("forgotPassword.button.sending") : t("forgotPassword.button.reset")}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        {t("forgotPassword.loginLink")}{" "}
                        <a href="/Login-Page" className="text-blue-100 hover:text-blue-200">
                            {t("forgotPassword.loginLinkText")}
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;