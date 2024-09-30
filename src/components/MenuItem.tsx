import { MenuItems } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
    menuItem: MenuItems;
    addToCart: () =>void;
}

const MenuItem = ({menuItem, addToCart}: Props) => {
    return (
        <Card className="cursor-pointer hover:bg-[#ecfeff] active:bg-[#a5f3fc] transition-colors duration-200" onClick={addToCart} >
            <CardHeader>
                <CardTitle>
                    {menuItem.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="font-bold">
                ${(menuItem.price/100).toFixed(2)}
            </CardContent>
        </Card>
    )
}

export default MenuItem;