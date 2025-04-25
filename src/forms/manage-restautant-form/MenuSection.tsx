import { Button } from "@/components/ui/button";
import { FormDescription, FormField, FormItem } from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import MenuItemInput from "./MenuItemInput";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import MenuTable from "./menutable";

const MenuSection = ({ existingImageUrl }: { existingImageUrl?: string }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItems",
  });

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Menu</h2>
        <FormDescription>
          Create your menu and give each item a name and a price
        </FormDescription>
      <div>
        {existingImageUrl && (
          <AspectRatio ratio={16 / 9}>
            <img
              src={existingImageUrl}
              className="rounded-md object-cover h-full w-full"
            />
          </AspectRatio>
        )}
      </div>
      </div>

      <div>
        <MenuTable removeMenuItem={() => remove(fields.length)}/>
      </div>

      {/*<FormField
        control={control}
        name="menuItems"
        render={() => (
          <FormItem className="flex flex-col gap-2 pb-2">
            {fields.map((_, index) => (
              <MenuItemInput
                key={index}
                index={index}
                removeMenuItem={() => remove(index)}
              />
            ))}
          </FormItem>
        )}
      />*/}
      {/* Sheet for adding new menu item */ }
      <div>
      <Sheet>
        <SheetTrigger>
          <Button 
            type="button" 
            className="bg-blue-500 text-white hover:bg-blue-600 w-full"
          >
            Add Menu Item
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Add New Menu Item</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <MenuItemInput 
              index={fields.length}
              onSave={(data) => {
                append({ name: data.name, price: data.price, imageUrl: data.imageUrl });
                const sheet = document.querySelector('[data-state="open"]');
                if (sheet) {
                  const closeButton = sheet.querySelector('[data-radix-focus-guard]') as HTMLElement;
                  closeButton?.click();
                }
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
      </div>
    </div>
  );
};

export default MenuSection;