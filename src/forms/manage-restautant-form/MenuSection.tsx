import { Button } from '@/components/ui/button';
import { FormDescription, FormField, FormItem } from '@/components/ui/form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import MenuItemInput from './MenuItemInput';
import { v4 as uuidv4 } from 'uuid';

const MenuSection = () => {
  const{control} = useFormContext();

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'menuItems',
  });

  // Function to generate a new item with a unique ID
  const addItemWithUUID = () => {
    const newItem = {
      id: uuidv4(), // Assign a unique ID to each new item
      name: '',
      price: '',
    };
    append(newItem);
  };

  return <div className=' space-y-2'>
        <div>
            <h2 className='text-2xl font-bold'>
                <FormDescription>
                    Create your menu and give each item a name and price
                </FormDescription>
            </h2>
        </div>
        <FormField control={control} name="menuItems" render={() => (
        <FormItem className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <MenuItemInput
              key={field.id} // Use the unique ID as the key
              index={index}
              removeMenuItem={() => remove(index)}
            />
                ))}
            </FormItem>
        )} />
        <Button 
        type="button" 
        onClick={addItemWithUUID}>
            Add Menu Item
        </Button>
    </div>
  
};

export default MenuSection;