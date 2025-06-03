import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCreateCheckoutSession } from "@/api/OrderApi";
import { RootState } from "@/store/store";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useGlobalContext } from "@/Provider/Global";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IAddress } from "@/store/addressSlice";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type Props = {
    disabled?: boolean;
    isLoading?: boolean;
    restaurantId: string;
};

const CheckoutButton = ({ disabled }: Props) => {
    const { restaurantId } = useParams();
    const { createCheckoutSession, isLoading: isCheckoutLoading } = useCreateCheckoutSession();
    const { cartItems } = useSelector((state: RootState) => state.cartMenuItem);
    const user = useSelector((state: RootState) => state.user);
    const addresses = useSelector((state: RootState) => state.address.addresses);
    const { fetchAddress } = useGlobalContext();
    const { t } = useTranslation();
    
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [customAddress, setCustomAddress] = useState("");

    useEffect(() => {
        if (open) {
            const loadData = async () => {
                setIsLoading(true);
                try {
                    if (user?._id) {
                        setName(user.name || "");
                        setEmail(user.email || "");
                        setMobile(user.mobile || "");
                        
                        if (addresses.length === 0 && fetchAddress) {
                            await fetchAddress();
                        }
                    }
                } catch (error) {
                    console.error("Failed to load user data:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            
            loadData();
        }
    }, [open, user, addresses.length, fetchAddress]);

    const handleCheckout = async () => {
        if (!selectedAddress && !customAddress) {
            toast.error(t("checkouts.fields.address.error"));
            return;
        }
    
        const addressDetails = addresses.find(addr => addr._id === selectedAddress);
    
        const checkoutData = {
            cartItems: cartItems.map(item => ({
                menuItemId: item.menuItemId._id,
                quantity: item.quantity.toString(),
                name: item.menuItemId.name,
                price: item.menuItemId.price,
                imageUrl: item.menuItemId.imageUrl
            })),
            deliveryDetails: {
                email: email,
                name: name,
                mobile: mobile,
                address: addressDetails 
                    ? `${addressDetails.address_line}, ${addressDetails.city}, ${addressDetails.country}`
                    : customAddress
            },
            restaurantId: restaurantId!,
        };
    
        try {
            const response = await createCheckoutSession(checkoutData);
            const url = response?.data?.url;
    
            if (url) {
                window.location.href = url;
            } else {
                console.error("No URL returned from checkout session", response);
            }
        } catch (error) {
          console.error("Checkout failed:", error);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" disabled={disabled}>
                    {t("checkouts.button.checkout")}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("checkouts.title")}</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin h-8 w-8" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="name">{t("checkouts.fields.name")}</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t("checkouts.fields.name")}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">{t("checkouts.fields.email")}</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("checkouts.fields.email")}
                            />
                        </div>

                        <div>
                            <Label htmlFor="mobile">{t("checkouts.fields.mobile")}</Label>
                            <Input
                                id="mobile"
                                type="mobile"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder={t("checkouts.fields.mobile")}
                            />
                        </div>
                        
                        {addresses.length > 0 && (
                            <div>
                                <Label>{t("checkouts.fields.address.saved")}</Label>
                                <Select onValueChange={setSelectedAddress}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("checkouts.fields.address.selectPlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {addresses.filter(addr => addr.status).map((address: IAddress) => (
                                            <SelectItem key={address._id} value={address._id}>
                                                {`${address.address_line}, ${address.city}, ${address.country}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        
                        <div>
                            <Label htmlFor="address">
                                {addresses.length > 0 
                                    ? t("checkouts.fields.address.new") 
                                    : t("checkouts.fields.address.delivery")}
                            </Label>
                            <Input
                                id="address"
                                value={selectedAddress ? "" : customAddress}
                                onChange={(e) => {
                                    setSelectedAddress("");
                                    setCustomAddress(e.target.value);
                                }}
                                placeholder={t("checkouts.fields.address.placeholder")}
                                disabled={!!selectedAddress}
                            />
                        </div>
                        
                        <Button
                            className="mt-2"
                            onClick={handleCheckout}
                            disabled={isCheckoutLoading || !name || !email || (!selectedAddress && !customAddress)}
                        >
                            {isCheckoutLoading ? (
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            ) : (
                                t("checkouts.button.confirmPay")
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutButton;