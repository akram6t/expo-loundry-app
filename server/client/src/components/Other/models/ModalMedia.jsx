import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST } from '../../../utils/Constant';
import LoadingSpinner from '../ProgressBar';
import RainBowProgressBar from '../RainBowProgressBar';
import { ImageItentifier } from '../../../utils/ImageIdentifier';

const ModalMedia = ({ showMedia, setShowMedia, onChangeMedia }) => {
    const [loading, setLoading] = useState(false);
    const [mediaList, setMediaList] = useState([]);
    // const [isModalVisible, setModalVisibility] = useState(false);


    const getMedia = async () => {
        setLoading(true);
        const params = {
            collection: Collections.MEDIA,
            sort: JSON.stringify({ date: DATE_ACC_DESC.DECENDING }),
        }
        try {
            const response = await axios.get(URL_GET_LIST(params), HEADER_API);

            if (response.status === 200) {
                console.log(response.data);
                setLoading(false);
                const { status, data, message } = response.data;
                if (status) {
                    setMediaList([...data]);
                }
            } else {
                console.error('Error fetching media:', response.statusText);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching media:', error);
        }
    };

    useEffect(() => {
        getMedia();
    }, []);

    const modalRef = useRef(null);

    const toggleModal = () => {
        setShowMedia(false);
    };

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowMedia(false);
        }
    };


    useEffect(() => {
        if (showMedia) {
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
    }, [showMedia]);

    return (
        <>
        <div>
            {showMedia && (
                <div
                    id="popup-modal"
                    tabIndex="-1"
                    className="bg-gray-900 bg-opacity-30 fixed flex top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                    <div ref={modalRef}
                        className=" relative p-4 w-full max-w-5xl max-h-full" >
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
                                    Media
                                </h3>

                                {
                                    loading && <RainBowProgressBar />
                                }

                                <div className="mt-5 p-3 items-center grid gap-x-5 gap-y-5 grid-cols-[repeat(auto-fill,minmax(50px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))]">
                                    {mediaList?.map((item) => (
                                        <button type='button' onClick={() => onChangeMedia(item)} className="w-full transition-all relative border border-gray-300 hover:border-gray-300 active:border-gray-300 px-2 pt-2">
                                            {/* <span className="absolute cursor-pointer transition-all hover:opacity-50 active:opacity-30 top-0 right-2">
                                                <FontAwesomeIcon color="red" icon={faRemove} />
                                            </span> */}
                                            <div className="h-20 rounded group mt-2">
                                                <img
                                                    className="w-full h-full object-contain"
                                                    src={ImageItentifier(item.media)}
                                                ></img>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default ModalMedia;