import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel, AlertDialogAction } from "@/components/ui/AlertDialog";

type Props = {
  removeMenuItem: () => void;
}

type MenuItem = {
    name: string;
    price: number;
    imageUrl?: string;
  };

const MenuTable = ({removeMenuItem}: Props) => {
  const { watch } = useFormContext();
  const menuItems = watch('menuItems');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {menuItems?.map((item: MenuItem, index: number) => (
        <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-4">
            {item.imageUrl && (
              <AspectRatio ratio={16/9}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="rounded-md object-cover w-full h-full"
                />
              </AspectRatio>
            )}
            <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold">£{item.price?.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {/* deleting a MenuItem button */} 
            <div>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                    type="button"
                    className="bg-red-500 max-h-fit w-full hover:bg-red-600"
                    >
                    Remove
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this menu item.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={removeMenuItem}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        Delete
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MenuTable;