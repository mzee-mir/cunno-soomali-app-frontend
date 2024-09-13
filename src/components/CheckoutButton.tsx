import { useAuth0 } from "@auth0/auth0-react"
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadinButton from "./LoadinButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/myUserApi";

type Props ={
    onCheckout: (userFormData: UserFormData)=> void;
    disabled: boolean;
    isLoading: boolean;
}

const CheckoutButton = ({onCheckout, disabled, isLoading}: Props)=> {
    const {
        isAuthenticated, 
        isLoading: isAuthLoading, 
        loginWithRedirect,} = useAuth0();

    const{pathname} = useLocation();

    const {currentUser, isLoading:isGetUserLoading} = useGetMyUser();

    const onLogin = async ()=>{
        await loginWithRedirect({
            appState: {
                returnTo:pathname,

            },
        });
    };

    if(!isAuthenticated) {
        return (
            <Button className="bg-blue-500 flex-1" onClick={onLogin}>Log in to Check out</Button>
        );
    }

    if (isAuthLoading || !currentUser || isLoading){
        return <LoadinButton />
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                disabled={disabled}
                className="bg-blue-500 flex-1">
                    Go to check out
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
            <UserProfileForm 
                    currentUser={currentUser} 
                    onSave={onCheckout} 
                    isLoading={isGetUserLoading}
                    title="confirm Delivery Details"
                    buttonText="Continue to payment"
                    />
            </DialogContent>
        </Dialog>
    )

};

export default CheckoutButton;