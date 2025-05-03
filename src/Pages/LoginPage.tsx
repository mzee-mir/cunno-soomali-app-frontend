import { SigninForm } from "@/components/SigninForm";
import { SignupForm } from "@/components/SignupForm"; // Assuming you have a RegisterForm component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryVerticalEnd } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import loginimahe from '../assets/loginimahe.jpg'

// Reusable Logo Component
function Logo() {
  return (
    <div className="flex justify-center gap-2 md:justify-start">
      <a href="#" className="flex items-center gap-2 font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Acme Inc.
      </a>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side: Tabs for Signin and Signup */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10">
        <Tabs defaultValue="Signin" className="w-full max-w-xs">
          <TabsList className="grid w-full grid-cols-2  bg-card">
            <TabsTrigger value="Signin">Signin</TabsTrigger>
            <TabsTrigger value="Signup">Register</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="Signin" className="mt-6">
              <motion.div
                key="signin" // Unique key for AnimatePresence
                initial={{ x: -100, opacity: 0 }} // Start off-screen to the left
                animate={{ x: 0, opacity: 1 }} // Animate to the center
                exit={{ x: 100, opacity: 0 }} // Exit to the right
                transition={{ type: "spring", stiffness: 100, damping: 20 }} // Spring animation
              >
                <Logo />
                <SigninForm />
              </motion.div>
            </TabsContent>

            <TabsContent value="Signup" className="mt-6">
              <motion.div
                key="signup" // Unique key for AnimatePresence
                initial={{ x: 100, opacity: 0 }} // Start off-screen to the right
                animate={{ x: 0, opacity: 1 }} // Animate to the center
                exit={{ x: -100, opacity: 0 }} // Exit to the left
                transition={{ type: "spring", stiffness: 100, damping: 20 }} // Spring animation
              >
                <Logo />
                <SignupForm /> {/* Replace with your RegisterForm component */}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      {/* Right Side: Image */}
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