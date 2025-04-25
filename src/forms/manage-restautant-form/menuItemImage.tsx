import { AspectRatio } from '@/components/ui/aspect-ratio';
import { FormControl, FormField, FormItem, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';

type Props = {
  index: number;
};

const ImageSection = ({ index }: Props) => {
  const { control, watch } = useFormContext();
  const previewImage = watch(`menuItems.${index}.imageUrl`);
  const [localPreview, setLocalPreview] = useState<string>("");

  const selectedFile = watch(`menuItems.${index}.image`);

  useEffect(() => {
    if (selectedFile instanceof File) {
      const url = URL.createObjectURL(selectedFile);
      setLocalPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  return (
    <div className='space-y-2'>
      <div className='flex flex-col gap-6'>
        
        <div className='flex flex-col  '>
          {(localPreview || previewImage) && (
            <AspectRatio ratio={4/3} className="bg-gray-100 w-full ">
              <img
                src={localPreview || previewImage}
                className="object-cover w-full"
                alt="Dish preview"
              />
            </AspectRatio>
          )}
        </div>

        <div className=''>
        <FormField
          control={control}
          name={`menuItems.${index}.image`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) field.onChange(file);
                    }}
                    className="hidden"
                    id={`file-input-${index}`}
                  />
                  <label
                    htmlFor={`file-input-${index}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
                  >
                    {field.value instanceof File ? field.value.name : "Choose File"}
                  </label>
                </div>
              </FormControl>
              {/*
              {field.value instanceof File && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {field.value.name}
                </p>
              )}
              
              {previewImage && !localPreview && (
                <p className="text-sm text-muted-foreground mt-2">
                  Current image: {previewImage.split('/').pop()}
                </p>
              )}*/}
            </FormItem>
          )}
        />
        </div>
      </div>
    </div>
  );
};

export default ImageSection;