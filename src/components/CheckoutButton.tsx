import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCreateCheckoutSession } from "@/api/OrderApi";
import { RootState } from "@/store/store";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";
import { useGlobalContext } from "@/Provider/Global";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { IAddress } from "@/store/addressSlice";
import { useGetRestaurant } from "@/api/RestaurentApi";
import { useParams } from "react-router-dom";
import { ICartMenuItem } from "@/store/cartMenuItem";

type Props = {
    disabled?: boolean;
    isLoading?: boolean;
    restaurantId:string;
};

const CheckoutButton = ({ disabled }: Props) => {
    const { restaurantId } = useParams();
    const { createCheckoutSession, isLoading: isCheckoutLoading } = useCreateCheckoutSession();
    const { cartItems } = useSelector((state: RootState) => state.cartMenuItem);
    const user = useSelector((state: RootState) => state.user);
    const addresses = useSelector((state: RootState) => state.address.addresses);
    const { fetchAddress } = useGlobalContext();
    
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [customAddress, setCustomAddress] = useState("");

    // Load user data and addresses when dialog opens
    useEffect(() => {
        if (open) {
            const loadData = async () => {
                setIsLoading(true);
                try {
                    // Pre-fill user details if available
                    if (user?._id) {
                        setName(user.name || "");
                        setEmail(user.email || "");
                        setMobile(user.mobile || "");
                        
                        // Fetch addresses if not already loaded
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
        const deliveryAddress = selectedAddress 
            ? addresses.find(addr => addr._id === selectedAddress)?.address_line || ""
            : customAddress;
    
        const checkoutData = {
            cartItems: cartItems.map(item => ({
                menuItemId: item.menuItemId._id,
                name: item.menuItemId.name,
                imageUrl: item.menuItemId.imageUrl,
                price: item.menuItemId.price,
                quantity: item.quantity.toString(),

            })),
            deliveryDetails: {
                name,
                email,
                mobile: user.mobile,
                address: deliveryAddress,
            },
            restaurantId,
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
                    Checkout
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Enter Delivery Info</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin h-8 w-8" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="mobile">Mobile No.</Label>
                            <Input
                                id="mobile"
                                type="mobile"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="+252 00 00 000"
                            />
                        </div>
                        
                        {addresses.length > 0 && (
                            <div>
                                <Label>Saved Addresses</Label>
                                <Select onValueChange={setSelectedAddress}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a saved address" />
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
                                {addresses.length > 0 ? "Or enter a new address" : "Delivery Address"}
                            </Label>
                            <Input
                                id="address"
                                value={selectedAddress ? "" : customAddress}
                                onChange={(e) => {
                                    setSelectedAddress("");
                                    setCustomAddress(e.target.value);
                                }}
                                placeholder="123 Street Name, City"
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
                                "Confirm & Pay"
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutButton;