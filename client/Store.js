import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./src/utils/reducers/CartReducer";
import ProductReducer from "./src/utils/reducers/ProductReducer";
import AuthStateReducer from "./src/utils/reducers/AuthStateReducer";

export default configureStore({
    reducer:{
        cart:CartReducer,
        product:ProductReducer,
        auth:AuthStateReducer
    }
})