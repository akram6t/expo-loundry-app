import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import Paginate from "../../components/Datatables/Paginate";
import filterDate from "../../data/filterdate";
import FilterDropDown from "../../components/Other/FilterDropDown";
import Linking from "../../components/Other/Linking";
import LINKINGDATA from "../../data/linking_data";
import EntryOptions from "../../components/Other/EntryOptions";
import SearchTable from "../../components/Other/SearchTable";
import { addonsHeader, addonsData } from "../../data/addons";
import AddonsTable from "./AddonsTable";
import { API_KEY, Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST } from "../../utils/Constant";
import axios from "axios";
import Modal from "../../components/Other/models/ModelDelete";
import ModalCreate from "../../components/Other/models/ModalCreate";
import { status } from "../../data/status";
import { SetTitle } from './../../utils/SetTitle';

function Addons() {
  const [addonsList, setAddonsList] = useState([]);
  const [sidebarToggle] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [CUModal, setCUModal] = useState({ status: false });

  SetTitle('Addons');

  const addData = {
    name: '',
    price: '',
    status: status[0].label
  }

  const collection = Collections.ADDONS;

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

  const getAddons = async () => {
    setAddonsList([]);
    setLoading(true);
    const params = {
      collection: Collections.ADDONS,
      sort: JSON.stringify({ date: DATE_ACC_DESC.ACCENDING }),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const { status, data, message } = response.data;
        if (status) {
          setAddonsList([...data]);
        }
      } else {
        console.error('Error fetching addons:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching addons:', error);
    }
  };


  useEffect(() => {
    getAddons();
  }, []);

  const filteredData = addonsList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <>
      <main className="h-full">
        <Navbar toggle={sidebarToggle} />

        {/* Main Content */}
        <div className="mainCard">

          {/* TopBar Start */}
          <div className="py-5 flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h2 className="font-bold text-3xl">Addons</h2>
              <Linking currentPage="Services" data={LINKINGDATA().ADDONS} />
            </div>
            <button onClick={() => setCUModal({ status: true, collection: collection, data: { ...addData } })} className="bg-emerald-600 transition-all hover:bg-emerald-700 active:bg-emerald-800 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-md">
              + Add New
            </button>
          </div>
          {/* Topbar End */}

          <div className="border w-full border-gray-200 bg-white py-4 px-6 rounded-md">

            {/* FilterBar Start */}
            <div className="flex items-center justify-between pb-3">
              <EntryOptions onChange={(value) => setItemsPerPage(value)} />
              <div className="flex flex-wrap items-center justify-end gap-y-2 md:flex md:items-center md:gap-x-4">
                <SearchTable searchTerm={searchTerm} handleSearch={(e) => handleSearch(e)} />
                {/* <FilterDropDown filter={dateFilter} setFilter={(value) => setDateFilter(value)}/> */}
              </div>
            </div>
            {/* Filterbar End */}

            <AddonsTable
              edit={(data) => setCUModal({ status: true, collection: collection, data: { ...data } })}
              onRefresh={() => getAddons()}
              collection={Collections.ADDONS}
              loading={loading}
              dataHeader={addonsHeader}
              data={paginatedData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
            <Paginate rows={paginatedData} setPage={(page) => handlePageChange(page)} currentPage={currentPage} itemsPerPage={itemsPerPage} totalPage={totalPages} loading={loading} listLength={filteredData.length} />
          </div>
        </div>
      </main>
      <ModalCreate title='Addon' onRefresh={() => getAddons()} isModalVisible={CUModal} setModalVisibility={(obj) => setCUModal(obj)}>
        {/* input start */}
        <div className="relative">
          <label className="font-bold text-sm text-gray-600">
            Addon Name
            <span className="text-red-600 font-bold ml-2">*</span>
          </label>
          <input
            value={CUModal?.data?.name}
            onChange={(e) => handleChangeValue('name', e.target.value)}
            id="inputWithIcon"
            type="text"
            name="inputWithIcon"
            className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Enter addon name"
          />
        </div>
        {/* input end */}
        {/* })} */}
        {/* input start */}
        <div className="relative">
          <label className="font-bold text-sm text-gray-600">
            Addon price
            <span className="text-red-600 font-bold ml-2">*</span>
          </label>
          <input
            value={CUModal?.data?.price}
            onChange={(e) => handleChangeValue('price', e.target.value)}
            id="inputWithIcon"
            type="number"
            name="inputWithIcon"
            className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Enter addon price"
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

export default Addons;