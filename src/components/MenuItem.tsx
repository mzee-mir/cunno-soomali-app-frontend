import { IMenuItem } from "@/store/menuItemSlice";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AddToCartButton from "@/components/AddToCart"; // Import the new component


type Props = {
    menuItem: IMenuItem;
}

const MenuItem = ({ menuItem}: Props) => {
    console.log("Image URL:", menuItem.imageUrl);
    console.log("Menu Item Name:", menuItem.name);
    
    return (
        <div>
            <Card className="w-full shadow-md">
                <CardHeader className="p-0">
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                        <img
                            src={menuItem.imageUrl}
                            alt={menuItem.name}
                            className="rounded-tl-md rounded-tr-md object-cover w-full h-full"
                        />
                    </AspectRatio>
                    <CardTitle className="pt-4 pl-3 pb-4 text-xl">
                        {menuItem.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="font-bold flex justify-between pr-3 pl-3 pb-3 ">
                    <div className="pt-2">
                        ${menuItem.price }
                        {menuItem.discount && (
                            <span className="text-sm text-red-600 ml-2">
                                (-{menuItem.discount}%)
                            </span>
                        )}
                    </div>
                    
                    <AddToCartButton data={menuItem} />
                    
                </CardContent>
            </Card>
        </div>
    )
}

export default MenuItem;