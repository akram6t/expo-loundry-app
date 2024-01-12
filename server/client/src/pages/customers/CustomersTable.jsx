import React from "react";
import { Link } from "react-router-dom";
import Datatables from "../../components/Datatables/Table";
import TableCell from "../../components/Datatables/TableCell";
import { status } from "../../data/status";
import { formatDate } from "../../utils/FormatDate";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPencil, faRemove } from "@fortawesome/free-solid-svg-icons";

function CustomerTable({loading, dataHeader, data, currentPage, itemsPerPage }) {
  return (
    <Datatables loading={loading} dataHeader={dataHeader}>
      {data?.map((row, index) => (
        <tr
          key={index}
          className={`${index % 2 === 0 ? '' : 'bg-gray-100'} border md:border-b block md:table-row rounded-md shadow-md md:rounded-none md:shadow-none mb-5`}
        >
          <TableCell dataLabel="S NO." showLabel={true}>
            <span className="font-medium text-sm text-gray-900">
              {(currentPage - 1) * itemsPerPage + index + 1}
            </span>
          </TableCell>
          <TableCell dataLabel="NAME" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">
              { row.name }
            </span>
          </TableCell>
          <TableCell dataLabel="EMAIL" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">{row.email}</span>
          </TableCell>
          <TableCell dataLabel="MOBILE" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">+91 {row.mobile}</span>
          </TableCell>
          <TableCell dataLabel="STATUS" showLabel={true}>
            <span className={`${status.find(item => item.label === row.status) ? status.find(item => item.label === row.status).color : '#929292'} shadow rounded-full px-2 py-1 font-medium text-sm text-gray-900`}>
            { status.find(item => item.label === row.status).label }
            </span>
          </TableCell>
          <TableCell dataLabel="CREATED_AT" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">
            {formatDate(row.date)}
            </span>
          </TableCell>
          <TableCell dataLabel="ACTIONS" showLabel={true}>
            <span className="gap-x-1">
              <Link to={`/customers/${row.uid}`} className="bg-black text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm transition-all hover:bg-opacity-80 active:bg-opacity-50">
                Edit
              </Link>
            </span>
            </TableCell>
        </tr>
      ))}
    </Datatables>
  );
}

export default CustomerTable;
