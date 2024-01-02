import { createSlice } from "@reduxjs/toolkit";

export const PathSlice = createSlice({
    name:"path",
    initialState:{
        path: {
            baseUrl: '',
            apikey: ''
        },
    },
    reducers:{
       setPath:(state, action) => {
        state.path = action.payload
       }
    }
});


export const { setPath } = PathSlice.actions;

export default PathSlice.reducer;