import React, { useEffect, useState } from "react";
import Navbar from "./../../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import Paginate from "../../components/Datatables/Paginate";
import Linking from "../../components/Other/Linking";
import LINKINGDATA from "../../data/linking_data";
import EntryOptions from "../../components/Other/EntryOptions";
import SearchTable from "../../components/Other/SearchTable";
import TimingTable from "./TimingTable";
import { orderTimingHeader, ordersDateData, ordersTimingData } from "../../data/date_time";
import Date from "./Date";
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST } from "../../utils/Constant";
import axios from "axios";
import { useSelector } from 'react-redux';
import ModalCreate from "../../components/Other/models/ModalCreate";
import { status } from "../../data/status";
import AppIndicator from "../../components/Other/AppIndicator";
import { SetTitle } from './../../utils/SetTitle';

function OrderDateTime() {
  SetTitle('Date & Time');
  const [ordersTimingList, setOrdersTimingList] = useState([]);
  const [sidebarToggle] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [CUModal, setCUModal] = useState({ status: false });
  const [store, setStore] = useState(null);

  const addData = {
    time: '',
    status: status[0].label
  }

  const collection = Collections.ORDERS_TIMING;

  const handleChangeValue = (name, value) => {
    let val = value;
    setCUModal({
      ...CUModal,
      data: {
        ...CUModal.data,
        [name]: val
      }
    })
  }

  const getStore = async () => {
    setLoading(true);
    const params = {
      collection: Collections.STORE,
      select: JSON.stringify({_id: 1, pickup_start_day: 1}),
      limit: 1
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const {status, data, message} = response.data;
        if(status){
          setStore(data[0]);
          // console.log(data);
          console.log(data);
        }
      } else {
        console.error('Error fetching general details:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching general details:', error);
    }
  };


  useEffect(() => {
    getStore();
  }, []);

  const getOrderTiming = async () => {
    setLoading(true);
    const params = {
      collection: Collections.ORDERS_TIMING,
      sort: JSON.stringify({date: DATE_ACC_DESC.ACCENDING}),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const {status, data, message} = response.data;
        if(status){
          setOrdersTimingList([...data]);
        }
      } else {
        console.error('Error fetching timing:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching timing:', error);
    }
  };


  useEffect(() => {
    getOrderTiming();
  }, []);

  const filteredData = ordersTimingList.filter(item =>
    item.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if(store == null){
    return <AppIndicator/>
  }

  return (
    <>
      <main className="h-full">
        <Navbar toggle={sidebarToggle} />

        {/* Main Content */}
        <div className="mainCard">

          {/* TopBar Start */}
          <div className="py-5 flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h2 className="font-bold text-3xl">Date & Time</h2>
              <Linking currentPage="Date & Time" data={LINKINGDATA().ADDONS} />
            </div>
          </div>
          {/* Topbar End */}

          <Date store={store} />

          <div className="h-5"></div>

          <div className="flex justify-end mb-3 pr-5">
          <button onClick={() => setCUModal({ status: true, collection: collection, data: { ...addData } })} className="bg-emerald-600 transition-all hover:bg-emerald-700 active:bg-emerald-800 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-md">
              + Add New
            </button>
          </div>
          <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">
            {/* FilterBar Start */}
            <div className="flex items-center justify-between pb-3">
              <EntryOptions itemsPerPage={itemsPerPage} onChange={(value) => setItemsPerPage(value)} />
              <div className="flex flex-wrap items-center justify-end gap-y-2 md:flex md:items-center md:gap-x-4">
                <SearchTable searchTerm={searchTerm} handleSearch={(e) => handleSearch(e)} />
                {/* <FilterDropDown filter={dateFilter} setFilter={(value) => setDateFilter(value)}/> */}
              </div>
            </div>
            {/* Filterbar End */}

            <TimingTable
              edit={(data) => setCUModal({ status: true, collection: collection, data: { ...data } })}
              loading={loading}
              onRefresh={() => getOrderTiming()}
              collection={Collections.ORDERS_TIMING}  
              dataHeader={orderTimingHeader}
              data={paginatedData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
            <Paginate rows={paginatedData} setPage={(page) => handlePageChange(page)} currentPage={currentPage} itemsPerPage={itemsPerPage} totalPage={totalPages} loading={loading} listLength={filteredData.length} />
          </div>
        </div>
      </main>

      <ModalCreate title='Order Timing' onRefresh={() => getOrderTiming()} isModalVisible={CUModal} setModalVisibility={(obj) => setCUModal(obj)}>
        {/* input start */}
        <div className="relative">
          <label className="font-bold text-sm text-gray-600">
            Time
            <span className="text-red-600 font-bold ml-2">*</span>
          </label>
          <input
            value={CUModal?.data?.time}
            onChange={(e) => handleChangeValue('time', e.target.value)}
            id="inputWithIcon"
            type="text"
            name="inputWithIcon"
            className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Enter Time"
          />
        </div>
        {/* input end */}

        {/* input start */}
        {
          CUModal?.data?._id &&
          <div className="relative">
            <label className="font-bold text-sm text-gray-600">
              Status
              <span className="text-red-600 font-bold ml-2">*</span>
            </label>
            <select
              value={CUModal?.data?.status}
              onChange={(e) => handleChangeValue('status', e.target.value)}
              className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
              {
                status.map(item => (
                  <option value={item.label}>{item.label}</option>
                ))
              }
            </select>

          </div>

        }
        {/* input end */}
      </ModalCreate>
    </>
  );
}

export default OrderDateTime;