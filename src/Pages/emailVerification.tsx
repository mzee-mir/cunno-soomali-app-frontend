import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/Axios"; // Import Axios
import SummaryApi from "@/api/Userauth"; //  Use structured API endpoints
import AxiosToastError from "@/lib/AxiosTost"; //  Handle errors with toast
import { toast } from "sonner";

const EmailVerificationPage = () => {
    const [code, setCode] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    //  Get email from location state or localStorage
    const userEmail = location.state?.email || localStorage.getItem("userEmail");

    // Redirect to signup if no email is found
    useEffect(() => {
        if (!userEmail) {
            toast.error("No email found. Please sign up first.");
            navigate("/signup");
        }
    }, [userEmail, navigate]);

    //  Handle OTP input changes
    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            handlePastedContent(value);
            return;
        }

        if (/^\d*$/.test(value)) {
            setCode((prev) => {
                const newCode = [...prev];
                newCode[index] = value;
                return newCode;
            });

            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    //  Handle OTP paste event
    const handlePastedContent = (value: string) => {
        const pastedCode = value
            .slice(0, 6)
            .split("")
            .filter((char) => /^\d$/.test(char));

        setCode((prev) => {
            const newCode = [...prev];
            pastedCode.forEach((digit, index) => {
                if (index < 6) newCode[index] = digit;
            });
            return newCode;
        });

        const lastIndex = Math.min(pastedCode.length - 1, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    // Handle backspace navigation
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    //  Submit OTP for verification
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userEmail) return;

        setLoading(true);
        const otpString = code.join(""); //  Keep as string to avoid leading zero issues

        try {
            await Axios.post(SummaryApi.auth.Verifyuser.url, { email: userEmail, otp: otpString });

            toast.success("Email verified successfully!");
            localStorage.removeItem("userEmail"); // ✅ Cleanup
            navigate("/login");
        } catch (error) {
            AxiosToastError(error);
            setCode(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    //  Auto-submit when all OTP fields are filled
    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            const form = document.querySelector("form");
            form?.requestSubmit();
        }
    }, [code]);

    return (
        <div className="w-full flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-blue-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-blue-100 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                        Verify Your Email
                    </h2>
                    <p className="text-center text-white mb-6">Enter the 6-digit code sent to {userEmail}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between gap-2">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-2xl font-bold bg-blue-100 text-gray-600 border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                                    disabled={loading}
                                    aria-label={`Digit ${index + 1}`}
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-white bg-gradient-to-r from-blue-600 to-blue-800"
                            disabled={loading || code.some((digit) => !digit)}
                        >
                            {loading ? "Verifying..." : "Verify Email"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default EmailVerificationPage;
