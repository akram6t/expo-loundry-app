import React, { useEffect, useState } from "react";
import Navbar from "./../../components/Navbar/Index";
import { Collections, HEADER_API, URL_GET_LIST, URL_POST_DOCUMENT, routes, sampleIcon } from "../../utils/Constant";
import { useOutletContext, Link, useParams, useNavigate } from "react-router-dom";
import Linking from "../../components/Other/Linking";
import LINKING_DATA from "../../data/linking_data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import { status } from "../../data/status";
import ProgressBar from "../../components/Other/ProgressBar";
import axios from "axios";
import { ImageItentifier } from "../../utils/ImageIdentifier";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.config";
import AppIndicator from "../../components/Other/AppIndicator";
import { SetTitle } from './../../utils/SetTitle';

function CustomerDetails() {
  SetTitle('Edit Customer');
  const navigate = useNavigate();
  const [sidebarToggle] = useOutletContext();
  const { uid } = useParams();
  const [ loading, setLoading ] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    status: status[0].label
  })

  const getCustomer = async () => {
    setLoading(true);
    const params = {
      collection: Collections.USERS,
      filter: JSON.stringify({uid: uid}),
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const {status, data, message} = response.data;
        if(status){
          console.log(data[0]);
          setUser(data[0]);
        }
      } else {
        console.error('Error fetching customers:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching customers:', error);
    }
  };


  useEffect(() => {
    if(uid){
      getCustomer();
    }
  }, [uid]);

  const handleChangeValue = (name, value) => {
    setUser({
      ...user,
      [name]: value
    })
  }

  const submitData = async (uid) => {
    if(user?.name?.trim() === ""){
      toast.error('Name is empty');
      return;
    }
    if(user?.mobile?.trim() === ""){
      toast.error('Mobile is empty');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(URL_POST_DOCUMENT, {
        collection: Collections.USERS,
        data: {
          uid: uid || user?.uid,
          ...user
        }
      }, HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const { status } = response.data;
        if (status) {
          navigate(-1);
          if(user?._id){
            toast.success('Updated...');
          }else{
            toast.success('Account Created...');
          }
        }
      } else {
        toast.error(response.statusText);
        console.error(`Error crud: ORDERS`, response.statusText);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.toString());
      console.error(`Error crud: ORDERS`, error);
    }
  }

   function createUser() {
     if(user?.email?.trim() === "" || user?.password?.trim() === ""){
       toast.error('Email or password is empty');
       return;
      }
      if(user?.name?.trim() === ""){
        toast.error('Name is empty');
        return;
      }
      if(user?.mobile?.trim() === ""){
        toast.error('Mobile is empty');
        return;
      }
      setLoading(true);
      createUserWithEmailAndPassword(auth, user?.email?.trim(), user?.password?.trim())
      .then((userCredential) => {
        setLoading(false);
        // Signed in 
        const u = userCredential.user;
        submitData(u.uid);
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.message;
        console.log(errorMessage);
        toast.error(errorMessage);
      });
  }

  if(uid && !user?._id){
      return <AppIndicator/>
  }
  

  return (
    <>
      <main className="h-full">
        <Navbar toggle={sidebarToggle} />

        {/* Main Content */}
        <div className="mainCard">
          <div className="py-5 flex items-center justify-between">
            <span className="flex flex-col space-y-2">
              <h2 className="font-bold text-3xl">Customer Details</h2>
              <Linking data={LINKING_DATA().CUSTOMER_DETAILS_PAGE} currentPage={'Akram Khan'} />
            </span>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <h2 className="bg-emerald-600 text-white p-2">Orders Details</h2>
            <div className="p-3 items-center grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-4">


              <div className="">
                <img src={ImageItentifier(user?.profile || sampleIcon)} className="mx-auto shadow w-24 h-24 rounded-full"></img>
              </div>

              {/* input start */}
              <div className="">
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  Email
                  <span className="text-red-600 text-md">*</span>
                </label>
                <input 
                disabled={user?.uid ? true : false}
                value={user?.email}
                onChange={(e) => handleChangeValue('email', e.target.value)}
                  id="defaultInput"
                  type="text"
                  name="defaultInput"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Customer Name"
                />
              </div>
              {/* input end */}

              {/* input start */}
              <div className="relative">
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  Password
                  <span className="text-red-600 text-md">*</span>
                </label>

                {/* <div className="inline-flex items-center justify-center absolute left-0 top-[0.85rem] h-full w-10 text-gray-400">
                  {/* <FontAwesomeIcon icon={faPhoneI} />  */}
                {/* <span>+91 </span> */}
                {/* </div>  */}
                <input
                disabled={user?.uid ? true : false}
                  value={user?.password}
                  onChange={(e) => handleChangeValue('password', e.target.value)}
                  id="inputWithIcon"
                  type="text"
                  name="inputWithIcon"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Phone Number"
                />
              </div>
              {/* input end */}

              {/* input start */}
              <div className="">
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  Customer Name <span className="text-red-600 text-md">*</span>
                </label>
                <input
                  // value={dateFilter.start}
                  value={user?.name}
                  onChange={(e) => handleChangeValue('name', e.target.value)}
                  id="defaultInput"
                  type="text"
                  // onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                  name="defaultInput"
                  // onChange={(e) => setEmail(e.target.value)}
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Customer Name"
                />
              </div>
              {/* input end */}

              {/* input start */}
              <div className="relative">
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  Phone Number
                  <span className="text-red-600 text-md">*</span>
                </label>

                <div className="inline-flex items-center justify-center absolute left-0 top-[0.85rem] h-full w-10 text-gray-400">
                  {/* <FontAwesomeIcon icon={faPhoneI} />  */}
                  <span>+91 </span>
                </div>
                <input
                  id="inputWithIcon"
                  value={user?.mobile}
                  onChange={(e) => handleChangeValue('mobile', e.target.value)}
                  type="text"
                  name="inputWithIcon"
                  // onChange={(e) => setEmail(e.target.value)}
                  className="text-md placeholder-gray-500 pl-10 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Phone Number"
                />
              </div>
              {/* input end */}

              {/* input status start */}
              <div>
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  Status <span className="text-red-600 text-md">*</span>
                </label>
                <select value={user?.status}
                  onChange={(e) => handleChangeValue('status', e.target.value)} className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
                  {
                    status.map((item, index) => (
                      <option key={index} value={item.label}>{item.label}</option>
                    ))
                  }
                </select>
              </div>
              {/* input status end */}

            </div>

                          
            <button onClick={() => user?.uid ? submitData(null) : createUser()} className="m-3 mb-5 hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
              <FontAwesomeIcon className="mr-2" icon={!loading && faSave}/>{ loading ? <ProgressBar/> : uid ? 'Update' : 'Submit'}
            </button>


          </div>


        </div>
      </main>
    </>
  );
}

export default CustomerDetails;