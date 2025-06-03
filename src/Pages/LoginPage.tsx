import {SigninForm} from "@/components/SigninForm";
import { SignupForm } from "@/components/SignupForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryVerticalEnd } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import loginimahe from '../assets/loginimahe.jpg'
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Logo() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center gap-2 md:justify-start">
      <a href="#" className="flex items-center gap-2 font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        {t("nav.logo")}
      </a>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("Signin");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-xs">
          <Tabs defaultValue="Signin" className="w-full" onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 bg-card">
              <TabsTrigger value="Signin">{t("loginPage.tabs.signin")}</TabsTrigger>
              <TabsTrigger value="Signup">{t("loginPage.tabs.signup")}</TabsTrigger>
            </TabsList>
          </Tabs>

          <AnimatePresence mode="wait" initial={false}>
            {tab === "Signin" && (
              <motion.div
                key="signin"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="mt-6"
              >
                <Logo />
                <SigninForm />
              </motion.div>
            )}

            {tab === "Signup" && (
              <motion.div
                key="signup"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="mt-6"
              >
                <Logo />
                <SignupForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src={loginimahe}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}