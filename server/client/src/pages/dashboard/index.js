import React, { useEffect, useState } from "react";
import StatisticWidget from "../../components/Widget/Statistic.jsx";
import DashboardHeader from "../../components/Other/DashboardHeader.jsx";
import ScrolledCard from "../../components/Widget/ScrolledCard.jsx";
import { useOutletContext } from "react-router-dom";
import PieChart from "../../components/Widget/PieChart.jsx";
import Footer from "../../components/Footer.jsx";
import axios from "axios";
import { Collections, HEADER_API, URL_GET_LIST, URL_GET_NOTIFICATION_COUNT, URL_GET_ORDERS__STATUS_COUNT, profileIcon } from "../../utils/Constant.js";
import AppIndicator from "../../components/Other/AppIndicator.jsx";
import { SetTitle } from './../../utils/SetTitle';

function Dashboard() {
  SetTitle('Dashboard');
  const [loading, setLoading] = useState(false);
  const [ordersStatusList, setOrdersStatusList] = useState(null);
  const [ unread, setUnread ] = useState(true);

  const get_orders_status_count = async (sList) => {
    setLoading(true);
    try {
      const response = await axios.get(URL_GET_ORDERS__STATUS_COUNT, HEADER_API);

      if (response.status === 200) {
        // console.log(response.data);
        setLoading(false);
        const { status, data, message } = response.data;
        if (status) {
          handle_count_status(data, sList);
          // setOrderStatus([...status]);
          // console.log(orderStatus);
        }
      } else {
        console.error('Error fetching expenses:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching expenses:', error);
    }
  };
  
    const getOrderStatus = async () => {
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
            setOrdersStatusList([...data]);
            get_orders_status_count(data);
          }
        } else {
          console.error('Error fetching orders status:', response.statusText);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching orders status:', error);
      }
    };


  function handle_count_status(data, sList){
    const st = sList.map((status) => {
      // Find corresponding entry in statusCount
      const countEntry = data.find((count) => count._id === status.tag);
      
      let obj = {...status};
      // Update count in statuses or set to 0 if not found
      obj.count = countEntry ? countEntry.count : 0;
      return obj;
    });
    setOrdersStatusList(st);
  }


  useEffect(() => {
    getOrderStatus();
  }, []);

  function getNotificationsCount() {
    axios.get(URL_GET_NOTIFICATION_COUNT, HEADER_API)
      .then((result, err) => {
        const { status, data } = result.data;
        if (status) {
          setUnread(typeof data === 'string' ? parseInt(data) : data);
        }
      }).catch(err => {
        // setMessage(`${err}`);
        // setSnackbar(true);
        console.log(err);
      })
  }

  useEffect(() => {
    getNotificationsCount();
  },[]);

  const avatar = profileIcon;
  const [sidebarToggle] = useOutletContext();


  if(ordersStatusList == null){
    return<AppIndicator/>
  }


  return (
    <>
    {/* <ColorPicker color={bg} onChange={(color) => setBg(color)}/> */}
      <main className="h-full">
        {/* Welcome Header */}
        <DashboardHeader
          unread={unread}
          toggle={sidebarToggle}
          avatar={avatar}
          user={{ name: "Dashboard" }}
        />

        {/* OS Kredit */}
        <div className="px-2 mx-auto mainCard">
          {/* <h1 className="text-slate-500 pb-3 text-base md:text-lg">
            Pencapaian OS Kredit
          </h1> */}

          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-8 gap-y-8">
            {ordersStatusList?.map((item, index) => (
              <ScrolledCard key={index} item={item} />
            ))}
          </div>

          <div className="lg:w-full w-[1024px] overflow-hidden flex flex-row justify-between text-slate-700 gap-2 lg:max-h-screen overflow-x-auto whitespace-nowrap"></div>
        </div>

        {/* Laba */}
        <div className="px-2 mx-auto mainCard">
          <div className="w-full gap-x-10 gap-y-10 flex flex-col-reverse lg:flex-row justify-between  overflow-hidden text-slate-700">
            <StatisticWidget className="flex-1 h-fit bg-white" />
            {/* < className="flex-1 h-fit bg-white" /> */}
            {/* <TodayOrders className="w-[60%] overflow-hidden bg-white border rounded-md" data={ordersData} dataHeader={ordersHeader}/> */}
            {/* <div className="flex-1">Today's Delivery</div> */}
            <PieChart data={ordersStatusList} className="bg-white" />
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default Dashboard;
