import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { FaRegUserCircle, FaCamera } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Axios from '@/lib/Axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface ImageUploaderProps {
  uploadUrl: string;
  updateAction: (imageUrl: string) => void;
  onClose?: () => void;
  isModal?: boolean;
  previewImage?: string;
  title?: string;
  inputName?: string;
  shape?: 'circle' | 'rectangle';
}

const ImageUploader = ({
  uploadUrl,
  updateAction,
  onClose,
  isModal = false,
  previewImage = '',
  title = 'imageUploader.title',
  inputName = 'image',
  shape = 'rectangle',
}: ImageUploaderProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('imageUploader.error.fileType'));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('imageUploader.error.fileSize'));
      return;
    }

    const formData = new FormData();
    formData.append(inputName, file);

    try {
      setLoading(true);
      const response = await Axios.post(uploadUrl, formData);
      if (response.data?.success) {
        updateAction(response.data.data.imageUrl);
        toast.success(t('imageUploader.success'));
        if (onClose) onClose();
      }
    } catch (error) {
      toast.error(t('imageUploader.error.uploadFailed'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isModal ? 'fixed inset-0 bg-neutral-900 bg-opacity-60 flex items-center justify-center z-50 p-4' : 'relative group'}>
      <div className={isModal ? 'bg-white max-w-sm w-full rounded-lg p-6 shadow-lg' : 'w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden'}>
        {isModal && (
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold'>{t(title)}</h3>
            {onClose && (
              <button onClick={onClose} className='text-neutral-800 hover:text-neutral-600 transition-colors' disabled={loading}>
                <IoClose size={24} />
              </button>
            )}
          </div>
        )}
        
        <div className={`flex flex-col items-center gap-4 ${isModal ? '' : 'w-full h-full'}`}>
          <div className={`${shape === 'circle' ? 'w-24 h-24 rounded-full' : 'w-32 h-32 rounded-lg'} bg-gray-200 flex items-center justify-center overflow-hidden`}>
            {previewImage ? (
              <img alt={t('imageUploader.altText')} src={previewImage} className='w-full h-full object-cover' />
            ) : (
              shape === 'circle' ? <FaRegUserCircle size={48} className='text-gray-400' /> : <FaCamera size={48} className='text-gray-400' />
            )}
          </div>
          
          <label htmlFor='uploadImage'>
            <div className='border border-blue-200 cursor-pointer hover:text-white hover:bg-gradient-to-r from-blue-500 to-blue-300 px-4 py-1 rounded text-sm my-3'>
              {loading ? t('imageUploader.uploading') : t('imageUploader.selectImage')}
            </div>
            <input onChange={handleUploadImage} type='file' id='uploadImage' className='hidden' accept='image/*' />
          </label>
          
          <p className='text-sm text-gray-500 text-center'>{t('imageUploader.fileRequirements')}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;