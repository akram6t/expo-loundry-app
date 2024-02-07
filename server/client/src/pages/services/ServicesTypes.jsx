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
import { servicesTypesHeader, servicesTypesData, service_base } from "../../data/services";
import ServicesTypeTable from "./ServicesTypesTable";
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST, sampleIcon } from "../../utils/Constant";
import axios from "axios";
import ModalMedia from "../../components/Other/models/ModalMedia";
import { status } from "../../data/status";
import ModalCreate from "../../components/Other/models/ModalCreate";
import { ImageItentifier } from "../../utils/ImageIdentifier";
import ModalColorPicker from "../../components/Other/models/ModalColorPicker";
import { SetTitle } from './../../utils/SetTitle';

function ServicesTypes() {
  SetTitle('Services Types');
  const [showMedia, setShowMedia] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [servicesTypeList, setServicesTypeList] = useState([]);
  const [sidebarToggle] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState(filterDate[2]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [CUModal, setCUModal] = useState({ status: false });

  const addData = {
    image: sampleIcon,
    name: '',
    color: '#FEFFEC',
    price: 0,
    type: service_base[0],
    time: '42 Hrs.',
    status: status[0].label
  }

  const collection = Collections.SERVICES;

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

  const getServicesStypes = async () => {
    setServicesTypeList([]);
    setLoading(true);
    const params = {
      collection: Collections.SERVICES,
      sort: JSON.stringify({ date: DATE_ACC_DESC.ACCENDING }),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const { status, data, message } = response.data;
        if (status) {
          setServicesTypeList([...data]);
        }
      } else {
        console.error('Error fetching services types:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching services types:', error);
    }
  };


  useEffect(() => {
    getServicesStypes();
  }, []);

  const filteredData = servicesTypeList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.image.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <>
      <main className="h-full">
        <Navbar toggle={sidebarToggle} />

        {/* Main Content */}
        <div className="mainCard">

          {/* TopBar Start */}
          <div className="py-5 flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h2 className="font-bold text-3xl">Services Types</h2>
              <Linking currentPage="Types" data={LINKINGDATA().SERVICES_TYPE_PAGE} />
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

            <ServicesTypeTable
              edit={(data) => setCUModal({ status: true, collection: collection, data: { ...data } })}
              onRefresh={() => getServicesStypes()}
              collection={Collections.SERVICES}
              loading={loading}
              dataHeader={servicesTypesHeader}
              data={paginatedData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
            <Paginate rows={paginatedData} setPage={(page) => handlePageChange(page)} currentPage={currentPage} itemsPerPage={itemsPerPage} totalPage={totalPages} loading={loading} listLength={filteredData.length} />
          </div>
        </div>
      </main>
      <ModalCreate dismissable={false} title='Service Type' onRefresh={() => getServicesStypes()} isModalVisible={CUModal} setModalVisibility={(obj) => setCUModal(obj)}>
        {/* input start */}
        <div className="relative my-2">
          <label className="font-bold text-sm text-gray-600">
            Icon
            <span className="text-red-600 font-bold ml-2">*</span>
          </label>
          <div className="flex flex-row space-x-2 items-center">
            <img alt="icon" className="w-20 h-20 border rounded" src={ImageItentifier(CUModal?.data?.image || addData.image)}></img>
            <button type="button" onClick={() => setShowMedia(true)} className="bg-gray-600 transition-all hover:bg-gray-700 active:bg-gray-800 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-md">
              Change
            </button>
          </div>
        </div>
        {/* input end */}
        {/* input start */}
        <div className="relative">
          <label className="font-bold text-sm text-gray-600">
            Service Name
            <span className="text-red-600 font-bold ml-2">*</span>
          </label>
          <input
            value={CUModal?.data?.name}
            onChange={(e) => handleChangeValue('name', e.target.value)}
            id="inputWithIcon"
            type="text"
            name="inputWithIcon"
            className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Enter service name"
          />
        </div>
        {/* input end */}

        {/* price and bass */}
        <div className="flex gap-2">
          {/* input start */}
          <div className="relative flex-1">
            <label className="font-bold text-sm text-gray-600">
              Price /
              <span className="text-red-600 font-bold ml-2">*</span>
            </label>
            <input
              value={CUModal?.data?.price}
              onChange={(e) => handleChangeValue('price', e.target.value)}
              id="inputWithIcon"
              type="number"
              name="inputWithIcon"
              className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
              placeholder="Enter Price"
            />
          </div>
          {/* input end */}

          {/* select start */}
          <div className="relative flex-1">
            <label className="font-bold text-sm text-gray-600">
              Base
              <span className="text-red-600 font-bold ml-2">*</span>
            </label>
            <select
              value={CUModal?.data?.type}
              onChange={(e) => handleChangeValue('type', e.target.value)}
              className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
              {
                service_base.map(item => (
                  <option value={item}>{item}</option>
                ))
              }
            </select>
          </div>
          {/* select end */}
        </div>
        {/* input start */}
        <div className="relative flex-1">
          <label className="font-bold text-sm text-gray-600">
            Service Time
            <span className="text-red-600 font-bold ml-2">*</span>
          </label>
          <input
            value={CUModal?.data?.time}
            onChange={(e) => handleChangeValue('time', e.target.value)}
            id="inputWithIcon"
            type="text"
            name="inputWithIcon"
            className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Enter Service Time ex. - 42 Hrs."
          />
        </div>
        {/* input end */}

        {/* input start */}
        <div className="relative my-2">
          <label className="font-bold text-sm text-gray-600">
            Color
            <span className="text-red-600 font-bold ml-2">*</span>
          </label>
          <div className="flex flex-row space-x-2 items-center">
            <div style={{ backgroundColor: CUModal?.data?.color || addData.color }} className={`border rounded shadow-lg p-2`}>{CUModal?.data?.color}</div>
            <button type="button" onClick={() => setShowColorPicker(true)} className="bg-gray-600 transition-all hover:bg-gray-700 active:bg-gray-800 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-md">
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
      <ModalColorPicker show={showColorPicker} setShow={setShowColorPicker} color={CUModal?.data?.color} onChangeColor={(color) => handleChangeValue('color', color)} />
      <ModalMedia onChangeMedia={(item) => { setCUModal({ ...CUModal, data: { ...CUModal.data, image: item.media } }); setShowMedia(false) }} showMedia={showMedia} setShowMedia={setShowMedia} />
    </>
  );
}

export default ServicesTypes;