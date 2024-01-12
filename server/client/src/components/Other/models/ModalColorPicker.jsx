import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from "react-colorful";

const ModalColorPicker = ({ show, setShow, onChangeColor, color }) => {
    // const [isModalVisible, setModalVisibility] = useState(false);


    const modalRef = useRef(null);

    const toggleModal = () => {
        setShow(!show);
    };

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShow(false);
        }
    };


    useEffect(() => {
        if (show) {
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
    }, [show]);

    return (
        <>
            <div>
                {show && (
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
                                        Color Picker
                                    </h3>

                                    <div className="w-fit mt-5 rounded-b-lg shadow-lg flex flex-row space-x-2">
                                       
                                       <div>
                                       <HexColorPicker color={color} onChange={(color) => onChangeColor(color)} />
                                        <div className="py-2 text-center bg-white">
                                            {/* <label className="">Hex</label> */}
                                            <input className="mx-2 mt-2 border-b-gray-500 focus:border-b-gray-700 focus:border-b-2 mb-1 p-1 rounded-md text-center border border-gray-300 outline-none"
                                                onChange={(e) => onChangeColor(e.target.value)} value={color}></input>
                                        </div>
                                       </div>

                                       <div className='p-3 w-24' style={{ backgroundColor: color }}>
                                       </div>
                                       
                                    </div>

                                    <button
                    onClick={() => setShow(false)}
                    className="mt-5 text-white bg-emerald-600 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                  >
                    Save
                  </button>


                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ModalColorPicker;