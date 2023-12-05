import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./utils/reducers/CartReducer";
import ProductReducer from "./utils/reducers/ProductReducer";
import PathReducer from "./utils/reducers/DatabaseReducer";

export default configureStore({
    reducer:{
        cart:CartReducer,
        product:ProductReducer,
        path:PathReducer
    }
})