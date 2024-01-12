import { faBars, faBell, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, Routes } from "react-router-dom";
import { HEADER_API, URL_GET_NOTIFICATION_COUNT, profileIcon, routes } from './../../utils/Constant';
import axios from "axios";

function Index({ toggle }) {
  const [unread, setUnread] = useState(0);

  function getNotificationsCount() {
    axios.get(URL_GET_NOTIFICATION_COUNT, HEADER_API)
      .then((result, err) => {
        const { status, data } = result.data;
        if (status) {
          setUnread(typeof data === 'string' ? parseInt(data) : data);
          console.log('notifications count: ' + data);
        }
      }).catch(err => {
        // setMessage(`${err}`);
        // setSnackbar(true);
        console.log(err);
      })
  }

  useEffect(() => {
    getNotificationsCount();
  },[]);

  const avatar = profileIcon;

  return (
    <>
      <header className="">
        <div className="shadow-sm">
          <div className="relative flex w-full items-center px-5 py-2.5">
            <div className="flex-1">
              <p className="block md:hidden cursor-pointer">
                <FontAwesomeIcon icon={faBars} onClick={toggle} />
              </p>
            </div>
            <div className="">
              <ul className="flex flex-row space-x-4 items-center">
                <Link to={routes.MESSAGES}>
                  <span className="h-9 w-9 cursor-pointer text-gray-600">
                    <FontAwesomeIcon icon={faMessage} />
                  </span>
                </Link>
                <Link to={routes.NOTIFICATIONS}>
                  <span className="h-9 w-9 relative cursor-pointer text-gray-600">
                    {unread > 0 && <span className="transition-all absolute w-2 h-2 right-0 top-0 rounded-full shadow bg-red-500 border border-white">
                    </span>}
                    <FontAwesomeIcon icon={faBell} />
                  </span>
                </Link>
                <Link to={routes.PROFILE_SETTINGS}>
                  <span>
                    <img
                      className="rounded-full h-9 w-9 border cursor-pointer"
                      src={avatar}
                      alt="Avatar"
                    />
                  </span>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Index;
