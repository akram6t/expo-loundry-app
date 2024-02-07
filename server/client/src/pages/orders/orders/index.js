import React, { useEffect, useState } from "react";
import Navbar from "./../../../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import OrdersTable from "./OrdersTable";
import Paginate from "../../../components/Datatables/Paginate";
import filterDate from "../../../data/filterdate";
import { ordersData, ordersHeader } from "../../../data/orders";
import FilterDropDown from "../../../components/Other/FilterDropDown";
import Linking from "../../../components/Other/Linking";
import LINKINGDATA from "../../../data/linking_data";
import EntryOptions from "../../../components/Other/EntryOptions";
import SearchTable from "../../../components/Other/SearchTable";
import axios from 'axios';
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST } from "../../../utils/Constant";
import Appindicator from './../../../components/Other/AppIndicator';
import { SetTitle } from "../../../utils/SetTitle";

function Orders() {
  const [ordersList, setOrdersList] = useState([]);
  const [sidebarToggle] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState(filterDate[2]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [order_status, set_order_status] = useState(null);

  SetTitle("Orders");

  const getOrderStatus = async () => {
    set_order_status([]);
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
          set_order_status([...data]);
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

  const getOrders = async () => {
    setLoading(true);
    const params = {
      collection: Collections.ORDERS,
      filter: JSON.stringify({order_date: dateFilter.value()}),
      sort: JSON.stringify({order_date: DATE_ACC_DESC.DECENDING}),
      select: JSON.stringify({ items: 0, storeid: 0, storename: 0, payment_type: 0, _id: 0 })
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const {status, data, message} = response.data;
        if(status){
          setOrdersList([...data]);
        }
      } else {
        console.error('Error fetching orders:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching orders:', error);
    }
  };


  useEffect(() => {
    getOrders();
  }, [dateFilter]);


  const filteredData = ordersList.filter(item =>
    item.pickup_address?.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
    item.order_status?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
    item.order_id?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
    item.uid?.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

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

  if(order_status == null){
    return (
      <Appindicator/>
    )
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
              <h2 className="font-bold text-3xl">Orders</h2>
              <Linking currentPage="Orders" data={LINKINGDATA().ORDERS_PAGE} />
            </div>
            {/* <button className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-md"> */}
              {/* + Add New */}
            {/* </button> */}
          </div>
          {/* Topbar End */}

          <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">

            {/* FilterBar Start */}
            <div className="flex items-center justify-between pb-3">
              <EntryOptions onChange={(value) => setItemsPerPage(value)} />
              <div className="flex flex-wrap items-center justify-end gap-y-2 md:flex md:items-center md:gap-x-4">
                <SearchTable searchTerm={searchTerm} handleSearch={(e) => handleSearch(e)} />
                <FilterDropDown filter={dateFilter} setFilter={(value) => setDateFilter(value)} />
              </div>
            </div>
            {/* Filterbar End */}

            <OrdersTable
              loading={loading}
              dataHeader={ordersHeader}
              data={paginatedData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              ordersStatus={order_status}
            />
            <Paginate rows={paginatedData} setPage={(page) => handlePageChange(page)} currentPage={currentPage} itemsPerPage={itemsPerPage} totalPage={totalPages} loading={loading} listLength={filteredData.length} />
          </div>
        </div>
      </main>
    </>
  );
}

export default Orders;