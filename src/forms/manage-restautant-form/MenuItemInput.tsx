import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import ImageSection from "./menuItemImage";

type Props = {
  index: number;
  onSave?: (data: { name: string; price: number; unit: string; category: string; status: string; productId: string; imageUrl: string }) => void;
};

const MenuItemInput = ({ index, onSave }: Props) => {
  const { control, watch } = useFormContext();
  const imageUrl = watch(`menuItems.${index}.imageUrl`);

  return (
    <div className="flex flex-col items-center  gap-6 bg-white shadow-lg rounded-lg w-full max-w-3xl mx-auto">
      {/* Image Upload Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-[200px] h-[150px] bg-gray-100 rounded-lg overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Menu item"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <ImageSection index={index} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <FormField
          control={control}
          name={`menuItems.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Product Name" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`menuItems.${index}.unit`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Unit</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Unit" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`menuItems.${index}.category`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Category" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`menuItems.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Price" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`menuItems.${index}.status`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Select Status" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`menuItems.${index}.productId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Product ID" disabled />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Save Button */}
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (onSave) {
            onSave({
              name: watch(`menuItems.${index}.name`),
              price: Number(watch(`menuItems.${index}.price`)),
              unit: watch(`menuItems.${index}.unit`),
              category: watch(`menuItems.${index}.category`),
              status: watch(`menuItems.${index}.status`),
              productId: watch(`menuItems.${index}.productId`),
              imageUrl: watch(`menuItems.${index}.imageUrl`),
            });
          }
        }}
        className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
      >
        Save Product
      </Button>
    </div>
  );
};

export default MenuItemInput;
