import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Collections, HEADER_API, URL_GET_LIST } from "../../utils/Constant";
import { ImageItentifier } from "../../utils/ImageIdentifier";

function SidebarLogo({ icon, text, ...props }) {
  const [ store, setStore ] = useState(null);


  const getStore = async () => {
    const params = {
      collection: Collections.STORE,
      select: JSON.stringify({ logo: 1, name: 1 }),
      limit: 1
    }
    try {
      const response = await axios.get(URL_GET_LIST(params), HEADER_API);

      if (response.status === 200) {
        const { status, data, message } = response.data;
        if (status) {
          setStore(data[0]);
        }
      } else {
        console.error('Error fetching general icons:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching general icons:', error);
    }
  };


  useEffect(() => {
    getStore();
  }, []);

  return (
    <div className="relative flex flex-row font-semibold text-3xl md:items-center md:mx-auto text-green-700 justify-between">
      <Link to="/" className="flex space-x-3 p-2 items-center justify-center">
        {store?.logo && <img className="w-10 h-10" src={ImageItentifier(store?.logo || '')} />}
        <span className="font-semibold text-xl">{store?.name || 'Admin'}</span>
      </Link>
      <button
        onClick={props.toggle}
        className="border border-emerald-300 text-xl font-medium py-2 px-4 block md:hidden absolute right-1 top-3"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
}

export default SidebarLogo;
