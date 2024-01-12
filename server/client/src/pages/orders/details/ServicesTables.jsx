import React from 'react';
import Datatables from './../../../components/Datatables/Table'
import TableCell from './../../../components/Datatables/TableCell'
import { ImageItentifier } from '../../../utils/ImageIdentifier';

const ServicesTables = ({data}) => {
  return (
    <Datatables dataHeader={[
        { key: 'serial_number_details', label: 's NO.'},
        {key: 'image', label: 'Image'},
        {key: 'services', label: 'Services'},
        { key: 'services_type', label: 'Services Type' },
        { key: 'rate', label: 'Rate'},
        { key: 'quantity', label: 'Quantity'},
        { key: 'total', label: 'Total'}
      ]}>
        {data?.items.map((row, index) => (
          <tr
            key={index}
            className={`${index % 2 === 0 ? '' : 'bg-gray-100'} border md:border-b block md:table-row rounded-md shadow-md md:rounded-none md:shadow-none mb-5`}
          >
            <TableCell dataLabel="S NO." showLabel={true}>
              <span className="font-medium text-sm text-gray-900">
                {index + 1}
              </span>
            </TableCell>
            <TableCell dataLabel="IMAGE" showLabel={true}>
              <span className="font-medium text-sm text-gray-900">
                <img src={ImageItentifier(row.image)} className="w-10 h-10" />
              </span>
            </TableCell>
            <TableCell dataLabel="NAME" showLabel={true}>
              <span className="font-semibold text-sm text-gray-900">{row.name} <span className='ml-1 font-thin'>({row.gender.toUpperCase()})</span> </span>
            </TableCell>
            <TableCell dataLabel="TYPES" showLabel={true}>
              <span className="font-medium text-sm text-gray-900 space-x-1">
                {
                  row.services.map((item, index) => {

                    return (
                      <span> {item.name}{index === row.services.length - 1 ? ' ' : ', '}</span>
                    )
                  })
                }
              </span>
            </TableCell>
            <TableCell dataLabel="RATE" showLabel={true}>
              <span className="font-semibold text-sm text-gray-900">₹ {row.services.reduce((total, service) => total + service.price, 0)}</span>
            </TableCell>
            <TableCell dataLabel="Qty" showLabel={true}>
              <span className="font-semibold text-sm text-gray-900">{row.quantity}</span>
            </TableCell>
            <TableCell dataLabel="Total" showLabel={true}>
              <span className="font-semibold text-sm text-gray-900">₹ {row.services.reduce((total, service) => total + service.price, 0) * row.quantity}</span>
            </TableCell>
          </tr>
        ))}
      </Datatables>
  )
}

export default ServicesTables