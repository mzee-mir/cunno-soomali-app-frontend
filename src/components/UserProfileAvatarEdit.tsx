import React, { useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import toast from "react-hot-toast";
import { updatedAvatar } from "@/store/userSlice";
import { RootState } from '@/store/store';

const UserProfileAvatarEdit = ({ close }: { close: () => void }) => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
    }

    const handleUploadAvatarImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        formData.append('avatar', file);

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.user.uploadAvatar,
                data: formData
            });

            if (response.data?.success) {
                dispatch(updatedAvatar(response.data.data.avatar));
                toast.success('Avatar updated successfully');
                close();
            }
        } catch (error) {
            toast.error('Failed to upload avatar');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='fixed inset-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center z-50'>
            <div className='bg-white max-w-sm w-full rounded-lg p-6 shadow-lg'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold'>Update Profile Picture</h3>
                    <button 
                        onClick={close} 
                        className='text-neutral-800 hover:text-neutral-600 transition-colors'
                        disabled={loading}
                    >
                        <IoClose size={24}/>
                    </button>
                </div>

                <div className='flex flex-col items-center gap-4'>
                    <div className='w-24 h-24 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden'>
                        {user.avatar ? (
                            <img 
                                alt={user.name}
                                src={user.avatar}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <FaRegUserCircle size={48} className='text-gray-400'/>
                        )}
                    </div>
                    <form onSubmit={handleSubmit}>
                    <label htmlFor='uploadProfile' >
                        <div className='border border-blue-200 cursor-pointer hover:text-white hover:bg-gradient-to-r from-blue-500 to-blue-300 px-4 py-1 rounded text-sm my-3'
                        >
                            {loading ? 'Uploading...' : 'Select Image'}
                        </div>
                        <input 
                            onChange={handleUploadAvatarImage} 
                            type='file' 
                            id='uploadProfile' 
                            className='hidden'
                            accept='image/*'
                        />
                    </label>
                    </form> 

                    <p className='text-sm text-gray-500 text-center'>
                        JPG, PNG up to 2MB
                    </p>
                </div>
            </div>
        </section>
    );
};

export default UserProfileAvatarEdit;