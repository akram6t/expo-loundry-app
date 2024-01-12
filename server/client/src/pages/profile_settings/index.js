import React, { useEffect, useState } from "react";
import Navbar from "./../../components/Navbar/Index";
import { Collections, HEADER_API, URL_GET_LIST, URL_POST_DOCUMENT, routes } from "../../utils/Constant";
import { useOutletContext, Link, useParams } from "react-router-dom";
import Linking from "../../components/Other/Linking";
import LINKING_DATA from "../../data/linking_data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import { status } from "../../data/status";
import axios from "axios";
import AppIndicator from "../../components/Other/AppIndicator";
import ProgressBar from "../../components/Other/ProgressBar";
import { toast } from "react-toastify";
import { SetTitle } from './../../utils/SetTitle';

function ProfileSettings() {
  SetTitle('Profile Setting');
  const [sidebarToggle] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [managePassword, setManagepassword] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const getAdmin = async () => {
    setLoading(true);
    const params = {
      collection: Collections.ADMIN,
      limit: 1
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const { status, data, message } = response.data;
        if (status) {
          setAdmin(data[0]);
          // console.log(data);
        }
      } else {
        console.error('Error fetching admin details:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching admin details:', error);
    }
  };


  useEffect(() => {
    getAdmin();
  }, []);

  const submit = async (data, setLoading) => {
    setLoading(true);
    try {
      const response = await axios.post(URL_POST_DOCUMENT, {
        collection: Collections.ADMIN,
        data: { ...data }
      }, HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const { status } = response.data;
        if (status) {
          toast.success(`Admin Updated`)
          getAdmin();
          setManagepassword({
            password: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } else {
        toast.error(response.statusText);
        console.error(`Error crud: ${Collections.ADMIN}`, response.statusText);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.toString());
      console.error(`Error crud: ${Collections.ADMIN}`, error);
    }
  }

  const updateDetails = () => {
    if (admin.name.trim() === '' || admin.email.trim() === '' || admin.username.trim() === '') {
      toast.error('name or email or username is empty.');
    } else {
      const body = {
        ...admin
      }
      submit(body, setLoading);
    }
  }

  const updatePassword = () => {
    if ((!managePassword.confirmPassword.trim() || !managePassword.newPassword.trim()) || (managePassword.confirmPassword !== managePassword.newPassword)) {
      toast.error('New password and confirm password did not match');
    } else {
      if (admin?.password !== managePassword.password) {
        toast.error('Current password is wrong');
      } else{
        const body = {
          _id: admin?._id,
          password: managePassword.newPassword
        }
        submit(body, setPasswordLoading);
      }
    }
  }

  const handleAdminDetails = (name, value) => {
    setAdmin({
      ...admin,
      [name]: value
    })
  }

  const handleManagepassword = (name, value) => {
    setManagepassword({
      ...managePassword,
      [name]: value
    })
  }

  if (admin == null) {
    return <AppIndicator />
  }


  return (
    <>
      <main className="h-full">
        <Navbar toggle={sidebarToggle} />

        {/* Main Content */}
        <div className="mainCard">
          <div className="py-5 flex items-center justify-between">
            <span className="flex flex-col space-y-2">
              <h2 className="font-bold text-3xl">Profile Settings</h2>
              <Linking data={LINKING_DATA().CUSTOMER_PAGE} currentPage={'Profile Settings'} />
            </span>
          </div>

          {/* user details */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <h2 className="bg-emerald-600 text-white p-2">Admin Details</h2>
            <div className="p-3 items-center grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-4">


              {/* input start */}
              <div className="">
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  Admin Name
                </label>
                <input
                  value={admin?.name}
                  onChange={(e) => handleAdminDetails('name', e.target.value)}
                  id="defaultInput"
                  type="text"
                  name="defaultInput"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Name"
                />
              </div>
              {/* input end */}

              {/* input start */}
              <div className="relative">
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  Admin Email
                </label>
                <input
                  value={admin?.email}
                  onChange={(e) => handleAdminDetails('email', e.target.value)}
                  id="inputWithIcon"
                  type="text"
                  name="inputWithIcon"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Email Name"
                />
              </div>
              {/* input end */}
              {/* input start */}
              <div className="relative">
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  Username
                </label>
                <input
                  value={admin?.username}
                  onChange={(e) => handleAdminDetails('username', e.target.value)}
                  id="inputWithIcon"
                  type="text"
                  name="inputWithIcon"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Name"
                />
              </div>
              {/* input end */}

            </div>


            <button onClick={() => updateDetails()} className="m-3 mb-5 hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
              {loading ? <ProgressBar /> : 'Update'}
            </button>
          </div>
          {/* end user details */}


          {/* user details */}
          <div className="bg-white shadow rounded-lg overflow-hidden mt-5">
            <h2 className="bg-emerald-600 text-white p-2">Change Password</h2>
            <div className="p-3 items-center grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-4">

              {/* input start */}
              <div className="">
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  Current Password
                </label>
                <input
                  value={managePassword.password}
                  onChange={(e) => handleManagepassword('password', e.target.value)}
                  id="defaultInput"
                  type="password"
                  name="defaultInput"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Current Password"
                />
              </div>
              {/* input end */}

              {/* input start */}
              <div className="relative">
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  New Password
                </label>
                <input
                  value={managePassword.newPassword}
                  onChange={(e) => handleManagepassword('newPassword', e.target.value)}
                  id="inputWithIcon"
                  type="password"
                  name="inputWithIcon"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="New Password"
                />
              </div>
              {/* input end */}
              {/* input start */}
              <div className="relative">
                <label htmlFor="defaultInput" className="font-bold text-sm text-gray-600">
                  Confirm Password
                </label>
                <input
                  value={managePassword.confirmPassword}
                  onChange={(e) => handleManagepassword('confirmPassword', e.target.value)}
                  id="inputWithIcon"
                  type="password"
                  name="inputWithIcon"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Confirm Password"
                />
              </div>
              {/* input end */}
            </div>


            <button onClick={() => updatePassword()} className="m-3 mb-5 hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
              {passwordLoading ? <ProgressBar /> : 'Update'}
            </button>


          </div>
          {/* end user details */}



        </div>
      </main>
    </>
  );
}

export default ProfileSettings;