import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RootState } from "@/store/store";
import { RestaurantService } from "@/lib/restaurantServices";
import {
  setCurrentRestaurant,
  setRestaurantLoading,
  setRestaurantError,
} from "@/store/restaurantSlice";
import toast from "react-hot-toast";
import LoadinButton from "@/components/LoadinButton";
import RestaurantImageUploader from "@/components/UploadRestaurantImage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

const MobileManageRestaurantForm = () => {
  const dispatch = useDispatch();
  const { currentRestaurant, loading, error } = useSelector(
    (state: RootState) => state.restaurant
  );
  
  const [imageState, setImageState] = useState({
    showUploader: false,
    isEditing: false
  });

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
    <div className="space-y-4 mb-6">
      {currentRestaurant?.imageUrl ? (
        <div className="relative group">
          <img 
            src={currentRestaurant.imageUrl} 
            alt="Restaurant" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button 
            variant="outline"
            size="sm"
            className="absolute bottom-2 right-2"
            onClick={() => setImageState({ showUploader: true, isEditing: true })}
          >
            Change Image
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline"
          className="w-full h-32 border-2 border-dashed"
          onClick={() => setImageState({ showUploader: true, isEditing: false })}
        >
          <span className="text-gray-500">Add Restaurant Image</span>
        </Button>
      )}
    </div>
  );

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <div className="p-4">
          {renderImageSection()}
          
          {imageState.showUploader && currentRestaurant?._id && (
            <RestaurantImageUploader
              restaurantId={currentRestaurant._id}
              onClose={() => setImageState({ showUploader: false, isEditing: false })}
              isModal
            />
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {/* Basic Information Section */}
              <AccordionItem value="basic-info ">
                <AccordionTrigger className="text-lg font-medium">
                  Basic Information
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Restaurant Name</Label>
                    <Input
                      {...form.register("name")}
                      placeholder="Restaurant name"
                      className="bg-input/40"
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      {...form.register("description")}
                      placeholder="About your restaurant"
                      className="bg-input/40"
                      rows={3}
                    />
                    {form.formState.errors.description && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={form.watch("isActive")}
                        onCheckedChange={(checked) =>
                          form.setValue("isActive", checked)
                        }
                      />
                      <Label htmlFor="isActive">
                        {form.watch("isActive") ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Contact Information Section */}
              <AccordionItem value="contact-info">
                <AccordionTrigger className="text-lg font-medium">
                  Contact Information
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      {...form.register("address")}
                      placeholder="Street address"
                      className="bg-input/40"
                    />
                    {form.formState.errors.address && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input {...form.register("city")} placeholder="City" 
                      className="bg-input/40" />
                      {form.formState.errors.city && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.city.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input {...form.register("country")} placeholder="Country"
                      className="bg-input/40" />
                      {form.formState.errors.country && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      {...form.register("phone")}
                      placeholder="Phone number"
                      className="bg-input/40"
                      type="tel"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      {...form.register("email")}
                      placeholder="Email"
                      type="email"
                      className="bg-input/40"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Website (optional)</Label>
                    <Input
                      {...form.register("website")}
                      placeholder="Website URL"
                      type="url"
                      className="bg-input/40"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Delivery Information Section */}
              <AccordionItem value="delivery-info">
                <AccordionTrigger className="text-lg font-medium">
                  Delivery Information
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Delivery Price ($)</Label>
                    <Input
                      {...form.register("deliveryPrice")}
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      className="bg-input/40"
                    />
                    {form.formState.errors.deliveryPrice && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.deliveryPrice.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Estimated Delivery Time (minutes)</Label>
                    <Input
                      {...form.register("estimatedDeliveryTime")}
                      placeholder="30"
                      type="number"
                      className="bg-input/40"
                    />
                    {form.formState.errors.estimatedDeliveryTime && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.estimatedDeliveryTime.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Opening Hours</Label>
                    <Input
                      {...form.register("openingHours")}
                      placeholder="e.g. 9:00 AM - 10:00 PM"
                      className="bg-input/40"
                    />
                    {form.formState.errors.openingHours && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.openingHours.message}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-400 hover:to-blue-600 transition-all duration-300 text-white py-3"
                disabled={loading}
              >
                {loading ? (
                  <LoadinButton />
                ) : currentRestaurant?._id ? (
                  "Update Restaurant"
                ) : (
                  "Create Restaurant"
                )}
              </Button>
            </div>

            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p>
            )}
          </form>
        </div>
      </Form>
    </FormProvider>
  );
};

export default MobileManageRestaurantForm;