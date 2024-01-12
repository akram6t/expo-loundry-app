import React from 'react'

const EntryOptions = ({ onChange }) => {
    return (
        <div className="flex items-center space-x-1"> Show
            <select className="border" onChange={(e) => onChange(e.target.value)}>
                <option value={10} defaultChecked>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </select>
            entries
        </div>
    )
}

export default EntryOptions