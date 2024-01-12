import React, { useState, useRef, useEffect } from "react";
import Navbar from "./../../components/Navbar/Index";
import { Collections, DATE_ACC_DESC, HEADER_API, POST_MEDIA, URL_DELETE_DOCUMENT, URL_GET_LIST, URL_POST_MEDIA, routes } from "../../utils/Constant";
import { useOutletContext, Link, useParams } from "react-router-dom";
import Linking from "../../components/Other/Linking";
import LINKING_DATA from "../../data/linking_data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faRemove, faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import { status } from "../../data/status";
import axios from "axios";
import { toast } from "react-toastify";
import ProgressBar from "../../components/Other/ProgressBar";
import RainBowProgressBar from "../../components/Other/RainBowProgressBar";
import { ImageItentifier } from "../../utils/ImageIdentifier";
import DeleteModal from "../../components/Other/models/ModelDelete";
import { SetTitle } from './../../utils/SetTitle';

function Media() {
    SetTitle('Media');
    const [mediaList, setMediaList] = useState([]);
    const fileInputRef = useRef(null);
    const [sidebarToggle] = useOutletContext();
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisibility] = useState({status: false});

    const handleImageChange = (event) => {
        console.log(event.target.files);
        const selectedFile = event.target.files[0];
        console.log(selectedFile);
        setSelectedImage(selectedFile);
        // You can perform additional actions here, such as uploading the image to a server
    };

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

    const handleDeleteMedia = async (item) => {
      setModalVisibility({status: true, id: item._id, collection: Collections.MEDIA});
    }

    const addMedia = async () => {
        if (selectedImage == null) {
            return toast.error("Please select a media");
        }
        setLoading(true);
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);

        reader.onload = () => {
            const base64String = reader.result.split(",")[1];
            console.log(typeof base64String);
            axios.post(URL_POST_MEDIA, { media: base64String }, HEADER_API)
                .then(response => {
                    setLoading(false);
                    toast.success('icons added');
                    setSelectedImage(null);
                    fileInputRef.current.value = null;
                    getMedia();
                    // Handle successful response
                })
                .catch(error => {
                    setLoading(false);
                    console.error(error);
                    // Handle error
                });
        };
    };

    return (
        <>
            <main className="h-full">
                <Navbar toggle={sidebarToggle} />

                {/* Main Content */}
                <div className="mainCard">
                    <div className="py-5 flex items-center justify-between">
                        <span className="flex flex-col space-y-2">
                            <h2 className="font-bold text-3xl">Media Gallery</h2>
                            <Linking
                                data={LINKING_DATA().CUSTOMER_PAGE}
                                currentPage={"Media Gallery"}
                            />
                        </span>
                    </div>

                    {/* user details */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <h2 className="bg-emerald-600 text-white p-2">Icons Details</h2>
                        {/* input start */}
                        <div className="w-fit items-center mx-auto sm:flex mt-5 space-y-2 sm:space-y-0 sm:space-x-3">
                            {selectedImage != null ? (
                                <img
                                    className="object-contain w-24 h-24 rounded"
                                    src={URL.createObjectURL(selectedImage)}
                                ></img>
                            ) : null}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                onChange={(event) => handleImageChange(event)}
                            />
                            {selectedImage != null ? (
                                <button
                                    onClick={() => addMedia()}
                                    className="ml-2 flex hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                                > {loading ? (<ProgressBar />) : 'Upload'}
                                </button>
                            ) : null}
                        </div>
                        {/* input end */}

                        {/* important */}
                        <div className="p-4 text-center text-xl font-semibold">
                            <span className="text-red-500">Important!</span> Upload 1:1 images
                            or icons only
                        </div>

                        {
                            loading && <RainBowProgressBar />
                        }
                        <div className="p-3 items-center grid gap-x-5 gap-y-5 grid-cols-[repeat(auto-fill,minmax(70px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
                            {mediaList?.map((item) => (
                                <div className="w-full relative border border-gray-300 px-2 pt-2">
                                    <span onClick={() => handleDeleteMedia(item)} className="absolute cursor-pointer transition-all hover:opacity-50 active:opacity-30 top-0 right-2">
                                        <FontAwesomeIcon color="red" icon={faRemove} />
                                    </span>
                                    <div className="h-32 rounded group mt-2">
                                        <img
                                            className="w-full h-full object-contain"
                                            src={ImageItentifier(item.media)}
                                        ></img>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <DeleteModal isModalVisible={isModalVisible} setModalVisibility={(obj) => setModalVisibility(obj)} onRefresh={() => getMedia()}/>
        </>
    );
}

export default Media;
