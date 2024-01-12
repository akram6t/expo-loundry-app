import React from "react";
import Datatables from "../../components/Datatables/Table";
import TableCell from "../../components/Datatables/TableCell";
import { taxIncluded } from './../../data/expenses';

function ExpenseReportTable({ loading, dataHeader, data, currentPage, itemsPerPage }) {
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
            <span className="font-medium text-sm text-gray-900">{row?.towards}</span>
          </TableCell>
          <TableCell dataLabel="AMOUNT" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">₹ {row?.amount}</span>
          </TableCell>
          <TableCell dataLabel="Tax(%)" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">₹ { row?.taxIncluded === taxIncluded[0].label ? row?.taxPercentage : 0}</span>
          </TableCell>
          {/* <TableCell dataLabel="TAX(%)" showLabel={true}>
          <span className={`font-medium text-sm text-gray-900 ${taxIncluded.find(item => item.label === row.taxIncluded).color} px-2 py-1 rounded-full shadow`}>
            { taxIncluded.find(item => item.label === row.taxIncluded).label }
            </span>
          </TableCell> */}
          <TableCell dataLabel="PAYMENT METHOD" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">{row.paymentMethod}</span>
          </TableCell>
        </tr>
      ))}
    </Datatables>
  );
}

export default ExpenseReportTable;
