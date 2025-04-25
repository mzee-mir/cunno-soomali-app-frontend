import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import toast from "react-hot-toast";
import { setUserDetails } from "@/store/userSlice";
import fetchUserDetails from "@/lib/fetchUserDetails";
import UserProfileAvatarEdit from "@/components/UserProfileAvatarEdit";
import { RootState } from '@/store/store';

// Define form schema with validation
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").optional(),
    mobile: z.string().min(1, "Mobile number is required"),
    addressLine1: z.string().min(1, "Address is required").optional(),
    city: z.string().min(1, "City is required").optional(),
    country: z.string().min(1, "Country is required").optional()
});

export type UserFormData = z.infer<typeof formSchema>;

const UserProfileForm = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<UserFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: user.email || "",
            name: user.name || "",
            mobile: user.mobile || "",
        },
    });

    useEffect(() => {
        form.reset({
            email: user.email || "",
            name: user.name || "",
            mobile: user.mobile || "",
        });
    }, [user, form]);

    console.log("loogingForm", form);
    
    console.log("logging user",user);

    const onSubmit = async (formData: UserFormData) => {
        try {
            setIsLoading(true);
            const response = await Axios({
                ...SummaryApi.user.updateUserDetails,
                data: formData
            });

            if (response.data.success) {
                toast.success(response.data.message);
                const userData = await fetchUserDetails();
                dispatch(setUserDetails(userData.data));
            }
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-start gap-4">
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
                    {user.avatar ? (
                        <img 
                            alt={user.name}
                            src={user.avatar}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FaRegUserCircle size={65} className="text-gray-400" />
                    )}
                </div>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setProfileAvatarEdit(true)}
                >
                    Edit Avatar
                </Button>
                
                {openProfileAvatarEdit && (
                    <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
                )}
            </div>

            {/* Profile Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 rounded-lg p-6">
                    <div>
                        <h2 className="text-2xl font-bold">User Profile</h2>
                        <FormDescription>
                            View and change your profile information
                        </FormDescription>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled className="bg-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Mobile */}
                        <FormField 
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Address Section */}
                    <div className="space-y-2">
                        <h3 className="font-medium">Address Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField 
                                control={form.control}
                                name="addressLine1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address Line 1</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="bg-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="bg-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="bg-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default UserProfileForm;