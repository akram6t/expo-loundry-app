import React, { useState } from "react";
import Navbar from "./../../components/Navbar/Index";
import { useOutletContext, Link, useParams } from "react-router-dom";
import Linking from "../../components/Other/Linking";
import LINKING_DATA from "../../data/linking_data";
import { SetTitle } from './../../utils/SetTitle';

function ApplicationSettings() {
  const [sidebarToggle] = useOutletContext();

  SetTitle('Application');


  return (
    <>
      <main className="h-full">
        <Navbar toggle={sidebarToggle} />

        {/* Main Content */}
        <div className="mainCard">
          <div className="py-5 flex items-center justify-between">
            <span className="flex flex-col space-y-2">
              <h2 className="font-bold text-3xl">Application Settings</h2>
              <Linking data={LINKING_DATA().CUSTOMER_PAGE} currentPage={'Application Settings'} />
            </span>
          </div>



                    {/* user details */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
            <h2 className="bg-emerald-600 text-white p-2">General Details</h2>
            <div className="p-3 items-center grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-4">


              {/* input start */}
              <div className="">
                <label className="font-bold text-sm text-gray-600">
                  App Logo
                </label>
                <div className="mt-2 flex">
                  <img className="w-20 h-20" src="https://picsum.photos/200/200"></img>
                  <button className="m-3 mb-5 hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-black text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                    Change
                  </button>
                </div>
              </div>
              {/* input end */}
              {/* input start */}
              <div className="">
                <label className="font-bold text-sm text-gray-600">
                  Application Name
                </label>
                <input
                  value={'LoundryApp'}
                  type="text"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Name"
                />
              </div>
              {/* input end */}

              {/* input start */}
              <div className="relative">
                <label className="font-bold text-sm text-gray-600">
                  Email
                </label>
                <input
                  //   value={'user1234'}
                  id="inputWithIcon"
                  type="text"
                  name="inputWithIcon"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="loundry@gmail.com"
                />
              </div>
              {/* input end */}
              {/* input start */}
              <div className="relative">
                <label className="font-bold text-sm text-gray-600">
                  Phone Number
                </label>

                <div className="inline-flex items-center justify-center absolute left-0 top-[0.85rem] h-full w-10 text-gray-400">
                  {/* <FontAwesomeIcon icon={faPhoneI} />  */}
                  <span>+91 </span>
                </div>
                <input
                  id="inputWithIcon"
                  type="text"
                  name="inputWithIcon"
                  // onChange={(e) => setEmail(e.target.value)}
                  className="text-md placeholder-gray-500 pl-10 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Phone Number"
                />
              </div>
              {/* input end */}
              {/* input start */}
              <div className="relative">
                <label className="font-bold text-sm text-gray-600">
                  Whatsapp Number
                </label>

                <div className="inline-flex items-center justify-center absolute left-0 top-[0.85rem] h-full w-10 text-gray-400">
                  {/* <FontAwesomeIcon icon={faPhoneI} />  */}
                  <span>+91 </span>
                </div>
                <input
                  id="inputWithIcon"
                  type="text"
                  name="inputWithIcon"
                  // onChange={(e) => setEmail(e.target.value)}
                  className="text-md placeholder-gray-500 pl-10 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Phone Number"
                />
              </div>
              {/* input end */}
              {/* input start */}
              <div className="relative">
                <label className="font-bold text-sm text-gray-600">
                  Address
                </label>
                <input
                  //   value={'user1234'}
                  id="inputWithIcon"
                  type="text"
                  name="inputWithIcon"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                  placeholder="Enter Address"
                />
              </div>
              {/* input end */}
              {/* input start */}
              <div className="relative">
                <label className="font-bold text-sm text-gray-600">
                  Latitude
                </label>
                <input
                  //   value={'user1234'}
                  id="inputWithIcon"
                  type="text"
                  name="inputWithIcon"
                  placeholder="Enter latitude"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                />
              </div>
              {/* input end */}
              {/* input start */}
              <div className="relative">
                <label className="font-bold text-sm text-gray-600">
                  Longitude
                </label>
                <input
                  //   value={'user1234'}
                  id="inputWithIcon"
                  type="text"
                  name="inputWithIcon"
                  placeholder="Enter longitude"
                  className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                />
              </div>
              {/* input end */}

            </div>


            <button className="m-3 mb-5 hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
              Update
            </button>
          </div>
          {/* end user details */}

          



        </div>
      </main>
    </>
  );
}

export default ApplicationSettings;