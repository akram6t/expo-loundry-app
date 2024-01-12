import React, { useEffect, useState } from "react";
import Navbar from "./../../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import ReportTable from "./OrdersReportTable";
import Paginate from "../../components/Datatables/Paginate";
import { orderReportData, orderReportHeader } from './../../data/order_report';
import Linking from "../../components/Other/Linking";
import LINKINGDATA from "../../data/linking_data";
import EntryOptions from "../../components/Other/EntryOptions";
import SearchTable from "../../components/Other/SearchTable";
// import { order_status } from "../../data/order_status";
import { DateInInput } from "../../utils/DateInInput";
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST } from "../../utils/Constant";
import axios from "axios";
import AppIndicator from "../../components/Other/AppIndicator";
import { SetTitle } from './../../utils/SetTitle';

function OrdersReport() {
    SetTitle('Orders Report');
    const [order_status, set_order_statuses] = useState(null);
    const [ordersReportList, setOrdersReportList] = useState([]);
    const [sidebarToggle] = useOutletContext();
    const [loading, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ dateFilter, setDateFilter ] = useState({
        $lte: DateInInput(new Date()),
        $gte: DateInInput(new Date()),
        order_status: 'all'
    });


    const filteredData = ordersReportList.filter(item =>
        item.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.amount.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.order_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pickup_address.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleChangeStatus = (value) => {
        setDateFilter({ ...dateFilter, order_status: value });
    }

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
        const query = dateFilter.order_status === 'all' ? {} : { order_status: dateFilter.order_status };
        setOrdersReportList([]);
        setLoading(true);
        const params = {
          collection: Collections.ORDERS,
          filter: JSON.stringify({order_date: { $lte:  dateFilter.$lt, $gte: dateFilter.$gte}, ...query}),
          sort: JSON.stringify({order_date: DATE_ACC_DESC.DECENDING}),
          select: JSON.stringify({ items: 0, storeid: 0, storename: 0, payment_type: 0, _id: 0 })
        }
        try {
          const response = await axios.get(URL_GET_LIST(params), HEADER_API);
    
          if (response.status === 200) {
            setLoading(false);
            const {status, data, message} = response.data;
            if(status){
                setOrdersReportList([...data]);
            }
          } else {
            setLoading(false);
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

            
      if(order_status == null){
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
                            <h2 className="font-bold text-3xl">Orders Report</h2>
                            <Linking currentPage="Orders Report" data={LINKINGDATA().ORDERS_PAGE} />
                        </div>
                    </div>
                    {/* Topbar End */}

                    {/* Report Picker */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <h2 className="bg-emerald-600 text-white p-2">Orders Details</h2>
                        <div className="p-3 items-center grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-4 gap-y-4">
                            <div className="">
                                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                                    Start Date <span className="text-red-600 text-md">*</span>
                                </label>
                                <input
                                value={dateFilter.$gte}
                                    id="defaultInput"
                                    type="date"
                                    onChange={(e) => setDateFilter({...dateFilter, '$gte': e.target.value})}
                                    name="defaultInput"
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                />
                            </div>
                            <div className="">
                                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                                    End Date <span className="text-red-600 text-md">*</span>
                                </label>
                                <input
                                    id="defaultInput"
                                    value={dateFilter.$lte}
                                    onChange={(e) => setDateFilter({...dateFilter, '$lte': e.target.value})}
                                    type="date"
                                    name="defaultInput"
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Default Input"
                                />
                            </div>
                            <div className="">
                            <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                                    Status <span className="text-red-600 text-md">*</span>
                                </label>
                            <select value={dateFilter.order_status} onChange={(e) => handleChangeStatus(e.target.value)} className="text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
                                <option className="m-2" value={'all'}>All Orders</option>
                                {
                                    order_status.map((item, index) => {
                                        return (
                                            <option value={item.tag} key={index}>{item.tag}</option>
                                        )
                                    })
                                }
                            </select>
                            </div>
                        </div>
                    </div>
                    {/*End Report Picker */}

                    <div className="mt-5 border w-full border-gray-200 bg-white py-4 px-6 rounded-md">

                        {/* FilterBar Start */}
                        <div className="flex items-center justify-between pb-3">
                            <EntryOptions onChange={(value) => setItemsPerPage(value)} />
                            <div className="flex flex-wrap items-center justify-end gap-y-2 md:flex md:items-center md:gap-x-4">
                                <SearchTable searchTerm={searchTerm} handleSearch={(e) => handleSearch(e)} />
                                {/* <FilterDropDown filter={dateFilter} setFilter={(value) => setDateFilter(value)}/> */}
                            </div>
                        </div>
                        {/* Filterbar End */}

                        <ReportTable
                            orderStatus={order_status}
                            loading={loading}
                            dataHeader={orderReportHeader}
                            data={paginatedData}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                        />
                        <Paginate rows={paginatedData} setPage={(page) => handlePageChange(page)} currentPage={currentPage} itemsPerPage={itemsPerPage} totalPage={totalPages} loading={loading} listLength={filteredData.length} />
                    </div>
                </div>
            </main>
        </>
    );
}

export default OrdersReport;