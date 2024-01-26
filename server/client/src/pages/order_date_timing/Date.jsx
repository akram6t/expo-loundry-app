import React, { useState } from 'react'
import { ordersDateData } from '../../data/date_time'
import axios from 'axios';
import LoadingSpinner from './../../components/Other/ProgressBar';
import { Collections, HEADER_API, URL_POST_DOCUMENT } from '../../utils/Constant';
import { toast } from 'react-toastify';

const Date = ({store}) => {
  const [loading, setLoading] = useState(false);
  const [ startDay, setStartDay ] = useState({
    pickup_start_day: store?.pickup_start_day
  })


  const handleUpdate =  async () => {
    setLoading(true);
    try {
      const response = await axios.post(URL_POST_DOCUMENT, {
        collection: Collections.STORE,
        data: {
          _id: store?._id,
          pickup_start_day: parseInt(startDay.pickup_start_day),
        }
      }, HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const { status } = response.data;
        if (status) {
          toast.success(`Date Updated`)
        }
      } else {
        toast.error(response.statusText);
        console.error(`Error crud: ${Collections.STORE}`, response.statusText);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.toString());
      console.error(`Error crud: ${Collections.STORE}`, error);
    }
  }

  return (
     <div className="bg-white shadow rounded-lg overflow-hidden">
     <h2 className="bg-emerald-600 text-white p-2">Order Pickup & Drop Date</h2>
     <div className="p-3 items-center grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-4">

       {/* input start */}
       <div className="">
         <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
           Pickup Start Day
           <span className='ml-1 text-red-500'>*</span>
         </label>
         <select
         value={startDay.pickup_start_day}
         onChange={(e) => setStartDay({ ...startDay, pickup_start_day: e.target.value })}
           className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
            {
                ordersDateData?.map((item, index) => {
                    let label = item === 0 ? 'Today' : item;
                    label = item === 1 ? 'Tomorrow' : label
                    if(typeof label !== 'string'){
                      label = label + 1;
                    }
                    return(
                        <option value={item}>{label}</option>
                    )
                })
            }
         </select>
       </div>
       {/* input end */}

     </div>

                   
     <button onClick={() => handleUpdate()} className="m-3 mb-5 hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
          { loading ? <LoadingSpinner/> : 'Update' }
     </button>
   </div>
  )
}

export default Date