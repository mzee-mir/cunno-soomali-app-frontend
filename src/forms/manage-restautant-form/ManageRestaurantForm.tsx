import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/store/store";
import { RestaurantService } from "@/lib/restaurantServices";
import {
  setCurrentRestaurant,
  setRestaurantLoading,
  setRestaurantError,
} from "@/store/restaurantSlice";
import toast from "react-hot-toast";
import DetailSection from "./DetaiSection";
import CuisinesSection from "./cuisines-section";
import LoadinButton from "@/components/LoadinButton";
import RestaurantImageUploader from "@/components/UploadRestaurantImage";

const restaurantFormSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  deliveryPrice: z.coerce.number().min(0, "Must be a valid number"),
  estimatedDeliveryTime: z.coerce.number().min(1, "Must be a valid number"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  openingHours: z.string().min(1, "Opening hours are required"),
  website: z.string().optional(),
  isActive: z.boolean().default(true),
});

type RestaurantFormData = z.infer<typeof restaurantFormSchema>;

const DEFAULT_FORM_VALUES: RestaurantFormData = {
  name: "",
  description: "",
  address: "",
  city: "",
  country: "",
  deliveryPrice: 0,
  estimatedDeliveryTime: 30,
  phone: "",
  email: "",
  openingHours: "",
  isActive: true,
};

const ErrorDisplay = ({ error }: { error: string | null }) => (
  error ? <p className="text-red-500 text-center mt-4">{error}</p> : null
);

const SubmitButton = ({ 
  isSubmitting, 
  hasRestaurant 
}: { 
  isSubmitting: boolean; 
  hasRestaurant: boolean; 
}) => (
  <Button 
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white"
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <LoadinButton />
    ) : hasRestaurant ? (
      "Update Restaurant"
    ) : (
      "Create Restaurant"
    )}
  </Button>
);

const ManageRestaurantForm = () => {
  const dispatch = useDispatch();
  const { currentRestaurant, loading, error } = useSelector(
    (state: RootState) => state.restaurant
  );
  const { _id: userId } = useSelector((state: RootState) => state.user);
  
  const [imageState, setImageState] = useState({
    showUploader: false,
    isEditing: false
  });
  console.log("restaurantData", currentRestaurant);
  

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (currentRestaurant) {
      form.reset({
        ...currentRestaurant,
        deliveryPrice: currentRestaurant.deliveryPrice ? currentRestaurant.deliveryPrice : 0,
        estimatedDeliveryTime: currentRestaurant.estimatedDeliveryTime || 30,
      });
    }
    
    return () => {
      dispatch(setRestaurantError(null)); 
    };
  }, [currentRestaurant, form, dispatch]);

  const onSubmit = async (formData: RestaurantFormData) => {
    try {
      dispatch(setRestaurantLoading(true));
      
      const restaurantPayload = {
        ...formData,
        deliveryPrice: formData.deliveryPrice,
        imageUrl: currentRestaurant?.imageUrl || "",
        cuisineType: currentRestaurant?.cuisineType || [],
        menuItems: currentRestaurant?.menuItems || [],
      };
      
      let result;
      
      if (currentRestaurant?._id) {
        result = await RestaurantService.updateRestaurant(dispatch, currentRestaurant._id, restaurantPayload);
      } else {
        result = await RestaurantService.createRestaurant(dispatch, restaurantPayload);
      }
  
      dispatch(setCurrentRestaurant(result));
      toast.success(
        currentRestaurant?._id 
          ? "Restaurant updated successfully" 
          : "Restaurant created successfully"
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Operation failed";
      dispatch(setRestaurantError(errorMessage));
      toast.error(errorMessage);
    } finally {
      dispatch(setRestaurantLoading(false));
    }
  };
  
  

  const renderImageSection = () => (
    <div className="space-y-4  max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-4 ">
        {currentRestaurant?.imageUrl ? (
          <div className="relative group">
            <img 
              src={currentRestaurant.imageUrl} 
              alt="Restaurant" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
              <Button 
                variant="outline"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setImageState({ showUploader: true, isEditing: true })}
              >
                Change Image
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline"
            className="w-full h-48 border-2 border-dashed hover:text-white hover:bg-gradient-to-r from-blue-500 to-blue-300"
            onClick={() => setImageState({ showUploader: true, isEditing: false })}
          >
            <span className="text-gray-500">Add Image</span>
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-card">
    <FormProvider {...form}>
      <Form {...form}>
        {renderImageSection()}
        
        {imageState.showUploader && currentRestaurant?._id && (
          <RestaurantImageUploader
            restaurantId={currentRestaurant._id}
            onClose={() => setImageState({ showUploader: false, isEditing: false })}
            isModal
          />
        )}
        
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-card p-10 rounded-lg"
        >
          <DetailSection />
          <Separator />
          <CuisinesSection />
          
          <div className="flex justify-end">
            <SubmitButton 
              isSubmitting={loading} 
              hasRestaurant={!!currentRestaurant?._id} 
            />
          </div>
          
          <ErrorDisplay error={error} />
        </form>
      </Form>
    </FormProvider>
    </div>
  );
};

export default ManageRestaurantForm;