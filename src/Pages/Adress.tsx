import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../lib/Axios';
import SummaryApi from '../api/Userauth';
import toast from 'react-hot-toast';
import AxiosToastError from '../lib/AxiosTost';
import { RootState } from '@/store/store';
import { useGlobalContext } from '@/Provider/Global';
import { IAddress } from '@/store/addressSlice';
import { useTranslation } from 'react-i18next';

const Address = () => {
  const addressList = useSelector((state: RootState) => state.address.addresses)
  const [openAddress,setOpenAddress] = useState(false)
  const [OpenEdit,setOpenEdit] = useState(false)
  const [editData, setEditData] = useState<IAddress | null>(null);
  const { fetchAddress } = useGlobalContext()
  const { t } = useTranslation();

  const handleDisableAddress = async(id:string)=>{
    try {
      const response = await Axios({
        ...SummaryApi.address.disableAddress,
        data : {
          _id : id
        }
      })
      if(response.data.success){
        toast.success(t("address.removeSuccess"))
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className=''>
        <div className='bg-card shadow-lg px-2 py-2 flex justify-between gap-4 items-center '>
            <h2 className='font-semibold text-ellipsis line-clamp-1'>{t("address.title")}</h2>
            <button onClick={()=>setOpenAddress(true)} className='border border-primary text-primary px-3 hover:bg-primaryhover:text-black py-1 rounded-full'>
                {t("address.addAddress")}
            </button>
        </div>
        <div className='bg-card p-2 grid gap-4'>
              {
                addressList.map((address,index)=>{
                  return(
                      <div className={`border rounded p-3 flex gap-3 bg-card ${!address.status && 'hidden'}`} key={address._id}>
                          <div className='w-full'>
                            <p>{address.address_line}</p>
                            <p>{address.city}</p>
                            <p>{address.state}</p>
                            <p>{address.country} - {address.pincode}</p>
                            <p>{address.mobile}</p>
                          </div>
                          <div className=' grid gap-10'>
                            <button onClick={()=>{
                              setOpenEdit(true)
                              setEditData(address)
                            }} className='bg-green-200 p-1 rounded  hover:text-white hover:bg-green-600'>
                              <MdEdit/>
                            </button>
                            <button onClick={()=>
                              handleDisableAddress(address._id)
                            } className='bg-red-200 p-1 rounded hover:text-white hover:bg-red-600'>
                              <MdDelete size={20}/>  
                            </button>
                          </div>
                      </div>
                  )
                })
              }
              <div onClick={()=>setOpenAddress(true)} className='h-16 bg-input border-2 border-dashed flex justify-center items-center cursor-pointer'>
                {t("address.addAddress")}
              </div>
        </div>

        {
          openAddress && (
            <AddAddress close={() => setOpenAddress(false)} />
          )
        }

        {
        OpenEdit && editData && (
          <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
        )
        }
    </div>
  )
}

export default Address