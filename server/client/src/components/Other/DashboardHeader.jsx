import {
  faBars,
  faBell,
  faCog,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../../utils/Constant";

function DashboardHeader({ user, avatar, toggle, unread }) {
  return (
    <div className="px-3 sm:px-8 pt-9 pb-4 flex flex-wrap w-full justify-between items-center">
      <div className="flex flex-row space-x-3">
        <p className="flex-shrink-0 rounded-full block md:hidden border border-emerald-400 p-[3px] shadow-lg">
          <img
            className="rounded-full md:h-14 md:w-14 h-10 w-10 border cursor-pointer"
            src={avatar}
            alt="Avatar"
          />
        </p>
        <div id="nameSection">
          <p className="text-sm font-semibold text-gray-500">Admin </p>
          <h1 className="font-medium lg:text-3xl text-2xl text-gray-700">
            {user?.name}
          </h1>
        </div>
      </div>
      <div className="avaterSection flex items-center gap-2 sm:gap-6 text-slate-400">
        <div className="hidden md:flex flex-row gap-4 text-xl">
          <Link to={routes.GENERAL_SETTINGS}>
            <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
          </Link>
          <Link to={routes.NOTIFICATIONS}>
            <span className="relative">
              {unread > 0 && <span className="flex items-center justify-center absolute w-4 h-4 -right-1 -top-1 rounded-full shadow bg-red-500 border">

                <span className="text-xs text-white">
                {unread}
                </span>

              </span> }
              <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
            </span>
          </Link>
          <Link to={routes.MESSAGES}>
            <FontAwesomeIcon icon={faMessage}></FontAwesomeIcon>
          </Link>
        </div>
        <Link to={routes.PROFILE_SETTINGS} className="relative rounded-full hidden md:block border border-emerald-400 p-[3px] shadow-lg">
          <img
            className="rounded-full md:h-14 md:w-14 h-10 w-10 border cursor-pointer"
            src={avatar}
            alt="Avatar"
          />
        </Link>

        <p className="cursor-pointer md:hidden text-2xl" onClick={toggle}>
          <FontAwesomeIcon icon={faBars} />
        </p>
      </div>
    </div>
  );
}

export default DashboardHeader;
