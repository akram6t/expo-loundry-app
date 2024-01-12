import React from 'react'

const SearchTable = ({ searchTerm,  handleSearch}) => {
    return (
        <input
            type="text"
            placeholder="search ..."
            value={searchTerm}
            onChange={(e) => handleSearch(e)}
            className="border border-gray-400 rounded-md w-36 lg:focus:w-60 transition-all text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
        />
    )
}

export default SearchTable