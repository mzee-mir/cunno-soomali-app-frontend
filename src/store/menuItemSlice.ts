import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IMenuItem {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: boolean;
    discount?: number | null;
    description: string;
    publish: boolean;
    createdAt: string;
    updatedAt: string;
    restaurantId: {
        _id: string;
    }
}

interface MenuItemState {
    menuItems: IMenuItem[];
    loading: boolean;
    error: string | null;
}

const initialState: MenuItemState = {
    menuItems: [],
    loading: false,
    error: null,
};

const menuItemSlice = createSlice({
    name: "menuItem",
    initialState,
    reducers: {
        fetchMenuItems: (state, action: PayloadAction<IMenuItem[]>) => {
            state.menuItems = action.payload;
        },
        addMenuItem: (state, action: PayloadAction<IMenuItem>) => {
            state.menuItems.push(action.payload);
        },
        updateMenuItem: (state, action: PayloadAction<IMenuItem>) => {
            state.menuItems = state.menuItems.map(item =>
                item._id === action.payload._id ? action.payload : item
            );
        },
        updateMenuItemImage: (state, action: PayloadAction<{ menuItemId: string; imageUrl: string }>) => {
            const { menuItemId, imageUrl } = action.payload;
            const menuItem = state.menuItems.find(item => item._id === menuItemId);
            if (menuItem) {
                menuItem.imageUrl = imageUrl; // Directly assign the string
              }
        },
        deleteMenuItem: (state, action: PayloadAction<string>) => {
            state.menuItems = state.menuItems.filter(item => item._id !== action.payload);
        },
        setMenuItemLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setMenuItemError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearMenuItemsState: () => initialState,
    }
});

export const { 
    fetchMenuItems, 
    addMenuItem, 
    updateMenuItem, 
    updateMenuItemImage,
    deleteMenuItem, 
    setMenuItemLoading, 
    setMenuItemError, 
    clearMenuItemsState 
} = menuItemSlice.actions;

export type { IMenuItem, MenuItemState };
export default menuItemSlice.reducer;
