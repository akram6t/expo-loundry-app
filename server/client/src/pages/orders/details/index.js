import React, { useEffect, useState } from "react";
import Navbar from "./../../../components/Navbar/Index";
import { useOutletContext, useParams } from "react-router-dom";
import Linking from "../../../components/Other/Linking";
import LINKING_DATA from "../../../data/linking_data";
import AddressDetails from "./AddressDetails";
import ServicesTables from "./ServicesTables";

import { useSelector } from 'react-redux';
import { Collections, HEADER_API, URL_GET_LIST, URL_POST_DOCUMENT, URL_POST_NOTIFICATION } from "../../../utils/Constant";
import axios from "axios";
import { formatDate } from "../../../utils/FormatDate";
import formatTime from "../../../utils/FormatTime";
import AppIndicator from "../../../components/Other/AppIndicator";
import ModalCreate from './../../../components/Other/models/ModalCreate';
import { paymentMethods } from "../../../data/payment_method";
import { toast } from "react-toastify";
import ProgressBar from "../../../components/Other/ProgressBar";
import { SetTitle } from './../../../utils/SetTitle';

function OrderDetails() {
  SetTitle('Order Details');
  const [isModalVisibility, setModalVisible] = useState({ status: false });
  const [sidebarToggle] = useOutletContext();
  const [paymentsList, setpaymentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { order_id } = useParams();
  const [details, setDetails] = useState(null);

  const [status, setOrderStatus] = useState('');

  const [order_status, set_order_statuses] = useState(null);

  const getOrderStatus = async () => {
    set_order_statuses([]);
    setLoading(true);
    const params = {
      collection: Collections.ORDERS_STATUS,
      sort: JSON.stringify({position: 1}),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const {status, data, message} = response.data;
        if(status){
          set_order_statuses([...data]);
          getOrder();
        }
      } else {
        console.error('Error fetching orders status:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching orders status:', error);
    }
  };


  useEffect(() => {
    getOrderStatus();
  }, []);

  // const order_status = useSelector((state) => state.orderstatus.value);

  const paymentData = {
    order_id: order_id,
    paymentMethod: 'Cash',
    amount: 0,
  }
  
  const paymentCollection = Collections.PAYMENTS;
  const addonsAmount = details?.addons?.reduce((total, addon) => total + addon.price, 0) || 0;
  const paidAmount = paymentsList?.reduce((total, p) => total + p.amount, 0) || 0;


  const getOrder = async () => {
    setLoading(true);
    const params = {
      collection: Collections.ORDERS,
      filter: JSON.stringify({ order_id: order_id }),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const { status, data, message } = response.data;
        if (status) {
          setOrderStatus(data[0].order_status);
          setDetails(data[0]);
          // console.log(data);
        }
      } else {
        console.error('Error fetching order details:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching order details:', error);
    }
  };

  const getpayments = async () => {
    setLoading(true);
    const params = {
      collection: Collections.PAYMENTS,
      filter: JSON.stringify({ order_id: order_id }),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const { status, data, message } = response.data;
        if (status) {
          setpaymentsList([...data]);
          // console.log(data);
        }
      } else {
        console.error('Error fetching order details:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching order details:', error);
    }
  };


  useEffect(() => {
    getpayments();
  }, []);


  const sendNotification = async (status) => {
    setLoading(true);
    const data = {
      uid: details?.uid,
      title: 'Order Id #' + details?.order_id,
      message: 'Your order ' + status,
      color: order_status.find(item => item.tag === status).color,
      icon: order_status.find(item => item.tag === status).icon,
      type: 'order',
      status: 'unread'
    }

    try {
      const response = await axios.post(URL_POST_NOTIFICATION, {
        collection: Collections.NOTIFICATIONS,
        data: {
          ...data
        }
      }, HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const { status } = response.data;
        if (status) {
          toast.success(`notification send to user`)
        //   sendNotification();
        }
      } else {
        toast.error(response.statusText);
        console.error(`Error crud: notification`, response.statusText);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.toString());
      console.error(`Error crud: notification`, error);
    }


  }


  const handleChangeStatus = async (value) => {
    setLoading(true);
    setOrderStatus(value);
    try {
      const response = await axios.post(URL_POST_DOCUMENT, {
        collection: Collections.ORDERS,
        data: {
          _id: details?._id,
          order_status: value
        }
      }, HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const { status } = response.data;
        if (status) {
          toast.success(`Order Status Changed`)
          sendNotification(value);
        }
      } else {
        toast.error(response.statusText);
        console.error(`Error crud: ORDERS`, response.statusText);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.toString());
      console.error(`Error crud: ORDERS`, error);
    }
  }


  const handleChangePaymentValue = (name, value) => {
    setModalVisible({
      ...isModalVisibility,
      data: {
        ...isModalVisibility.data,
        [name]: value
      }
    })
  }

  if (details == null || order_status == null) {
    return (
      <AppIndicator />
    );
  }

  return (
    <>
      <main className="h-full">
        <Navbar toggle={sidebarToggle} />

        {/* Main Content */}
        <div className="mainCard">
          <div className="py-5 flex items-center justify-between">
            <span className="flex flex-col gap-y-2">
              <h2 className="font-bold text-3xl">Order Details</h2>
              <Linking data={LINKING_DATA().ORDERS_DETAILS_PAGE} currentPage={order_id} />
            </span>
          </div>

          <div className="w-full flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3">

            {/* Left Container */}
            <div className="flex-1 border bg-white border-gray-200 py-4 px-6 rounded-md">

              <div className="flex items-center justify-between">
                <div className="text-center sm:text-lg font-semibold text-emerald-700">
                  <h3>{details?.order_date && formatDate(details?.order_date)}</h3>
                  <h3>{details?.order_date && formatTime(details?.order_date)}</h3>
                </div>
                <h3 className="hidden sm:block sm:text-xl font-semibold text-emerald-700"># {order_id}</h3>
                <span>
                <select value={status} onChange={(e) => handleChangeStatus(e.target.value)} style={{ backgroundColor: order_status?.find(item => item.tag === status) ? order_status?.find(item => item.tag === status).color : '#929292' }} className={`text-sm sm:text-lg text-white placeholder-gray-500 px-4 rounded-lg border border-gray-200 md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1`}>
                  {
                    order_status.map((item, index) => {
                      return (
                        <option className="bg-white text-gray-900" value={item.tag} key={index}>{item.tag}</option>
                      )
                    })
                  }
                </select>
                </span>
              </div>

              {/* divider */}
              <div className="border border-emerald-100 mt-2"></div>

              <div className="mt-2 text-sm flex item-center justify-between">
                <div className="font-semibold">
                  <h1 className="text-lg text-black font-bold">Pickup Date</h1>
                  <h3><span className="font-medium">Date: </span>{formatDate(details.pickup_date.date)}</h3>
                  <h3><span className="font-medium">Time: </span>{details.pickup_date.time}</h3>
                </div>
                <div className="font-semibold">
                  <h1 className="text-lg text-black font-bold">Delivery Date</h1>
                  <h3><span className="font-medium">Date: </span>{formatDate(details.delivery_date.date)}</h3>
                  <h3><span className="font-medium">Time: </span>{details.delivery_date.time}</h3>
                </div>
              </div>


              {/* divider */}
              <div className="border border-emerald-100 mt-3"></div>

              <div className="mt-2 sm:flex space-y-3 sm:space-y-0 items-center justify-between">
                <AddressDetails name={'Pickup'} address={details.pickup_address} />
                <AddressDetails name={'Delivery'} address={details.delivery_address} />
              </div>


              {/* divider */}
              <div className="border border-emerald-100 mt-3 mb-3"></div>
              <ServicesTables data={details} />


            </div>

            {/* right container */}
            <div className="w-full lg:w-60 border bg-white border-gray-200 py-4 px-6 rounded-md">

              <div>
                <h1 className="font-semibold text-lg mb-2">Payment Details</h1>
                <h2 className="flex items-center justify-between">Sub Total: <span className="font-semibold">₹ {details.amount}</span></h2>
                <h2 className="flex items-center justify-between">Service Fee: <span className="font-semibold">₹ {details.service_fee}</span></h2>
                {
                  details?.addons?.map((item, index) => (
                    <h2 key={index} className="flex items-center justify-between">{item.name}: <span className="font-semibold">₹ {item.price}</span></h2>
                  ))
                }
                <h2 className="flex items-center justify-between">Grand Total: <span className="font-semibold">₹ {details.amount + details.service_fee + addonsAmount}</span></h2>
              </div>


              {/* divider */}
              <div className="border border-emerald-100 mt-3 mb-3"></div>

              <h1 className="text-lg font-semibold mt-2">Payments</h1>

              <div className="mt-4 flex-1">
                {/* list */}
                {paymentsList.map((item, index) => {
                  return (
                    <div className="bg-gray-100 border p-2 rounded-md mt-1">
                      <h2 className="font-semibold">₹ {item.amount}</h2>
                      <h5>{formatDate(item.date)} [{item.paymentMethod}]</h5>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-1 mt-3">
                <button onClick={() => setModalVisible({ status: true, collection: paymentCollection, data: { ...paymentData, amount: ((details?.amount + details?.service_fee + addonsAmount) - (paidAmount || 0)) < 0 ? 0 :(details?.amount + details?.service_fee + addonsAmount) - (paidAmount || 0) } })} className="hover:bg-opacity-80 active:bg-opacity-50 transition-all w-full bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                  Add Payment
                </button>
                <button onClick={() => window.print()} className="hover:bg-opacity-80 active:bg-opacity-50 transition-all w-full bg-black text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                  Print Invoice
                </button>
                <button className="invisible hover:bg-opacity-80 active:bg-opacity-50 transition-all w-full bg-black text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                  Download Pdf
                </button>

              </div>

            </div>

          </div>

        </div>
      </main>

      <ModalCreate title={'Payment'} isModalVisible={isModalVisibility} onRefresh={() => getpayments()} setModalVisibility={(obj) => setModalVisible(obj)}>
        <div className="flex items-center justify-between">
          <span>Customer Name:</span>
          <span className="font-semibold">{details?.pickup_address?.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Order ID:</span>
          <span className="font-semibold"># {details?.order_id}</span>
        </div>
        {/* divider */}
        <div className="border border-emerald-100 mt-3 mb-3"></div>

        <div className="flex items-center justify-between">
          <span>order Amount:</span>
          <span className="font-semibold">₹ {details?.amount + details?.service_fee + addonsAmount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Paid:</span>
          <span className="font-semibold">₹ {paidAmount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Balance:</span>
          <span className="font-semibold">₹ {(details?.amount + details?.service_fee + addonsAmount) - paidAmount}</span>
        </div>
        {/* divider */}
        <div className="border border-emerald-100 mt-3 mb-3"></div>
        <div className="flex items-center justify-between">
          {/* input start */}
          <div className="relative mr-1">
            <label className="font-bold text-sm text-gray-600">
              Amount
              <span className="text-red-600 font-bold ml-2">*</span>
            </label>
            <input
              value={isModalVisibility?.data?.amount}
              onChange={(e) => handleChangePaymentValue('amount', e.target.value)}
              id="inputWithIcon"
              type="number"
              name="inputWithIcon"
              className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
              placeholder="Enter amount"
            />
          </div>
          {/* input end */}

          {/* input end */}
          <div className="relative ml-1">
            <label className="font-bold text-sm text-gray-600">
              PaymentMethod
              <span className="text-red-600 font-bold ml-2">*</span>
            </label>
            <select
              value={isModalVisibility?.data?.type}
              onChange={(e) => handleChangePaymentValue('paymentMethod', e.target.value)}
              className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
              {
                paymentMethods.map(item => (
                  <option value={item}>{item}</option>
                ))
              }
            </select>
          </div>
          {/* input end */}
        </div>

      </ModalCreate>
    </>
  );
}

export default OrderDetails;


// const detailsData = {
//   "_id": "6572265566b29db63bf03dec",
//   "uid": "cC8B1tZcjzTVyTnp07Aj5fDWl0B2",
//   "addons":[
//     {
//       "name": 'Extra care',
//       "price": 10
//     },
//   ],
//   "items": [
//     {
//       "_id": "654483a03dd85806ea9f6a4b",
//       "image": "https://cdn-icons-png.flaticon.com/128/4643/4643574.png",
//       "name": "shirt",
//       "quantity": 1,
//       "gender": "Man",
//       "services": [
//         {
//           "name": "Iron Only",
//           "price": 10
//         }
//       ],
//       "shopid": "65442ccd8674edea93aa8587"
//     },
//     {
//       "_id": "654483a03dd85806ea9f6a4c",
//       "image": "https://cdn-icons-png.flaticon.com/128/892/892458.png",
//       "name": "T-shirt",
//       "quantity": 1,
//       "gender": "men",
//       "services": [
//         {
//           "name": "Iron Only",
//           "price": 10
//         }
//       ],
//       "shopid": "65442ccd8674edea93aa8587"
//     }
//   ],
//   "pickup_date": {
//     "date": "2023-12-07T20:07:38.023Z",
//     "time": "07 - 08 pm"
//   },
//   "delivery_date": {
//     "date": "2023-12-07T20:07:38.101Z",
//     "time": "07 - 08 pm"
//   },
//   "pickup_address": {
//     "_id": "6572060066b29db63bf03de8",
//     "uid": "cC8B1tZcjzTVyTnp07Aj5fDWl0B2",
//     "name": "Archit Vishvkarma",
//     "mobile": "9131265569",
//     "pincode": "452006",
//     "state": "Madhya Pradesh",
//     "city": "Indore",
//     "house": "512",
//     "area": "01, Chandan Nagar",
//     "type": "home",
//     "nearby": "Asad kirana dukaan ke pass"
//   },
//   "delivery_address": {
//     "_id": "6572060066b29db63bf03de8",
//     "uid": "cC8B1tZcjzTVyTnp07Aj5fDWl0B2",
//     "name": "Archit Vishvkarma",
//     "mobile": "9131265569",
//     "pincode": "452006",
//     "state": "Madhya Pradesh",
//     "city": "Indore