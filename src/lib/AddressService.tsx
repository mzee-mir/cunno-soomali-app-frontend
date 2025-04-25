// services/addressService.ts
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import { Dispatch } from "redux";
import {
  setAddresses,
  addAddress,
  updateAddress,
  disableAddress,
  setAddressLoading,
  setAddressError,
} from "@/store/addressSlice";
import type { IAddress } from "@/store/addressSlice";

export const AddressService = {
  /**
   * Fetch all addresses for the current user
   */
  async getAddresses(dispatch: Dispatch): Promise<IAddress[]> {
    try {
      dispatch(setAddressLoading(true));
      dispatch(setAddressError(null));

      const response = await Axios(SummaryApi.address.getAddress);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch addresses");
      }

      const addresses = response.data.data as IAddress[];
      dispatch(setAddresses(addresses));
      return addresses;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch addresses";
      dispatch(setAddressError(errorMessage));
      throw error;
    } finally {
      dispatch(setAddressLoading(false));
    }
  },

  /**
   * Create a new address
   */
  async createAddress(
    dispatch: Dispatch,
    addressData: Omit<IAddress, "_id" | "createdAt" | "updatedAt" | "status">
  ): Promise<IAddress> {
    try {
      dispatch(setAddressLoading(true));
      dispatch(setAddressError(null));

      const response = await Axios({
        ...SummaryApi.address.createAddress,
        data: addressData,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create address");
      }

      const newAddress = response.data.data as IAddress;
      dispatch(addAddress(newAddress));
      return newAddress;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create address";
      dispatch(setAddressError(errorMessage));
      throw error;
    } finally {
      dispatch(setAddressLoading(false));
    }
  },

  /**
   * Update an existing address
   */
  async updateAddress(
    dispatch: Dispatch,
    addressId: string,
    updateData: Partial<IAddress>
  ): Promise<IAddress> {
    try {
      dispatch(setAddressLoading(true));
      dispatch(setAddressError(null));

      const response = await Axios({
        ...SummaryApi.address.updateAddress,
        data: updateData,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update address");
      }

      const updatedAddress = response.data.data as IAddress;
      dispatch(updateAddress(updatedAddress));
      return updatedAddress;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update address";
      dispatch(setAddressError(errorMessage));
      throw error;
    } finally {
      dispatch(setAddressLoading(false));
    }
  },

  /**
   * Disable/soft delete an address
   */
  async disableUserAddress(
    dispatch: Dispatch,
    addressId: string
  ): Promise<boolean> {
    try {
      dispatch(setAddressLoading(true));
      dispatch(setAddressError(null));

      const response = await Axios(SummaryApi.address.disableAddress);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to disable address");
      }

      dispatch(disableAddress(addressId));
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to disable address";
      dispatch(setAddressError(errorMessage));
      throw error;
    } finally {
      dispatch(setAddressLoading(false));
    }
  },
};