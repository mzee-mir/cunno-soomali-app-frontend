import { createSlice, PayloadAction  } from "@reduxjs/toolkit";

interface UserState {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    mobile: string;
    verify_email: boolean;
    last_login_date: string;
    status: string;
    address_details: any[]; 
    shopping_cart: any[]; 
    orderHistory: any[];
    role: 'USER' | 'RESTAURANT OWNER' | 'ADMIN';
    loading: boolean;
}

const initialValue: UserState = {
    _id: "",
    name: "",
    email: "",
    avatar: "",
    mobile: "",
    verify_email: false, 
    last_login_date: "",
    status: "",
    address_details: [],
    shopping_cart: [],
    orderHistory: [],
    role: "USER", 
    loading: true,
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialValue,
    reducers : {
        setUserDetails: (state, action: PayloadAction<Omit<UserState, "loading">>) => {
            return { ...action.payload, loading: false };
          },
        updatedAvatar : (state,action)=>{
            state.avatar = action.payload
        },
        logout: () => initialValue,
        
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
          }

    }
})

export const { setUserDetails, logout ,updatedAvatar, setLoading} = userSlice.actions

export default userSlice.reducer