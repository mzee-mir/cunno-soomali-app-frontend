// store/addressSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAddress {
  _id: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  mobile: number;
  status: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AddressState {
  addresses: IAddress[];
  loading: boolean;
  error: string | null;
  selectedAddress: IAddress | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
  selectedAddress: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // Set loading state
    setAddressLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error message
    setAddressError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set all addresses
    setAddresses: (state, action: PayloadAction<IAddress[]>) => {
      state.addresses = action.payload;
    },

    // Add a new address
    addAddress: (state, action: PayloadAction<IAddress>) => {
      state.addresses.push(action.payload);
    },

    // Update an existing address
    updateAddress: (state, action: PayloadAction<IAddress>) => {
      const index = state.addresses.findIndex(
        (addr) => addr._id === action.payload._id
      );
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },

    // Soft delete/disable an address
    disableAddress: (state, action: PayloadAction<string>) => {
      const index = state.addresses.findIndex(
        (addr) => addr._id === action.payload
      );
      if (index !== -1) {
        state.addresses[index].status = false;
      }
    },

    // Set selected address
    selectAddress: (state, action: PayloadAction<IAddress | null>) => {
      state.selectedAddress = action.payload;
    },

    // Clear all addresses (for logout)
    clearAddresses: () => initialState,
  },
});

export const {
  setAddressLoading,
  setAddressError,
  setAddresses,
  addAddress,
  updateAddress,
  disableAddress,
  selectAddress,
  clearAddresses,
} = addressSlice.actions;

export type { IAddress, AddressState };
export default addressSlice.reducer;