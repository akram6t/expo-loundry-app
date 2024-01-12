import React, { useEffect, useState } from "react";
import Navbar from "./../../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import Paginate from "../../components/Datatables/Paginate";
import filterDate from "../../data/filterdate";
import FilterDropDown from "../../components/Other/FilterDropDown";
import Linking from "../../components/Other/Linking";
import LINKINGDATA from "../../data/linking_data";
import EntryOptions from "../../components/Other/EntryOptions";
import SearchTable from "../../components/Other/SearchTable";
import { bannersHeader } from "../../data/banners";
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST, sampleIcon } from "../../utils/Constant";
import axios from "axios";
import BannerTable from "./BannersTable";
import { status } from "../../data/status";
import { SetTitle } from './../../utils/SetTitle';
import ModalMedia from "../../components/Other/models/ModalMedia";
import ModalCreate from "../../components/Other/models/ModalCreate";
import { ImageItentifier } from "../../utils/ImageIdentifier";

function Banners() {
  const [showMedia, setShowMedia] = useState(false);
  const [bannersList, setBannersList ] = useState([]);
  const [sidebarToggle] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [CUModal, setCUModal] = useState({ status: false });

  SetTitle('Banners');

  const addData = {
    image: sampleIcon,
    status: status[0].label
  }

  const collection = Collections.BANNERS;

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

  
  const getBanners = async () => {
    setBannersList([]);
    setLoading(true);
    const params = {
      collection: Collections.BANNERS,
      sort: JSON.stringify({date: DATE_ACC_DESC.ACCENDING}),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const {status, data, message} = response.data;
        if(status){
          setBannersList([...data]);
        }
      } else {
        console.error('Error fetching expenses:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching expenses:', error);
    }
  };


  useEffect(() => {
    getBanners();
  }, []);

  const filteredData = bannersList;

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
              <h2 className="font-bold text-3xl">Banners</h2>
              <Linking currentPage="Banners" data={LINKINGDATA().EXPENSES}/>
            </div>
            <button onClick={() => setCUModal({ status: true, collection: collection, data: { ...addData } })} className="bg-emerald-600 transition-all hover:bg-emerald-700 active:bg-emerald-800 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-md">
              + Add New
            </button>
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

            <BannerTable
              edit={(data) => setCUModal({ status: true, collection: collection, data: { ...data } })}
              onRefresh={() => getBanners()}
              collection={Collections.BANNERS} 
              loading={loading}
              dataHeader={bannersHeader}
              data={paginatedData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
            <Paginate rows={paginatedData} setPage={(page) => handlePageChange(page)} currentPage={currentPage} itemsPerPage={itemsPerPage} totalPage={totalPages} loading={loading} listLength={filteredData.length} />
          </div>
        </div>
      </main>

      <ModalCreate dismissable={false} title='banner' onRefresh={() => getBanners()} isModalVisible={CUModal} setModalVisibility={(obj) => setCUModal(obj)}>
        {/* input start */}
        <div className="relative my-2">
          <label className="font-bold text-sm text-gray-600">
            Icon
            <span className="text-red-600 font-bold ml-2">*</span>
          </label>
          <div className="flex flex-row space-x-2 items-center">
            <img alt="icon" className="w-32 object-contain h-20 border rounded" src={ImageItentifier(CUModal?.data?.image || addData.image)}></img>
            <button type="button" onClick={() => setShowMedia(true)} className="bg-gray-600 transition-all hover:bg-gray-700 active:bg-gray-800 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-md">
              Change
            </button>
          </div>
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
      <ModalMedia onChangeMedia={(item) => { setCUModal({ ...CUModal, data: { ...CUModal.data, image: item.media } }); setShowMedia(false) }} showMedia={showMedia} setShowMedia={setShowMedia} />
    </>
  );
}

export default Banners;