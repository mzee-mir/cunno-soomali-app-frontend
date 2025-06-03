import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import AxiosToastError from "@/lib/AxiosTost";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = location.state?.email || localStorage.getItem("userEmail");
  const resetToken = localStorage.getItem("resetToken");

  useEffect(() => {
    if (!userEmail || !resetToken) {
      toast.error(t("resetPassword.messages.error.invalidRequest"));
      navigate("/forgot-Password");
    }
  }, [userEmail, resetToken, navigate, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error(t("resetPassword.messages.error.mismatch"));
      setLoading(false);
      return;
    }

    try {
      await Axios.put(SummaryApi.password.resetPassword.url, {
        email: userEmail,
        newPassword,
        confirmPassword,
        resetToken,
      });

      toast.success(t("resetPassword.messages.success"));
      localStorage.removeItem("userEmail");
      localStorage.removeItem("resetToken");
      navigate("/Login-Page", { replace: true });
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
            {t("resetPassword.title")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                {t("resetPassword.fields.newPassword")}
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder={t("resetPassword.fields.newPassword")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t("resetPassword.fields.confirmPassword")}
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder={t("resetPassword.fields.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:bg-gradient-to-l hover:transition-all hover:duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? t("resetPassword.button.resetting") : t("resetPassword.button.reset")}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            {t("resetPassword.messages.loginLink")}{" "}
            <Link to="/Login-Page" className="text-blue-100 hover:text-blue-200">
              {t("resetPassword.messages.loginLinkText")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;