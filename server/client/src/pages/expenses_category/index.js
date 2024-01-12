import React, { useEffect, useState } from "react";
import Navbar from "./../../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";
import Paginate from "../../components/Datatables/Paginate";
import filterDate from "../../data/filterdate";
import Linking from "../../components/Other/Linking";
import LINKINGDATA from "../../data/linking_data";
import EntryOptions from "../../components/Other/EntryOptions";
import SearchTable from "../../components/Other/SearchTable";
import { expensesCategoryHeader, expensesCategoryData, categoryType } from "../../data/expenses";
import ExpensesCategoryTable from "./CategoryTable";
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST } from "../../utils/Constant";
import axios from "axios";
import { status } from "../../data/status";
import ModalCreate from "../../components/Other/models/ModalCreate";
import { SetTitle } from './../../utils/SetTitle';

function ExpensesCategory() {
  SetTitle('Expenses Category');
  const [expensesCategoryList, setExpensesCategoryList ] = useState([]);
  const [sidebarToggle] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState(filterDate[2]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [CUModal, setCUModal] = useState({ status: false });

  const addData = {
    category: '',
    type: categoryType[0].label,
    status: status[0].label
  }

  const collection = Collections.EXPENSES_CATEGORY;

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

  const getExpensesCategory = async () => {
    setExpensesCategoryList([]);
    setLoading(true);
    const params = {
      collection: Collections.EXPENSES_CATEGORY,
      sort: JSON.stringify({date: DATE_ACC_DESC.ACCENDING}),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const {status, data, message} = response.data;
        if(status){
          setExpensesCategoryList([...data]);
        }
      } else {
        console.error('Error fetching expenses category:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching expenses category:', error);
    }
  };


  useEffect(() => {
    getExpensesCategory();
  }, []);

  const filteredData = expensesCategoryList.filter(item =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()));

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
              <h2 className="font-bold text-3xl">Expenses Category</h2>
              <Linking currentPage="Category" data={LINKINGDATA().EXPENSES_CATEGORY}/>
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

            <ExpensesCategoryTable
            edit={(data) => setCUModal({ status: true, collection: collection, data: { ...data } })}
            onRefresh={() => getExpensesCategory()}
            collection={Collections.EXPENSES_CATEGORY} 
              loading={loading}
              dataHeader={expensesCategoryHeader}
              data={paginatedData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
            <Paginate rows={paginatedData} setPage={(page) => handlePageChange(page)} currentPage={currentPage} itemsPerPage={itemsPerPage} totalPage={totalPages} loading={loading} listLength={filteredData.length} />
          </div>
        </div>
      </main>

      <ModalCreate title='Expense Category' onRefresh={() => getExpensesCategory()} isModalVisible={CUModal} setModalVisibility={(obj) => setCUModal(obj)}>
        {/* input start */}
        <div className="relative">
          <label className="font-bold text-sm text-gray-600">
            Category
            <span className="text-red-600 font-bold ml-2">*</span>
          </label>
          <input
            value={CUModal?.data?.category}
            onChange={(e) => handleChangeValue('category', e.target.value)}
            id="inputWithIcon"
            type="text"
            name="inputWithIcon"
            className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Enter category"
          />
        </div>
        {/* input end */}
        {/* input end */}
        <div className="relative">
            <label className="font-bold text-sm text-gray-600">
              Type
              <span className="text-red-600 font-bold ml-2">*</span>
            </label>
            <select
              value={CUModal?.data?.type}
              onChange={(e) => handleChangeValue('type', e.target.value)}
              className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
              {
                categoryType.map(item => (
                  <option value={item.label}>{item.label}</option>
                ))
              }
            </select>

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

export default ExpensesCategory;