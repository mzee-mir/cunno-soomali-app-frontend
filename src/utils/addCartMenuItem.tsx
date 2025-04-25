import toast from "react-hot-toast"
import SummaryApi from "../api/Userauth"
import Axios from "../lib/Axios"
import AxiosToastError from "../lib/AxiosTost"

export const addToCartProduct = async(menuItemId:string, qty:number)=>{
    try {
        const response = await Axios({
            ...SummaryApi.cartMenu.createCart,
            data : {
                quantity : qty,
                menuItemId : menuItemId
            }
        })

        const { data : responseData} = response

        console.log(responseData)
        if(responseData.success){
            toast.success(responseData.message)
        }
        return responseData

    } catch (error) {
        AxiosToastError(error)

        return {}
    }
}

export const getCartItems = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.cartMenu.getCart
        })

        const { data : responseData } = response

        if(responseData.success){
            return responseData 
        }
    } catch (error) {
        AxiosToastError(error)
        return error
    }
}