import React from "react";
// import { useIcon } from "../../hooks/useIcon";
// import ButtonSecondary from "../Buttons/ButtonSecondary";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Paginate({ rows, setPage, loading, currentPage, totalPage, itemsPerPage, listLength }) {
  // const { ArrowBack, ArrowForward } = useIcon();
  return (
    <>
      {
        loading ? (
          <div class="flex justify-center items-center p-5">
            <div class="relative w-16 h-16 animate-spin rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 ">
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-2 border-white"></div>
            </div>
          </div>
        ) : null
      }

      {
        !loading &&
          rows.length === 0 && (<div className="p-3 text-lg text-center text-gray-600">No data available in table</div>)
        
      }

      {rows?.length > 0 && (
        <div className="flex items-center justify-between pb-4 md:py-4 text-sm font-semibold">
          <div className="md:pl-4 text-slate-500">
            Showing
            <span className="text-gray-700"> {((currentPage - 1) * itemsPerPage) + 1} </span>
            to <span className="text-gray-700"> {itemsPerPage * (currentPage - 1) + rows.length} </span>
            of <span className="text-gray-700"> {listLength} </span>
            entries
          </div>
          <div className="flex space-x-3 items-center">
            <button className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
              disabled={loading || currentPage <= 1}
              type="button"
              style={{ visibility: currentPage <= 1 ? 'hidden' : 'visible' }}
              onClick={() => {
                setPage(currentPage - 1);
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Prev
            </button>
            <button className="text-emerald-600 border border-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
              {currentPage}
            </button>
            <button
              className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
              disabled={loading || currentPage === totalPage}
              style={{ visibility: currentPage === totalPage ? 'hidden' : 'visible' }}
              type="button"
              onClick={() => {
                setPage(currentPage + 1);
              }}
            >
              Next <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Paginate;
