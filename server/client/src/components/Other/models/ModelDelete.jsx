import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { HEADER_API, URL_DELETE_DOCUMENT } from '../../../utils/Constant';
import LoadingSpinner from '../ProgressBar';
import { toast } from 'react-toastify';

const DeleteModal = ({isModalVisible, setModalVisibility, onRefresh}) => {
    const [ loading, setLoading ] = useState(false);
    // const [isModalVisible, setModalVisibility] = useState(false);

    const modalRef = useRef(null);

    const toggleModal = () => {
        setModalVisibility({status: !isModalVisible.status});
    };

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setModalVisibility({status: false});
        }
      };
    

    useEffect(() => {
        if (isModalVisible.status) {
          // Add event listener when the modal is visible
          document.addEventListener('mousedown', handleOutsideClick);
        } else {
          // Remove event listener when the modal is hidden
          document.removeEventListener('mousedown', handleOutsideClick);
        }
    
        // Clean up the event listener on component unmount
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, [isModalVisible]);

      const deleteDocument = async (id, collection) => {
        setLoading(true);
        try {
          const response = await axios.post(URL_DELETE_DOCUMENT, {
            id: id,
            collection: collection
          }, HEADER_API);
    
          if (response.status === 200) {
            console.log(response.data);
            setLoading(false);
            const {status} = response.data;
            if(status){
                toast.success(`${collection} deleted`)
                setModalVisibility({status: false})
                onRefresh();
            }
          } else {
            console.error(`Error deleting: ${collection}`, response.statusText);
          }
        } catch (error) {
          setLoading(false);
          console.error(`Error deleting: ${collection}`, error);
        }
      };

      const handleDeleteDocument = () => {
        const { id, collection } = isModalVisible;
        deleteDocument(id, collection);
      }

    return (
        <div>
            {isModalVisible?.status && (
                <div
                    id="popup-modal"
                    tabIndex="-1"
                    className="bg-gray-900 bg-opacity-30 fixed flex top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                    <div                     ref={modalRef}
                        className=" relative p-4 w-full max-w-md max-h-full" >
                        <div className="relative bg-white rounded-lg shadow">
                            <button
                                onClick={toggleModal}
                                type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                <svg
                                    className="mx-auto mb-4 text-gray-400 w-12 h-12 "
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                                    Are you sure you want to delete <span className='text-xl font-semibold text-emerald-600'>{isModalVisible?.title}?</span>
                                </h3>
                                
                                <button
                                    onClick={toggleModal}
                                    type="button"
                                    className="mx-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                                >
                                    No, cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteDocument()}
                                    type="button"
                                    className="mx-2 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                                >
                                    {loading ? <LoadingSpinner/>: ''} Yes, I'm sure
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteModal;
