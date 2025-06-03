import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { MenuItemService } from '@/lib/menuItemservice';
import toast from "react-hot-toast";
import LoadinButton from "@/components/LoadinButton";
import { RootState } from '@/store/store';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

interface MenuItemImageUploaderProps {
  restaurantId: string;
  menuItemId?: string;
  currentImage?: string;
  onImageUpload?: (file: File) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const MenuItemImageUploader = ({ 
  restaurantId,
  menuItemId,
  currentImage,
  onImageUpload,
  onClose, 
  isModal = false 
}: MenuItemImageUploaderProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { menuItems } = useSelector((state: RootState) => state.menuItem);
  const currentMenuItem = menuItems.find(item => item._id === menuItemId);
  const { t } = useTranslation();

  const handleUploadMenuItemImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error((t("menuItemUploader.invalidFile")));
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error((t("menuItemUploader.fileTooLarge")));
      return;
    }

    try {
      setLoading(true);
      
      if (menuItemId) {
        // Update existing menu item
        await MenuItemService.uploadMenuItemImage(
          dispatch,
          restaurantId,
          menuItemId,
          file
        );
        toast.success((t("menuItemUploader.success")));
        if (onClose) onClose();
      } else if (onImageUpload) {
        // New menu item - pass the file to parent
        onImageUpload(file);
      }
    } catch (error) {
      toast.error((t("menuItemUploader.error")));
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
            <h3 className='text-lg font-semibold'>{t("menuItemUploader.title")}</h3>
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
              {currentMenuItem?.imageUrl ? (
                <img 
                  alt={currentMenuItem.name}
                  src={currentMenuItem.imageUrl}
                  onError={(e) => {
                    console.error('Failed to load image:', currentMenuItem.imageUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  className='w-full h-full object-cover'
                />
              ) : (
                <FaCamera size={48} className='text-gray-400'/>
              )}
            </div>
            
            <label htmlFor='uploadMenuItemImage'>
              <input
                type='file'
                id='uploadMenuItemImage'
                accept='image/*'
                onChange={handleUploadMenuItemImage}
                className='hidden'
                disabled={loading}
              />
              <Button className=' bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg cursor-pointer hover:from-blue-400 hover:to-blue-600 transition-all duration-300 '>
                {loading ? <LoadinButton /> : (t("menuItemUploader.upload"))}
              </Button>
            </label>
          </div>
        </div>
      </section>
    );
  }

  // Non-modal version
  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='w-32 h-32 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden'>
        {currentMenuItem?.imageUrl ? (
          <img 
            alt={currentMenuItem.name}
            src={currentMenuItem.imageUrl}
            className='w-full h-full object-cover'
          />
        ) : (
          <FaCamera size={48} className='text-gray-400'/>
        )}
      </div>
      
      <label htmlFor='uploadMenuItemImage'>
        <input
          type='file'
          id='uploadMenuItemImage'
          accept='image/*'
          onChange={handleUploadMenuItemImage}
          className='hidden'
          disabled={loading}
        />
        <div className='bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors'>
          {loading ? <LoadinButton /> : (t("menuItemUploader.upload"))}
        </div>
      </label>
    </div>
  );
};

export default MenuItemImageUploader;