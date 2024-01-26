import React, { useState, useEffect } from "react";
import Navbar from "./../../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import { SetTitle } from './../../utils/SetTitle';
import { Collections, DATE_ACC_DESC, HEADER_API, URL_DELETE_DOCUMENT, URL_GET_LIST, URL_POST_DOCUMENT, sampleIcon } from "../../utils/Constant";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import AppIndicator from "../../components/Other/AppIndicator";
import Linking from "../../components/Other/Linking";
import LINKING_DATA from "../../data/linking_data";
import ProgressBar from "../../components/Other/ProgressBar";
import { ImageItentifier } from "../../utils/ImageIdentifier";
import { toast } from "react-toastify";
import { formatDate } from './../../utils/FormatDate';
import formatTime from './../../utils/FormatTime';

function Notifications() {
  SetTitle('Notifications');
  const [sidebarToggle] = useOutletContext();
  const [ loading, setLoading ] = useState(false);
  const [ notificationsList, setNotificationsList ] = useState([]);
  const [ skip, setSkip ] = useState(0);
  const limit = 10;
  const [ store, setStore ] = useState(null);
  const [ notificationEnd, setNotificationEnd ] = useState(false);

  const getStore = async () => {
    const params = {
      collection: Collections.STORE,
      select: JSON.stringify({ logo: 1, name: 1 }),
      limit: 1  
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        const { status, data, message } = response.data;
        if (status) {
          setStore(data[0]);
        }
      } else {
        console.error('Error fetching general icons:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching general icons:', error);
    }
  };


  useEffect(() => {
    getStore();
  }, []);

  const getNotifications = async () => {
    setNotificationEnd(false);
    setLoading(true);
    const params = {
      collection: Collections.ADMIN_NOTIFICATIONS,
      skip: skip,
      limit: limit,
      sort: JSON.stringify({date: DATE_ACC_DESC.DECENDING}),

    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const {status, data, message} = response.data;
        if(status){
          setNotificationsList([...notificationsList, ...data]);
          setSkip(skip + limit);
          if(data?.length < limit){
            setNotificationEnd(true);
          }
        }
      } else {
        console.error('Error fetching notifications:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const deleteNotification = async (_id) => {
    try {
      const response = await axios.post(URL_DELETE_DOCUMENT, {
        id: _id,
        collection: Collections.ADMIN_NOTIFICATIONS
      }, HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        const {status} = response.data;
        if(status){
            toast.success(`notification deleted`)
            const filterNotification = notificationsList.filter(item => item._id !== _id);
            setNotificationsList([...filterNotification]);
        }
      } else {
        console.error(`Error deleting: notification`, response.statusText);
      }
    } catch (error) {
      console.error(`Error deleting: notification`, error);
    }
  };

  const readNotification = (_id) => {
    axios.post(URL_POST_DOCUMENT, { 
      collection: Collections.ADMIN_NOTIFICATIONS,
      data: {
        _id: _id,
        status: 'read'
      }
     }, HEADER_API)
      .then((result, err) => {
        const { status, message } = result.data;
        if (status) {
          console.log('status read');
        }
      }).catch(err => {
        // setMessage(`${err}`);
        // setSnackbar(true);
        console.log(err);
      })
  }

  if(store == null){
    return <AppIndicator/>
  }

  return (
    <>
      <main className="h-full">
        <Navbar toggle={sidebarToggle} />

         {/* Main Content */}
         <div className="mainCard">
         <div className="py-5 flex items-center justify-between">
            <span className="flex flex-col space-y-2">
              <h2 className="font-bold text-3xl">Notifications</h2>
              <Linking data={LINKING_DATA().CUSTOMER_PAGE} currentPage={'Notifications'} />
            </span>
          </div>

          {/* notifications */}
          <div className="border border-gray-200 bg-white py-4 px-6 rounded-md grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-4">
           {
            notificationsList.map((item, index) => {
                if( item.status === 'unread'){
                  readNotification(item?._id);
                }
              return(
                <div className={`p-2 border ${item?.type === 'auth' ? 'bg-emerald-50 border-emerald-300' : ''} rounded-md flex relative flex-row items-center justify-between`}>
                  { item?.status === 'unread' && <span className="absolute top-0 left-0 px-2 py-1 bg-emerald-600 mt-1 ms-1 rounded-full text-white text-xs">new</span> }
                  <div className="flex items-center space-x-3">
                    <img src={ImageItentifier(store?.logo)} className="w-10 h-10"/>
                    <div>
                      <h2 className="font-semibold text-lg">{item?.title}</h2>
                      <p className="font-normal">{item?.message}</p>
                      <p className="font-normal text-gray-400">{formatDate(item?.date)} {formatTime(item?.date)}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteNotification(item._id)} className="transition-all hover:bg-red-200 active:bg-red-300 px-2 rounded-full">
                    <FontAwesomeIcon icon={faRemove}/>
                  </button>
                </div>
              )
            })
           }
            {/* load more notifications */}
            <div className="flex items-center">
              {
                (notificationEnd === true || notificationsList.length === 0) ? <h2 className="text-lg mx-auto">No notifications</h2>
               : <button onClick={() => getNotifications()} className="m-3 mb-5 hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
              {loading ? <ProgressBar /> : 'Load more...'}
              </button>
              }
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

export default Notifications;
