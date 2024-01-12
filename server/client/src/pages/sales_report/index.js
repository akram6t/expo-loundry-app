import React, { useEffect, useState } from "react";
import Navbar from "./../../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import Paginate from "../../components/Datatables/Paginate";
import { salesReportHeader, salesReportData } from './../../data/sales_report';
import Linking from "../../components/Other/Linking";
import LINKINGDATA from "../../data/linking_data";
import EntryOptions from "../../components/Other/EntryOptions";
import SearchTable from "../../components/Other/SearchTable";
import { order_status } from "../../data/order_status";
import { DateInInput } from "../../utils/DateInInput";
import SalesReportTable from "./SalesReportTable";
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST } from "../../utils/Constant";
import axios from "axios";
import { SetTitle } from './../../utils/SetTitle';


function SalesReport() {
    SetTitle('Sales Report');
    const [salesReportList, setSalesReportList] = useState([]);
    const [sidebarToggle] = useOutletContext();
    const [loading, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ dateFilter, setDateFilter ] = useState({
        $lte: DateInInput(new Date()),
        $gte: DateInInput(new Date()),
    });

    const filteredData = salesReportList.filter(item =>
        item?.order_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.pickup_address?.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    const getOrders = async () => {
        setSalesReportList([]);
        setLoading(true);
        const params = {
          collection: Collections.ORDERS,
          filter: JSON.stringify({order_date: { $lte:  dateFilter.$lt, $gte: dateFilter.$gte}}),
          sort: JSON.stringify({order_date: DATE_ACC_DESC.DECENDING}),
          select: JSON.stringify({ items: 0, storeid: 0, storename: 0, payment_type: 0, _id: 0 })
        }
        try {
          const response = await axios.get(URL_GET_LIST(params), HEADER_API);
    
          if (response.status === 200) {
            setLoading(false);
            const {status, data, message} = response.data;
            if(status){
                setSalesReportList([...data]);
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

    return (
        <>
            <main className="h-full">
                <Navbar toggle={sidebarToggle} />

                {/* Main Content */}
                <div className="mainCard">

                    {/* TopBar Start */}
                    <div className="py-5 flex items-center justify-between">
                        <div className="flex flex-col gap-y-2">
                            <h2 className="font-bold text-3xl">Sales Report</h2>
                            <Linking currentPage="Sales Report" data={LINKINGDATA().ORDERS_PAGE} />
                        </div>
                    </div>
                    {/* Topbar End */}

                    {/* Report Picker */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <h2 className="bg-emerald-600 text-white p-2">Sales Details</h2>
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

                        <SalesReportTable
                            loading={loading}
                            dataHeader={salesReportHeader}
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

export default SalesReport;