import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector} from 'react-redux';
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import toast from "react-hot-toast";
import { setRestaurantImage } from '@/store/restaurantSlice';
import { RootState } from '@/store/store';

interface RestaurantImageUploaderProps {
  restaurantId: string;
  onClose?: () => void;
  isModal?: boolean;
}

const RestaurantImageUploader = ({ 
  restaurantId, 
  onClose, 
  isModal = false 
}: RestaurantImageUploaderProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { currentRestaurant } = useSelector(
    (state: RootState) => state.restaurant
  );

  const handleUploadRestaurantImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Image size should be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.restaurant.uploadImageRestaurant,
        url: SummaryApi.restaurant.uploadImageRestaurant.url.replace(':restaurantId', restaurantId),
        data: formData
      });

      if (response.data?.success) {
        // Update the restaurant image in the store
        dispatch(setRestaurantImage(response.data.data.imageUrl));
        toast.success('Restaurant image uploaded successfully');
        if (onClose) onClose();
      }
    } catch (error) {
      toast.error('Failed to upload restaurant image');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isModal) {
    return (
      <section className='fixed inset-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center z-50'>
        <div className='bg-white max-w-sm w-full rounded-lg p-6 shadow-lg'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold'>Add Restaurant Image</h3>
            {onClose && (
              <button 
                onClick={onClose} 
                className='text-neutral-800 hover:text-neutral-600 transition-colors'
                disabled={loading}
              >
                <IoClose size={24}/>
              </button>
            )}
          </div>

          <div className='flex flex-col items-center gap-4'>
            <div className='w-32 h-32 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden'>
                {currentRestaurant?.imageUrl ? (
                    <img 
                      alt={currentRestaurant.name}
                      src={currentRestaurant.imageUrl}
                      className='w-full h-full object-cover'
                    />
                    ) : (
                    <FaCamera size={48} className='text-gray-400'/>
                   )}
            </div>
            
            <label htmlFor='uploadRestaurantImage'>
              <div className='border border-blue-200 cursor-pointer hover:text-white hover:bg-gradient-to-r from-blue-500 to-blue-300 px-4 py-1 rounded text-sm my-3'>
                {loading ? 'Uploading...' : 'Select Image'}
              </div>
              <input 
                onChange={handleUploadRestaurantImage} 
                type='file' 
                id='uploadRestaurantImage' 
                className='hidden'
                accept='image/*'
              />
            </label>

            <p className='text-sm text-gray-500 text-center'>
              JPG, PNG up to 2MB
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="relative group">
      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        <label 
          htmlFor="uploadRestaurantImage" 
          className="cursor-pointer w-full h-full flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <FaCamera size={32} className="text-gray-400 group-hover:text-gray-600"/>
            <span className="mt-2 text-sm text-gray-500 group-hover:text-gray-700">
              {loading ? 'Uploading...' : 'Add Image'}
            </span>
          </div>
        </label>
        <input 
          onChange={handleUploadRestaurantImage} 
          type="file" 
          id="uploadRestaurantImage" 
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default RestaurantImageUploader;