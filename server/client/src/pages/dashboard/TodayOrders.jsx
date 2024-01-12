import React from 'react'
import Datatables from '../../components/Datatables/Table'
import TableCell from '../../components/Datatables/TableCell'
import { Link } from 'react-router-dom'

const TodayOrders = ({ loading=false, dataHeader, data }) => {
  return (
    <div className=''>
        <div className='p-2 font-semibold bg-emerald-600 text-white'>Today Orders</div>
        <Datatables loading={loading} dataHeader={dataHeader}>
      {data?.map((row, index) => (
        <tr
          key={index}
          className={`${index % 2 === 0 ? '' : 'bg-gray-100'} border md:border-b block md:table-row rounded-md shadow-md md:rounded-none md:shadow-none mb-5`}
        >
          <TableCell dataLabel="S NO." showLabel={true}>
            <span className="font-medium text-sm text-gray-900">
              {index+1}
            </span>
          </TableCell>
          <TableCell dataLabel="ORDER INFO" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">
              {
                row.orderinfo.map((val, index) => (
                  <p key={index}>{val.key}: <span className="font-bold">{val.value}</span></p>
                ))
              }
            </span>
          </TableCell>
          <TableCell dataLabel="CUSTOMER" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">{row.customer}</span>
          </TableCell>
          <TableCell dataLabel="AMOUNT" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">₹ {row.amount}</span>
          </TableCell>
          <TableCell dataLabel="PAYMENT" showLabel={true}>
            <span className="font-medium text-sm text-gray-900">
              {
                row.payment.map((val, index) => (
                  <p key={index}>{val.key}:<span className="ml-2 font-bold">₹ {val.value}</span></p>
                ))
              }
            </span>
          </TableCell>
          <TableCell dataLabel="ORDER STATUS" showLabel={true}>
            <span style={{ backgroundColor: row.status.color }} className={`rounded-full py-1 px-3 text-xs font-semibold text-white`}>
              {row.status.status}
            </span>
          </TableCell>
          <TableCell dataLabel="ACTIONS" showLabel={true}>
            <span className="space-x-1">
              <Link to={`/orders/${row.orderinfo[0].value}`} className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                View
              </Link>

              <Link to={'/user'} className="text-white bg-yellow-600 border border-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                Print
              </Link>
            </span>
            </TableCell>
        </tr>
      ))}
    </Datatables>
    </div>
  )
}

export default TodayOrders