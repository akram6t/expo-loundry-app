import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { HEADER_API, URL_POST_DOCUMENT } from '../../../utils/Constant';
import LoadingSpinner from '../ProgressBar';
import { toast } from 'react-toastify';
import { ParseObjectValues } from '../../../data/parse_keys';

const ModalCreate = ({ dismissable=true, isModalVisible, setModalVisibility, title, onRefresh, ...props }) => {
  const [loading, setLoading] = useState(false);
  // const [isModalVisible, setModalVisibility] = useState(false);

  const modalRef = useRef(null);

  const toggleModal = () => {
    setModalVisibility({ status: !isModalVisible.status });
  };

  const handleOutsideClick = (event) => {
    if (dismissable && modalRef.current && !modalRef.current.contains(event.target)) {
      setModalVisibility({ status: false });
    }
  };


  useEffect(() => {
    if (isModalVisible?.status) {
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

  function validateObjectValues(obj) {

    ParseObjectValues.forEach((key) => {
      if (obj[key]) {
        obj[key] = obj[key].toString();
      }
    })

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        // Check if the value is a non-empty string
        if (typeof value !== 'string' || value.trim() === '') {
          toast.error(`${key} is empty`)
          return false;
          // Validation failed
        }
      }
    }

    return true; // All values passed validation
  }

  const postDocument = async (collection, data) => {
    const validate = validateObjectValues(data);
    if (!validate) {
      return;
    }

    // let data = {...data};

    ParseObjectValues.forEach((key) => {
      if (data[key]) {
        data[key] = parseInt(data[key], 10);
      }
    })

    setLoading(true);
    try {
      const response = await axios.post(URL_POST_DOCUMENT, {
        collection: collection,
        data: data
      }, HEADER_API);

      if (response.status === 200) {
        console.log(response.data);
        setLoading(false);
        const { status } = response.data;
        if (status) {
          toast.success(`${response?.data?.message}`)
          setModalVisibility({ status: false })
          onRefresh();
        }
      } else {
        toast.error(response.statusText);
        console.error(`Error crud: ${collection}`, response.statusText);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.toString());
      console.error(`Error crud: ${collection}`, error);
    }
  };

  const handlePostDocument = (event) => {
    event.preventDefault();
    console.log(isModalVisible.data);
    const { collection, data } = isModalVisible;
    if (isModalVisible.status) {
      if (isModalVisible.data == null || isModalVisible.collection == null) {
        return toast.error('data is empty');
      }
    }
    postDocument(collection, data);
  }

  return (
    <div>
      {isModalVisible?.status && (
        <div
          id="popup-modal"
          tabIndex="-1"
          className="bg-gray-900 bg-opacity-30 fixed flex top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div ref={modalRef}
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
              <div className="p-4 md:p-5">
                {/* <svg
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
                                </svg> */}
                <h3 className="mb-2 font-bold text-left text-lg text-gray-700 ">
                  {title}{isModalVisible?.data?._id != null ? ' Edit' : ' Add'}
                </h3>

                {
                  isModalVisible?.data?._id && <div className='space-x-1'>
                    <span className='text-md'>_id: </span>
                    <span className='font-semibold'>{isModalVisible?.data?._id}</span>
                  </div>
                }

                <form onSubmit={handlePostDocument} className='mt-5'>
                  {props.children}

                  <button
                    onClick={handlePostDocument}
                    type="submit"
                    className="mt-5 text-white bg-emerald-600 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                  >
                    {loading ? <LoadingSpinner /> : isModalVisible?.data?._id ? 'Update' : 'Submit'}
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalCreate;
