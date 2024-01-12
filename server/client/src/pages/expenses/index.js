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
import { ExpensesHeader, ExpensesData, taxIncluded, categoryType } from "../../data/expenses";
import ExpensesTable from "./ExpensesTable";
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST } from "../../utils/Constant";
import axios from "axios";
import { paymentMethods } from "../../data/payment_method";
import { status } from "../../data/status";
import ModalCreate from "../../components/Other/models/ModalCreate";
import { SetTitle } from './../../utils/SetTitle';

function Expenses() {
  SetTitle('Expenses');
  const [expensesList, setExpensesList ] = useState([]);
  const [expensesCategoryList, setExpensesCategoryList ] = useState([]);
  const [sidebarToggle] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState(filterDate[2]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [CUModal, setCUModal] = useState({ status: false });

  const addData = {
    towards: '',
    amount: '',
    taxIncluded: taxIncluded[1].label,
    paymentMethod: paymentMethods[0],
    taxPercentage: '0'
  }

  const collection = Collections.EXPENSES;

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
          addData['towards'] = data[0].category;
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
  
  const getExpenses = async () => {
    setLoading(true);
    const params = {
      collection: Collections.EXPENSES,
      sort: JSON.stringify({date: DATE_ACC_DESC.DECENDING}),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const {status, data, message} = response.data;
        if(status){
          setExpensesList([...data]);
          
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
    getExpenses();
  }, []);

  const filteredData = expensesList.filter(item =>
    item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.towards.toLowerCase().includes(searchTerm.toLowerCase()));

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
              <h2 className="font-bold text-3xl">Expenses</h2>
              <Linking currentPage="Expenses" data={LINKINGDATA().EXPENSES}/>
            </div>
            <button onClick={() => setCUModal({ status: true, collection: collection, data: { ...addData, towards: expensesCategoryList[0].category }})} className="bg-emerald-600 transition-all hover:bg-emerald-700 active:bg-emerald-800 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-md">
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

            <ExpensesTable
              edit={(data) => setCUModal({ status: true, collection: collection, data: { ...data, towards: expensesCategoryList.find(item => item.category === data.towards).category }})}
              onRefresh={() => getExpenses()}
              collection={Collections.EXPENSES}
              loading={loading}
              dataHeader={ExpensesHeader}
              data={paginatedData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
            <Paginate rows={paginatedData} setPage={(page) => handlePageChange(page)} currentPage={currentPage} itemsPerPage={itemsPerPage} totalPage={totalPages} loading={loading} listLength={filteredData.length} />
          </div>
        </div>
      </main>

      <ModalCreate title='Expense' onRefresh={() => getExpenses()} isModalVisible={CUModal} setModalVisibility={(obj) => setCUModal(obj)}>
       {/* input end */}
       <div className="relative">
            <label className="font-bold text-sm text-gray-600">
              Category Name
              <span className="text-red-600 font-bold ml-2">*</span>
            </label>
            <select
              value={CUModal?.data?.category}
              onChange={(e) => handleChangeValue('towards', e.target.value)}
              className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
              {
                expensesCategoryList.map(item => (
                  <option value={item.category}>{item.category}</option>
                ))
              }
            </select>
          </div>
              {/* input end */}
        {/* input start */}
        <div className="relative">
          <label className="font-bold text-sm text-gray-600">
            Amount
            {/* <span className="text-red-600 font-bold ml-2">*</span> */}
          </label>
          <input
            value={CUModal?.data?.amount}
            onChange={(e) => handleChangeValue('amount', e.target.value)}
            id="inputWithIcon"
            type="number"
            name="inputWithIcon"
            className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Enter amount"
          />
        </div>
        {/* input end */}

        {/* input end */}
        <div className="relative">
            <label className="font-bold text-sm text-gray-600">
              PaymentMethod
              <span className="text-red-600 font-bold ml-2">*</span>
            </label>
            <select
              value={CUModal?.data?.paymentMethod}
              onChange={(e) => handleChangeValue('paymentMethod', e.target.value)}
              className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
              {
                paymentMethods.map(item => (
                  <option value={item}>{item}</option>
                ))
              }
            </select>
          </div>
              {/* input end */}
                      {/* input end */}
        <div className="relative">
            <label className="font-bold text-sm text-gray-600">
              TaxIncluded
              <span className="text-red-600 font-bold ml-2">*</span>
            </label>
            <select
              value={CUModal?.data?.taxIncluded}
              onChange={(e) => handleChangeValue('taxIncluded', e.target.value)}
              className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
              {
                taxIncluded.map(item => (
                  <option value={item.label}>{item.label}</option>
                ))
              }
            </select>
          </div>
              {/* input end */}
                     {/* input start */}
              { CUModal?.data?.taxIncluded === taxIncluded[0].label ? 
        <div className="relative">
          <label className="font-bold text-sm text-gray-600">
            TaxPercentage
            {/* <span className="text-red-600 font-bold ml-2">*</span> */}
          </label>
          <input
            value={CUModal?.data?.taxPercentage}
            onChange={(e) => handleChangeValue('taxPercentage', e.target.value)}
            id="inputWithIcon"
            type="number"
            name="inputWithIcon"
            className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
            placeholder="Enter taxPercentage"
          />
        </div>
        : null
      }
        {/* input end */}

      </ModalCreate>
    </>
  );
}

export default Expenses;