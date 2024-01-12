import React, { useState } from "react";
import { Link } from "react-router-dom";
import Datatables from "../../components/Datatables/Table";
import TableCell from "../../components/Datatables/TableCell";
import { status } from "../../data/status";
import DeleteModal from './../../components/Other/models/ModelDelete';
import {ImageItentifier} from './../../utils/ImageIdentifier';

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPencil, faRemove } from "@fortawesome/free-solid-svg-icons";

// const serverUrl = 'https://loundryapp.akram.pw';

function ServicesTypeTable({ edit, collection, onRefresh, loading, dataHeader, data, currentPage, itemsPerPage }) {
  
const [modalVisible, setModalVisible] = useState({ status: false });

const deleteData = (id, title) => {
  if (id) {
    setModalVisible(
      {
        id: id,
        title: title,
        status: true,
        collection: collection
      }
    )
  }
};
  return (
    <>
    <Datatables loading={loading} dataHeader={dataHeader}>
      {data?.map((row, index) => {
        return <tr
          key={index}
          className={`${index % 2 === 0 ? '' : 'bg-gray-100'} border md:border-b block md:table-row rounded-md shadow-md md:rounded-none md:shadow-none mb-5`}
        >
          <TableCell dataLabel="S NO." showLabel={true}>
            <span className="font-medium text-sm text-gray-900">
              {(currentPage - 1) * itemsPerPage + index + 1}
            </span>
          </TableCell>
          <TableCell dataLabel="IMAGE" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">
              <img src={ImageItentifier(row.image)} className="w-14 h-14"/>
            </span>
          </TableCell>
          <TableCell dataLabel="NAME" showLabel={true}>
            <span className="font-semibold text-sm text-gray-900">{row.name}</span>
          </TableCell>
          <TableCell dataLabel="COLOR" showLabel={true}>
            <span className={`font-semibold text-sm p-2 rounded-md border`} style={{backgroundColor: row.color}}>{row.color}</span>
          </TableCell>
          <TableCell dataLabel="STATUS" showLabel={true}>
            <span className={`font-medium text-sm text-gray-900 ${status.find(item => item.label === row.status).color} px-2 py-1 rounded-full shadow`}>
            { status.find(item => item.label === row.status).label }
            </span>
          </TableCell>
          <TableCell dataLabel="ACTIONS" showLabel={true}>
            <span className="space-x-1">
              <button onClick={() => edit(row)} className="bg-black text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm transition-all hover:bg-opacity-80 active:bg-opacity-50">
                Edit
              </button>

              <button
                  onClick={() => deleteData(row._id, row.name)}
                  className="bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm transition-all hover:bg-opacity-80 active:bg-opacity-50"
                >
                  Delete
                </button>
            </span>
            </TableCell>
        </tr>
})}
    </Datatables>
    

    <DeleteModal
        onRefresh={() => onRefresh()}
        isModalVisible={modalVisible}
        setModalVisibility={(obj) => setModalVisible(obj)}
      />
    </>
  );
}

export default ServicesTypeTable;
