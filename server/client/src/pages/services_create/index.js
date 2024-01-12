import React, { useState, useEffect } from "react";
import Navbar from "./../../components/Navbar/Index";
import { Collections, DATE_ACC_DESC, HEADER_API, URL_GET_LIST, URL_POST_DOCUMENT, routes, sampleIcon } from "../../utils/Constant";
import { useOutletContext, Link, useParams, useNavigate } from "react-router-dom";
import Linking from "../../components/Other/Linking";
import LINKING_DATA from "../../data/linking_data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faPlus, faRemove, faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import { status } from "../../data/status";
import { genders, servicesTypesData } from "../../data/services";
import { order_status } from "../../data/order_status";
import axios from "axios";
import ModalMedia from "../../components/Other/models/ModalMedia";
import { ImageItentifier } from "../../utils/ImageIdentifier";
import RainBowProgressBar from "../../components/Other/RainBowProgressBar";
import AppIndicator from "../../components/Other/AppIndicator";
import ProgressBar from "../../components/Other/ProgressBar";
import { toast } from "react-toastify";
import { SetTitle } from './../../utils/SetTitle';

function ServicesEdit() {
    SetTitle('Create Service');
    const [sidebarToggle] = useOutletContext();
    const { id } = useParams();
    const [ _id, set_Id ] = useState(id);
    const navigate = useNavigate();
    const [showMedia, setShowMedia] = useState(false);
    const [servicesTypeList, setServicesTypeList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [store, setStore] = useState(null);

    useEffect(() => set_Id(id), [id]);

    const [product, setProduct] = useState({
        shopid: '',
        name: '',
        image: sampleIcon,
        gender: genders[0],
        status: status[0].label,
        quantity: 0,
        services: [

        ]
    });


    const getServices = async () => {
        console.log("get services start");
        setLoading(true);
        const params = {
          collection: Collections.PRODUCTS,
          filter: JSON.stringify({_id: id}),
          limit: 1
        }
        try {
          const response = await axios.get(URL_GET_LIST(params), HEADER_API);
          console.log(response.data);
          if (response.status === 200) {
            setLoading(false);
            const {status, data, message} = response.data;
            if(status){
                console.log("product is: ");
                console.log({...data[0]});
              setProduct({...data[0]});
            }
          } else {
            console.error('Error fetching services:', response.statusText);
          }
        } catch (error) {
          setLoading(false);
          console.error('Error fetching services:', error);
        }
      };

    const getStore = async () => {
        setLoading(true);
        const params = {
            collection: Collections.STORE,
            select: JSON.stringify({ _id: 1 }),
            limit: 1
        }
        try {
            const response = await axios.get(URL_GET_LIST(params), HEADER_API);

            if (response.status === 200) {
                setLoading(false);
                const { status, data, message } = response.data;
                if (status) {
                    setStore(data[0]);
                    setProduct({
                        ...product,
                        shopid: data[0]?._id
                    })
                }
            } else {
                console.error('Error fetching general details:', response.statusText);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching general details:', error);
        }
    };

    const getServicesStypes = async () => {
        setServicesTypeList([]);
        setLoading(true);
        const params = {
            collection: Collections.SERVICES,
            sort: JSON.stringify({ date: DATE_ACC_DESC.ACCENDING }),
        }
        try {
            const response = await axios.get(URL_GET_LIST(params), HEADER_API);
            if (response.status === 200) {
                setLoading(false);
                const { status, data, message } = response.data;
                if (status) {
                    if(id){
                        getServices();
                    }
                    setServicesTypeList([...data]);
                }
            } else {
                console.error('Error fetching services types:', response.statusText);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching services types:', error);
        }
    };


    useEffect(() => {
     Promise.all([
        getServicesStypes(),
        getStore(),
    ]);
    }, []);

    const handleChangeServices = (index, key, value) => {
        // Create a new array with the updated object
        const updatedArray = [...product?.services];

        // Check if the index is within the array bounds
        if (index >= 0 && index < updatedArray.length) {
            // Create a new object with the updated 'name' field
            updatedArray[index] = { ...updatedArray[index], [key]: key == 'price' ? parseFloat(value) : value };
        }

        setProduct({ ...product, services: [...updatedArray] });
    }
    const removeService = (index) => {
        // Create a new array with the updated object
        let updatedArray = [...product?.services];

        // Check if the index is within the array bounds
        if (updatedArray.length >= 2) {
            // Create a new object with the updated 'name' field
            updatedArray = updatedArray.filter((_, ind) => ind != index);
        }else{
            toast.error('minimum 1 service required');
        }

        setProduct({ ...product, services: [...updatedArray] });
    }

    const addService = () => {
        // Create a new array with the updated object
        let updatedArray = [...product?.services];

        // Check if the index is within the array bounds
            // Create a new object with the updated 'name' field
            updatedArray = [...updatedArray, { name: servicesTypeList[0].name, price: 0 }]

        setProduct({ ...product, services: [...updatedArray] });
    }


    const handleSubmit = async () => {

        if(product?.name.trim() === ""){
            return toast.error('Please enter service name');   
        }

        if(product?.services.length === 0){
            return toast.error('Minimum 1 service type required');
        }   
        setLoading(true);
        try {
          const response = await axios.post(URL_POST_DOCUMENT, {
            collection: Collections.PRODUCTS,
            data: {...product}
          }, HEADER_API);
    
          if (response.status === 200) {
            console.log(response.data);
            setLoading(false);
            const { status } = response.data;
            if (status) {
              toast.success(`${response?.data?.message}`)
              navigate(-1);
            }
          } else {
            toast.error(response.statusText);
            console.error(`Error crud: product`, response.statusText);
          }
        } catch (error) {
          setLoading(false);
          toast.error(error.toString());
          console.error(`Error crud: product`, error);
        }
    }



    if (store == null || servicesTypeList == null) {
        return <AppIndicator />
    }

    if(id && !product?._id){
        return <AppIndicator/>
    }


    return (
        <>
            <main className="h-full">
                <Navbar toggle={sidebarToggle} />

                {/* Main Content */}
                <div className="mainCard">
                    <div className="py-5 flex items-center justify-between">
                        <span className="flex flex-col space-y-2">
                            <h2 className="font-bold text-3xl">Edit Service</h2>
                            <Linking data={LINKING_DATA().SERVICES_TYPE_PAGE} currentPage={id || 'Create'} />
                        </span>
                    </div>

                    {/* user details */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <h2 className="bg-emerald-600 text-white p-2">Service Details</h2>
                        <div className="p-3 items-center grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-4">


                            {/* input start */}
                            <div className="">
                                <label className="font-bold text-sm text-gray-600">
                                    Icon
                                </label>
                                <div className="flex mt-2">
                                    <img className="w-12 h-12" src={ImageItentifier(product?.image)}></img>
                                    <button onClick={() => setShowMedia(true)} className="m-3 mb-5 hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                                        Choose
                                    </button>
                                </div>
                            </div>
                            {/* input end */}
                            {/* input start */}
                            <div className="">
                                <label className="font-bold text-sm text-gray-600">
                                    Service Name
                                </label>
                                <input
                                    value={product?.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                    type="text"
                                    className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1"
                                    placeholder="Enter Service Name"
                                />
                            </div>
                            {/* input end */}

                            {/* input start */}
                            <div className="">
                                <label className="font-bold text-sm text-gray-600">
                                    Gender
                                </label>

                                <select value={product?.gender} onChange={(e) => setProduct({ ...product, gender: e.target.value })} className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
                                    {
                                        genders.map((item, index) => {
                                            return (<option value={item}>{item}</option>)
                                        })
                                    }
                                </select>
                            </div>
                            {/* input end */}
                            {/* input start */}
                            {
                                id && <div className="">
                                    <label className="font-bold text-sm text-gray-600">
                                        Status
                                    </label>

                                    <select value={product?.status} onChange={(e) => setProduct({ ...product, status: e.target.value })} className="text-md placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
                                        {
                                            status.map((item, index) => {
                                                return (<option value={item.label}>{item.label}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                            }
                            {/* input end */}


                        </div>
                    </div>
                    {/* end user details */}

                    <div className="h-3"></div>


                    {/* user details */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <h2 className="bg-emerald-600 text-white p-2">Service Types</h2>
                        <div className="p-3 items-center gap-x-4 gap-y-4">

                            <div className="rounded-md p-2 font-medium flex item-center bg-emerald-600 text-white">
                                <h2 className="flex-1">Service Type</h2>
                                <h2 className="flex-1">Service Price</h2>
                            </div>
                            {
                                product?.services?.map((item, index) => {
                                    return (
                                        <div key={index} className="flex item-center space-x-3 space-y-2 mt-1 border-b pb-2">
                                            <select value={product?.services[index].name} onChange={(e) => handleChangeServices(index, 'name', e.target.value)} className="flex-1 text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1">
                                                {
                                                    servicesTypeList?.map((type, index) => {
                                                        return (<option value={type.name}>{type.name}</option>)
                                                    })
                                                }
                                            </select>
                                            <input type="number" value={product?.services[index]?.price} onChange={(e) => handleChangeServices(index, 'price', e.target.value)} className="flex-1 text-sm placeholder-gray-500 px-4 rounded-lg border border-gray-200 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400 mt-1" />
                                            <button onClick={() => removeService(index)} className="m-3 mb-5 hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                                                <FontAwesomeIcon icon={faRemove} />
                                            </button>
                                        </div>
                                    )
                                })
                            }

                            <div className="mt-2 flex items-center justify-end">
                                <button onClick={() => addService()} className="hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-black text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                                    <FontAwesomeIcon icon={faPlus} /> Add Service Type
                                </button>
                            </div>

                        </div>

                        <button onClick={() => handleSubmit()} className="m-3 mb-5 hover:bg-opacity-80 active:bg-opacity-60 transition-all bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                            { loading ? <ProgressBar/> : id ? 'Update' : 'Submit'}
                        </button>
                    </div>
                    {/* end user details */}



                </div>
            </main>

            <ModalMedia showMedia={showMedia} setShowMedia={() => setShowMedia(false)} onChangeMedia={(item) => { setProduct({ ...product, image: item.media }); setShowMedia(false) }} />
        </>
    );
}

export default ServicesEdit;