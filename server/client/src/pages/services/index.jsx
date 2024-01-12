import React, { useEffect, useState } from "react";
import Navbar from "./../../components/Navbar/Index";
import { Link, useOutletContext } from "react-router-dom";
import Paginate from "../../components/Datatables/Paginate";
import filterDate from "../../data/filterdate";
import FilterDropDown from "../../components/Other/FilterDropDown";
import Linking from "../../components/Other/Linking";
import LINKINGDATA from "../../data/linking_data";
import EntryOptions from "../../components/Other/EntryOptions";
import SearchTable from "../../components/Other/SearchTable";
import ServicesTable from "./ServicesTable";
import { servicesHeader, servicesData } from "../../data/services";
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST, routes } from "../../utils/Constant";
import axios from "axios";
import { SetTitle } from './../../utils/SetTitle';

function Services() {
  SetTitle('Services');
  const [servicesList, setServicesList ] = useState([]);
  const [sidebarToggle] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState(filterDate[2]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const getServices = async () => {
    setLoading(true);
    const params = {
      collection: Collections.PRODUCTS,
      sort: JSON.stringify({date: DATE_ACC_DESC.ACCENDING}),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const {status, data, message} = response.data;
        if(status){
          setServicesList([...data]);
        }
      } else {
        console.error('Error fetching services:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching services:', error);
    }
  };


  useEffect(() => {
    getServices();
  }, []);

  const filteredData = servicesList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.image.toLowerCase().includes(searchTerm.toLowerCase()))

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

  return (
    <>
      <main className="h-full">
        <Navbar toggle={sidebarToggle} />

        {/* Main Content */}
        <div className="mainCard">

          {/* TopBar Start */}
          <div className="py-5 flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h2 className="font-bold text-3xl">Services</h2>
              <Linking currentPage="Services" data={LINKINGDATA().SERVICES_PAGE}/>
            </div>
            <Link to={routes.SERVICES_CREATE} className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-md">
              + Add New
            </Link>
          </div>
          {/* Topbar End */}

          <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">

            {/* FilterBar Start */}
            <div className="flex items-center justify-between pb-3">
              <EntryOptions onChange={(value) => setItemsPerPage(value)}/>
              <div className="flex flex-wrap items-center justify-end gap-y-2 md:flex md:items-center md:gap-x-4">
                <SearchTable searchTerm={searchTerm} handleSearch={(e) => handleSearch(e)}/>
                {/* <FilterDropDown filter={dateFilter} setFilter={(value) => setDateFilter(value)}/> */}
              </div>
            </div>
            {/* Filterbar End */}

            <ServicesTable
              loading={loading}
              onRefresh={() => getServices()}
              collection={Collections.PRODUCTS}  
              dataHeader={servicesHeader}
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

export default Services;