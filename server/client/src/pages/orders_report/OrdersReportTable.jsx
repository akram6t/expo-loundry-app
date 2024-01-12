import React from "react";
import Datatables from "../../components/Datatables/Table";
import TableCell from "../../components/Datatables/TableCell";
import { formatDate } from "../../utils/FormatDate";
function ReportTable({orderStatus, loading, dataHeader, data, currentPage, itemsPerPage }) {
  return (
    <Datatables loading={loading} dataHeader={dataHeader}>
      {data?.map((row, index) => {
        
        const statusColor = orderStatus?.find(item => item.tag === row.order_status) ? orderStatus?.find(item => item.tag === row.order_status).color : '#929292'


        return(<tr
          key={index}
          className={`${index % 2 === 0 ? '' : 'bg-gray-100'} border md:border-b block md:table-row rounded-md shadow-md md:rounded-none md:shadow-none mb-5`}
        >
          <TableCell dataLabel="S NO." showLabel={true}>
            <span className="font-medium text-sm text-gray-900">
              {(currentPage - 1) * itemsPerPage + index + 1}
            </span>
          </TableCell>
          <TableCell dataLabel="DATE" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">{formatDate(row?.order_date)}</span>
          </TableCell>
          <TableCell dataLabel="Order Id" showLabel={true}>
            <span className="font-medium text-sm text-gray-900"># {row?.order_id}</span>
          </TableCell>
          <TableCell dataLabel="CUSTOMER" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">{row?.pickup_address.name}</span>
          </TableCell>
          <TableCell dataLabel="AMOUNT" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">₹ {row?.amount + (row?.addons?.reduce((total, addon) => total+addon.price, 0) || 0) + row?.service_fee}</span>
          </TableCell>
          <TableCell dataLabel="STATUS" showLabel={true}>
          <span 
          style={{ backgroundColor: statusColor }} 
          className={`rounded-full py-1 px-3 text-xs font-semibold text-white`}>
              {row?.order_status}
            </span>
          </TableCell>
        </tr>)}
      )}
    </Datatables>
  );
}

export default ReportTable;
