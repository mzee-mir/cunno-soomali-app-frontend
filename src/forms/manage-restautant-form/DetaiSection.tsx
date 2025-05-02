// DetailSection.tsx
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

const DetailSection = () => {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Restaurant Details</h2>
        <FormDescription>
          Enter the basic information about your restaurant
        </FormDescription>
      </div>

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Restaurant Name</FormLabel>
            <FormControl>
              <Input {...field} className="bg-input/40" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input {...field} className="bg-input/40" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input {...field} className="bg-input/40" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} className="bg-input/40" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} className="bg-input/40" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} className="bg-input/40" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} className="bg-input/40" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="openingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opening Hours</FormLabel>
              <FormControl>
                <Input {...field} className="bg-input/40" placeholder="9:00 AM - 10:00 PM" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="deliveryPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Price ($)</FormLabel>
              <FormControl>
                <Input {...field} className="bg-input/40" type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="estimatedDeliveryTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Delivery Time (minutes)</FormLabel>
              <FormControl>
                <Input {...field} className="bg-input/40" type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DetailSection;